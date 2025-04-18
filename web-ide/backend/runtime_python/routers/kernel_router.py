from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import aiohttp

class UserRequest(BaseModel):
    user_id: str
router = APIRouter()

# 배포할 떄 변경=> KERNEL_GATEWAY_URL = "http://host.docker.internal:8888"  # 도커 환경에서 사용
KERNEL_GATEWAY_URL = "http://localhost:8888"

KG_AUTH_TOKEN = "rocket"

@router.post("/api/kernels")
async def create_kernel(user_id: str):
    headers = {
        "Authorization": f"token {KG_AUTH_TOKEN}",
        "Content-Type": "application/json"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{KERNEL_GATEWAY_URL}/api/kernels", headers=headers, json={"user_id": user_id}) as resp:
            if resp.status in (200, 201):
                kernel_data = await resp.json()
                return kernel_data
            else:
                detail = await resp.text()
                raise HTTPException(status_code=resp.status, detail=f"Kernel creation failed: {detail}")