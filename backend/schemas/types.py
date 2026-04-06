from pydantic import BaseModel, Field
from typing import Literal


class GeoJSONGeometry(BaseModel):
    type: Literal["Polygon", "MultiPolygon"] = Field(
        description="GeoJSON geometry type",
        examples=["Polygon"],
    )
    coordinates: list[list[list[float]]] = Field(
        description="GeoJSON coordinates",
        examples=[
            [
                [
                    [85.3, 27.7],
                    [85.4, 27.7],
                    [85.4, 27.8],
                    [85.3, 27.8],
                    [85.3, 27.7],
                ]
            ]
        ],
    )


class LayerURLs(BaseModel):
    emit_rgb: str = Field(
        description="EMIT RGB tile URL",
        examples=["https://earthengine.googleapis.com/emit_rgb/..."],
    )
    s2_rgb: str = Field(
        description="Sentinel-2 RGB tile URL",
        examples=["https://earthengine.googleapis.com/s2_rgb/..."],
    )
    ndvi: str = Field(
        description="NDVI tile URL",
        examples=["https://earthengine.googleapis.com/ndvi/..."],
    )
    ndre: str = Field(
        description="NDRE tile URL",
        examples=["https://earthengine.googleapis.com/ndre/..."],
    )
