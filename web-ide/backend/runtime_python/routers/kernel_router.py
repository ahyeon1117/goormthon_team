from fastapi import APIRouter, Request
from services.kernel_manager import get_or_create_kernel

router = APIRouter()

@router.post("/api/v1/kernel")
async def create_or_get_kernel(request: Request):
    data = await request.json()
    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}

    kernel_id = await get_or_create_kernel(user_id)
    return {"kernel_id": kernel_id}
