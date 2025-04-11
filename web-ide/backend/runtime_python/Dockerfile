FROM python:3.10

# ping 명령어용
RUN apt update && apt install iputils-ping -y

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#머지?
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
#배포할 때는 "--reload" 제거 (운영 환경 안정성을 위해)
