import redis.asyncio as redis

# Docker compose에서 redis 서비스명으로 접근
REDIS_URL = "redis://redis:6379"

# 전역 Redis 클라이언트
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
