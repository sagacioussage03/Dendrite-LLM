#!/data/data/com.termux/files/usr/bin/bash
# ─────────────────────────────────────────────────────────
#  Dendrite-LLM — Stop Script (Termux)
#  Stops the Backend and Frontend background processes.
# ─────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$SCRIPT_DIR/.pids"

echo "🌿 Dendrite-LLM — Stopping services..."
echo ""

stop_service() {
    local name="$1"
    local pid_file="$PID_DIR/${name}.pid"

    if [ -f "$pid_file" ]; then
        local pid
        pid=$(cat "$pid_file")

        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
            # Wait briefly, then force-kill if still running
            sleep 1
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null
            fi
            echo "  ✓ $name stopped (PID $pid)"
        else
            echo "  · $name was not running (stale PID $pid)"
        fi

        rm -f "$pid_file"
    else
        echo "  · $name — no PID file found"
    fi
}

stop_service "backend"
stop_service "frontend"

echo ""
echo "✅ All services stopped."
