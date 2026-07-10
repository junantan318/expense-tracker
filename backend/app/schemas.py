from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        orm_mode = True

class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        orm_mode = True

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    description: str | None = None
    date: datetime
    category_id: int

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    description: str | None = None
    date: datetime
    category_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ExpenseSummaryResponse(BaseModel):
    total_expenses: float
    count: int
    average_expense: float | None = None
    highest_expense: float | None = None
    lowest_expense: float | None = None

    class Config:
        orm_mode = True