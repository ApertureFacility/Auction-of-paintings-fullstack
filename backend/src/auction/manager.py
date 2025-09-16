from fastapi import WebSocket
from typing import Dict, List


class AuctionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, lot_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(lot_id, []).append(websocket)
        await self.broadcast_users_count(lot_id)

    def disconnect(self, lot_id: int, websocket: WebSocket):
        if lot_id in self.active_connections:
            self.active_connections[lot_id].remove(websocket)
            if not self.active_connections[lot_id]:
                del self.active_connections[lot_id]
            else:
                import asyncio
                asyncio.create_task(self.broadcast_users_count(lot_id))

    async def broadcast(self, lot_id: int, message: dict):
        if lot_id in self.active_connections:
            for connection in self.active_connections[lot_id]:
                await connection.send_json(message)

    async def broadcast_users_count(self, lot_id: int):
        if lot_id in self.active_connections:
            count = len(self.active_connections[lot_id])
            message = {"type": "USERS_COUNT", "count": count}
            await self.broadcast(lot_id, message)

    async def broadcast_status(self, lot_id: int, is_active: bool):
        """Сообщаем клиентам, открыт или закрыт аукцион"""
        message = {
            "type": "AUCTION_STATUS",
            "lot_id": lot_id,
            "is_active": is_active
        }
        await self.broadcast(lot_id, message)

manager = AuctionManager()
