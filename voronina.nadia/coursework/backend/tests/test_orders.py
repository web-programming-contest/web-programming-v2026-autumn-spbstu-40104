import json

from backend.services import storage


def login(client):
    response = client.post("/login", json={"username": "admin", "password": "test123"})

    assert response.status_code == 200


def order_data():
    return {
        "items": [{"product_id": 6, "quantity": 2}],
        "phone": "+79990000000",
        "email": None,
        "delivery": "pickup",
        "address": None,
        "payment": "card",
        "packaging": False,
    }


def test_create_order(client):
    login(client)

    product = client.get("/goods/6").json()

    response = client.post("/orders", json=order_data())

    assert response.status_code == 201
    assert response.json()["total_quantity"] == 2
    assert response.json()["total_price"] == product["price"] * 2


def test_order_history(client):
    login(client)

    response = client.post("/orders", json=order_data())

    assert response.status_code == 201

    response = client.get("/orders")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_order_saved(client):
    login(client)

    response = client.post("/orders", json=order_data())

    assert response.status_code == 201

    path = storage.DATA_DIR / "orders.json"

    orders = json.loads(path.read_text(encoding="utf-8"))

    assert len(orders) == 1
    assert orders[0]["id"] == response.json()["id"]


def test_order_unauthorized(client):
    response = client.post("/orders", json=order_data())

    assert response.status_code == 401


def test_history_unauthorized(client):
    response = client.get("/orders")

    assert response.status_code == 401


def test_empty_order(client):
    login(client)

    data = order_data()
    data["items"] = []

    response = client.post("/orders", json=data)

    assert response.status_code == 422


def test_delivery_without_address(client):
    login(client)

    data = order_data()
    data["delivery"] = "delivery"

    response = client.post("/orders", json=data)

    assert response.status_code == 422


def test_invalid_product(client):
    login(client)

    data = order_data()
    data["items"][0]["product_id"] = 1000

    response = client.post("/orders", json=data)

    assert response.status_code == 404


def test_invalid_quantity(client):
    login(client)

    data = order_data()
    data["items"][0]["quantity"] = 0

    response = client.post("/orders", json=data)

    assert response.status_code == 422
