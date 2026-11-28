from fastapi import APIRouter, HTTPException, Response, Request, Depends
from starlette.concurrency import run_in_threadpool

from backend.schemas.auth import LoginRequest, UserResponse
from backend.services.storage import read_json
from backend.services.auth import (
    verify_password,
    create_session,
    delete_session,
    get_current_user,
    SESSION_LIFETIME,
)

router = APIRouter(tags=["Auth"])


@router.post("/login", response_model=UserResponse)
async def login(data: LoginRequest, request: Request, response: Response):
    users = await read_json("users.json")

    for user in users:
        if user["username"] == data.username:
            valid = await run_in_threadpool(
                verify_password, data.password, user["password_hash"]
            )

            if valid:
                old_token = request.cookies.get("session_id")

                if old_token:
                    delete_session(old_token)

                token = create_session(user)

                response.set_cookie(
                    key="session_id",
                    value=token,
                    httponly=True,
                    samesite="lax",
                    secure=False,
                    max_age=SESSION_LIFETIME,
                )

                return {"id": user["id"], "username": user["username"]}

    raise HTTPException(status_code=401, detail="Неправильный логин или пароль")


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_id")

    if token:
        delete_session(token)

    response.delete_cookie("session_id")

    return {"message": "Вы успешно вышли из системы"}


@router.get("/me", response_model=UserResponse)
async def me(user=Depends(get_current_user)):
    return user
