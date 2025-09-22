from fastapi_users import schemas
from typing import List



class UserRead(schemas.BaseUser[int]):
    """ Схема для чтения данных пользователя (ответ API)."""
    username: str
    favorite_lots: List[int] = [] 

class UserCreate(schemas.BaseUserCreate):
    """ Схема для создания нового пользователя (запрос API). """
    username: str

class UserUpdate(schemas.BaseUserUpdate):
    """ Схема для обновления данных пользователя (запрос API). """
    username: str
