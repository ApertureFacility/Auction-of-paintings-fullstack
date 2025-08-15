from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from src.core.db import Base 

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    big_title = Column(String(255), nullable=False)
    big_text = Column(Text, nullable=False)
    image1_url = Column(String(500), nullable=True)
    small_title = Column(String(255), nullable=True)
    small_text = Column(Text, nullable=True)
    image2_url = Column(String(500), nullable=True)
    published_at = Column(DateTime, default=datetime.now)
