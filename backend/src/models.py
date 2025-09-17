from sqlalchemy import (
    String,
    Integer,
    ForeignKey,
    DateTime,
    Float,
    Table,
    Column
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timedelta
from src.core.db import Base


user_favorite_lots = Table(
    "user_favorite_lots",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("lot_id", ForeignKey("lots.id", ondelete="CASCADE"), primary_key=True),
)


class Bid(Base):
    __tablename__ = "bids"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lot_id: Mapped[int] = mapped_column(ForeignKey("lots.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lot: Mapped["Lot"] = relationship(back_populates="bids")
    user: Mapped["User"] = relationship(back_populates="bids")


class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    current_price: Mapped[float] = mapped_column(Float, nullable=True)
    start_price: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=True)

    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=True,
        default=lambda: datetime.utcnow() + timedelta(hours=1)
    )
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=True,
        default=lambda: datetime.utcnow() + timedelta(days=1)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        default=datetime.utcnow
    )

    is_forced_started: Mapped[bool] = mapped_column(default=False)  

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    lot_materials: Mapped[str] = mapped_column(String, nullable=True)
    auction_name: Mapped[str] = mapped_column(String, nullable=True)
    author: Mapped[str] = mapped_column(String, nullable=True)

    favorited_by: Mapped[list["User"]] = relationship(
        secondary=user_favorite_lots,
        back_populates="favorite_lots",
        lazy="selectin"
    )

    purchase: Mapped["Purchase"] = relationship(
        back_populates="lot",
        uselist=False,
        lazy="selectin"
    )

    owner = relationship(
        "User",
        back_populates="lots",
        foreign_keys=[owner_id],
        lazy="selectin"
    )

    bids: Mapped[list["Bid"]] = relationship(
        back_populates="lot",
        cascade="all, delete-orphan",
        lazy="selectin"
    ) 


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    lot_id: Mapped[int] = mapped_column(ForeignKey("lots.id", ondelete="CASCADE"))
    purchased_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="purchases")
    lot: Mapped["Lot"] = relationship(back_populates="purchase")
