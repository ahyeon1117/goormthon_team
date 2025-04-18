from httpx import AsyncClient
import pytest

KERNEL_GATEWAY_URL = "http://localhost:8888"  # 또는 실제 URL
KG_AUTH_TOKEN = "rocket"  # 실제 토큰을 입력

@pytest.mark.asyncio
async def test_kernel_api():
    # AsyncClient를 사용하여 비동기적으로 FastAPI 애플리케이션에 요청
    async with AsyncClient() as client:
        # 인증 헤더와 함께 요청 보내기
        response = await client.post(
            f"{KERNEL_GATEWAY_URL}/api/kernels",  # 엔드포인트 수정
            headers={
                "Authorization": f"token {KG_AUTH_TOKEN}",
                "Content-Type": "application/json"
            },
            # json={"user_id": "test_user"}  # 요청 본문에 JSON 데이터 포함
        )

        # 예외 처리
        response.raise_for_status()

        # 응답 상태 코드 확인
        assert response.status_code in (200, 201)
        assert "id" in response.json()

        # 응답에서 kernel_id 출력
        data = response.json()  # 응답을 JSON으로 변환
        print("✅ kernel_id:", data["id"])

