from fastapi import APIRouter, Depends

from backend.schemas.orders import OrderRequest, OrderResponse
from backend.services.auth import get_current_user
from backend.services.orders import create_order, get_user_orders

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=201)
async def add_order(data: OrderRequest, user=Depends(get_current_user)):
    return await create_order(data, user)


@router.get("", response_model=list[OrderResponse])
async def get_orders(user=Depends(get_current_user)):
    return await get_user_orders(user["id"])
