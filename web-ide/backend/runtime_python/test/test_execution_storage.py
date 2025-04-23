import asyncio
import pytest
import nbformat
from db.mongo import file_collection
from services.execution_storage_service import save_code_execution_to_db


@pytest.mark.asyncio
async def test_execution_storage_to_file():
    file_id = "test235"
    cell_id = "5aa1462a"
    code = "print('Hello World')"
    result_data = {
        "stdout": "",
        "stderr": "",
        "result": "Hello World",
    }

    # 저장 함수 호출
    try:
        await save_code_execution_to_db(file_id, cell_id, code, result_data)
    except Exception as e:
        pytest.fail(f"❌ save_code_execution_to_db 실패: {e}")




