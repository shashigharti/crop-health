from pydantic import BaseModel, Field
from .types import GeoJSONGeometry, LayerURLs


class DownloadRequest(BaseModel):
    aoi: GeoJSONGeometry = Field(
        description="Area of interest as a GeoJSON geometry",
    )
    class_name: str = Field(
        description="Crop class name",
        examples=["coffee"],
    )


class LayersResponse(BaseModel):
    status: str = Field(
        description="Status message after loading layers",
        examples=[
            "Loaded 3 EMIT scene(s). Now add training polygons: coffee, cocoa, other."
        ],
    )
    n_emit: int = Field(
        description="Number of EMIT scenes found for the AOI",
        examples=[3],
    )
    layers: LayerURLs
