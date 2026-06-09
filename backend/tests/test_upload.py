def test_upload_invalid_file(client):
    response = client.post(
        "/api/upload",
        files={
            "file": (
                "test.txt",
                b"hello world",
                "text/plain"
            )
        }
    )

    assert response.status_code == 400