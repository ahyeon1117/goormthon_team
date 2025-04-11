# 파일구조 설명

db/ Mongo/Postgres 연동 코드 모음

routers/ API 라우터 모음 (코드 실행, 셀 저장 등)

services/ 실행 로직, 커널 관리 등

services/executor.py 코드 실행 관련

services/kernel_manager.py  커널 상태 관리, Redis에 커널 ID 저장/조회 코드

models/ Pydantic 모델 정의

/runtime_python/Dockerfile     # FastAPI

/kernel_gateway/Dockerfile     # Jupyter Kernel Gateway

kernel_router.py  여기에 API 정의

kernel_manager.py  실제 로직 처리 (Redis + Gateway 통신)

