import os
import json
import logging
from contextlib import asynccontextmanager
from typing import Optional

try:
    import asyncpg
except ImportError:
    asyncpg = None

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

# ---------------------------------------------------------------------------
# Logging & Environment
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smritisetu-backend")

load_dotenv()

# ---------------------------------------------------------------------------
# Connection pool & Fallback State
# ---------------------------------------------------------------------------
pool: Optional[object] = None

# Default in-memory state used if database is unconfigured or unreachable
_fallback_config = {
    "patient_id": "default",
    "game_selection": ["game1", "game2", "game3"],
    "reminder_medicine": "08:00",
    "reminder_food": "10:00",
    "reminder_doctor": "12:00",
    "reminder_walk": "18:00",
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    database_url = os.environ.get("DATABASE_URL")
    if database_url and asyncpg is not None:
        try:
            logger.info("Connecting to PostgreSQL database...")
            pool = await asyncpg.create_pool(database_url, min_size=1, max_size=5)
            logger.info("Connected to PostgreSQL successfully.")

            # Ensure table exists and default row is seeded
            async with pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS patient_config (
                        patient_id VARCHAR(64) PRIMARY KEY,
                        game_selection TEXT NOT NULL DEFAULT '["game1", "game2", "game3"]',
                        reminder_medicine VARCHAR(16) DEFAULT '08:00',
                        reminder_food VARCHAR(16) DEFAULT '10:00',
                        reminder_doctor VARCHAR(16) DEFAULT '12:00',
                        reminder_walk VARCHAR(16) DEFAULT '18:00',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                await conn.execute("""
                    INSERT INTO patient_config (patient_id, game_selection, reminder_medicine, reminder_food, reminder_doctor, reminder_walk)
                    VALUES ('default', '["game1", "game2", "game3"]', '08:00', '10:00', '12:00', '18:00')
                    ON CONFLICT (patient_id) DO NOTHING;
                """)
            logger.info("Database schema initialized and verified.")
        except Exception as e:
            logger.warning(
                f"Failed to connect to DATABASE_URL: {e}. "
                "Running in local memory fallback mode."
            )
            pool = None
    else:
        if not database_url:
            logger.warning(
                "DATABASE_URL environment variable is not set. "
                "Running in local memory fallback mode for development."
            )
        else:
            logger.warning(
                "asyncpg library is not installed. "
                "Running in local memory fallback mode."
            )
        pool = None

    yield

    if pool is not None:
        await pool.close()
        logger.info("PostgreSQL connection pool closed.")

app = FastAPI(
    title="SmritiSetu API",
    description="Cognitive care & memory stimulation platform backend API",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
cors_env = os.environ.get("CORS_ORIGINS", "")
if cors_env:
    origins = [o.strip() for o in cors_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://peppy-puppy-9df68c.netlify.app",
        "https://smritisetu-pwa.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
VALID_GAME_IDS = {
    "game1", "game2", "game3", "game4", "game5",
    "game6", "game7", "game8", "game9", "game10",
}

class GamesPayload(BaseModel):
    game_selection: list[str]

    @field_validator("game_selection")
    @classmethod
    def validate_games(cls, v: list[str]) -> list[str]:
        if len(v) < 3:
            raise ValueError("At least 3 games must be selected")
        if len(v) > 10:
            raise ValueError("At most 10 games can be selected")
        invalid = set(v) - VALID_GAME_IDS
        if invalid:
            raise ValueError(f"Unknown game ids: {invalid}")
        return v


class RemindersPayload(BaseModel):
    reminder_medicine: Optional[str] = None
    reminder_food:     Optional[str] = None
    reminder_doctor:   Optional[str] = None
    reminder_walk:     Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "service": "SmritiSetu backend",
        "version": "1.0.0",
        "database_connected": pool is not None,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected" if pool is not None else "in_memory_fallback",
    }


@app.get("/patient-config")
async def get_patient_config():
    if pool is None:
        return dict(_fallback_config)

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM patient_config WHERE patient_id = $1", "default"
        )
    if row is None:
        raise HTTPException(status_code=404, detail="patient_config row not found")

    raw = dict(row)
    # game_selection is stored as jsonb/text — normalise to list
    gs = raw.get("game_selection")
    if isinstance(gs, str):
        try:
            gs = json.loads(gs)
        except json.JSONDecodeError:
            gs = []
    elif gs is None:
        gs = []
    raw["game_selection"] = gs
    return raw


@app.patch("/patient-config/games")
async def update_games(payload: GamesPayload):
    if pool is None:
        _fallback_config["game_selection"] = payload.game_selection
        return {"ok": True, "game_selection": payload.game_selection, "storage": "in_memory"}

    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE patient_config SET game_selection = $1 WHERE patient_id = $2",
            json.dumps(payload.game_selection),
            "default",
        )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="patient_config row not found")
    return {"ok": True, "game_selection": payload.game_selection}


@app.patch("/patient-config/reminders")
async def update_reminders(payload: RemindersPayload):
    if pool is None:
        if payload.reminder_medicine is not None:
            _fallback_config["reminder_medicine"] = payload.reminder_medicine
        if payload.reminder_food is not None:
            _fallback_config["reminder_food"] = payload.reminder_food
        if payload.reminder_doctor is not None:
            _fallback_config["reminder_doctor"] = payload.reminder_doctor
        if payload.reminder_walk is not None:
            _fallback_config["reminder_walk"] = payload.reminder_walk
        return {"ok": True, "storage": "in_memory"}

    async with pool.acquire() as conn:
        result = await conn.execute(
            """
            UPDATE patient_config
            SET reminder_medicine = $1,
                reminder_food     = $2,
                reminder_doctor   = $3,
                reminder_walk     = $4
            WHERE patient_id = $5
            """,
            payload.reminder_medicine,
            payload.reminder_food,
            payload.reminder_doctor,
            payload.reminder_walk,
            "default",
        )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="patient_config row not found")
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
