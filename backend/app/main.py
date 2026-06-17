from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
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

app = FastAPI(
    title="CoreText Executive OS Core API",
    description="Fully Predictive Shareholder Asset Compounding Backend",
    version="2.0.0"
)

# CORS configuration to allow React local and preview proxy access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular sub-routers
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
        "engine": "CoreText Executive OS Compounding API",
        "version": "2.0.0",
        "posture": "Shareholder Asset Command"
    }
