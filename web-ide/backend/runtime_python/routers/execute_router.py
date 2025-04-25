from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.execute_service import execute_code_via_ws  # 네가 만든 실행 함수

router = APIRouter(prefix="/api", tags=["kernel"])

class ExecuteRequest(BaseModel):
    kernel_id: str
    code: str
    cell_id: str

@router.post("/execute/{file_id}")
async def execute_code(file_id: str, req: ExecuteRequest):
    result = await execute_code_via_ws(req.kernel_id, req.code, req.cell_id)
    return result
