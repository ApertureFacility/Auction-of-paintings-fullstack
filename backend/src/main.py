from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import test
from .auth.router import router as auth_router
from .lots.routers import router as lots_router
from .favorites.router import router as favorites_router
from .auction.websocket import websocket_router
from .core.config import settings

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Подключение роутеров ---
app.include_router(test.router)
app.include_router(auth_router)
app.include_router(lots_router)
app.include_router(favorites_router)
app.include_router(websocket_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
