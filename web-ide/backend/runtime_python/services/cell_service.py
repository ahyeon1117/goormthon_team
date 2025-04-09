from motor.motor_asyncio import AsyncIOMotorDatabase
from models.code_cell import CodeCell

#MongoDB를 활용한 셀 생성 & 조회 로직 추가
async def create_cell(db: AsyncIOMotorDatabase, cell: CodeCell):
    cell_dict = cell.dict()
    await db["code_cells"].insert_one(cell_dict)
    return cell_dict

async def get_cells_by_file_id(db: AsyncIOMotorDatabase, file_id: str):
    cursor = db["code_cells"].find({"file_id": file_id})
    return [doc async for doc in cursor]
