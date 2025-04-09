# routers/user_router.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/user/test")
def user_test():
    return {"message": "User router is working!"}

@router.get("/user/ping")
def ping_user():
    return {"ping": "pong"}