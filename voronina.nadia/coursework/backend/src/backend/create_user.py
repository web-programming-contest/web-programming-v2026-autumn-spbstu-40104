import json
from pathlib import Path
from getpass import getpass

from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

username = input("Логин: ").strip()
password = getpass("Пароль: ")

if not username or not password:
    raise ValueError("Логин и пароль не должны быть пустыми")

users = [{"id": 1, "username": username, "password_hash": password_hash.hash(password)}]

path = Path(__file__).resolve().parent / "data" / "users.json"

path.write_text(json.dumps(users, ensure_ascii=False, indent=4), encoding="utf-8")

print("Пользователь успешно создан")
