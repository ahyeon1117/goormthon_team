import os
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient, ASCENDING
import psycopg2
from dotenv import load_dotenv
# 라우터
from routers.code_router import router as code_router
from routers.user_router import router as user_router

app = FastAPI()

load_dotenv()  # ← 이거 추가 필수!

# MongoDB 연결
mongo_client = MongoClient("mongodb://rocket:qwer123!@localhost:27017/webide?authSource=admin")
mongo_db = mongo_client["notebook_db"]


host = "localhost" if os.getenv("ENV") != "docker" else "postgres"
print(f"💡 실제 PostgreSQL 호스트: {host}")

# PostgreSQL 연결
postgres_conn = psycopg2.connect(
    host=host,
    database="user_db",
    user="rocket",
    password="qwer123!"
)
postgres_cursor = postgres_conn.cursor()

@app.get("/")
def root():
    return {"message": "FastAPI with MongoDB and PostgreSQL is working!"}

@app.get("/mongo-test")
def mongo_test():
    mongo_db["test"].insert_one({"hello": "world"})
    return {"mongo": "ok"}

@app.get("/postgres-test")
def postgres_test():
    postgres_cursor.execute("SELECT NOW();")
    result = postgres_cursor.fetchone()
    return {"postgres_time": result[0].isoformat()}

# 라우터 등록
app.include_router(code_router)
app.include_router(user_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)