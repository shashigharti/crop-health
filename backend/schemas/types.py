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
    emit_rgb: dict = Field(
        description="EMIT RGB tile URL + legend",
    )
    s2_rgb: dict = Field(
        description="Sentinel-2 RGB tile URL + legend",
    )
    ndvi: dict = Field(
        description="NDVI tile URL + legend",
    )
    ndre: dict = Field(
        description="NDRE tile URL + legend",
    )
