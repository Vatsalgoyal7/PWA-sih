import os
import json
import asyncpg
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Connection pool
# ---------------------------------------------------------------------------
pool: asyncpg.Pool | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    database_url = os.environ["DATABASE_URL"]
    pool = await asyncpg.create_pool(database_url, min_size=1, max_size=5)
    yield
    await pool.close()

app = FastAPI(lifespan=lifespan)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "https://peppy-puppy-9df68c.netlify.app",
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
    "game6", "game7", "game8", "game9", "game10", "game11",
}

class GamesPayload(BaseModel):
    game_selection: list[str]

    @field_validator("game_selection")
    @classmethod
    def validate_games(cls, v: list[str]) -> list[str]:
        if len(v) < 3:
            raise ValueError("At least 3 games must be selected")
        if len(v) > 11:
            raise ValueError("At most 11 games can be selected")
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
    return {"message": "SmritiSetu backend running"}


@app.get("/patient-config")
async def get_patient_config():
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
        gs = json.loads(gs)
    elif gs is None:
        gs = []
    raw["game_selection"] = gs
    return raw


@app.patch("/patient-config/games")
async def update_games(payload: GamesPayload):
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
