# API Design

## Authentication

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Log in user | No |
| POST | /auth/logout | Log out user | Yes |

## Expenses

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| POST | /expenses | Create an expense | Yes |
| GET | /expenses | View all expenses | Yes |
| GET | /expenses/{id} | View one expense | Yes |
| PUT | /expenses/{id} | Update an expense | Yes |
| DELETE | /expenses/{id} | Delete an expense | Yes |

## Categories

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| POST | /categories | Create a category | Yes |
| GET | /categories | View all categories | Yes |
| PUT | /categories/{id} | Update a category | Yes |
| DELETE | /categories/{id} | Delete a category | Yes |

## Filtering

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| GET | /expenses?month=7 | Filter expenses by month | Yes |
| GET | /expenses?year=2026 | Filter expenses by year | Yes |
| GET | /expenses?category_id=1 | Filter expenses by category | Yes |

## Summary

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| GET | /summary/monthly | View monthly spending summary | Yes |
| GET | /summary/yearly | View yearly spending summary | Yes |
| GET | /summary/categories | View spending by category | Yes |

## Dashboard

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| GET | /dashboard | View spending overview and recent expenses | Yes |
