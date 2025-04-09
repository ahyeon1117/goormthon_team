import requests

class KernelManager:
    def __init__(self):
        self.base_url = "http://localhost:8888"  # Jupyter Kernel Gateway
        self.kernels = {}  # session_id -> kernel_id

    def start_kernel(self, session_id: str):
        response = requests.post(f"{self.base_url}/api/kernels")
        if response.status_code == 201:
            kernel_id = response.json()["id"]
            self.kernels[session_id] = kernel_id
            return kernel_id
        raise Exception("Kernel start failed")

    def get_kernel(self, session_id: str):
        return self.kernels.get(session_id)