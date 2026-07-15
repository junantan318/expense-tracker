# Expense Tracker

Live Demo:
https://expense-tracker-one-delta-41.vercel.app

Backend API:
http://47.131.251.17/docs

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

(image)

### Expenses

(image)

### Categories

(image)

### Login

(image)

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
