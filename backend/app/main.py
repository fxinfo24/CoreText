from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app import init_db as _init_db
from app.routers import (
    auth,
    sites,
    briefing,
    nervous_system,
    routing,
    portfolio,
    geo,
    decay,
    monetization,
    competitors,
    hive,
    chat
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs on every serverless cold start (Vercel @vercel/python does NOT execute
    # run.py, so schema creation/seeding must happen here). Idempotent.
    try:
        _init_db.init_database()
    except Exception as e:  # never block startup on a transient DB error
        print(f"[startup] init_database skipped/failed: {e}")
    yield


app = FastAPI(
    title="CoreText Executive OS Core API",
    description="Fully Predictive Shareholder Asset Compounding Backend",
    version="2.0.0",
    lifespan=lifespan
)

# CORS: restrict to known origins (Vercel prod + preview + local dev).
# Comma-separated CORS_ORIGINS env; falls back to the app's own Vercel domain + localhost.
def _cors_origins():
    env = os.getenv("CORS_ORIGINS", "").strip()
    if env:
        return [o.strip() for o in env.split(",") if o.strip()]
    return [
        "https://coretext-eight.vercel.app",
        "https://coretext-eight-git-main-fxinfo24s-projects.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include all modular sub-routers
app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(briefing.router)
app.include_router(nervous_system.router)
app.include_router(routing.router)
app.include_router(portfolio.router)
app.include_router(geo.router)
app.include_router(decay.router)
app.include_router(monetization.router)
app.include_router(competitors.router)
app.include_router(hive.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "engine": "Cortex Executive OS Compounding API",
        "version": "2.0.0",
        "posture": "Shareholder Asset Command"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
