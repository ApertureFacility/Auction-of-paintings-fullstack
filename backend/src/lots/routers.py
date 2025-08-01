from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import LotCreate, LotListResponse, LotRead
from src.models import Lot
from src.core.db import get_db
from sqlalchemy import func, select

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