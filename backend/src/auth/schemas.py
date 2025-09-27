from fastapi_users import schemas
from typing import List
from pydantic import BaseModel

class UserReadBase(schemas.BaseUser[int]):
    """Базовая схема пользователя без ленивых связей"""
    username: str

class UserRead(UserReadBase):
    """Схема для чтения пользователя с любимыми лотами"""
    favorite_lots: List[int] = []

class UserReadWithoutFavorites(UserReadBase):
    """Схема для регистрации и базовых эндпоинтов (без favorite_lots)"""
    pass

class UserCreate(schemas.BaseUserCreate):
    username: str

class UserUpdate(schemas.BaseUserUpdate):
    username: str
