# models/cell.py
from pydantic import BaseModel
from enum import Enum

class CellType(Enum):
    CODE = "code"
    MARKDOWN = "markdown"

class CellCreate(BaseModel):
    cell_type: CellType
    source: str = ""  # 기본값을 빈 문자열로 설정)

class CellResponse(BaseModel):
    cell_id: str

