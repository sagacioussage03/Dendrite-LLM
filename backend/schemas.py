"""
Dendrite-LLM — Pydantic schemas for request / response validation.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ── Conversations ─────────────────────────────────────────


class ConversationCreate(BaseModel):
    """Request body for creating a new conversation."""
    title: Optional[str] = Field(None, max_length=255)


class ConversationResponse(BaseModel):
    """Single conversation (without messages)."""
    id: UUID
    title: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationDetailResponse(BaseModel):
    """Conversation with its messages."""
    id: UUID
    title: str
    created_at: datetime
    messages: list["MessageResponse"] = []

    model_config = {"from_attributes": True}


# ── Messages ──────────────────────────────────────────────


class MessageResponse(BaseModel):
    """A single message."""
    id: int
    role: str
    content: str
    timestamp: datetime

    model_config = {"from_attributes": True}


# ── Chat ──────────────────────────────────────────────────


class ChatRequest(BaseModel):
    """Request body for the /chat endpoint."""
    conversation_id: UUID
    prompt: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    """Response from the /chat endpoint."""
    conversation_id: UUID
    user_message: MessageResponse
    assistant_message: MessageResponse
