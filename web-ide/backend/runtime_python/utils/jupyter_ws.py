import websockets
import json
import uuid
from fastapi import HTTPException
import asyncio

# 배포할 떄 변경=> KERNEL_GATEWAY_URL = "http://host.docker.internal:8888"  # 도커 환경에서 사용
KERNEL_GATEWAY_URL = "localhost:8888"
KG_AUTH_TOKEN = "rocket"


def build_execute_message(kernel_id: str, source: str, cell_id: str) -> dict:
    """커널로 보낼 실행 메시지를 구성"""
    return {
        "header": {
            "msg_id": str(uuid.uuid4()),
            "msg_type": "execute_request",
            "session": kernel_id  # username은 생략
        },
        "parent_header": {},
        "metadata": {},
        "content": {
            "code": source,
            "silent": False,
            "store_history": True,
            "user_expressions": {},
            "allow_stdin": False,
            "metadata": {
                "cell_id": cell_id
            }
        }
    }


async def communicate_with_kernel(kernel_id: str, message: dict) -> dict:
    """WebSocket을 통해 커널에 메시지를 전송하고 응답을 수신"""
    ws_url = f"ws://{KERNEL_GATEWAY_URL}/api/kernels/{kernel_id}/channels?session_id={kernel_id}&token={KG_AUTH_TOKEN}"

    try:
        async with websockets.connect(ws_url) as websocket:
            # 커널이 idle 상태가 될 때까지 기다림
            while True:
                # WebSocket에서 수신된 메시지 확인
                response = await websocket.recv()
                response_json = json.loads(response)
                msg_type = response_json.get("msg_type", "")
                content = response_json.get("content", {})

                # 커널 상태가 idle이면 메시지를 보낼 수 있음
                if msg_type == "status" and content.get("execution_state") == "idle":
                    print("✅ Kernel is idle and ready for execution.")
                    break
                # 상태가 idle이 아니면 계속 기다림
                await asyncio.sleep(3)

            result = {
                "outputs": [],
                "metadata": {
                    "cell_id": message['content']['metadata']['cell_id']
                }
            }

            while True:
                response = await websocket.recv()
                response_json = json.loads(response)
                msg_type = response_json.get("msg_type", "")
                content = response_json.get("content", {})

                if msg_type == "execute_result":
                    result["outputs"].append({
                        "output_type": "execute_result",
                        "data": content.get("data"),
                        "execution_count": content.get("execution_count"),
                        "metadata": content.get("metadata", {}),
                    })

                elif msg_type == "stream":
                    result["outputs"].append({
                        "output_type": "stream",
                        "name": content.get("name"),
                        "text": content.get("text"),
                    })

                elif msg_type == "error":
                    result["outputs"].append({
                        "output_type": "error",
                        "ename": content.get("ename"),
                        "evalue": content.get("evalue"),
                        "traceback": content.get("traceback"),
                    })
                elif msg_type == "status" and content.get("execution_state") == "idle":
                    break

            return result

    except websockets.exceptions.InvalidURI as e:
        print(f"❌ Invalid URI: {e}")
        raise HTTPException(status_code=400, detail=f"WebSocket URL is invalid: {e}")
    except websockets.exceptions.WebSocketException as e:
        print(f"❌ WebSocket connection failed: {e}")
        raise HTTPException(status_code=500, detail=f"WebSocket connection failed: {e}")
    except Exception as e:
        print(f"❌ WebSocket 연결 실패: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")


async def send_execute_request(kernel_id: str, source: str, cell_id: str) -> dict:
    """커널 ID, 코드, 셀 ID를 받아 실행 요청을 보내고 결과를 반환"""
    message = build_execute_message(kernel_id, source, cell_id)
    return await communicate_with_kernel(kernel_id, message)


