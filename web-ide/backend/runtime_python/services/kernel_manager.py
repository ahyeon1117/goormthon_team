from utils.jupyter_ws import send_execute_request
import httpx
from fastapi import HTTPException
import os



# 배포할 떄 변경=> KERNEL_GATEWAY_URL = "http://host.docker.internal:8888"  # 도커 환경에서 사용
KERNEL_GATEWAY_URL = "http://localhost:8888"
#(서버마다 토큰이 상이한 경우)확장성 일때는 따로 해야 하지만 지금 괜찮음
KG_AUTH_TOKEN = "rocket"

async def get_kernel(self, user_id: str) -> str:
    # 이미 존재하는 커널 ID 반환 (추후, 필요 시 구현)
    pass


# 커널 생성 or 기존 커널 사용
async def get_or_create_kernel(user_id: str) -> str:
    # 기존 커널이 이미 있는 경우는 처리하지 않음 (Redis 등 저장소를 사용하지 않기 때문)
    # 커널이 없는 경우, 새로 생성
    # kernel_id = await get_kernel_id(user_id)
    # if kernel_id:
    #     return kernel_id
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{KERNEL_GATEWAY_URL}/api/kernels",
                headers={
                    "Authorization": f"token {KG_AUTH_TOKEN}",
                    "Content-Type": "application/json"
                }
            )
            res.raise_for_status()  # HTTP 에러가 발생하면 예외를 던짐

            # 응답에서 커널 ID를 추출
            data = res.json()  # JSON 응답을 파싱
            kernel_id = data.get("id")  # 커널 ID 추출

            if not kernel_id:
                raise HTTPException(status_code=500, detail="Kernel ID not found in response.")
            print(f"🔥 Kernel created: {kernel_id} for user {user_id}")

            return kernel_id  # 생성된 커널 ID 반환
            # return res.json()  # 성공적으로 응답이 오면 JSON으로 반환
    except httpx.HTTPStatusError as http_err:
        # HTTP 에러 발생 시 처리 (예: 404, 500 등의 HTTP 상태 코드 오류)
        raise HTTPException(status_code=res.status_code, detail=f"HTTP error occurred: {str(http_err)}")

    except httpx.RequestError as req_err:
        # 요청 오류 (네트워크 오류 등)
        raise HTTPException(status_code=500, detail=f"Request error occurred: {str(req_err)}")

    except Exception as e:
        # 기타 예상하지 못한 예외
        raise HTTPException(status_code=600, detail=f"Error creating kernel: {str(e)}")
        # kernel_id = res.json()["id"]
        # return kernel_id  # 프론트엔드에서 kernel_id를 관리하도록 반환만 함


# 코드 실행 요청도 커버

async def execute_code(*, kernel_id: str, user_id: str, source: str, cell_id: str) -> dict:
    # 확장성 고려한 중간 계층
    print(f"🚀 Executing code for user {user_id}, cell {cell_id}")
    return await send_execute_request(kernel_id=kernel_id, source=source, cell_id=cell_id)
