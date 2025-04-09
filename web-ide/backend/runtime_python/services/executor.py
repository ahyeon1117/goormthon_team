import requests
import uuid

def execute_code(session_id: str, code: str, kernel_manager):
    kernel_id = kernel_manager.get_kernel(session_id)
    if not kernel_id:
        raise Exception("Kernel not found for session")

    payload = {
        "header": {
            "msg_id": str(uuid.uuid4()),
            "username": "user",
            "session": session_id,
            "msg_type": "execute_request",
            "version": "5.2"
        },
        "parent_header": {},
        "metadata": {},
        "content": {
            "code": code,
            "silent": False
        }
    }

    response = requests.post(
        f"http://localhost:8888/api/kernels/{kernel_id}/execute",
        json=payload
    )

    return response.json()