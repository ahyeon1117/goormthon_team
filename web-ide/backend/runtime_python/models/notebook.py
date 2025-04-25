from typing import List, Dict, Any
from pydantic import BaseModel

class Cell(BaseModel):
    cell_type: str
    id: str
    metadata: Dict[str, Any]
    source: List[str]

class Notebook(BaseModel):
    cells: List[Cell]
    metadata: Dict[str, Any]
    nbformat: int
    nbformat_minor: int

class FileNotebookResponse(BaseModel):
    fileId: str
    fileName: str
    folderId: int | None
    projectId: int
    notebook: Notebook
