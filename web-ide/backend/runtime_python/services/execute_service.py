import uuid
import json
from typing import Optional
from collections import defaultdict
from aiohttp import ClientSession, WSMsgType

WS_GATEWAY_URL = "http://localhost:8888"  # Jupyter Kernel Gateway 주소
GATEWAY_TOKEN = "rocket"


def build_execute_request(kernel_id: str, code: str, cell_id: Optional[str]) -> dict:
    """
    WebSocket으로 보낼 실행 메시지 생성
    """
    msg_id = str(uuid.uuid4())
    return {
        "header": {
            "msg_id": msg_id,
            "session": kernel_id,
            "msg_type": "execute_request",
            "version": "5.3",
        },
        "parent_header": {},
        "metadata": {},
        "content": {
            "code": code,
            "silent": False,
            "store_history": True,
            "user_expressions": {},
            "allow_stdin": False,
            "cell_id": cell_id,
        },
    }


async def execute_code_via_ws(kernel_id: str, code: str, cell_id: Optional[str] = None) -> dict:
    url = f"{WS_GATEWAY_URL}/api/kernels/{kernel_id}/channels?session_id={kernel_id}&token={GATEWAY_TOKEN}"
    execute_msg = build_execute_request(kernel_id, code, cell_id)

    logs = defaultdict(str)  # stdout, stderr 누적용
    result_data = {
        "cell_id": cell_id,
        "code": code,
        "stdout": "",
        "stderr": "",
        "result": None
    }

    async with ClientSession() as session:
        try:
            async with session.ws_connect(url) as ws:
                await ws.send_json(execute_msg)

                async for msg in ws:
                    if msg.type == WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        msg_type = data.get("msg_type") or data.get("header", {}).get("msg_type")

                        if msg_type == "stream":
                            if data["content"]["name"] == "stdout":
                                result_data["stdout"] += data["content"]["text"]
                            elif data["content"]["name"] == "stderr":
                                result_data["stderr"] += data["content"]["text"]

                        elif msg_type == "execute_result":
                            result_data["result"] = data["content"]["data"]["text/plain"]

                        elif msg_type == "error":
                            result_data["stderr"] += "\n".join(data["content"].get("traceback", []))

                        elif msg_type == "execute_reply":
                            break

                return result_data

        except Exception as e:
            return {
                "cell_id": cell_id,
                "code": code,
                "stdout": "",
                "stderr": f"WebSocket Error: {str(e)}",
                "result": "Execution Failed"
            }
