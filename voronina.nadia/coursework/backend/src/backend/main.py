from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import goods, auth, orders

app = FastAPI(title="Gadget Hub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(goods.router)
app.include_router(auth.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "Gadget Hub API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
