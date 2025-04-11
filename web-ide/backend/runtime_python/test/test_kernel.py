# test_kernel.py

import asyncio
from services.kernel_manager import get_or_create_kernel
from db.redis_client import redis_client


async def test_kernel_creation():
    user_id = "test_user"
    print(f"👤 Testing with user_id: {user_id}")

    kernel_id = await get_or_create_kernel(user_id)
    print("🧠 Created or reused kernel_id:", kernel_id)

    # Redis 저장 확인
    redis_key = f"user:{user_id}:kernel"
    saved_kernel = await redis_client.get(redis_key)
    print("📦 Redis stored kernel_id:", saved_kernel)


if __name__ == "__main__":
    asyncio.run(test_kernel_creation())
