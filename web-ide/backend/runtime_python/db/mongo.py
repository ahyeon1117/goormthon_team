#접속 + 컬렉션 핸들러 export" 용도
# from pymongo import MongoClient
# from pymongo.errors import ConnectionFailure
from motor.motor_asyncio import AsyncIOMotorClient

# Docker로 실행 중이면 host는 "mongodb", 로컬에서 실행 중이면 "localhost" (접속 설정)
MONGO_HOST = "mongodb_container"
MONGO_PORT = 27017
MONGO_USER = "rocket"
MONGO_PASSWORD = "qwer123!"
MONGO_DB = "webide"

# # 연결 테스트용 (동기 pymongo)
# try:
#     sync_client = MongoClient(
#         f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"
#     )
#     sync_client.admin.command('ping')
#     print("[✅ MongoDB] 연결 성공!")
# except ConnectionFailure as e:
#     print("[❌ MongoDB] 연결 실패:", e)

# FastAPI에서 사용할 비동기 클라이언트 (motor)
async_client = AsyncIOMotorClient(
    f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/?authSource=admin"
)

db = async_client[MONGO_DB]
code_cells = db["code_cells"]
# file_collection도 여기서 추가해두는 게 좋음
file_collection = db["files"]

def get_mongo_client():
    return db