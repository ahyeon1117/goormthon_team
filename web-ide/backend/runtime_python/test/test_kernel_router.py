import pytest
from httpx import AsyncClient,  ASGITransport
from main import app

pytestmark = pytest.mark.asyncio

@pytest.mark.asyncio
async def test_create_or_get_kernel():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/kernel", json={"user_id": "test_user"})
        assert response.status_code == 200
        assert "kernel_id" in response.json()
