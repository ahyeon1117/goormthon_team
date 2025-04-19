#!/bin/bash
# 실행 순서: 1. Jupyter Kernel Gateway → 2. FastAPI

jupyter kernelgateway \
  --port=8888 \
  --KernelGatewayApp.allow_origin='*' \
  --NotebookApp.token='rocket' \
  &

# Kernel Gateway가 완전히 뜰 때까지 약간 대기
sleep 3

# FastAPI 실행
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
