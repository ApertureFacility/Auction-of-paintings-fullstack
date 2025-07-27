from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_db
from src.models import Lot
from .schemas import LotCreate, LotRead

router = APIRouter()



@router.post("/lots", response_model=LotRead)
async def create_lot(lot: LotCreate, db: AsyncSession = Depends(get_db)):
    data = lot.model_dump()


    if data.get("start_time") and data["start_time"].tzinfo is not None:
        data["start_time"] = data["start_time"].replace(tzinfo=None)


    if data.get("created_at") and data["created_at"].tzinfo is not None:
        data["created_at"] = data["created_at"].replace(tzinfo=None)

    new_lot = Lot(**data)
    db.add(new_lot)
    await db.commit()
    await db.refresh(new_lot)
    return new_lot
