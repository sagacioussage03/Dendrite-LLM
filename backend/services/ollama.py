"""
Dendrite-LLM — Ollama API client.
Handles communication with the local Ollama server.
"""

import httpx
from fastapi import HTTPException

from config import get_settings

settings = get_settings()


async def query_ollama(messages: list[dict], model: str | None = None) -> str:
    """
    Send a chat completion request to the Ollama API.

    Args:
        messages: List of message dicts with 'role' and 'content' keys.
        model: Model name override (defaults to config OLLAMA_MODEL).

    Returns:
        The assistant's response content string.

    Raises:
        HTTPException(503): If Ollama is unreachable.
        HTTPException(502): If Ollama returns an unexpected response.
    """
    model = model or settings.OLLAMA_MODEL

    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(
            base_url=settings.OLLAMA_BASE_URL,
            timeout=httpx.Timeout(settings.OLLAMA_TIMEOUT),
        ) as client:
            response = await client.post("/api/chat", json=payload)
            response.raise_for_status()

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=(
                f"Ollama server is unreachable at {settings.OLLAMA_BASE_URL}. "
                "Ensure the Ollama service is running on port 11434."
            ),
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail=(
                f"Ollama request timed out after {settings.OLLAMA_TIMEOUT}s. "
                "The model may be loading or the prompt may be too complex."
            ),
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama returned an error: {exc.response.status_code} — {exc.response.text}",
        )

    data = response.json()

    # Ollama response format: { "message": { "role": "assistant", "content": "..." } }
    try:
        return data["message"]["content"]
    except (KeyError, TypeError):
        raise HTTPException(
            status_code=502,
            detail=f"Unexpected Ollama response format: {data}",
        )
