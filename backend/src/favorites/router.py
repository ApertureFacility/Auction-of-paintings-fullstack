from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.lots.schemas import LotRead
from src.auth.dependencies import current_active_user
from src.auth.models import User
from src.models import Lot
from src.core.db import get_db
from typing import List
from sqlalchemy.orm import selectinload



router = APIRouter(prefix="/favorites", tags=["Favorites"])
"""Маршруты для работы с избранными лотами пользователя."""


@router.post("/add/{lot_id}")
async def add_lot_to_favorites(
    lot_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Добавить лот в избранное.

    Args:
        lot_id (int): ID лота для добавления.
        db (AsyncSession): Сессия базы данных.
        user (User): Текущий пользователь.

    Raises:
        HTTPException: Если лот не найден или уже добавлен.

    Returns:
        dict: Сообщение об успешном добавлении.
    """
    result = await db.execute(
        select(User).options(selectinload(User.favorite_lots)).where(User.id == user.id)
    )
    user = result.scalar_one()

    result = await db.execute(select(Lot).where(Lot.id == lot_id))
    lot = result.scalar_one_or_none()

    if lot is None:
        raise HTTPException(status_code=404, detail="Lot not found")

    if lot in user.favorite_lots:
        raise HTTPException(status_code=400, detail="Lot already in favorites")

    user.favorite_lots.append(lot)
    await db.commit()
    return {"detail": "Lot added to favorites"}


@router.delete("/remove/{lot_id}")
async def remove_lot_from_favorites(
    lot_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Удалить лот из избранного.

    Args:
        lot_id (int): ID лота для удаления.
        db (AsyncSession): Сессия базы данных.
        user (User): Текущий пользователь.

    Raises:
        HTTPException: Если лота нет в избранных.

    Returns:
        dict: Сообщение об успешном удалении.
    """
    result = await db.execute(
        select(User).options(selectinload(User.favorite_lots)).where(User.id == user.id)
    )
    user = result.scalar_one()

    lot = next((lot for lot in user.favorite_lots if lot.id == lot_id), None)

    if lot is None:
        raise HTTPException(status_code=404, detail="Lot not in favorites")

    user.favorite_lots.remove(lot)
    await db.commit()
    return {"detail": "Lot removed from favorites"}


@router.get("/", response_model=List[LotRead])
async def get_favorite_lots(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Получить список избранных лотов текущего пользователя.

    Args:
        db (AsyncSession): Сессия базы данных.
        user (User): Текущий пользователь.

    Returns:
        List[LotRead]: Список избранных лотов.
    """
    result = await db.execute(
        select(User).options(selectinload(User.favorite_lots)).where(User.id == user.id)
    )
    user = result.scalar_one()

    return user.favorite_lots
