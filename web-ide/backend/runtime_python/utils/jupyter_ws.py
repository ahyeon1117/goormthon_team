import websockets
import json
import uuid

KERNEL_GATEWAY_URL = "jupyter-kernel-gateway:8888"
KG_AUTH_TOKEN = "rocket"


async def send_execute_request(kernel_id: str, user_id: str, code: str) -> str:
    ws_url = f"ws://{KERNEL_GATEWAY_URL}/api/kernels/{kernel_id}/channels?token={KG_AUTH_TOKEN}"

    async with websockets.connect(ws_url) as websocket:
        msg_id = str(uuid.uuid4())

#주피터 프로토콜 표준
        request_msg = {
            "header": {
                "msg_id": msg_id,
                "username": user_id,
                "session": str(uuid.uuid4()),
                "msg_type": "execute_request",
                "version": "5.0"
            },
            "parent_header": {},
            "metadata": {},
            "content": {
                "code": code,
                "silent": False
            },
            "channel": "shell"
        }

        await websocket.send(json.dumps(request_msg))

        result = ""
        while True:
            message = await websocket.recv()
            message_json = json.loads(message)

            if message_json.get("msg_type") == "stream":
                result += message_json["content"].get("text", "")
            elif message_json.get("msg_type") == "execute_reply":
                break

        return result
