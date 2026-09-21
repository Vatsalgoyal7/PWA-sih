# SmritiSetu Local Development & Testing Guide

This guide walks through setting up, running, testing, and verifying the SmritiSetu project locally on Windows, macOS, or Linux.

---

## 1. Prerequisites
- **Node.js**: v18.0.0+ (v20+ LTS recommended)
- **npm**: v9.0.0+
- **Python**: v3.10+ (v3.12 recommended)
- **Git**

---

## 2. Setting Up the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 3. Setting Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies (from UTF-8 requirements.txt)
pip install -r requirements.txt

# (Optional) Configure environment variables
# copy .env.example to .env and edit if you have a local PostgreSQL DB:
# cp .env.example .env

# Run the backend development server
python main.py
# Alternatively:
# uvicorn main:app --reload --port 8000
```
The backend will be running at `http://localhost:8000`.

*Note: If `DATABASE_URL` is not set in `.env`, the backend will start automatically in local in-memory fallback mode.*

---

## 4. Running Automated Checks

### Linting the Frontend
```bash
cd frontend
npm run lint
```
*Expected: 0 warnings, 0 errors.*

### Building the Frontend PWA
```bash
cd frontend
npm run build
```
*Expected: Clean Vite production build with service worker generated in `dist/`.*

### Validating Backend Syntax
```bash
python -m py_compile backend/main.py
```
*Expected: Silent success.*

### Verifying API Health
```bash
curl http://localhost:8000/health
```
*Expected: `{"status": "healthy", "database": "..."}`*
