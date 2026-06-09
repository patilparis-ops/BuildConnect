def test_generate_requires_image_id(client):
    response = client.post(
        "/api/generate",
        json={
            "prompt": "Create dashboard",
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "image_id is required."


def test_generate_unknown_image_id(client):
    response = client.post(
        "/api/generate",
        json={
            "prompt": "Create dashboard",
            "image_id": "fake-id"
        }
    )

    assert response.status_code == 404
