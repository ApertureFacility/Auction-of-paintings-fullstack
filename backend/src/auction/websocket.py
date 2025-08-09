from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from .manager import manager
from .utils import get_user_by_id

websocket_router = APIRouter()

@websocket_router.websocket("/ws/lots/{lot_id}")
async def websocket_endpoint(websocket: WebSocket, lot_id: int):
    await manager.connect(lot_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            user_id = data.get("user_id")
            amount = data.get("amount")

            if user_id is None or amount is None:
                await websocket.send_json({"error": "user_id and amount are required"})
                continue

            user = await get_user_by_id(user_id)
            if not user:
                await websocket.send_json({"error": f"User {user_id} not found"})
                continue

            bid_data = {
                "type": "NEW_BID",
                "bid": {
                    "id": f"{user_id}-{datetime.now().timestamp()}",
                    "user_id": user_id,
                    "bidder_name": user.username,
                    "amount": float(amount),
                    "lot_id": lot_id,
                    "created_at": datetime.now().isoformat()
                }
            }

            await manager.broadcast(lot_id, bid_data)

    except WebSocketDisconnect:
        manager.disconnect(lot_id, websocket)
