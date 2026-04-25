#!/data/data/com.termux/files/usr/bin/bash
# ─────────────────────────────────────────────────────────
#  Dendrite-LLM — Start Script (Termux)
#  Launches the Backend and Frontend in the background.
# ─────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
PID_DIR="$SCRIPT_DIR/.pids"

mkdir -p "$PID_DIR"

echo "🌿 Dendrite-LLM — Starting services..."
echo ""

# ── Backend ──────────────────────────────────────────────
echo "  → Starting Backend (port 8001)..."

cd "$BACKEND_DIR"

# Create venv if it doesn't exist
if [ ! -d "venv-Dendrite-LLM" ]; then
    echo "    Creating Python virtual environment..."
    python -m venv venv-Dendrite-LLM
    source venv-Dendrite-LLM/bin/activate
    pip install -r requirements.txt --quiet
else
    source venv-Dendrite-LLM/bin/activate
fi

# Copy .env.example to .env if .env doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "    Created .env from .env.example — review and adjust if needed."
fi

nohup uvicorn main:app --host 0.0.0.0 --port 8001 > "$PID_DIR/backend.log" 2>&1 &
echo $! > "$PID_DIR/backend.pid"
echo "    Backend PID: $(cat "$PID_DIR/backend.pid")"

# ── Frontend ─────────────────────────────────────────────
echo "  → Starting Frontend (port 3000)..."

cd "$FRONTEND_DIR"

# Install node modules if needed
if [ ! -d "node_modules" ]; then
    echo "    Installing npm dependencies..."
    npm install --silent
fi

nohup npm run dev > "$PID_DIR/frontend.log" 2>&1 &
echo $! > "$PID_DIR/frontend.pid"
echo "    Frontend PID: $(cat "$PID_DIR/frontend.pid")"

echo ""
echo "✅ Dendrite-LLM is running!"
echo "   Backend  → http://0.0.0.0:8001"
echo "   Frontend → http://0.0.0.0:3000"
echo ""
echo "   Logs: $PID_DIR/*.log"
echo "   Stop: ./stop.sh"
