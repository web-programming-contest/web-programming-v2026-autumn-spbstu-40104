import json
import shutil

import pytest
from fastapi.testclient import TestClient
from pwdlib import PasswordHash

from backend.main import app
from backend.services import storage
from backend.services.auth import sessions


@pytest.fixture
def client(tmp_path, monkeypatch):
    shutil.copy(storage.DATA_DIR / "goods.json", tmp_path / "goods.json")

    users = [
        {
            "id": 1,
            "username": "admin",
            "password_hash": PasswordHash.recommended().hash("test123"),
        }
    ]

    (tmp_path / "users.json").write_text(json.dumps(users), encoding="utf-8")

    (tmp_path / "orders.json").write_text("[]", encoding="utf-8")

    monkeypatch.setattr(storage, "DATA_DIR", tmp_path)

    sessions.clear()

    with TestClient(app) as test_client:
        yield test_client

    sessions.clear()
