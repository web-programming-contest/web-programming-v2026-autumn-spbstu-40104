from fastapi import APIRouter, HTTPException

from backend.schemas.goods import Product
from backend.services.storage import read_json

router = APIRouter(prefix="/goods", tags=["Goods"])


@router.get("", response_model=list[Product])
async def get_goods():
    return await read_json("goods.json")


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int):
    goods = await read_json("goods.json")

    for product in goods:
        if product["id"] == product_id:
            return product

    raise HTTPException(status_code=404, detail="Товар не найден")
