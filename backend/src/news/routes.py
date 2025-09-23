from sqlalchemy import desc, select
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_db
from src.news.models import News
from .schemas import NewsCreate, NewsRead, NewsUpdate

router = APIRouter(prefix="/news", tags=["News"])


@router.post("/", response_model=NewsRead, status_code=status.HTTP_201_CREATED)
async def create_news(news: NewsCreate, db: AsyncSession = Depends(get_db)):
    """
    Создать новую новость.
    - **return**: объект созданной новости
    """
    new_news = News(**news.model_dump())
    db.add(new_news)
    await db.commit()
    await db.refresh(new_news)
    return new_news


@router.get("/latest", response_model=NewsRead)
async def get_latest_news(db: AsyncSession = Depends(get_db)):
    """
    Получить последнюю опубликованную новость.

    - **return**: объект последней новости или 404, если новостей нет
    """
    result = await db.execute(
        select(News).order_by(desc(News.published_at)).limit(1)
    )
    latest_news = result.scalar_one_or_none()
    if not latest_news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No news found"
        )
    return latest_news


@router.get("/{news_id}", response_model=NewsRead)
async def read_news(news_id: int, db: AsyncSession = Depends(get_db)):
    """
    Получить новость по ID.
    - **return**: объект новости или 404, если не найдено
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news_item = result.scalar_one_or_none()
    if not news_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    return news_item


@router.get("/", response_model=list[NewsRead])
async def read_all_news(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = Query(default=10, le=100)
):
    """
    Получить список всех новостей с пагинацией.

    - **skip**: количество записей для пропуска
    - **limit**: количество возвращаемых записей (макс. 100)
    - **return**: список новостей
    """
    result = await db.execute(select(News).offset(skip).limit(limit))
    return result.scalars().all()


@router.put("/{news_id}", response_model=NewsRead)
async def update_news(
    news_id: int,
    news_data: NewsUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить новость по ID.

    - **news_id**: ID новости
    - **return**: обновлённый объект или 404, если не найдено
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news_item = result.scalar_one_or_none()
    
    if not news_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    update_data = news_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(news_item, field, value)
    
    await db.commit()
    await db.refresh(news_item)
    return news_item


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news(
    news_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Удалить новость по ID.
    - **return**: `204 No Content` если удалено, либо 404 если не найдено
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news_item = result.scalar_one_or_none()
    
    if not news_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    await db.delete(news_item)
    await db.commit()
    return None
