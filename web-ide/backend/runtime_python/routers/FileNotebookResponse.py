from fastapi import APIRouter, HTTPException
from db.mongo import file_collection
from fastapi.responses import JSONResponse

router = APIRouter()


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