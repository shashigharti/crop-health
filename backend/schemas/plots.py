from pydantic import BaseModel, Field


class PlotFeatureProperties(BaseModel):
    crop: str
    plot_id: int = Field(description="Unique plot ID from connectedComponents")
    ndvi_mean: float = Field(description="Mean NDVI value within plot")
    ndre_mean: float = Field(description="Mean NDRE value within plot")
    health: int = Field(description="0=stressed, 1=moderate, 2=healthy")
    area_ha: float = Field(description="Plot area in hectares")


class PlotsResponse(BaseModel):
    status: str
    geojson: dict = Field(description="GeoJSON FeatureCollection of plot polygons")
