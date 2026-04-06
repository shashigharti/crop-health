from pydantic import BaseModel, Field
from .types import GeoJSONGeometry


class TrainingRequest(BaseModel):
    geometry: GeoJSONGeometry
    class_name: str = Field(examples=["coffee"])
    buffer_m: int = Field(default=150, examples=[150])


class TrainingResponse(BaseModel):
    status: str
    total: int


class TrainResponse(BaseModel):
    status: str
    layers: dict
