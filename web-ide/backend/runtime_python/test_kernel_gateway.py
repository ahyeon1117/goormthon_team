import pytest
from fastapi.testclient import TestClient
from main import app  # FastAPI 앱 객체 불러오기
import httpx

@pytest.mark.asyncio
async def test_kernel_gateway():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8888/test_kernel_gateway")
        assert response.status_code == 200
        assert response.json() == {"status": "success", "message": "Kernel Gateway is running!"}

