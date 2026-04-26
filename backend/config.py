"""
Dendrite-LLM — Configuration module.
All settings are loaded from environment variables (with .env fallback).
"""

import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Database ──────────────────────────────────────────
    DATABASE_URL: str = "postgresql://localhost/dendrite-llm-db"

    # ── Ollama ────────────────────────────────────────────
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2:3b"
    OLLAMA_TIMEOUT: int = 120  # seconds

    # ── Context ───────────────────────────────────────────
    CONTEXT_WINDOW_SIZE: int = 10  # number of past messages to include

    # ── Server ────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8001

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
