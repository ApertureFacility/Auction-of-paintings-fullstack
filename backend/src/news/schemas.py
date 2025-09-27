from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, Union
from datetime import datetime

class NewsBase(BaseModel):
    """Схема новости на 2 текста ,2 картинки"""
    big_title: str
    big_text: str
    image1_url: Optional[Union[str, None]] = None 
    small_title: Optional[str] = None
    small_text: Optional[str] = None
    image2_url: Optional[Union[str, None]] = None 
    published_at: Optional[datetime] = None

    @field_validator('image1_url', 'image2_url')
    def convert_url_to_str(cls, v):
        if v is None:
            return None
        return str(v) 
    
class NewsCreate(NewsBase):
    pass  


class NewsUpdate(BaseModel):
    big_title: Optional[str] = None
    big_text: Optional[str] = None
    image1_url: Optional[Union[str, None]] = None
    small_title: Optional[str] = None
    small_text: Optional[str] = None
    image2_url: Optional[Union[str, None]] = None
    published_at: Optional[datetime] = None



class NewsOut(NewsBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class NewsRead(NewsOut):
    pass
