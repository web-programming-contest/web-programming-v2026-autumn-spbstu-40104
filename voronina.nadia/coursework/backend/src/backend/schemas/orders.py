from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, EmailStr, model_validator


class OrderItemRequest(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderRequest(BaseModel):
    items: list[OrderItemRequest] = Field(min_length=1)

    phone: str = Field(pattern=r"^\+?[0-9\s()-]{10,18}$")
    email: EmailStr | None = None

    delivery: Literal["pickup", "delivery"]
    address: str | None = None

    payment: Literal["card", "cash"]
    packaging: bool = False

    @model_validator(mode="after")
    def validate_order(self):
        if self.delivery == "delivery":
            if not self.address or not self.address.strip():
                raise ValueError("Укажите адрес доставки")

        if sum(char.isdigit() for char in self.phone) not in range(10, 16):
            raise ValueError("Некорректный номер телефона")

        ids = [item.product_id for item in self.items]

        if len(ids) != len(set(ids)):
            raise ValueError("Товары не должны повторяться")

        return self


class OrderItemResponse(BaseModel):
    product_id: int
    name: str
    price: int
    quantity: int
    total_price: int


class OrderResponse(BaseModel):
    id: int
    created_at: datetime
    items: list[OrderItemResponse]

    total_quantity: int
    total_price: int

    phone: str
    email: EmailStr | None

    delivery: Literal["pickup", "delivery"]
    address: str | None

    payment: Literal["card", "cash"]
    packaging: bool
