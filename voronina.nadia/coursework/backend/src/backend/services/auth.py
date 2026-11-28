import secrets
import time

from fastapi import Request, HTTPException
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

SESSION_LIFETIME = 86400

sessions = {}


def verify_password(password: str, hashed_password: str):
    return password_hash.verify(password, hashed_password)


def create_session(user: dict):
    token = secrets.token_urlsafe(32)

    sessions[token] = {
        "id": user["id"],
        "username": user["username"],
        "expires_at": time.time() + SESSION_LIFETIME,
    }

    return token


def delete_session(token: str):
    sessions.pop(token, None)


async def get_current_user(request: Request):
    token = request.cookies.get("session_id")

    session = sessions.get(token)

    if session is None:
        raise HTTPException(status_code=401, detail="Пользователь не авторизован")

    if session["expires_at"] <= time.time():
        delete_session(token)

        raise HTTPException(status_code=401, detail="Сессия истекла")

    return {"id": session["id"], "username": session["username"]}
