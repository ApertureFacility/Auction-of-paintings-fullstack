
import sys
import asyncio

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import pytest_asyncio
from httpx import AsyncClient
from httpx import ASGITransport
from src.main import app  

@pytest_asyncio.fixture(scope="function")
async def async_client():
    transport = ASGITransport(app=app, raise_app_exceptions=True)
    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
    ) as client:
        yield client
