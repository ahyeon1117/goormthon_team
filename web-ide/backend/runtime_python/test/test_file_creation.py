# test/test_file_creation.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

#이전 코드
def test_create_file():
    file_id = "test235"

    response = client.post(
        f"/api/v1/files/{file_id}"
    )

    assert response.status_code == 200

    assert response.json()["file_id"] == file_id



def test_add_cell():
    # 셀 추가 테스트
    file_id = "test235"
    cell_data = {
        "cell_type": "code",
        "source": ""
    }

    response = client.post(f"/api/v1/files/{file_id}/add_code_cell", json=cell_data)

    assert response.status_code == 200
    assert "cell_id" in response.json()
