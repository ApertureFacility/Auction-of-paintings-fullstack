from datetime import datetime
from pydantic import BaseModel, HttpUrl
from typing import Optional

class NewsBase(BaseModel):
    big_title: str
    big_text: str
    image1_url: Optional[HttpUrl] = None
    small_title: Optional[str] = None
    small_text: Optional[str] = None
    image2_url: Optional[HttpUrl] = None
    published_at: Optional[datetime] = None

class NewsCreate(NewsBase):
    pass  

class NewsUpdate(NewsBase):
    pass  

class NewsOut(NewsBase):
    id: int

    class Config:
        from_attributes = True  # для Pydantic v2

class NewsRead(NewsOut):
    pass
