from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@router.get("/summary", response_model=schemas.ExpenseSummaryResponse)
def get_expense_summary(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    summary = db.query(
        func.sum(models.Expense.amount).label("total_expenses"),
        func.count(models.Expense.id).label("count"),
        func.avg(models.Expense.amount).label("average_expense"),
        func.max(models.Expense.amount).label("highest_expense"),
        func.min(models.Expense.amount).label("lowest_expense")
    ).filter(models.Expense.user_id == current_user.id).first()

    return {
        "total_expenses": float(summary[0]),
        "count": summary[1],
        "average_expense": float(summary[2]),
        "highest_expense": float(summary[3]),
        "lowest_expense": float(summary[4])
        }

@router.post("/", response_model=schemas.ExpenseResponse)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    # Check if the category exists and belongs to the current user
    category = db.query(models.Category).filter(models.Category.id == expense.category_id, models.Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found or does not belong to the user")
    
    new_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        description=expense.description,
        date=expense.date,
        category_id=expense.category_id,
        user_id=current_user.id
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/", response_model=list[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()
    return expenses

@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(expense_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    existing_expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id).first()
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Check if the category exists and belongs to the current user
    category = db.query(models.Category).filter(models.Category.id == expense.category_id, models.Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found or does not belong to the user")
    
    existing_expense.title = expense.title
    existing_expense.amount = expense.amount
    existing_expense.description = expense.description
    existing_expense.date = expense.date
    existing_expense.category_id = expense.category_id
    
    db.commit()
    db.refresh(existing_expense)
    return existing_expense

@router.delete("/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    existing_expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id).first()
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(existing_expense)
    db.commit()
    return None

@router.get("/", response_model=list[schemas.ExpenseResponse])
def filter_expenses(category_id: int | None = None, start_date: str | None = None, end_date: str | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    query = db.query(models.Expense).filter(models.Expense.user_id == current_user.id)

    if category_id is not None:
        query = query.filter(models.Expense.category_id == category_id)

    if start_date is not None:
        query = query.filter(models.Expense.date >= start_date)

    if end_date is not None:
        query = query.filter(models.Expense.date <= end_date)

    return query.all()
     