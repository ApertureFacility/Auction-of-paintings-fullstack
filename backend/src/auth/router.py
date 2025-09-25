# src/auth/router.py
from types import SimpleNamespace

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, EmailStr

from src.core.db import get_db
from src.auth.dependencies import (
    current_active_user,
    fastapi_users,
    auth_backend,
    get_access_strategy,
    get_refresh_strategy,
    get_user_manager,
)
from src.auth.models import User
from src.auth.schemas import UserRead, UserCreate, UserUpdate

router = APIRouter()


# ===============================
# 📌 Login schema — только email + password
# ===============================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ===============================
# 📌 Получение текущего пользователя с избранным
# ===============================
@router.get("/users/me", response_model=UserRead)
async def get_current_user_with_favorites(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user),
):
    result = await db.execute(
        select(User).options(selectinload(User.favorite_lots)).where(User.id == user.id)
    )
    user_with_favorites = result.scalar_one_or_none()

    if not user_with_favorites:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    return UserRead(
        id=user_with_favorites.id,
        email=user_with_favorites.email,
        is_active=user_with_favorites.is_active,
        is_superuser=user_with_favorites.is_superuser,
        is_verified=user_with_favorites.is_verified,
        username=user_with_favorites.username,
        favorite_lots=[lot.id for lot in user_with_favorites.favorite_lots],
    )


# ===============================
# 📌 Стандартные роуты FastAPI Users
# ===============================
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/cookie",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


# ===============================
# 📌 Login-refresh (ставит access + refresh куки)
#      — пользователь передаёт только email и password
# ===============================
@router.post("/auth/cookie/login-refresh", tags=["auth"])
async def login_with_refresh(
    credentials: LoginRequest,
    response: Response,
    user_manager=Depends(get_user_manager),
):
   
    auth_creds = SimpleNamespace(username=str(credentials.email), password=credentials.password)

    user = await user_manager.authenticate(auth_creds)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    access_token = await get_access_strategy().write_token(user)
    refresh_token = await get_refresh_strategy().write_token(user)

    # Ставим куки (в продакшене: secure=True, указать domain, sameSite по потребностям)
    response.set_cookie("auth", access_token, httponly=True, max_age=3600, secure=False, samesite="lax")
    response.set_cookie(
        "refresh", refresh_token, httponly=True, max_age=60 * 60 * 24 * 30, secure=False, samesite="lax"
    )

    return {"message": "Logged in with refresh"}


# ===============================
# 📌 Refresh access токена через refresh cookie
# ===============================
@router.post("/auth/cookie/refresh", tags=["auth"])
async def refresh_access_token(
    response: Response,
    user: User = Depends(fastapi_users.current_user(get_refresh_strategy, active=True)),
):
    new_access = await get_access_strategy().write_token(user)
    response.set_cookie("auth", new_access, httponly=True, max_age=3600, secure=False, samesite="lax")
    return {"message": "Access token refreshed"}


# ===============================
# 📌 Logout (удаление access и refresh cookies)
# ===============================
@router.post("/auth/cookie/logout", tags=["auth"])
async def custom_logout(response: Response):
    response.delete_cookie("auth")
    response.delete_cookie("refresh")
    return {"message": "Logged out"}
