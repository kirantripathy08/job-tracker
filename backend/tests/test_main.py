"""
Integration tests: these hit real endpoints against a real Postgres database
(not mocked). In CI, a temporary Postgres container provides this.
Locally, this runs against whatever DATABASE_URL points to — so run these
against a throwaway/test database, not your real dev data, since tests
create and delete rows.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_returns_ok():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_list_application():
    payload = {"company": "Test Corp", "role": "Backend Engineer", "status": "applied"}
    create_res = client.post("/applications", json=payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["company"] == "Test Corp"
    assert "id" in created

    list_res = client.get("/applications")
    assert list_res.status_code == 200
    companies = [app["company"] for app in list_res.json()]
    assert "Test Corp" in companies

    # cleanup so repeated test runs stay idempotent
    client.delete(f"/applications/{created['id']}")


def test_invalid_status_is_rejected():
    payload = {"company": "Bad Co", "role": "Tester", "status": "not_a_real_status"}
    response = client.post("/applications", json=payload)
    assert response.status_code == 422


def test_get_nonexistent_application_returns_404():
    response = client.get("/applications/999999")
    assert response.status_code == 404


def test_update_application():
    create_res = client.post(
        "/applications", json={"company": "Update Co", "role": "Dev", "status": "applied"}
    )
    app_id = create_res.json()["id"]

    update_res = client.put(f"/applications/{app_id}", json={"status": "interview"})
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "interview"

    client.delete(f"/applications/{app_id}")
