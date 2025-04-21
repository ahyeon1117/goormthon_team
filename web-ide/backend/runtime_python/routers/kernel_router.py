from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional
import aiohttp

router = APIRouter(prefix="/api", tags=["kernel"])

# 배포할 떄 변경=> KERNEL_GATEWAY_URL = "http://host.docker.internal:8888"  # 도커 환경에서 사용
KERNEL_GATEWAY_URL = "http://localhost:8888"

KG_AUTH_TOKEN = "rocket"

@router.post("/kernels")
async def create_kernel(
    authorization: str = Header(...),
    user_id: Optional[str] = Query(None)
):
    # 1. Spring에서 전달된 JWT 토큰 확인 (사용 여부는 나중에 처리 가능)
    jwt_token = authorization  # 예: "Bearer eyJhbGciOiJIUz..."
    
    print(f"📨 Received JWT Token: {jwt_token}")
    
    headers = {
        "Authorization": f"token {KG_AUTH_TOKEN}",
        "Content-Type": "application/json"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{KERNEL_GATEWAY_URL}/api/kernels", headers=headers, json={}) as resp:
            if resp.status in (200, 201):
                kernel_data = await resp.json()
                return kernel_data
            else:
                # 더 구체적인 에러 처리 (예: Jupyter가 반환한 오류 메시지)
                try:
                    detail = await resp.json()
                except Exception:
                    detail = await resp.text()
                raise HTTPException(status_code=resp.status, detail=f"Kernel creation failed: {detail}")