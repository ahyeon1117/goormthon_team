import httpx
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel

# kernel_manager 임포트
from services.kernel_manager import get_or_create_kernel

#DB
from db.redis_client import redis_client  # redis_client 임포트
from db.mongo import MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB

# 라우터
from routers.code_router import router as code_router
from routers.user_router import router as user_router
from routers import kernel_router

# FastAPI 앱 생성
app = FastAPI()


# 요청 모델 정의 (user_id를 요청으로 받음)
class UserRequest(BaseModel):
    user_id: str


# CORS 설정 (Spring Boot와 Jupyter Kernel Gateway에서 호출 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://fastapi:8000", "http://localhost:8888"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  # ← 이거 추가 필수!

# # MongoDB 연결
# mongo_client = MongoClient("mongodb://rocket:qwer123!@localhost:27017/webide?authSource=admin")
# mongo_db = mongo_client["notebook_db"]


# host = "localhost" if os.getenv("ENV") != "docker" else "postgres"
# print(f"💡 실제 PostgreSQL 호스트: {host}")

# # PostgreSQL 연결 (나중에 사용자 로그 필요할 때 하지만 이번 프로젝트에서는 필요 없음)
# postgres_conn = psycopg2.connect(
#     host=host,
#     database="user_db",
#     user="rocket",
#     password="qwer123!"
# )
# postgres_cursor = postgres_conn.cursor()


# 비동기 MongoDB 클라이언트 초기화
mongo_client = AsyncIOMotorClient(
    f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"
)
mongo_db = mongo_client[MONGO_DB]


@app.get("/")
def root():
    return {"message": "FastAPI is working!"}


#동기 테스트
# @app.get("/mongo-test")
# def mongo_test():
#     mongo_db["test"].insert_one({"hello": "world"})
#     return {"mongo": "ok"}

#비동기 테스트
@app.get("/mongo-test")
async def mongo_test():
    await mongo_db["test"].insert_one({"hello": "world"})
    return {"mongo": "ok"}


# @app.get("/postgres-test")
# def postgres_test():
#     postgres_cursor.execute("SELECT NOW();")
#     result = postgres_cursor.fetchone()
#     return {"postgres_time": result[0].isoformat()}

# 커널 생성 또는 가져오기 엔드포인트
@app.post("/kernel")
async def create_or_get_kernel(user_request: UserRequest):
    user_id = user_request.user_id
    kernel_id = await get_or_create_kernel(user_id)  # kernel_manager에서 가져온 함수 사용
    return {"kernel_id": kernel_id}


# 라우터 등록
app.include_router(code_router, prefix="/api/v1")
app.include_router(user_router)

app.include_router(kernel_router.router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
