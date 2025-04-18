import pytest
import asyncio
import aiohttp
import websockets
import uuid
import json

GATEWAY_URL = "http://localhost:8888"
WS_GATEWAY_URL = GATEWAY_URL.replace("http", "ws")

#응답 기다리는 동안 CPU를 낭비하지 않고, 다른 작업이 돌아갈 수 있음
@pytest.mark.asyncio
async def test_execute_code():
    async with aiohttp.ClientSession() as session:
        # 1. 커널 생성

        headers = {
            "Authorization": "token rocket"
        }
#비동기 POST 요청
        async with session.post(f"{GATEWAY_URL}/api/kernels", headers=headers) as resp:
            assert resp.status == 201
            #서버에서 받은 응답(Response)을 JSON으로 파싱(parsing)
            kernel_data = await resp.json()
            kernel_id = kernel_data["id"]
            print(f"🆕 커널 생성됨: {kernel_id}")

        try:
            # 2. WebSocket 연결
            ws_url = f"{WS_GATEWAY_URL}/api/kernels/{kernel_id}/channels?session_id={kernel_id}&token=rocket"
            async with websockets.connect(ws_url) as ws:
                msg_id = str(uuid.uuid4())
                session_id = str(uuid.uuid4())
                code = "1+1"

                execute_msg = {
                    "header": {
                        "msg_id": msg_id,                # 메시지 고유 ID (uuid)
                        "username": "test-user",         # 누가 보냈는지
                        "session": session_id,           # 세션 ID (같은 흐름으로 묶을 때)
                        "msg_type": "execute_request",   # 어떤 메시지인지 (→ 실행 요청!)
                        "version": "5.3",                # Jupyter 메시지 프로토콜 버전
                    },
                    "parent_header": {},         # (부모 메시지가 있을 때 사용) 여긴 지금 비워둠
                    "metadata": {},              # 추가 정보 넣는 곳 (지금은 없음)
                    "content": {
                        "code": code,            # ⭐ 실행할 코드! 예: "1 + 1"
                        "silent": False,         # True면 출력 없이 실행됨
                        "store_history": True,   # True면 커널에 기록됨 (arrow 키로 불러올 수 있음)
                        "user_expressions": {},  # 사용자가 지정한 표현식 결과를 따로 받을 수 있음
                        "allow_stdin": False,  # 입력을 받게 할 건지 (여기선 비활성화)
                    },
                }

                await ws.send(json.dumps(execute_msg))

                result = None

                # 3. 실행 결과 수신
                while True:
                    msg = await ws.recv()
                    data = json.loads(msg)
                    msg_type = data.get("msg_type") or data.get("header", {}).get("msg_type")

                    if msg_type == "stream":
                        print("📤 STDOUT:", data["content"]["text"])

                    if msg_type == "execute_result":
                        result = data["content"]["data"]["text/plain"]
                        print("✅ 결과 수신:", result)

                    if msg_type == "execute_reply":
                        break

                # 4. 결과 검증
                assert result == "2"

        finally:
            # 5. 커널 정리
            await session.delete(f"{GATEWAY_URL}/api/kernels/{kernel_id}")
            print(f"🧹 커널 종료: {kernel_id}")