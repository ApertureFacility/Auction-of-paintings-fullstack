import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List


mail_config = ConnectionConfig(
    MAIL_USERNAME="",
    MAIL_PASSWORD="",
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@auctionapp.com"),
    MAIL_PORT=int(os.getenv("MAILHOG_PORT", 1025)),
    MAIL_SERVER=os.getenv("MAILHOG_HOST", "mailhog"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Auction App"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=False,
)

fm = FastMail(mail_config)

async def send_email(
    to: List[EmailStr],
    subject: str,
    body: str,
    subtype: str = "html"
):
    """Базовая функция отправки email"""
    message = MessageSchema(
        subject=subject,
        recipients=to,
        body=body,
        subtype=subtype,
    )
    
    await fm.send_message(message)

async def send_welcome_email(email: EmailStr, username: str):
    """Приветственное письмо после регистрации"""
    subject = f"Добро пожаловать в Auction App, {username}!"
    body = f"""
    <h1>Добро пожаловать!</h1>
    <p>Привет, {username}!</p>
    <p>Спасибо за регистрацию в нашем аукционном приложении.</p>
    <p>Ваш email: {email}</p>
    <br>
    <p>С уважением,<br>Команда Auction App</p>
    """
    
    await send_email([email], subject, body)

async def send_bid_notification_email(email: EmailStr, lot_name: str, amount: float):
    """Уведомление о новой ставке"""
    subject = f"Новая ставка на лот '{lot_name}'!"
    body = f"""
    <h1>Новая ставка!</h1>
    <p>На лот <strong>{lot_name}</strong> сделана новая ставка: ${amount}</p>
    <p>Не упустите свой шанс!</p>
    """
    
    await send_email([email], subject, body)

async def send_auction_ended_email(email: EmailStr, lot_name: str, winning: bool = False):
    """Уведомление о завершении аукциона"""
    if winning:
        subject = f"Поздравляем! Вы выиграли лот '{lot_name}'"
        body = f"""
        <h1>Поздравляем с победой!</h1>
        <p>Вы выиграли лот <strong>{lot_name}</strong></p>
        <p>Свяжитесь с продавцом для оформления покупки.</p>
        """
    else:
        subject = f"Аукцион по лоту '{lot_name}' завершен"
        body = f"""
        <h1>Аукцион завершен</h1>
        <p>Аукцион по лоту <strong>{lot_name}</strong> завершен.</p>
        <p>К сожалению, ваша ставка не выиграла.</p>
        """
    
    await send_email([email], subject, body)