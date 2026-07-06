# expense-tracker

---

## Project Summary

Create a tracker that tracks daily expenses

---

## Motivation

Build a production-style expense tracking application from scratch while following modern backend development practices, including authentication, database design, testing, and deployment.

---

## Target Users

Individuals seeking a simple and efficient way to track their daily expenses, monitor spending patterns, and make informed financial decisions.

---

## Problem statement 

Managing personal expenses manually can be time-consuming and makes it difficult to gain deep meaningful insights into spending habits.

---

## Goals

The goal of this application is to make expense tracking more simple and accessbile, helping users build consistent budgetting habits without feeling overwhelmed.

- Simplify personal expense tracking.
- Encourage users to build consistent budgeting habits.
- Provide a clear overview of spending patterns.
- Allow users to categorize and organize expenses.
- Build a secure and scalable REST API using modern backend practices.

---

## Core Features (version 1)

### Authorization

- Register a new Account
- Log in securely using JWT authentication

### Expense Management
- Create a new expense
  - Enter expense title
  - specify the expense amount
  - Select a category
  - Record the transaction date
  - add optional description
- View all recorded expenses
- Update an existing expense
- delete expense

### Categories
- Categorize expenses
- view expenses by categories

### Filtering
- Filter by month
- Filter by year

### Summary
- Display the total expenses by month/year
- Display the total expenses by category

---

## Future Features (version 2)

- import bank statements
- interactive charts and spending analytics
- Recurring expenses
- Saving Goals
- Budget planning and spending limits
- export expenses as csv or pdf
- search expenses by keywords
- 

---

## Tech Stack

### Backend
- python
- FastAPI

### Database
- PostgreSQL
- SQLAlchemy
- Alembic

### Authentication
- JWT ( JSON Web Tokens)
- Password Hashing (bcrypt)

### Testing
- pytest

### Development tools
- Git
- GitHub
- Postman

### Deployment (planned)
- Docker
- AWS EC2

---

## Database Overview

To be designed

---

## Api Overview

The API will provide endpoints for:
- Authentication
- Expense Management
- Categories

---

## Security

To be designed

---

## Project Status

Planning

