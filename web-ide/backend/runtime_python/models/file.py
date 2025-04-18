from pydantic import BaseModel
from typing import Optional

#요청
class FileBase(BaseModel):
    file_id: str
#응답
class FileResponse(BaseModel):
    file_id: str
    user_id: str
    kernel_id: str



