import pytest
from datetime import datetime

@pytest.mark.asyncio
async def test_create_news(async_client):
    response = await async_client.post(
        "/news/",
        json={
            "big_title": "Big Title",
            "big_text": "Some text",
            "image1_url": None,
            "small_title": "Small Title",
            "small_text": "Small text",
            "image2_url": None,
            "published_at": str(datetime.now())
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["big_title"] == "Big Title"
    assert "id" in data
    global NEWS_ID
    NEWS_ID = data["id"]

@pytest.mark.asyncio
async def test_read_news(async_client):
    response = await async_client.get(f"/news/{NEWS_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == NEWS_ID
    assert data["big_title"] == "Big Title"

@pytest.mark.asyncio
async def test_read_all_news(async_client):
    response = await async_client.get("/news/?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

@pytest.mark.asyncio
async def test_update_news(async_client):
    response = await async_client.put(
        f"/news/{NEWS_ID}",
        json={"big_title": "Updated Title"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["big_title"] == "Updated Title"

@pytest.mark.asyncio
async def test_delete_news(async_client):
    response = await async_client.delete(f"/news/{NEWS_ID}")
    assert response.status_code == 204

 
    response = await async_client.get(f"/news/{NEWS_ID}")
    assert response.status_code == 404
