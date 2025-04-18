from fastapi import APIRouter, HTTPException, Depends

from services.notebook_service import NotebookService
from db.mongo import get_mongo_client # DB 연결 가져오기
from pydantic import BaseModel, Field

router = APIRouter()

# FastAPI 의존성 주입을 사용하여 NotebookService 인스턴스 생성
def get_notebook_service(db=Depends(get_mongo_client)):
    return NotebookService(db)

class CodeExecutionRequest(BaseModel):
    id: str  # 'kernel_id' -> 'id'
    source: str
    cell_id: str
    file_id: str

# class CodeExecutionRequest(BaseModel):
#     kernel_id: str = Field(..., description="Jupyter 커널 ID")
#     user_id: str = Field(..., description="사용자 ID")
#     source: str = Field(..., description="실행할 Python 코드")
#     cell_id: str = Field(..., description="노트북 셀 ID")
#     file_id: str = Field(..., description="노트북 파일 ID")


@router.post("/api/kernels/{kernel_id}/execute")
async def execute_code_api(
    request: CodeExecutionRequest,
    service: NotebookService = Depends(get_notebook_service)  # <- 의존성 주입 받기
):
    try:
        result = await service.execute_code(
            kernel_id=request.id,
            code=request.source,
            cell_id=request.cell_id,
            file_id=request.file_id
        )
        return result
    except Exception as e:
        print(f"❌ Error during execution: {e}")  # 혹은 logging 사용
        raise HTTPException(status_code=500, detail=str(e))
