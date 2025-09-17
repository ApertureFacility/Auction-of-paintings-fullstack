from fastapi import WebSocket, WebSocketDisconnect
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
            if websocket in self.active_connections[lot_id]:
                self.active_connections[lot_id].remove(websocket)
            if not self.active_connections[lot_id]:
                del self.active_connections[lot_id]
            else:
                import asyncio
                asyncio.create_task(self.broadcast_users_count(lot_id))

    async def broadcast(self, lot_id: int, message: dict):
        """Отправка сообщения всем подключенным клиентам, с удалением отключенных"""
        if lot_id in self.active_connections:
            to_remove = []
            for connection in self.active_connections[lot_id]:
                try:
                    await connection.send_json(message)
                except (RuntimeError, WebSocketDisconnect):
  
                    to_remove.append(connection)

            for conn in to_remove:
                self.active_connections[lot_id].remove(conn)

            if not self.active_connections[lot_id]:
                del self.active_connections[lot_id]

    async def broadcast_users_count(self, lot_id: int):
        """Отправка текущего числа подключенных пользователей"""
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
