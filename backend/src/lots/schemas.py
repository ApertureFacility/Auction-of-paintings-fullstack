
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class LotBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_price: float
    current_price: Optional[float] = None
    start_time: Optional[datetime] = None
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


class LotRead(LotBase):
    id: int
    created_at: datetime
    favorited_by: Optional[List[UserRef]] = None
    purchase: Optional[PurchaseRef] = None
    owner: Optional[UserRef] = None

    model_config = ConfigDict(from_attributes=True)
    
class LotListResponse(BaseModel):
    items: List[LotRead]
    total: int
