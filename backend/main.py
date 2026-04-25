"""
Dendrite-LLM — FastAPI application entry point.
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import init_db
from routers import conversations, chat

settings = get_settings()


# ── Lifespan events ──────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    print(f"🌿 Dendrite-LLM Backend starting on :{settings.PORT}")
    print(f"   Database : {settings.DATABASE_URL}")
    print(f"   Ollama   : {settings.OLLAMA_BASE_URL} ({settings.OLLAMA_MODEL})")
    init_db()
    print("   Tables   : OK")
    yield
    print("🌿 Dendrite-LLM Backend shutting down")


app = FastAPI(
    title="Dendrite-LLM Backend",
    description="Chat API backed by Ollama and PostgreSQL",
    version="1.0.0",
    lifespan=lifespan,
)


# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request logging middleware ───────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    print(
        f"  {request.method} {request.url.path} → {response.status_code} "
        f"({duration_ms:.1f} ms)"
    )
    return response


# ── Routers ──────────────────────────────────────────────────
app.include_router(conversations.router)
app.include_router(chat.router)


@app.get("/", tags=["health"])
def health_check():
    """Root health-check endpoint."""
    return {"status": "Dendrite-LLM Backend is Online"}
