from sqlalchemy import text  # добавь импорт
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_db

router = APIRouter()

@router.get("/ping-db")
async def ping_db(session: AsyncSession = Depends(get_db)):
    result = await session.execute(text("SELECT 1"))  # оберни в text()
    return {"db_status": result.scalar()}
