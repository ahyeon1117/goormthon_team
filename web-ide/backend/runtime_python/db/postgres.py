import os
import psycopg2

# 실행 환경 구분: ENV=docker이면 도커, 아니면 로컬
env = os.getenv("ENV", "local")  # 기본값은 'local'

# 환경에 따라 host 설정
host = "postgres" if env == "docker" else "localhost"

try:
    postgres_conn = psycopg2.connect(
        host=host,
        database="user_db",
        user="rocket",
        password="qwer123!"
    )
    postgres_cursor = postgres_conn.cursor()
    print(f"[✅ PostgreSQL] 연결 성공: 환경={env}, host={host}")
except Exception as e:
    print(f"[❌ PostgreSQL] 연결 실패: {e}")
