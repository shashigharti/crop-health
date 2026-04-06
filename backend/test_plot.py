# test_generate.py
import ee
import json
import os
from dotenv import load_dotenv

load_dotenv()

# ── Auth ──────────────────────────────────────────────────────────────────────
credentials = ee.ServiceAccountCredentials(
    os.getenv("GEE_SERVICE_ACCOUNT"),
    key_file=os.getenv("GEE_SERVICE_ACCOUNT_KEY_PATH"),
)
ee.Initialize(credentials)

# ── AOIs ─────────────────────────────────────────────────────────────────────
aoi_coffee = ee.Geometry.Point([36.95, -0.42]).buffer(1000).bounds()
aoi_cocoa = ee.Geometry.Point([-1.62, 6.69]).buffer(1000).bounds()
aoi_other = ee.Geometry.Point([36.90, -0.45]).buffer(1000).bounds()
merged_aoi = aoi_coffee.union(aoi_cocoa, 1).union(aoi_other, 1)

AOI_MAP = {
    "coffee": aoi_coffee,
    "cocoa": aoi_cocoa,
    "other": aoi_other,
}


# ── EMIT ─────────────────────────────────────────────────────────────────────
def load_emit(aoi, label):
    ic = (
        ee.ImageCollection("NASA/EMIT/L2A/RFL")
        .filterBounds(aoi)
        .filterDate("2022-01-01", "2026-01-01")
        .sort("system:time_start", False)
    )
    n = ic.size().getInfo()
    print(f"EMIT scenes [{label}]: {n}")
    if n == 0:
        raise RuntimeError(f"No EMIT coverage for {label}")
    return ee.Image(ic.first())


emit_coffee = load_emit(aoi_coffee, "coffee")
emit_cocoa = load_emit(aoi_cocoa, "cocoa")
emit_other = load_emit(aoi_other, "other")


# ── Band selection ────────────────────────────────────────────────────────────
def nearest_emit_band_name(image, target_nm):
    band_names = image.bandNames().getInfo()
    start_nm, end_nm, n_bands = 381.0, 2493.0, 285
    step = (end_nm - start_nm) / (n_bands - 1)
    idx = int(round((target_nm - start_nm) / step))
    idx = max(0, min(idx, n_bands - 1))
    return band_names[idx]


TARGETS = [
    450,
    500,
    550,
    600,
    650,
    680,
    705,
    720,
    740,
    760,
    790,
    820,
    860,
    900,
    970,
    1100,
    1200,
]
bands = [nearest_emit_band_name(emit_coffee, t) for t in TARGETS]

emit_mosaic = ee.ImageCollection([emit_coffee, emit_cocoa, emit_other]).mosaic()
emit_sel = emit_mosaic.select(bands).clip(merged_aoi)

# ── Training samples ──────────────────────────────────────────────────────────
training_fc = ee.FeatureCollection(
    [
        ee.Feature(aoi_coffee.buffer(-100), {"class": 1, "class_name": "coffee"}),
        ee.Feature(aoi_coffee.buffer(-200), {"class": 1, "class_name": "coffee"}),
        ee.Feature(aoi_coffee.buffer(-300), {"class": 1, "class_name": "coffee"}),
        ee.Feature(aoi_cocoa.buffer(-100), {"class": 2, "class_name": "cocoa"}),
        ee.Feature(aoi_cocoa.buffer(-200), {"class": 2, "class_name": "cocoa"}),
        ee.Feature(aoi_cocoa.buffer(-300), {"class": 2, "class_name": "cocoa"}),
        ee.Feature(aoi_other.buffer(-100), {"class": 0, "class_name": "other"}),
        ee.Feature(aoi_other.buffer(-200), {"class": 0, "class_name": "other"}),
        ee.Feature(aoi_other.buffer(-300), {"class": 0, "class_name": "other"}),
    ]
)

for scale in (30, 60, 90):
    training = emit_sel.sampleRegions(
        training_fc, ["class"], scale=scale, geometries=True
    )
    n_samples = training.size().getInfo()
    print(f"Samples at scale={scale}: {n_samples}")
    if n_samples >= 50:
        break

sampled_classes = training.aggregate_array("class").distinct().getInfo()
print(f"Sampled classes: {sampled_classes}")
if len(sampled_classes) < 2:
    raise RuntimeError("Not enough classes in samples — check AOI coverage")

# ── Classify ──────────────────────────────────────────────────────────────────
clf = ee.Classifier.smileRandomForest(300, 2).train(
    training, "class", emit_sel.bandNames()
)
class_img = emit_sel.classify(clf).rename("crop_class").clip(merged_aoi)

vis_params = {"min": 0, "max": 2, "palette": ["808080", "00ff00", "ff00ff"]}
map_id = class_img.getMapId(vis_params)
tile_url = map_id["tile_fetcher"].url_format
print(f"\n✅ Tile URL:\n{tile_url}\n")


# ── Plot polygons scoped per AOI ──────────────────────────────────────────────
def build_plots(class_value, crop_name, aoi):
    # Mask to only this class within this AOI
    masked = class_img.eq(class_value).selfMask().clip(aoi)

    labeled = (
        masked.connectedComponents(ee.Kernel.square(1), 1024)
        .select("labels")
        .rename("plot_id")
    )

    plots = labeled.reduceToVectors(
        geometry=aoi,
        scale=60,
        geometryType="polygon",
        labelProperty="plot_id",
        bestEffort=True,
        maxPixels=1e13,
    )
    return plots.map(lambda f: f.set({"crop": crop_name}))


all_plots = build_plots(1, "coffee", aoi_coffee).merge(
    build_plots(2, "cocoa", aoi_cocoa)
)


# ── Sentinel-2 NDVI health ────────────────────────────────────────────────────
def build_s2_ndvi(aoi):
    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(aoi)
        .filterDate("2023-01-01", "2025-01-01")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
        .map(
            lambda img: (
                img.updateMask(
                    img.select("QA60")
                    .bitwiseAnd(1 << 10)
                    .eq(0)
                    .And(img.select("QA60").bitwiseAnd(1 << 11).eq(0))
                ).divide(10000)
            )
        )
        .median()
        .clip(aoi)
    )
    return s2.normalizedDifference(["B8", "B4"]).rename("NDVI")


ndvi_coffee = build_s2_ndvi(aoi_coffee)
ndvi_cocoa = build_s2_ndvi(aoi_cocoa)

ndvi_mosaic = ee.ImageCollection(
    [
        ndvi_coffee.clip(aoi_coffee),
        ndvi_cocoa.clip(aoi_cocoa),
    ]
).mosaic()


def add_health(f):
    nv = ee.Number(
        ndvi_mosaic.reduceRegion(
            ee.Reducer.mean(), f.geometry(), 20, maxPixels=1e9
        ).get("NDVI")
    )
    health = ee.Algorithms.If(nv.gte(0.60), 2, ee.Algorithms.If(nv.lt(0.45), 0, 1))
    return f.set({"health": health, "area_ha": f.geometry().area(1).divide(10000)})


plots_fc = all_plots.map(add_health)
geojson = plots_fc.getInfo()

# ── Save outputs ──────────────────────────────────────────────────────────────
with open("test_tile_url.txt", "w") as f:
    f.write(tile_url)
    print("✅ Tile URL saved to test_tile_url.txt")

with open("test_plots.geojson", "w") as f:
    json.dump(geojson, f, indent=2)
    print(
        f"✅ GeoJSON saved to test_plots.geojson ({len(geojson['features'])} features)"
    )
