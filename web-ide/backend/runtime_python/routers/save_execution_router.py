import logging
from fastapi import Request
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.execution_storage_service import save_code_execution_to_db

logger = logging.getLogger(__name__)
router = APIRouter()

class SaveExecutionRequest(BaseModel):
    file_id: str
    cell_id: str
    code: str
    stdout: str = ""
    stderr: str = ""
    result: Optional[str] = ""


@router.post("/api/save_execution")
# async def debug_save_execution(raw: Request):
#     body = await raw.json()
#     logger.info("📝 RAW JSON: %s", body)
#     return {"message": "확인 완료 ✅"}
async def save_execution(req: SaveExecutionRequest):
    result_data = {
        "stdout": req.stdout,
        "stderr": req.stderr,
        "result": req.result
    }

    success = await save_code_execution_to_db(
        file_id=req.file_id,
        cell_id=req.cell_id,
        code=req.code,
        result_data=result_data
    )

    if success:
        return {"message": "Execution saved successfully ⭕️"}
    else:
        return {"error": "Failed to save execution to DB ❌"}
