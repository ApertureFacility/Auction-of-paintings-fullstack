import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from src.main import app
from src.models import Lot

@pytest.fixture
def test_user():
    from src.auth.models import User
    return User(id=1, username="testuser", email="test@example.com", hashed_password="fakehash")

@pytest.fixture
def test_lot(test_user):
    return Lot(
        id=1,
        title="Test Lot",
        description="Test lot description",
        current_price=10.0,
        start_price=10.0,
        owner_id=test_user.id,
        is_forced_started=True
    )

def test_websocket_connect(test_lot, test_user):
    """Тест на открытие WebSocket с моками и правильным закрытием"""

    # Мокаем функции, чтобы не обращаться к реальной базе
    with patch("src.auction.websocket.get_lot_by_id", new_callable=AsyncMock) as mock_get_lot, \
         patch("src.auction.websocket.get_bid_history", new_callable=AsyncMock) as mock_get_history, \
         patch("src.auction.utils.get_user_by_id", new_callable=AsyncMock) as mock_get_user:

        mock_get_lot.return_value = test_lot
        mock_get_history.return_value = []
        mock_get_user.return_value = test_user

        from src.auction.manager import manager
        manager.active_connections = {} 

        with TestClient(app) as client:
            with client.websocket_connect(f"/ws/lots/{test_lot.id}") as ws:
                # Первое сообщение: USERS_COUNT
                msg1 = ws.receive_json()
                assert msg1["type"] == "USERS_COUNT"
                assert msg1["count"] == 1

                # Второе сообщение: LOT_STATUS
                msg2 = ws.receive_json()
                assert msg2["type"] == "LOT_STATUS"
                assert msg2["lot_id"] == test_lot.id

                # Третье сообщение: BID_HISTORY
                msg3 = ws.receive_json()
                assert msg3["type"] == "BID_HISTORY"
                assert msg3["lot_id"] == test_lot.id
                assert msg3["bids"] == []

                # Проверяем активные соединения
                assert test_lot.id in manager.active_connections
                assert len(manager.active_connections[test_lot.id]) == 1


                ws.close()


                manager.disconnect(test_lot.id, list(manager.active_connections.get(test_lot.id, []))[0] if manager.active_connections.get(test_lot.id) else None)

                assert test_lot.id not in manager.active_connections
