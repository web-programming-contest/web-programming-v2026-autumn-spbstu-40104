import asyncio
from datetime import datetime, timezone

from fastapi import HTTPException

from backend.schemas.orders import OrderRequest
from backend.services.storage import read_json, write_json

orders_lock = asyncio.Lock()


async def create_order(data: OrderRequest, user: dict):
    goods = await read_json("goods.json")

    products = {product["id"]: product for product in goods}

    items = []
    total_price = 0
    total_quantity = 0

    for item in data.items:
        product = products.get(item.product_id)

        if product is None:
            raise HTTPException(
                status_code=404, detail=f"Товар {item.product_id} не найден"
            )

        item_price = product["price"] * item.quantity

        items.append(
            {
                "product_id": product["id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item.quantity,
                "total_price": item_price,
            }
        )

        total_price += item_price
        total_quantity += item.quantity

    async with orders_lock:
        orders = await read_json("orders.json")

        order_id = max((order["id"] for order in orders), default=0) + 1

        order = {
            "id": order_id,
            "user_id": user["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "items": items,
            "total_price": total_price,
            "total_quantity": total_quantity,
            "phone": data.phone,
            "email": data.email,
            "delivery": data.delivery,
            "address": (data.address if data.delivery == "delivery" else None),
            "payment": data.payment,
            "packaging": data.packaging,
        }

        orders.append(order)

        await write_json("orders.json", orders)

    return order


async def get_user_orders(user_id: int):
    orders = await read_json("orders.json")

    user_orders = [order for order in orders if order["user_id"] == user_id]

    return sorted(user_orders, key=lambda order: order["created_at"], reverse=True)
