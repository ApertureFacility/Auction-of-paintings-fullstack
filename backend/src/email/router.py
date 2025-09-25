from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel, EmailStr

from src.email.service import send_confirmation_email, send_email, send_welcome_email
from src.auth.dependencies import fastapi_users, get_access_strategy
import logging
from src.auth.dependencies import get_user_manager

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/email", tags=["Email"])

# ===============================
# 📌 Schemas
# ===============================
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ===============================
# 📌 Routes
# ===============================
@router.post("/test")
async def send_test_email(background_tasks: BackgroundTasks, email: EmailStr = "test@example.com"):
    logger.info(f"Sending test email to {email}")
    background_tasks.add_task(
        send_email,
        [email],
        "Тестовое письмо от Auction API",
        "<h1>Тест MailHog</h1><p>Это тестовое письмо для проверки работы email рассылки</p>",
    )
    return {"message": "Test email sent to MailHog", "email": email}

@router.post("/welcome")
async def send_welcome_email_route(background_tasks: BackgroundTasks, email: EmailStr, username: str):
    logger.info(f"Sending welcome email to {email}, username: {username}")
    background_tasks.add_task(send_welcome_email, email, username)
    return {"message": "Welcome email will be sent", "email": email}

# # src/email/router.py



@router.post("/forgot-password")
async def forgot_password(
    body: ForgotPasswordRequest,
    user_manager=Depends(get_user_manager),
):
    user = await user_manager.get_by_email(body.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # встроенный метод FastAPI Users, вызывает on_after_forgot_password
    await user_manager.forgot_password(user)
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    user_manager=Depends(get_user_manager),
):
    try:
        await user_manager.reset_password(body.token, body.new_password)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"message": "Password has been reset successfully"}

# ===============================
@router.post("/confirm-account")
async def send_confirm_account_email(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    username: str,
    token: str,
):
    logger.info(f"Send confirm account email to {email}, username: {username}, token: {token}")
    background_tasks.add_task(send_confirmation_email, email, username, token)
    return {"message": "Confirmation email will be sent", "email": email}
