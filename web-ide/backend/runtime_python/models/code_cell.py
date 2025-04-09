from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime
from uuid import uuid4

class CodeCell(BaseModel):
    file_id: str  # Spring에서 전달
    cell_id: str = Field(default_factory=lambda: str(uuid4()))  # 서버에서 자동 생성
    type: Literal["code", "markdown"]
    content: str
    output: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
