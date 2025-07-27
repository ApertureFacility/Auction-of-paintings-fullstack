from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import LotCreate, LotRead
from src.models import Lot
from src.core.db import get_db
from sqlalchemy import select

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

@router.get("/", response_model=list[LotRead])
async def read_lots(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lot))
    return result.scalars().all()

@router.get("/{lot_id}", response_model=LotRead)
async def read_lot(lot_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lot).where(Lot.id == lot_id))
    lot = result.scalar_one_or_none()
    
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    
    return lot