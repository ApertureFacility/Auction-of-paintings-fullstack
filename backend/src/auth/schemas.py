from fastapi_users import schemas
from typing import List
from src.lots.schemas import LotRead 

class UserRead(schemas.BaseUser[int]):
    username: str
    favorite_lots: List[int] = [] 
    
class UserCreate(schemas.BaseUserCreate):
    username: str

class UserUpdate(schemas.BaseUserUpdate):
    username: str
