# TransitOps Platform

TransitOps Platform is a full-stack fleet operations app with:
- **Backend**: Flask + SQLAlchemy + JWT auth
- **Frontend**: React + Vite
- **Database**: MySQL

## Repository Structure

- `/backend` - Flask API, models, and routes
- `/frontend` - React web app

## Prerequisites

Install the following before setup:
- Python 3.11+ (or compatible with project dependencies)
- Node.js 20+ and npm
- MySQL 8+

## Backend Setup (Flask API)

1. Go to backend:
   ```bash
   cd /home/runner/work/TransitOps-Platform/TransitOps-Platform/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a MySQL database (example):
   ```sql
   CREATE DATABASE transitops;
   ```
5. Run schema and seed data from `/backend/schema.sql` in your MySQL database.
6. Create a `.env` file in `/backend` with:
   ```env
   SECRET_KEY=your_secret_key
   JWT_SECRET_KEY=your_jwt_secret_key
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=transitops
   ```

## Run Backend

From `/backend` with virtual environment activated:
```bash
python app.py
```

Backend runs by default at: `http://127.0.0.1:5000`

## Frontend Setup (React + Vite)

1. Go to frontend:
   ```bash
   cd /home/runner/work/TransitOps-Platform/TransitOps-Platform/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Run Frontend

From `/frontend`:
```bash
npm run dev
```

Frontend runs by default at: `http://127.0.0.1:5173`

The frontend API client is configured to call:
`http://127.0.0.1:5000/api`

## Useful Commands

From `/frontend`:
- Lint:
  ```bash
  npm run lint
  ```
- Build:
  ```bash
  npm run build
  ```