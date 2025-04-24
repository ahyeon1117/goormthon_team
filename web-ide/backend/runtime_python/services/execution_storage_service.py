from datetime import datetime
from db.mongo import file_collection
import nbformat
from nbformat.v4 import new_output
from nbformat import from_dict

async def save_code_execution_to_db(file_id: str, cell_id: str, code: str, result_data: dict):
    """
    :param file_id: 파일 ID
    :param cell_id: 셀 ID
    :param code: 실행된 코드 (문자열로 제공)
    :param result_data: 실행 결과 데이터 (stdout, stderr, result 포함)
    """
    # 0. 문서 찾기
    doc = await file_collection.find_one({"file_id": file_id})
    if not doc:
        return 0

    try:
        notebook = nbformat.reads(doc["notebook"], as_version=4)
    except Exception as e:
        print(f"❗️Notebook parsing error: {e}")
        return 0

    # 1. 해당 셀 찾기
    target_cell = next((cell for cell in notebook.cells if cell.get("id") == cell_id), None)
    if not target_cell:
        return 0


    # execution_count 증가
    execution_count = (target_cell.get("execution_count") or 0) + 1
    target_cell["execution_count"] = execution_count

    # source는 항상 리스트로 저장 (문자열이면 리스트로 감싸기)
    target_cell["source"] = [code] if isinstance(code, str) else code

    # output 데이터 구성
    outputs = []

    # stdout
    if result_data.get("stdout"):
        outputs.append(new_output(
            output_type="stream",
            name="stdout",
            text=result_data["stdout"].splitlines()  # 여러 줄 출력 처리
        ))

    # stderr
    if result_data.get("stderr"):
        outputs.append(new_output(
            output_type="stream",
            name="stderr",
            text=result_data["stderr"].splitlines()
        ))

    # result (from dict으로 데이터 추가)
    if result_data.get("result"):
        outputs.append(new_output(
            output_type="execute_result",
            data={"text/plain": result_data["result"]},  # ✅ 여기에만 담기도록!
        ))


    # 셀 내용 갱신
    target_cell["outputs"] = outputs


    target_cell.setdefault("metadata", {})["last_run"] = datetime.utcnow().isoformat()

    # DB에 저장
    await file_collection.update_one(
        {"file_id": file_id},
        {"$set": {"notebook": nbformat.writes(notebook)}}
    )

    return 1