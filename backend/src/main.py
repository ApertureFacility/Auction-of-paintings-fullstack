from typing import Union
from .api import test 

from fastapi import FastAPI

app = FastAPI()
app.include_router(test.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
