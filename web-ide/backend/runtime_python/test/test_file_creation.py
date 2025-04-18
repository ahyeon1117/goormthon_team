# test/test_file_creation.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

#이전 코드
def test_create_file():
    file_id = "test126"
    user_id = "test_user12"

    response = client.post(
        f"/api/v1/files/{file_id}",
        json={"user_id": user_id}
    )

    assert response.status_code == 200
    assert response.json()["file_id"] == file_id
    assert response.json()["user_id"] == user_id
    assert "kernel_id" in response.json()  # 'id' 대신 'kernel_id'가 포함되는지 확인


def test_add_cell():
    # 셀 추가 테스트
    file_id = "test126"
    cell_data = {
        "cell_type": "code",
        "source": "print('Hello, World!')"
    }

    response = client.post(f"/api/v1/files/{file_id}/cells", json=cell_data)

    assert response.status_code == 200
    assert "cell_id" in response.json()
