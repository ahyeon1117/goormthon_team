import asyncio
import websockets
import pytest
import logging

@pytest.mark.asyncio
async def test_ws():
    uri = "ws://localhost:8001/ws/test/c4f6f10e-f0d3-42ac-ae34-dbe9aa575813"
    async with websockets.connect(uri) as websocket:
        await websocket.send("안녕하세요 FastAPI!")
        response = await websocket.recv()
        print(f"서버 응답: {response}")
        await asyncio.sleep(10)  # 연결을 좀 더 오래 유지
    # try:
    #     async with websockets.connect(uri) as websocket:
    #         logging.info("💬 WebSocket 연결됨")
    #         await websocket.send("안녕하세요 FastAPI!")
    #         logging.info("📩 메시지 전송 완료")
    #         response = await websocket.recv()
    #         logging.info(f"📤 서버 응답: {response}")
    # except websockets.exceptions.WebSocketException as e:
    #     logging.error(f"WebSocket 예외 발생: {e}")
    # except Exception as e:
    #     logging.error(f"일반 예외 발생: {e}")
    #     await asyncio.sleep(3)  # 연결을 좀 더 오래 유지

asyncio.run(test_ws())