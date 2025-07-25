from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer
from src.core.db import Base

class User(Base, SQLAlchemyBaseUserTable[int]):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, default="buyer")

    purchases: Mapped[list["Purchase"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    favorite_lots: Mapped[list["Lot"]] = relationship(
        secondary="user_favorite_lots",
        back_populates="favorited_by"
    )
    
    # Добавляем это отношение
    lots: Mapped[list["Lot"]] = relationship(
        back_populates="owner",
        foreign_keys="Lot.owner_id"
    )
from src.models import Purchase, Lot
