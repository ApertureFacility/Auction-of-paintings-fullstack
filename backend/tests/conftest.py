import sys
import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.main import app
from src.core.db import Base
import src.core.db as db
from src.models import Lot

# Windows fix для event loop
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Тестовая база SQLite in-memory
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine_test = create_async_engine(TEST_DATABASE_URL, future=True, echo=False)
TestingSessionLocal = sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup_test_db():
    """Пересоздаём базу перед каждым тестом"""
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


    db.async_session_maker = TestingSessionLocal
    yield


@pytest_asyncio.fixture(scope="function")
async def async_client():
    transport = ASGITransport(app=app, raise_app_exceptions=True)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client


@pytest.fixture(scope="function")
def ws_client():
    return TestClient(app)


@pytest_asyncio.fixture
async def test_user():
    from src.auth.models import User
    async with TestingSessionLocal() as session:
        user = User(username="testuser", email="test@example.com", hashed_password="fakehash")
        session.add(user)
        await session.commit()
        await session.refresh(user)
        yield user


@pytest_asyncio.fixture
async def test_lot(test_user):
    """Создаём тестовый лот"""
    async with TestingSessionLocal() as session:
        lot = Lot(
            title="Test Lot",
            description="Test lot description",
            current_price=10.0,
            start_price=10.0,
            owner_id=test_user.id,
        )
        session.add(lot)
        await session.commit()
        await session.refresh(lot)
        yield lot
