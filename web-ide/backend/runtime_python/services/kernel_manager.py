import aiohttp
from fastapi import HTTPException
from utils.jupyter_ws import send_execute_request


KERNEL_GATEWAY_URL = "http://localhost:8888"  # 배포 시 host.docker.internal 등으로 변경
KG_AUTH_TOKEN = "rocket"


async def get_or_create_kernel(user_id: str) -> str:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{KERNEL_GATEWAY_URL}/api/kernels",
                headers={
                    "Authorization": f"token {KG_AUTH_TOKEN}",
                    "Content-Type": "application/json"
                }
            ) as response:
                #커널 정상 생성 시 HTTP 상태 코드로 201 Created를 반환
                if response.status != 201:
                    text = await response.text()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"Kernel creation failed: {text}"
                    )

            data = await response.json()
            kernel_id = data.get("id")

            if not kernel_id:
                raise HTTPException(status_code=500, detail="Kernel ID not found in response.")

            print(f"🔥 Kernel created: {kernel_id} for user {user_id}")
            return kernel_id

    except aiohttp.ClientError as e:
        raise HTTPException(status_code=500, detail=f"Request error occurred: {str(e)}")


    except Exception as e:
        raise HTTPException(status_code=600, detail=f"Unexpected error occurred: {str(e)}")


# 코드 실행 요청도 커버

async def execute_code(*, kernel_id: str, user_id: str, source: str, cell_id: str) -> dict:
    print(f"🚀 Executing code for user {user_id}, cell {cell_id}")
    return await send_execute_request(kernel_id=kernel_id, source=source, cell_id=cell_id)
