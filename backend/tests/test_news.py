import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from datetime import datetime
from src.main import app


@pytest.fixture
def example_news():
    return {
        "big_title": "Big Title",
        "big_text": "Big Text",
        "image1_url": "http://image1.jpg",
        "small_title": "Small Title",
        "small_text": "Small Text",
        "image2_url": "http://image2.jpg",
        "published_at": datetime.utcnow().isoformat()
    }

def test_create_news(example_news):
    with patch("src.news.routes.get_db", new_callable=AsyncMock) as mock_db:
        mock_session = AsyncMock()
        mock_db.return_value = mock_session

        client = TestClient(app)
        response = client.post("/news/", json=example_news)

        assert response.status_code == 201
        data = response.json()
        assert data["big_title"] == example_news["big_title"]
        assert data["big_text"] == example_news["big_text"]

def test_get_latest_news(example_news):
    with patch("src.news.routes.get_db", new_callable=AsyncMock) as mock_db:
        mock_session = AsyncMock()
        mock_db.return_value = mock_session

        client = TestClient(app)
        response = client.get("/news/latest")

        if response.status_code == 404:
            assert response.json()["detail"] == "No news found"
        else:
            data = response.json()
            assert "big_title" in data

def test_read_all_news():
    client = TestClient(app)
    response = client.get("/news/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_news(example_news):
    update_data = {"big_title": "Updated Title"}
    client = TestClient(app)
    news_id = 1
    response = client.put(f"/news/{news_id}", json=update_data)
    if response.status_code != 404:
        data = response.json()
        assert data["big_title"] == update_data["big_title"]

def test_delete_news():
    client = TestClient(app)
    news_id = 1
    response = client.delete(f"/news/{news_id}")
    assert response.status_code in (204, 404)
