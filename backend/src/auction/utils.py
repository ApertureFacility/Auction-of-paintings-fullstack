from sqlalchemy import select
from src.auth.models import User
from src.core.db import async_session_maker

async def get_user_by_id(user_id: int) -> User | None:
    async with async_session_maker() as session:
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
