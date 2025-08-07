from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.core.db import get_db
from src.auth.dependencies import current_active_user, fastapi_users, auth_backend
from src.auth.models import User
from src.auth.schemas import UserRead, UserCreate, UserUpdate

router = APIRouter()


@router.get("/users/me", response_model=UserRead)
async def get_current_user_with_favorites(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user)
):
    result = await db.execute(
        select(User)
        .options(selectinload(User.favorite_lots))
        .where(User.id == user.id)
    )
    user_with_favorites = result.scalar_one()

    return UserRead(
        id=user_with_favorites.id,
        email=user_with_favorites.email,
        is_active=user_with_favorites.is_active,
        is_superuser=user_with_favorites.is_superuser,
        is_verified=user_with_favorites.is_verified,
        username=user_with_favorites.username,
        favorite_lots=[lot.id for lot in user_with_favorites.favorite_lots]
    )



router.include_router(
    fastapi_users.get_auth_router(auth_backend),  
    prefix="/auth/jwt",
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
