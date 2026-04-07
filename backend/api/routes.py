import ee
from enum import Enum
from fastapi import APIRouter, HTTPException
from schemas.download import DownloadRequest, LayersResponse
from schemas.plots import PlotsResponse
from schemas.training import TrainingRequest, TrainingResponse, TrainResponse
from utils.gee_helpers import nearest_emit_band_name, get_tile_url, mask_s2
from utils.dummy import DUMMY_GEOJSON

router = APIRouter(prefix="/api")

state = {
    "classes": {},  # { "coffee": { aoi, emit, s2, ndvi, ndre }, ... }
    "class_label_map": {},  # { "coffee": 0, "cocoa": 1, ... } — stable labels
    "training_fc": None,
    "class_img": None,
}


class Collection(str, Enum):
    EMIT = "NASA/EMIT/L2A/RFL"
    S2 = "COPERNICUS/S2_SR_HARMONIZED"


class Wavelength(float, Enum):
    RED = 650.0
    GREEN = 560.0
    BLUE = 470.0
    RE705 = 705.0
    RE790 = 790.0


class Color(str, Enum):
    RED = "d7191c"
    YELLOW = "ffffbf"
    GREEN = "1a9641"
    BLUE = "2c7bb6"
    GRAY = "808080"
    LIME = "00ff00"
    MAGENTA = "ff00ff"


class Vis:
    EMIT_RGB = {"min": 0.0, "max": 0.3}
    S2_RGB = {"min": 0.02, "max": 0.35}
    NDVI = {"min": 0.0, "max": 0.9, "palette": [Color.RED, Color.YELLOW, Color.GREEN]}
    NDRE = {"min": -0.2, "max": 0.4, "palette": [Color.BLUE, Color.YELLOW, Color.RED]}
    CROP_MAP = {"min": 0, "max": 2, "palette": [Color.GRAY, Color.LIME, Color.MAGENTA]}
    #                                                   other       coffee        cocoa


EMIT_TARGET_WAVELENGTHS = [
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


def get_or_create_label(class_name: str) -> int:
    """Assign a stable numeric label to a class name."""
    if class_name not in state["class_label_map"]:
        state["class_label_map"][class_name] = len(state["class_label_map"])
    return state["class_label_map"][class_name]


@router.post("/images/download", response_model=LayersResponse)
def download_layers(request: DownloadRequest):
    aoi = ee.Geometry(request.aoi.model_dump())
    class_name = request.class_name.lower()

    emit_ic = (
        ee.ImageCollection(Collection.EMIT)
        .filterBounds(aoi)
        .filterDate("2022-01-01", "2026-01-01")
        .sort("system:time_start", False)
    )

    n_emit = emit_ic.size().getInfo()
    if n_emit == 0:
        raise HTTPException(
            status_code=404, detail="No EMIT scenes intersect this AOI."
        )

    emit = ee.Image(emit_ic.first())

    s2_ic = (
        ee.ImageCollection(Collection.S2)
        .filterBounds(aoi)
        .filterDate("2023-01-01", "2025-01-01")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
        .map(mask_s2)
    )

    if s2_ic.size().getInfo() == 0:
        raise HTTPException(status_code=404, detail="No Sentinel-2 scenes found.")

    s2 = ee.Image(s2_ic.median())
    ndvi = s2.normalizedDifference(["B8", "B4"]).rename("NDVI").clip(aoi)

    b705 = nearest_emit_band_name(emit, Wavelength.RE705)
    b790 = nearest_emit_band_name(emit, Wavelength.RE790)
    ndre = (
        emit.select(b790)
        .subtract(emit.select(b705))
        .divide(emit.select(b790).add(emit.select(b705)))
        .rename("NDRE")
        .clip(aoi)
    )

    b_r = nearest_emit_band_name(emit, Wavelength.RED)
    b_g = nearest_emit_band_name(emit, Wavelength.GREEN)
    b_b = nearest_emit_band_name(emit, Wavelength.BLUE)

    state["classes"][class_name] = {
        "aoi": aoi,
        "emit": emit,
        "s2": s2,
        "ndvi": ndvi,
        "ndre": ndre,
    }

    get_or_create_label(class_name)

    if state["training_fc"] is None:
        state["training_fc"] = ee.FeatureCollection([])

    return {
        "status": f"Loaded {n_emit} EMIT scene(s) for class: {class_name}.",
        "n_emit": n_emit,
        "layers": {
            "emit_rgb": get_tile_url(
                emit.select([b_r, b_g, b_b]).clip(aoi), Vis.EMIT_RGB
            ),
            "s2_rgb": get_tile_url(s2.select(["B4", "B3", "B2"]).clip(aoi), Vis.S2_RGB),
            "ndvi": get_tile_url(ndvi, Vis.NDVI),
            "ndre": get_tile_url(ndre, Vis.NDRE),
        },
    }


@router.post("/training/add", response_model=TrainingResponse)
def add_training(request: TrainingRequest):
    if state["training_fc"] is None:
        raise HTTPException(status_code=400, detail="Download layers first.")

    class_name = request.class_name.lower()
    if class_name not in state["classes"]:
        raise HTTPException(
            status_code=400,
            detail=f"No layers downloaded for class: {class_name}. Download layers first.",
        )

    label = get_or_create_label(class_name)
    geom = ee.Geometry(request.geometry.model_dump())
    buffered = geom.buffer(request.buffer_m)
    feature = ee.Feature(buffered, {"class": label, "class_name": class_name})

    state["training_fc"] = state["training_fc"].merge(ee.FeatureCollection([feature]))
    total = state["training_fc"].size().getInfo()

    print(
        f"add_training: {class_name} label={label} total={total} label_map={state['class_label_map']}"
    )

    return {
        "status": f"Added training: {class_name} (label={label}). Total polygons={total}.",
        "total": total,
    }


@router.post("/training/train", response_model=TrainResponse)
def train():
    if not state["classes"]:
        raise HTTPException(
            status_code=400, detail="Download layers for at least one class first."
        )

    if state["training_fc"] is None or state["training_fc"].size().getInfo() == 0:
        raise HTTPException(status_code=400, detail="Add training polygons first.")

    classes_in_fc = state["training_fc"].aggregate_array("class").distinct().getInfo()
    class_names = (
        state["training_fc"].aggregate_array("class_name").distinct().getInfo()
    )

    if len(classes_in_fc) < 2:
        raise HTTPException(
            status_code=400,
            detail=f"Only one class found: {class_names}. Add polygons for at least 2 classes.",
        )

    all_values = list(state["classes"].values())

    merged_aoi = all_values[0]["aoi"]
    for v in all_values[1:]:
        merged_aoi = merged_aoi.union(v["aoi"])

    emit = ee.ImageCollection([v["emit"] for v in all_values]).mosaic()

    bands = [
        nearest_emit_band_name(all_values[0]["emit"], t)
        for t in EMIT_TARGET_WAVELENGTHS
    ]
    emit_sel = emit.select(bands).clip(merged_aoi)

    training = emit_sel.sampleRegions(
        state["training_fc"], ["class"], scale=30, geometries=True
    )
    if training.size().getInfo() < 50:
        training = emit_sel.sampleRegions(
            state["training_fc"], ["class"], scale=60, geometries=True
        )

    if training.size().getInfo() == 0:
        raise HTTPException(
            status_code=400, detail="No training samples found. Add more polygons."
        )

    clf = ee.Classifier.smileRandomForest(300, 2).train(
        training, "class", emit_sel.bandNames()
    )
    class_img = emit_sel.classify(clf).rename("crop_class").clip(merged_aoi)
    state["class_img"] = class_img

    return {
        "status": f"Crop map created with {len(classes_in_fc)} classes: {class_names}.",
        "layers": {
            "crop_map": get_tile_url(class_img, Vis.CROP_MAP),
        },
    }


@router.post("/plots/make", response_model=PlotsResponse)
def make_plots():
    if not state["class_img"] or not state["classes"]:
        raise HTTPException(status_code=400, detail="Train the model first.")

    all_values = list(state["classes"].values())
    merged_aoi = all_values[0]["aoi"]
    for v in all_values[1:]:
        merged_aoi = merged_aoi.union(v["aoi"])

    ndvi = ee.ImageCollection([v["ndvi"] for v in all_values]).mosaic()
    ndre = ee.ImageCollection([v["ndre"] for v in all_values]).mosaic()
    crop_img = state["class_img"]

    def build_plots(mask, crop_name, scale_m=60):
        mask_stats = mask.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=merged_aoi,
            scale=scale_m,
            maxPixels=1e13,
            bestEffort=True,
        ).getInfo()

        pixel_sum = list(mask_stats.values())[0] if mask_stats else 0
        if not pixel_sum:
            return None

        labeled = (
            mask.selfMask()
            .connectedComponents(ee.Kernel.square(1), 1024)
            .select("labels")
            .rename("plot_id")
        )
        plots = labeled.reduceToVectors(
            reducer=ee.Reducer.countEvery(),
            geometry=merged_aoi,
            scale=scale_m,
            geometryType="polygon",
            labelProperty="plot_id",
            bestEffort=True,
            maxPixels=1e13,
        )
        if plots.size().getInfo() == 0:
            return None
        return plots.map(lambda f: f.set({"crop": crop_name}))

    all_plots = None
    skipped = []
    for class_name, label in state["class_label_map"].items():
        if class_name == "other":
            continue
        plots = build_plots(crop_img.eq(label), class_name)
        if plots is None:
            skipped.append(class_name)
            continue
        all_plots = plots if all_plots is None else all_plots.merge(plots)

    if all_plots is None or all_plots.size().getInfo() == 0:
        return {
            "status": f"No plots found. Skipped: {skipped}. Showing dummy data for UI testing.",
            "geojson": DUMMY_GEOJSON,
        }

    all_plots = all_plots.map(
        lambda f: f.set(
            {
                "ndvi_mean": ndvi.reduceRegion(
                    ee.Reducer.mean(), f.geometry(), 20, maxPixels=1e9
                ).get("NDVI"),
                "ndre_mean": ndre.reduceRegion(
                    ee.Reducer.mean(), f.geometry(), 60, maxPixels=1e9
                ).get("NDRE"),
            }
        )
    )

    def add_health(f):
        nv = ee.Number(f.get("ndvi_mean"))
        nr = ee.Number(f.get("ndre_mean"))
        healthy = nv.gte(0.60).And(nr.gte(0.20))
        stressed = nv.lt(0.45).Or(nr.lt(0.10))
        moderate = healthy.Not().And(stressed.Not())
        health = ee.Number(0).where(moderate, 1).where(healthy, 2)
        return f.set({"health": health, "area_ha": f.geometry().area(1).divide(10000)})

    plots_fc = all_plots.map(add_health)
    state["plots_fc"] = plots_fc
    geojson = plots_fc.getInfo()

    return {
        "status": f"Plots created: {len(geojson['features'])} plots. Skipped: {skipped}.",
        "geojson": geojson,
    }
