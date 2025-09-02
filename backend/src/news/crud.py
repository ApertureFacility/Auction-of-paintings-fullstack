from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas
from sqlalchemy import desc


async def create_news(db: AsyncSession, news: schemas.NewsCreate):
    db_news = models.News(**news.dict())
    db.add(db_news)
    await db.commit()
    await db.refresh(db_news)
    return db_news


async def get_news(db: AsyncSession, news_id: int):
    result = await db.execute(select(models.News).filter(models.News.id == news_id))
    return result.scalar_one_or_none()


async def get_all_news(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.News).offset(skip).limit(limit))
    return result.scalars().all()


async def update_news(db: AsyncSession, news_id: int, news: schemas.NewsUpdate):
    db_news = await get_news(db, news_id)
    if not db_news:
        return None
    for key, value in news.dict(exclude_unset=True).items():
        setattr(db_news, key, value)
    await db.commit()
    await db.refresh(db_news)
    return db_news


async def delete_news(db: AsyncSession, news_id: int):
    db_news = await get_news(db, news_id)
    if not db_news:
        return None
    await db.delete(db_news)
    await db.commit()
    return db_news


async def get_latest_news(db: AsyncSession):
    result = await db.execute(
        select(models.News).order_by(desc(models.News.published_at)).limit(1)
    )
    return result.scalar_one_or_none()
