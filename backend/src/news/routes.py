from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.core.db import get_db
from src.news.models import News
from .schemas import NewsCreate, NewsRead

router = APIRouter(prefix="/news", tags=["News"])

@router.post("/", response_model=NewsRead)
async def create_news(news: NewsCreate, db: AsyncSession = Depends(get_db)):
    new_news = News(**news.dict())
    db.add(new_news)
    await db.commit()
    await db.refresh(new_news)
    return new_news

@router.get("/{news_id}", response_model=NewsRead)
async def read_news(news_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(News).where(News.id == news_id))
    news_item = result.scalar_one_or_none()
    if not news_item:
        raise HTTPException(status_code=404, detail="News not found")
    return news_item

@router.get("/", response_model=list[NewsRead])
async def read_all_news(db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 10):
    result = await db.execute(select(News).offset(skip).limit(limit))
    return result.scalars().all()
