
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class LotBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_price: float
    current_price: Optional[float] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None  
    is_forced_started: Optional[bool] = False  
    owner_id: Optional[int] = None
    lot_materials: Optional[str] = None
    auction_name: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None




class LotCreate(LotBase):
    pass


class UserRef(BaseModel):
    id: int
    username: str

class PurchaseRef(BaseModel):
    id: int

    model_config = ConfigDict(from_attributes=True)


class LotRead(LotBase):
    id: int
    created_at: datetime
    purchase: Optional[PurchaseRef] = None

    model_config = ConfigDict(from_attributes=True)


class LotListResponse(BaseModel):
    items: List[LotRead]
    total: int

class BidRead(BaseModel):
    id: int
    lot_id: int
    user_id: int
    amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
