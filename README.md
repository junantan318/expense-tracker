# Expense Tracker

Live Demo:
https://expense-tracker-one-delta-41.vercel.app

Backend API:
http://47.131.251.17/docs

<img width="1851" height="916" alt="image" src="https://github.com/user-attachments/assets/a5d7e093-2f79-4d2c-9a52-a545d725201b" />

---

## Overview

Expense Tracker is a full-stack web application that enables users to securely manage their personal finances.

Users can register an account, authenticate using JWT, categorize expenses, filter transactions, and visualize spending through a dashboard.

The project was built to demonstrate production-oriented backend and deployment practices using FastAPI, React, PostgreSQL, Docker, AWS EC2, Vercel, and GitHub Actions.

---

## Features

### Authentication

- User Registration
- JWT Login
- Protected Routes
- Secure Password Hashing

### Expense Management

- Create Expenses
- Edit Expenses
- Delete Expenses
- Expense Categories
- Optional Descriptions

### Dashboard

- Total Spending
- Monthly Spending
- Category Breakdown

### Filtering

- Date Range
- Category
- Search

### Deployment

- Docker
- AWS EC2
- Nginx
- GitHub Actions
- Vercel
---

## Tech Stack

### Frontend

- React
- Axios
- React Router

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication

### Database

- PostgreSQL

### Deployment

- Docker
- Docker Compose
- AWS EC2
- Nginx
- Vercel
- GitHub Actions

### Development

- Git
- GitHub
- Postman
---
User
 │
 ▼
React (Vercel)
 │
 ▼
FastAPI
 │
 ▼
Nginx
 │
 ▼
Docker Compose
 │
 ▼
PostgreSQL

---

## Screenshots

### Dashboard

<img width="1851" height="916" alt="image" src="https://github.com/user-attachments/assets/27c018c2-356f-480f-b361-1b8b08e9adf3" />


### Expenses

<img width="1872" height="912" alt="image" src="https://github.com/user-attachments/assets/a4a6c454-46b6-4327-9488-41ecd16e6f28" />


### Categories

<img width="1869" height="916" alt="image" src="https://github.com/user-attachments/assets/506a4613-e9c0-42cc-b1a2-22561986859e" />


### Login

<img width="1116" height="909" alt="image" src="https://github.com/user-attachments/assets/15dda70d-aade-4717-9636-576010b484d1" />


---

## Local Setup

Clone repository

git clone ...

Backend

cd backend

python -m venv .venv

pip install -r requirements.txt

uvicorn app.main:app --reload

Frontend

cd frontend

npm install

npm run dev

---

## Environment Variables

Backend

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

Frontend

```env
VITE_API_BASE_URL=
```
---

## Deployment

Frontend

- Hosted on Vercel

Backend

- Docker
- AWS EC2
- Nginx Reverse Proxy

CI/CD

- GitHub Actions automatically deploys backend changes after every push to main.

---

## API

Authentication

POST /login

POST /users

Expenses

GET /expenses

POST /expenses

PUT /expenses/{id}

DELETE /expenses/{id}

Categories

GET /categories

POST /categories

---

## Lessons Learned

During this project I learned:

- Building REST APIs with FastAPI
- JWT Authentication
- PostgreSQL database design
- Docker containerization
- Reverse proxy with Nginx
- AWS EC2 deployment
- CI/CD using GitHub Actions
- Frontend deployment with Vercel
