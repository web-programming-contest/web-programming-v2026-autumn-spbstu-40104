def test_login_success(client):
    response = client.post("/login", json={"username": "admin", "password": "test123"})

    assert response.status_code == 200
    assert response.json()["username"] == "admin"
    assert "session_id" in response.cookies
    assert "password_hash" not in response.json()


def test_login_wrong_password(client):
    response = client.post("/login", json={"username": "admin", "password": "wrong"})

    assert response.status_code == 401


def test_login_empty_fields(client):
    response = client.post("/login", json={"username": "", "password": ""})

    assert response.status_code == 422


def test_me_unauthorized(client):
    response = client.get("/me")

    assert response.status_code == 401


def test_me_authorized(client):
    client.post("/login", json={"username": "admin", "password": "test123"})

    response = client.get("/me")

    assert response.status_code == 200
    assert response.json()["username"] == "admin"


def test_logout(client):
    client.post("/login", json={"username": "admin", "password": "test123"})

    response = client.post("/logout")

    assert response.status_code == 200
    assert client.get("/me").status_code == 401
