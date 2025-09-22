from __future__ import annotations  
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer
from src.models import Bid, Lot, Purchase
from src.core.db import Base


class User(Base, SQLAlchemyBaseUserTable[int]):
    """
    Модель пользователя.

    Наследуется от:
    - Base: базовый класс SQLAlchemy.
    - SQLAlchemyBaseUserTable: таблица FastAPI Users с поддержкой аутентификации.
    """

    __tablename__ = "users"

    # Уникальный ID пользователя
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Отображаемое имя
    username: Mapped[str] = mapped_column(String, nullable=False)

    # Роль (по умолчанию "buyer")
    role: Mapped[str] = mapped_column(String, default="buyer")

    # Все покупки пользователя
    purchases: Mapped[list["Purchase"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # Избранные лоты (many-to-many)
    favorite_lots: Mapped[list["Lot"]] = relationship(
        secondary="user_favorite_lots",
        back_populates="favorited_by"
    )
    
    # Лоты, выставленные пользователем
    lots: Mapped[list["Lot"]] = relationship(
        back_populates="owner",
        foreign_keys="Lot.owner_id"
    )

    # Сделанные ставки
    bids: Mapped[list["Bid"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )
