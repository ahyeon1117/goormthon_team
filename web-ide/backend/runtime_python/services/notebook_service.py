import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell
from fastapi import HTTPException
from models.cell import CellCreate, CellType
import uuid

#커널
from services.kernel_manager import get_or_create_kernel
from utils.jupyter_ws import send_execute_request
class NotebookService:
    def __init__(self, database):
        self.db = database["files"]

    async def create_file(self, user_id: str, file_id: str):
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
                "user_id": user_id,  # 사용자 아이디 추가
                "file_id": file_id,
                "notebook": nbformat.writes(notebook)
            }
            await self.db.insert_one(doc)

            # 파일 생성라면 커널 자동 생성 (user_id로 커널을 생성하고 반환)
            kernel_info = await get_or_create_kernel(user_id)
            print(f"🔥 Kernel created for {user_id}: {kernel_info}")  #
            #kernel_id 응답 필드는 실제 HTTP 응답 JSON의 키인 "id" 사용.
            # kernel_id = kernel_info["id"]  # 응답 JSON에서 id 키 사용
            kernel_id = kernel_info

            #보내는 값들
            return {"file_id": file_id, "user_id": user_id, "kernel_id": kernel_id}

        except Exception as e:
            print(f"🔥 Error in create_file: {e}")  # <- 추가
            raise HTTPException(status_code=500, detail=f"Error creating file: {str(e)}")

    async def add_cell(self, file_id: str, cell_data: CellCreate):
        try:
            doc = await self.db.find_one({"file_id": file_id})
            if not doc:
                raise HTTPException(status_code=404, detail="File not found")

            notebook = nbformat.reads(doc["notebook"], as_version=4)

            new_cell = (new_code_cell(cell_data.source)
                        if cell_data.cell_type == CellType.CODE
                        else new_markdown_cell(cell_data.source))

            # # 무조건 id 존재한다고 가정 (nbformat이 자동 생성)
            # cell_id = new_cell.get("id") or str(uuid.uuid4())  # 혹시 몰라 fallback 추가
            # "metadata"에 "id"와 "outputid" 추가
            new_cell.metadata = {
                "id": new_cell["id"],  # ID는 UUID로 생성
            }

            # # outputs가 비어 있지 않으면 outputid 생성
            # if new_cell.outputs:
            #     new_cell.metadata["outputid"] = str(uuid.uuid4())  # outputid는 결과가 있을 때만 생성

            # nbformat 4.x에서 ID가 필수로 존재해야 한다고 가정
            new_cell["execution_count"] = None  # execution_count는 null로 설정
            new_cell["outputs"] = []  # outputs는 빈 리스트로 설정

            notebook.cells.append(new_cell)

            await self.db.update_one(
                {"file_id": file_id},
                {"$set": {"notebook": nbformat.writes(notebook)}}
            )

            return {"cell_id": new_cell["metadata"]["id"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding cell: {str(e)}")

#user_id 제거
    async def execute_code(self, kernel_id: str, code: str, cell_id: str, file_id: str):
        try:

            print("✅ execute_code() 메서드 진입")
            print(f"📨 요청 내용: kernel_id={kernel_id}, cell_id={cell_id}, file_id={file_id}")

            # Jupyter에 코드 실행 요청 보내기
            result = await send_execute_request(kernel_id, code, cell_id)

            # 셀 실행 결과 가져오기
            outputs = result.get("outputs", [])
            print(f"📤 실행 결과 outputs: {outputs}")

            # outputs에 outputid 추가하기
            for output in outputs:
                output.setdefault("metadata", {})["outputid"] = str(uuid.uuid4())

            # 실행 결과 업데이트 (MongoDB)
            await self.update_cell_outputs(file_id, cell_id, outputs)

            return result

        except Exception as e:
            print(f"❌ execute_code 오류: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error executing code: {str(e)}")

    async def update_cell_outputs(self, file_id: str, cell_id: str, outputs: list):
        try:
            print(f"📌 update_cell_outputs 호출: file_id={file_id}, cell_id={cell_id}")

            # 파일을 찾고 없으면 에러 반환
            doc = await self.db.find_one({"file_id": file_id})
            if not doc:
                print(f"❗️파일 없음: {file_id}")
                raise HTTPException(status_code=404, detail="File not found")

            notebook = nbformat.reads(doc["notebook"], as_version=4)

            # 해당 셀을 찾기
            cell = next((cell for cell in notebook.cells if cell.metadata.get("id") == cell_id), None)
            if not cell:
                print(f"❗️셀 없음: {cell_id}")
                raise HTTPException(status_code=404, detail="Cell not found")

            # 셀에 실행 결과 업데이트
            cell["outputs"] = outputs

            # 파일 업데이트
            await self.db.update_one(
                {"file_id": file_id},
                {"$set": {"notebook": nbformat.writes(notebook)}}
            )

            print(f"✅ 셀 업데이트 완료: cell_id={cell_id}")

        except Exception as e:
            print(f"❌ update_cell_outputs 오류: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating cell outputs: {str(e)}")
