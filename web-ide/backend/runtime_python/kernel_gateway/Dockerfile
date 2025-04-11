FROM python:3.10-slim

RUN pip install --no-cache-dir \
    jupyter \
    jupyter_kernel_gateway \
    ipykernel

EXPOSE 8888

CMD ["jupyter", "kernelgateway", "--KernelGatewayApp.ip=0.0.0.0", "--KernelGatewayApp.port=8888", "--KernelGatewayApp.auth_token=rocket", "--KernelGatewayApp.allow_credentials=True"]

# optional: 미리 깔아둘 패키지
RUN pip install pandas numpy scikit-learn matplotlib seaborn
