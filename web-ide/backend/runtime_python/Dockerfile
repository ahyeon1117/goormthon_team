FROM python:3.10-slim

RUN apt update && apt install -y curl net-tools

# 필요한 패키지 설치
RUN pip install --no-cache-dir \
    jupyter_kernel_gateway \
    ipykernel

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001
EXPOSE 8888

CMD bash -c "jupyter kernelgateway \
  --ip=0.0.0.0 \
  --port=8888 \
  --KernelGatewayApp.auth_token=rocket \
  --KernelGatewayApp.default_kernel_name='python3' \
  --KernelGatewayApp.allow_origin='*' & \
  sleep 3 && \
  uvicorn main:app --host 0.0.0.0 --port=8001 --reload"

