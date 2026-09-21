# SmritiSetu Deployment Guide

This guide describes how to deploy the SmritiSetu Frontend PWA and FastAPI Backend to production environments.

---

## 1. Frontend Deployment (Netlify / Vercel)

### Netlify Deployment
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Base Directory**: `frontend`
4. **Environment Variables**:
   - `VITE_API_URL`: URL of the deployed FastAPI backend (e.g. `https://smritisetu-backend.onrender.com`).
5. **SPA Redirects**:
   - The file `frontend/public/_redirects` contains:
     ```
     /*    /index.html   200
     ```
   - Netlify serves static files in `/games/*` directly when requested, and rewrites all unknown route requests back to `/index.html` for client-side React routing.

---

## 2. Backend Deployment (Render / Railway / Docker)

### Render Deployment (Web Service)
1. **Environment**: Python 3
2. **Root Directory**: `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Health Check Path**: `/health`
6. **Environment Variables**:
   - `DATABASE_URL`: Full PostgreSQL connection string with SSL (e.g., `postgresql://user:pass@host:port/dbname?sslmode=require`).
   - `CORS_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., `https://your-app.netlify.app`).

### Database Schema Provisioning
Before running in production against PostgreSQL, execute the schema initialization:

```sql
CREATE TABLE IF NOT EXISTS patient_config (
    patient_id VARCHAR(50) PRIMARY KEY,
    game_selection JSONB NOT NULL DEFAULT '["game1", "game2", "game3"]'::jsonb,
    reminder_medicine VARCHAR(10) DEFAULT '08:00',
    reminder_food VARCHAR(10) DEFAULT '10:00',
    reminder_doctor VARCHAR(10) DEFAULT '12:00',
    reminder_walk VARCHAR(10) DEFAULT '18:00',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default record if not present
INSERT INTO patient_config (patient_id)
VALUES ('default')
ON CONFLICT (patient_id) DO NOTHING;
```

---

## 3. Docker Deployment

A production `Dockerfile` for the backend:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
