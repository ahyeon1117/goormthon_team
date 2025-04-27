from fastapi import APIRouter, HTTPException
from db.mongo import file_collection
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import nbformat
from nbformat import validator

router = APIRouter()

# 수정할 notebook 데이터를 받기 위한 Pydantic 모델
class NotebookUpdateRequest(BaseModel):
    notebookJson: str  # 수정할 notebook의 새로운 내용


@router.get("/api/notebooks/{file_id}")
async def get_notebook(file_id: str):
    collection = file_collection  # 컬렉션 이름이 정확한지 확인!
    doc = await collection.find_one({"file_id": file_id})

    if doc is None:
        raise HTTPException(status_code=404, detail="Notebook not found")

    notebook = doc.get("notebook")
    if notebook is None:
        raise HTTPException(status_code=500, detail="'notebook' field is missing")

    return JSONResponse(content=notebook)