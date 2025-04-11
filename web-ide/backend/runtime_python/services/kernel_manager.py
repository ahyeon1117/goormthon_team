from utils.jupyter_ws import send_execute_request
#레디스 로직 모듈화 됨
from db.redis_client import redis_client
import httpx

#파라미터로 받아서 수정 jupyter-kernel-gateway => "ip" 확장성 고려한 부분 나중에 어필
KERNEL_GATEWAY_URL = "http://jupyter-kernel-gateway:8888"
#(서버마다 토큰이 상이한 경우)확장성 일때는 따로 해야 하지만 지금 괜찮음
KG_AUTH_TOKEN = "rocket"


# Redis 기반 커널 ID 저장
async def save_kernel_id(user_id: str, kernel_id: str):
    await redis_client.set(f"user:{user_id}:kernel", kernel_id)


async def get_kernel_id(user_id: str) -> str | None:
    return await redis_client.get(f"user:{user_id}:kernel")


# 커널 생성 or 기존 커널 사용
async def get_or_create_kernel(user_id: str) -> str:
    kernel_id = await get_kernel_id(user_id)
    if kernel_id:
        return kernel_id

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{KERNEL_GATEWAY_URL}/api/kernels",
            headers={"Authorization": f"token {KG_AUTH_TOKEN}",
                     "Content-Type": "application/json"  # 안전하게 하려고 같이 넣어줌
                     }
        )
        res.raise_for_status()  # 예외 처리용 (HTTP 에러 대비)

        kernel_id = res.json()["id"]
        await save_kernel_id(user_id, kernel_id)
        return kernel_id


# 코드 실행 요청도 커버 (나중에 실행 로직 바뀌면 이 부부만 수정, 비즈니스 로직 캡슐화)
async def execute_code(kernel_id: str, user_id: str, code: str) -> str:
    return await send_execute_request(kernel_id, user_id, code)
