from fastapi import APIRouter, Request
# from services.executor import execute_code
from services.cell_service import create_cell, get_cells_by_file_id
from models.code_cell import CodeCell

router = APIRouter(prefix="/cells", tags=["cells"])
# kernel_manager = KernelManager()

@router.post("/")
async def create_code_cell(cell: CodeCell, request: Request):
    db = request.app.state.mongo_db
    saved = await create_cell(db, cell)
    return {"message": "Cell created", "cell": saved}

@router.get("/by-file/{file_id}")
async def get_cells(file_id: str, request: Request):
    db = request.app.state.mongo_db
    cells = await get_cells_by_file_id(db, file_id)
    return cells
