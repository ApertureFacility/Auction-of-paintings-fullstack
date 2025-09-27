import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from src.favorites.router import add_lot_to_favorites, remove_lot_from_favorites, get_favorite_lots

class FakeLot:
    def __init__(self, id):
        self.id = id

class FakeUser:
    def __init__(self, id):
        self.id = id
        self.favorite_lots = []


@pytest.mark.asyncio
async def test_add_lot_to_favorites():
    user = FakeUser(id=1)
    lot = FakeLot(id=1)

    mock_result_user = MagicMock()
    mock_result_user.scalar_one.return_value = user

    mock_result_lot = MagicMock()
    mock_result_lot.scalar_one_or_none.return_value = lot

    db = AsyncMock()
    db.execute.side_effect = [mock_result_user, mock_result_lot]

    response = await add_lot_to_favorites(lot_id=lot.id, db=db, user=user)

    assert response["detail"] == "Lot added to favorites"
    assert lot in user.favorite_lots

@pytest.mark.asyncio
async def test_add_lot_already_in_favorites():
    user = FakeUser(id=1)
    lot = FakeLot(id=1)
    user.favorite_lots.append(lot)

    mock_result_user = MagicMock()
    mock_result_user.scalar_one.return_value = user

    mock_result_lot = MagicMock()
    mock_result_lot.scalar_one_or_none.return_value = lot

    db = AsyncMock()
    db.execute.side_effect = [mock_result_user, mock_result_lot]

    with pytest.raises(HTTPException) as exc:
        await add_lot_to_favorites(lot_id=lot.id, db=db, user=user)

    assert exc.value.status_code == 400
    assert exc.value.detail == "Lot already in favorites"

@pytest.mark.asyncio
async def test_add_nonexistent_lot_to_favorites():
    user = FakeUser(id=1)

    mock_result_user = MagicMock()
    mock_result_user.scalar_one.return_value = user

    mock_result_lot = MagicMock()
    mock_result_lot.scalar_one_or_none.return_value = None

    db = AsyncMock()
    db.execute.side_effect = [mock_result_user, mock_result_lot]

    with pytest.raises(HTTPException) as exc:
        await add_lot_to_favorites(lot_id=999, db=db, user=user)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Lot not found"


@pytest.mark.asyncio
async def test_remove_nonexistent_lot_from_favorites():
    user = FakeUser(id=1)

    mock_result_user = MagicMock()
    mock_result_user.scalar_one.return_value = user

    db = AsyncMock()
    db.execute.return_value = mock_result_user

    with pytest.raises(HTTPException) as exc:
        await remove_lot_from_favorites(lot_id=999, db=db, user=user)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Lot not in favorites"

@pytest.mark.asyncio
async def test_get_favorite_lots():
    user = FakeUser(id=1)
    lot1 = FakeLot(id=1)
    lot2 = FakeLot(id=2)
    user.favorite_lots.extend([lot1, lot2])

    mock_result_user = MagicMock()
    mock_result_user.scalar_one.return_value = user

    db = AsyncMock()
    db.execute.return_value = mock_result_user

    favorites = await get_favorite_lots(db=db, user=user)

    assert favorites == [lot1, lot2]
