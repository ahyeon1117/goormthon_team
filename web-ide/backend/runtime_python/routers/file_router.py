from fastapi import APIRouter, Depends, HTTPException, Query
from models.file import FileResponse
from services.notebook_service import NotebookService
from motor.motor_asyncio import AsyncIOMotorClient
from db.mongo import get_mongo_client  # 여기서 get_mongo_client를 임포트
from models.cell import CellCreate, CellResponse
from pydantic import BaseModel

#Request Body로 받는 방식
class FileCreateRequest(BaseModel):
    user_id: str
# 의존성 주입을 위한 함수
def get_notebook_service(db = Depends(get_mongo_client)):
    return NotebookService(db)

router = APIRouter(tags=["files"])

#파일_id로 응답
@router.post("/files/{file_id}", response_model=FileResponse)
async def create_file_endpoint(
    file_id: str,
    #user_id 혹시 에러나면 여기 확인
    request: FileCreateRequest,  # 이제 body로 받음
    service: NotebookService = Depends(get_notebook_service)
):
    try:
        return await service.create_file(user_id=request.user_id, file_id=file_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create file: {str(e)}")

@router.post("/files/{file_id}/cells", response_model=CellResponse)
async def add_cell_endpoint(
    file_id: str,
    cell_data: CellCreate,
    service: NotebookService = Depends(get_notebook_service)
):
    try:
        return await service.add_cell(file_id, cell_data)
    except Exception as e:
        print(f"🔥 Error in create_file_endpoint: {e}")  # <- 추가
        raise HTTPException(status_code=500, detail=f"Failed to add cell: {str(e)}")

