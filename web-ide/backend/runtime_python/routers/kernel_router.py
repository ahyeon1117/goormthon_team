from pydantic import BaseModel
import httpx
import os
from fastapi import APIRouter, HTTPException
from services.kernel_manager import get_or_create_kernel

class UserRequest(BaseModel):
    user_id: str
router = APIRouter()

# 배포할 떄 변경=> KERNEL_GATEWAY_URL = "http://host.docker.internal:8888"  # 도커 환경에서 사용
KERNEL_GATEWAY_URL = "http://localhost:8888"

KG_AUTH_TOKEN = "rocket"

@router.post("/api/kernels")
async def create_kernel(user_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{KERNEL_GATEWAY_URL}/api/kernels",  # 엔드포인트
            headers={
                "Authorization": f"token {KG_AUTH_TOKEN}",
                "Content-Type": "application/json"
            },
            json={"user_id": user_id}  # 요청 본문에 JSON 데이터 포함
        )
        response.raise_for_status()  # 예외 처리

        if response.status_code in (200, 201):
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Kernel creation failed")