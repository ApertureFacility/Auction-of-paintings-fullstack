from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .manager import manager
from .utils import get_user_by_id
from src.models import Lot, Purchase, Bid
from src.core.db import async_session_maker

websocket_router = APIRouter()

async def get_lot_by_id(lot_id: int) -> Lot | None:
    async with async_session_maker() as session:
        result = await session.execute(select(Lot).where(Lot.id == lot_id))
        return result.scalar_one_or_none()

async def close_lot(lot_id: int):
    async with async_session_maker() as session:
        lot = await session.get(Lot, lot_id)
        if not lot:
            return None, None

        result = await session.execute(
            select(Bid).where(Bid.lot_id == lot_id).order_by(Bid.created_at.desc())
        )
        last_bid = result.scalars().first()
        winner_id = last_bid.user_id if last_bid else None

        lot.is_forced_started = False  
        await session.commit()
        await session.refresh(lot)

        if winner_id:
            purchase = Purchase(user_id=winner_id, lot_id=lot.id)
            session.add(purchase)
            await session.commit()

        return lot, winner_id

async def get_bid_history(lot_id: int):
    async with async_session_maker() as session:
        result = await session.execute(
            select(Bid)
            .where(Bid.lot_id == lot_id)
            .options(selectinload(Bid.user))
            .order_by(Bid.created_at.desc())
            .limit(20)
        )
        bids = result.scalars().all()

    return [
        {
            "id": b.id,
            "user_id": b.user_id,
            "bidder_name": b.user.username if b.user else "Unknown",
            "amount": b.amount,
            "lot_id": b.lot_id,
            "created_at": b.created_at.isoformat()
        }
        for b in bids
    ]

@websocket_router.websocket("/ws/lots/{lot_id}")
async def websocket_endpoint(websocket: WebSocket, lot_id: int):
    await manager.connect(lot_id, websocket)
    lot = await get_lot_by_id(lot_id)
    if not lot:
        await websocket.send_json({"type": "ERROR", "message": f"Lot {lot_id} not found"})
        await websocket.close()
        return


    def is_auction_active(lot: Lot):
        if lot.is_forced_started:
            return True  
        now = datetime.utcnow()
        return lot.start_time <= now and (not lot.end_time or now < lot.end_time)

    await websocket.send_json({
        "type": "LOT_STATUS",
        "lot_id": lot.id,
        "is_active": is_auction_active(lot),
        "start_time": lot.start_time.isoformat() if lot.start_time else None,
        "end_time": lot.end_time.isoformat() if lot.end_time else None,
        "current_price": lot.current_price,
        "owner_id": lot.owner_id
    })

    history = await get_bid_history(lot_id)
    await websocket.send_json({
        "type": "BID_HISTORY",
        "lot_id": lot.id,
        "bids": history
    })

    await manager.broadcast_users_count(lot_id)

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

                if not is_auction_active(lot):
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

                    bid = Bid(
                        lot_id=lot_id,
                        user_id=user_id,
                        amount=float(amount),
                    )
                    session.add(bid)
                    await session.commit()
                    await session.refresh(bid)

                bid_data = {
                    "type": "NEW_BID",
                    "bid": {
                        "id": bid.id,
                        "user_id": user_id,
                        "bidder_name": user.username,
                        "amount": float(amount),
                        "lot_id": lot_id,
                        "created_at": bid.created_at.isoformat()
                    }
                }
                await manager.broadcast(lot_id, bid_data)

            elif msg_type == "GET_HISTORY":
                history = await get_bid_history(lot_id)
                await websocket.send_json({
                    "type": "BID_HISTORY",
                    "lot_id": lot.id,
                    "bids": history
                })

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
        await manager.broadcast_users_count(lot_id)
