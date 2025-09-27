import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime
from fastapi import HTTPException

from src.lots.routers import (
    create_lot, force_start_lot, force_finish_lot
)
from src.lots.schemas import LotCreate


class FakeLot:
    def __init__(self, id, title="Lot", start_price=100, current_price=100, owner_id=1):
        self.id = id
        self.title = title
        self.start_price = start_price
        self.current_price = current_price
        self.owner_id = owner_id
        self.is_forced_started = False
        self.start_time = None
        self.end_time = None
        self.created_at = datetime.utcnow()

    async def refresh(self):
        pass


@pytest.mark.asyncio
async def test_create_lot():
    lot_data = LotCreate(title="Test Lot", start_price=100)
    db = AsyncMock()
    db.add = MagicMock()      
    db.commit = AsyncMock()
    db.refresh = AsyncMock()

    result = await create_lot(lot=lot_data, db=db)

    db.add.assert_called_once()
    db.commit.assert_awaited()
    db.refresh.assert_awaited()
    assert result.title == "Test Lot"
    assert result.start_price == 100


@pytest.mark.asyncio
async def test_force_start_lot():
    lot = FakeLot(id=1)
    db = AsyncMock()
    db.get = AsyncMock(return_value=lot)
    db.commit = AsyncMock()
    db.refresh = AsyncMock()

    result = await force_start_lot(lot_id=1, db=db)
    assert lot.is_forced_started is True
    assert lot.start_time is not None
    db.commit.assert_awaited()
    db.refresh.assert_awaited()

@pytest.mark.asyncio
async def test_force_start_lot_not_found():
    db = AsyncMock()
    db.get = AsyncMock(return_value=None)

    with pytest.raises(HTTPException) as exc:
        await force_start_lot(lot_id=1, db=db)
    assert exc.value.status_code == 404


@pytest.mark.asyncio
async def test_force_finish_lot():
    lot = FakeLot(id=1)
    db = AsyncMock()
    db.get = AsyncMock(return_value=lot)
    db.commit = AsyncMock()
    db.refresh = AsyncMock()

    result = await force_finish_lot(lot_id=1, db=db)
    assert lot.is_forced_started is False
    assert lot.end_time is not None
    db.commit.assert_awaited()
    db.refresh.assert_awaited()

@pytest.mark.asyncio
async def test_force_finish_lot_not_found():
    db = AsyncMock()
    db.get = AsyncMock(return_value=None)

    with pytest.raises(HTTPException) as exc:
        await force_finish_lot(lot_id=1, db=db)
    assert exc.value.status_code == 404
