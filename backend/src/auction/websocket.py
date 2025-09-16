from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from sqlalchemy import select
from .manager import manager
from .utils import get_user_by_id
from src.models import Lot, Purchase
from src.core.db import async_session_maker

websocket_router = APIRouter()


async def get_lot_by_id(lot_id: int) -> Lot | None:
    async with async_session_maker() as session:
        result = await session.execute(select(Lot).where(Lot.id == lot_id))
        return result.scalar_one_or_none()


async def close_lot(lot_id: int):
    """Закрыть аукцион и зафиксировать победителя"""
    async with async_session_maker() as session:
        lot = await session.get(Lot, lot_id)
        if not lot:
            return None, None

        winner_id = lot.owner_id

        lot.end_time = datetime.utcnow()
        await session.commit()
        await session.refresh(lot)

        if winner_id:
            purchase = Purchase(user_id=winner_id, lot_id=lot.id)
            session.add(purchase)
            await session.commit()

        return lot, winner_id


@websocket_router.websocket("/ws/lots/{lot_id}")
async def websocket_endpoint(websocket: WebSocket, lot_id: int):
    await manager.connect(lot_id, websocket)
    lot = await get_lot_by_id(lot_id)
    if not lot:
        await websocket.send_json({"type": "ERROR", "message": f"Lot {lot_id} not found"})
        await websocket.close()
        return


    now = datetime.utcnow()
    await websocket.send_json({
        "type": "LOT_STATUS",
        "lot_id": lot.id,
        "is_active": (now >= lot.start_time and (not lot.end_time or now < lot.end_time)),
        "start_time": lot.start_time.isoformat(),
        "end_time": lot.end_time.isoformat() if lot.end_time else None,
        "current_price": lot.current_price,
        "owner_id": lot.owner_id
    })

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

  
            if msg_type == "NEW_BID":
                user_id = data.get("user_id")
                amount = data.get("amount")

                user = await get_user_by_id(user_id)
                if not user:
                    await websocket.send_json({"type": "ERROR", "message": f"User {user_id} not found"})
                    continue

                now = datetime.utcnow()

  
                if not lot.is_forced_started and now < lot.start_time:
                    await websocket.send_json({
                        "type": "AUCTION_NOT_STARTED",
                        "lot_id": lot.id,
                        "start_time": lot.start_time.isoformat()
                    })
                    continue

                if lot.end_time and now >= lot.end_time:
                    await websocket.send_json({
                        "type": "AUCTION_ENDED",
                        "lot_id": lot.id,
                        "winner_id": lot.owner_id
                    })
                    continue

                async with async_session_maker() as session:
                    db_lot = await session.get(Lot, lot_id)
                    db_lot.current_price = float(amount)
                    db_lot.owner_id = user_id
                    await session.commit()

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


            elif msg_type == "CLOSE_AUCTION":
                closed_lot, winner_id = await close_lot(lot_id)
                await manager.broadcast(lot_id, {
                    "type": "AUCTION_ENDED",
                    "lot_id": lot_id,
                    "winner_id": winner_id
                })

            else:
                await websocket.send_json({"type": "ERROR", "message": f"Unknown message type: {msg_type}"})

    except WebSocketDisconnect:
        manager.disconnect(lot_id, websocket)
