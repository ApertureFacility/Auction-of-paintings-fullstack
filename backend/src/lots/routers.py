import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import String, cast, func, or_, select

from src.auction.manager import manager


from .schemas import LotCreate, LotListResponse, LotRead
from src.models import Lot
from src.core.db import get_db

router = APIRouter(prefix="/lots", tags=["Lots"])



@router.post("/", response_model=LotRead)
async def create_lot(lot: LotCreate, db: AsyncSession = Depends(get_db)):
    data = lot.dict()


    if data.get("start_time") and data["start_time"].tzinfo is not None:
        data["start_time"] = data["start_time"].replace(tzinfo=None)

    new_lot = Lot(**data)
    db.add(new_lot)
    await db.commit()
    await db.refresh(new_lot)
    return new_lot



@router.get("/search", response_model=LotListResponse)
async def search_lots(
    q: str = Query(..., description="Поиск по ID, названию или автору"),
    limit: int = Query(6, ge=1),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Lot)
        .where(
            or_(
                cast(Lot.id, String).ilike(f"%{q}%"),
                Lot.title.ilike(f"%{q}%"),
                Lot.author.ilike(f"%{q}%")
            )
        )
        .order_by(Lot.id.asc())
        .limit(limit)
        .offset(offset)
    )

    result = await session.execute(stmt)
    lots = result.scalars().all()

    total_stmt = (
        select(func.count())
        .select_from(
            select(Lot)
            .where(
                or_(
                    cast(Lot.id, String).ilike(f"%{q}%"),
                    Lot.title.ilike(f"%{q}%"),
                    Lot.author.ilike(f"%{q}%")
                )
            )
            .subquery()
        )
    )
    total_result = await session.execute(total_stmt)
    total = total_result.scalar() or 0

    return LotListResponse(
        items=[LotRead.model_validate(lot) for lot in lots],
        total=total
    )



@router.get("/", response_model=LotListResponse)
async def read_lots(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(6, ge=1),
    offset: int = Query(0, ge=0)
):
    result = await db.execute(select(Lot).limit(limit).offset(offset))
    lots = result.scalars().all()

    total_result = await db.execute(select(func.count()).select_from(Lot))
    total = total_result.scalar()

    return {"items": lots, "total": total}


@router.get("/{lot_id}", response_model=LotRead)
async def read_lot(lot_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lot).where(Lot.id == lot_id))
    lot = result.scalar_one_or_none()
    
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    
    return lot

@router.post("/{lot_id}/start", response_model=LotRead)
async def force_start_lot(lot_id: int, db: AsyncSession = Depends(get_db)):
    lot = await db.get(Lot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")

    lot.is_forced_started = True
    if not lot.start_time or lot.start_time > datetime.utcnow():
        lot.start_time = datetime.utcnow()

    await db.commit()
    await db.refresh(lot)

    asyncio.create_task(manager.broadcast_status(lot.id, True))  # <--- вот здесь

    return lot

@router.post("/{lot_id}/finish", response_model=LotRead)
async def force_finish_lot(lot_id: int, db: AsyncSession = Depends(get_db)):
    lot = await db.get(Lot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")

    lot.is_forced_started = False
    lot.end_time = datetime.utcnow()

    await db.commit()
    await db.refresh(lot)

    asyncio.create_task(manager.broadcast_status(lot.id, False))  # <--- уведомляем фронт

    return lot