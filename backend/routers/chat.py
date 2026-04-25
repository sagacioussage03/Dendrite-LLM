"""
Dendrite-LLM — Chat router.
Handles the core chat flow: prompt → context → Ollama → save → respond.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models import Conversation, Message
from schemas import ChatRequest, ChatResponse, MessageResponse
from services.ollama import query_ollama

settings = get_settings()
router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(body: ChatRequest, db: Session = Depends(get_db)):
    """
    Process a chat message:
    1. Validate conversation exists.
    2. Fetch last N messages for context.
    3. Save the user message.
    4. Query Ollama with the context window.
    5. Save the assistant response.
    6. Auto-title the conversation if it's the first message.
    """
    # ── 1. Validate conversation ──────────────────────────
    conversation = db.query(Conversation).filter(
        Conversation.id == body.conversation_id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # ── 2. Fetch context (last N messages) ────────────────
    history = (
        db.query(Message)
        .filter(Message.conversation_id == body.conversation_id)
        .order_by(Message.timestamp.desc())
        .limit(settings.CONTEXT_WINDOW_SIZE)
        .all()
    )
    # Reverse to chronological order
    history.reverse()

    # ── 3. Save user message ──────────────────────────────
    user_message = Message(
        conversation_id=body.conversation_id,
        role="user",
        content=body.prompt,
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # ── 4. Build Ollama payload & query ───────────────────
    ollama_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in history
    ]
    ollama_messages.append({"role": "user", "content": body.prompt})

    assistant_content = await query_ollama(ollama_messages)

    # ── 5. Save assistant message ─────────────────────────
    assistant_message = Message(
        conversation_id=body.conversation_id,
        role="assistant",
        content=assistant_content,
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    # ── 6. Auto-title on first exchange ───────────────────
    if conversation.title == "New Conversation" and len(history) == 0:
        # Use the first ~50 chars of the user prompt as title
        auto_title = body.prompt[:50].strip()
        if len(body.prompt) > 50:
            auto_title += "…"
        conversation.title = auto_title
        db.commit()

    return ChatResponse(
        conversation_id=body.conversation_id,
        user_message=MessageResponse.model_validate(user_message),
        assistant_message=MessageResponse.model_validate(assistant_message),
    )
