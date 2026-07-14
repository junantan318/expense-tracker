from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, auth, categories, expenses
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/api")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://expense-tracker-one-delta-41.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(expenses.router)


@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}