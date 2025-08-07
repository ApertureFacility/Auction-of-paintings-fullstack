from .api import test 
from .auth.router import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .lots.routers import router as lots_router
from src.favorites.router import router as favorites_router



app = FastAPI()


# Роутеры
app.include_router(test.router)
app.include_router(auth_router)
app.include_router(lots_router)
app.include_router(favorites_router)

# CORS настройки
origins =[
        "http://localhost:3000",      
        "http://192.168.100.5:3000"
    
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Разрешённые адреса
    allow_credentials=True,
    allow_methods=["*"],              # Разрешить все методы
    allow_headers=["*"],              # Разрешить все заголовки
)

@app.get("/")
def read_root():
    return {"Hello": "World"}
