def test_get_projects(client):
    response = client.get("/api/projects")

    assert response.status_code == 200
    assert isinstance(response.json(), list)