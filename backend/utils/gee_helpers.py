# utils/gee_helpers.py
import ee


def nearest_emit_band_name(image: ee.Image, target_nm: float) -> str:
    band_names = image.bandNames().getInfo()
    emit_start_nm = 381.0
    emit_end_nm = 2493.0
    n_bands = len(band_names)

    wavelengths = [
        emit_start_nm + (emit_end_nm - emit_start_nm) * i / (n_bands - 1)
        for i in range(n_bands)
    ]

    closest = min(range(n_bands), key=lambda i: abs(wavelengths[i] - target_nm))
    return band_names[closest]


def get_tile_url(image: ee.Image, vis_params: dict) -> str:
    map_id = image.getMapId(vis_params)
    return map_id["tile_fetcher"].url_format


def mask_s2(img: ee.Image) -> ee.Image:
    qa = img.select("QA60")
    cloud = qa.bitwiseAnd(1 << 10).eq(0)
    cirrus = qa.bitwiseAnd(1 << 11).eq(0)
    return img.updateMask(cloud.And(cirrus)).divide(10000)
