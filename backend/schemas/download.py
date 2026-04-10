from datetime import date
from pydantic import BaseModel, Field, model_validator
from .types import GeoJSONGeometry, LayerURLs


class DownloadRequest(BaseModel):
    aoi: GeoJSONGeometry = Field(
        description="Area of interest as a GeoJSON geometry",
    )
    class_name: str = Field(
        description="Crop class name",
        examples=["coffee"],
    )
    start_date: date = Field(
        description="Start date for the download request",
        examples=["2024-01-01"],
    )
    end_date: date = Field(
        description="End date for the download request",
        examples=["2024-12-31"],
    )

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError("end_date must be after start_date")
        return self


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
