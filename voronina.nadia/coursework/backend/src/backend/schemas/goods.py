from datetime import date
from pydantic import BaseModel, Field


class Product(BaseModel):
    id: int
    name: str
    price: int = Field(ge=0)
    rating: float = Field(ge=0, le=5)
    category: str
    color: str
    image: str
    isNew: bool
    isHit: bool
    createdAt: date
    description: str
    specifications: dict[str, str]
