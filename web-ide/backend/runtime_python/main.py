import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel
import logging
import asyncio




#DB
from db.mongo import MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB

# 라우터
from routers.code_router import router as code_router
from routers import kernel_router
from routers.file_router import router as file_router  # 파일 라우터 임포트

# FastAPI 앱 생성
app = FastAPI()


# 요청 모델 정의 (user_id를 요청으로 받음)
class UserRequest(BaseModel):
    user_id: str


# CORS 설정 (Spring Boot와 Jupyter Kernel Gateway에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:8001",      # 로컬 개발 환경
        "http://localhost:8888",      # Jupyter Kernel Gateway
        # "http://host.docker.internal:8001",  # 도커에서 로컬 접근
        # "http://host.docker.internal:8888"   # 도커에서 Jupyter Kernel Gateway 접근
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  # ← 이거 추가 필수!


# 비동기 MongoDB 클라이언트 초기화
mongo_client = AsyncIOMotorClient(
    f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"
)
mongo_db = mongo_client[MONGO_DB]


@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

#비동기 테스트
@app.get("/mongo-test")
async def mongo_test():
    try:
        client = AsyncIOMotorClient("mongodb://rocket:qwer123!@localhost:27017/?authSource=admin")
        await client.admin.command('ping')  # 단순 연결 확인

        return {"result": "MongoDB 연결 성공 ✅"}
    except Exception as e:
        logging.error(f"MongoDB 연결 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=f"MongoDB 연결 오류: {e}")


# 로그 포맷과 레벨 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

@app.websocket("/ws/test/{kernel_id}")
async def websocket_test(websocket: WebSocket, kernel_id: str):
    await websocket.accept()
    logging.info(f"🔌 WebSocket 연결됨: kernel_id={kernel_id}")

    try:
        while True:
            data = await websocket.receive_text()
            logging.info(f"📩 받은 메시지: {data}")
            await websocket.send_text(f"📤 서버에서 받은 메시지: {data}")
            await asyncio.sleep(1)  # 추가 대기 시간
    except WebSocketDisconnect:
        logging.info(f"❌ WebSocket 연결 종료: kernel_id={kernel_id}")
    except Exception as e:
        logging.error(f"서버 오류 발생: {e}")
        await websocket.close()

# 라우터 등록

app.include_router(code_router)
#커널
app.include_router(kernel_router.router)

app.include_router(file_router, prefix="/api/v1")



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True, log_level="debug")
