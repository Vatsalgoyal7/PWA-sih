# SmritiSetu API Reference

The SmritiSetu backend is a high-performance REST API built with FastAPI. It handles persistent patient configurations, caregiver preferences, and system diagnostics.

- **Base URL (Local)**: `http://localhost:8000`
- **Base URL (Production)**: `https://smritisetu-backend.onrender.com`

---

## Endpoints

### 1. Root Service Information
- **Route**: `GET /`
- **Description**: Returns basic service information and PostgreSQL connection health.
- **Response**:
```json
{
  "service": "SmritiSetu backend",
  "version": "1.0.0",
  "database_connected": true
}
```

---

### 2. Health & Liveness Check
- **Route**: `GET /health`
- **Description**: Liveness and readiness probe for cloud monitoring (Render, Railway, Docker).
- **Response**:
```json
{
  "status": "healthy",
  "database": "connected"
}
```
*(Note: If running without an external database, `"database"` returns `"in_memory_fallback"`).*

---

### 3. Retrieve Patient Configuration
- **Route**: `GET /patient-config`
- **Description**: Returns the active game list and daily reminder schedule for the default patient.
- **Response (200 OK)**:
```json
{
  "patient_id": "default",
  "game_selection": ["game1", "game2", "game3", "game4"],
  "reminder_medicine": "08:00",
  "reminder_food": "10:00",
  "reminder_doctor": "12:00",
  "reminder_walk": "18:00"
}
```

---

### 4. Update Game Selection
- **Route**: `PATCH /patient-config/games`
- **Description**: Updates the subset of active games displayed on the patient dashboard.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "game_selection": ["game1", "game3", "game5", "game8"]
}
```
- **Validation Rules**:
  - `game_selection` must contain between 3 and 10 items.
  - All IDs must belong to the set: `{"game1", "game2", "game3", "game4", "game5", "game6", "game7", "game8", "game9", "game10"}`.
- **Response (200 OK)**:
```json
{
  "ok": true,
  "game_selection": ["game1", "game3", "game5", "game8"]
}
```
- **Error Response (422 Unprocessable Entity)**:
```json
{
  "detail": [
    {
      "msg": "Value error, At least 3 games must be selected",
      "type": "value_error"
    }
  ]
}
```

---

### 5. Update Daily Reminder Schedule
- **Route**: `PATCH /patient-config/reminders`
- **Description**: Updates the daily reminder times (24-hour HH:MM format).
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "reminder_medicine": "08:30",
  "reminder_food": "10:15",
  "reminder_doctor": null,
  "reminder_walk": "17:45"
}
```
- **Response (200 OK)**:
```json
{
  "ok": true
}
```
