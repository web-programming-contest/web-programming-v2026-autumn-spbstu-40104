def test_get_goods(client):
    response = client.get("/goods")

    assert response.status_code == 200
    assert len(response.json()) == 32


def test_get_product(client):
    response = client.get("/goods/6")

    assert response.status_code == 200
    assert response.json()["id"] == 6


def test_product_not_found(client):
    response = client.get("/goods/1000")

    assert response.status_code == 404
