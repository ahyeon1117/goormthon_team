import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell
from fastapi import HTTPException
from models.cell import CellCreate, MarkdownUpdate
import uuid

#커널
from services.kernel_manager import get_or_create_kernel
from utils.jupyter_ws import send_execute_request
class NotebookService:
    def __init__(self, database):
        self.db = database["files"]

    async def create_file(self, file_id: str):
        try:
            notebook = new_notebook()

            # notebook의 기본 정보 설정 (metadata, nbformat, nbformat_minor)
            notebook.nbformat = 4
            notebook.nbformat_minor = 5
            notebook.metadata = {}

            # # 파일 권한 설정 (소유자만)
            # permissions = {
            #     "owner": user_id  # 소유자만 권한을 가짐
            # }
            doc = {
                "file_id": file_id,
                "notebook": nbformat.writes(notebook)
            }
            # MongoDB에 저장
            await self.db.insert_one(doc)

            return {"file_id": file_id}

        except Exception as e:
            print(f"🔥 Error in create_file: {e}")  # <- 추가
            raise HTTPException(status_code=500, detail=f"Error creating file: {str(e)}")

    async def add_cell(self, file_id: str, cell_data: CellCreate):
        try:
            # 문서 찾기
            doc = await self.db.find_one({"file_id": file_id})
            if not doc:
                raise HTTPException(status_code=404, detail="File not found")

            # nbformat 파싱
            notebook = nbformat.reads(doc["notebook"], as_version=4)

            # 코드 셀 생성
            new_cell = nbformat.v4.new_code_cell(source=cell_data.source)
            new_cell["execution_count"] = None
            new_cell["outputs"] = []

            # # cell_id 생성 (nbformat이 자동 생성하긴 하지만 fallback 포함)
            # new_cell = nbformat.v4.new_code_cell(source=code)
            # # ID는 자동 생성된 값으로 그대로 사용
            # new_cell["metadata"] = {"id": new_cell["id"]}  # 메타데이터에 ID를 포함시키는 건 선택 사항

            # 출력이 있다면 outputid 생성
            if new_cell.get("outputs"):
                new_cell["metadata"]["outputid"] = str(uuid.uuid4())

            # 셀 메타데이터에 ID 추가 (nbformat이 자동으로 생성하는 ID 사용)
            new_cell["metadata"]["id"] = new_cell["id"]

            # 셀 notebook에 추가
            notebook.cells.append(new_cell)

            # 저장
            await self.db.update_one(
                {"file_id": file_id},
                {"$set": {"notebook": nbformat.writes(notebook)}}
            )

            return {"cell_id": new_cell["metadata"]["id"]}

            # # nbformat 4.x에서 ID가 필수로 존재해야 한다고 가정
            # new_cell["execution_count"] = None  # execution_count는 null로 설정
            # new_cell["outputs"] = []  # outputs는 빈 리스트로 설정
            #
            # notebook.cells.append(new_cell)
            #
            # await self.db.update_one(
            #     {"file_id": file_id},
            #     {"$set": {"notebook": nbformat.writes(notebook)}}
            # )
            #
            # return {"cell_id": new_cell["metadata"]["id"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding cell: {str(e)}")

    async def add_markdown_cell(self, file_id: str, markdown: str):
        try:
            # 문서 찾기
            doc = await self.db.find_one({"file_id": file_id})
            if not doc:
                raise HTTPException(status_code=404, detail="File not found")

            # nbformat 파싱
            notebook = nbformat.reads(doc["notebook"], as_version=4)

            # 마크다운 셀 생성
            new_cell = new_markdown_cell(source=markdown)

            # 셀 메타데이터에 ID 추가 (nbformat이 자동 생성한 ID 사용)
            new_cell["metadata"]["id"] = new_cell["id"]

            # notebook에 추가
            notebook.cells.append(new_cell)

            # MongoDB에 저장
            await self.db.update_one(
                {"file_id": file_id},
                {"$set": {"notebook": nbformat.writes(notebook)}}
            )

            return {"cell_id": new_cell["metadata"]["id"]}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding markdown cell: {str(e)}")

    async def update_markdown_cell(self, file_id: str, cell_data: MarkdownUpdate):
        try:
            # 문서 찾기
            doc = await self.db.find_one({"file_id": file_id})
            if not doc:
                raise HTTPException(status_code=404, detail="File not found")

            # 2. nbformat 파싱
            notebook = nbformat.reads(doc["notebook"], as_version=4)

            # 3. 해당 셀 찾아서 업데이트
            cell_found = False
            for cell in notebook.cells:
                if cell.get("metadata", {}).get("id") == cell_data.cell_id:
                    if cell.cell_type != "markdown":
                        raise HTTPException(status_code=400, detail="Cell is not a markdown type")
                    cell.source = "\n".join(cell_data.source)
                    cell_found = True
                    break

            if not cell_found:
                raise HTTPException(status_code=404, detail="Cell not found")

            # 4. notebook 저장
            await self.db.update_one(
                {"file_id": file_id},
                {"$set": {"notebook": nbformat.writes(notebook)}}
            )

            return {"message": "Markdown cell updated successfully", "cell_id": cell_data.cell_id}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating markdown cell: {str(e)}")



