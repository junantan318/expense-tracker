from fastapi import FastAPI

from app.routers import users,auth, categories, expenses

app = FastAPI()

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(expenses.router)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}