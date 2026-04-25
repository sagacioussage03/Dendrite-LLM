# 🌿 Dendrite-LLM

A self-hosted LLM chat application built for **Android (Termux)**, powered by **Ollama** and **PostgreSQL**.

---

## Architecture

```
┌──────────────┐    HTTP     ┌──────────────────┐    HTTP    ┌──────────────┐
│   Frontend   │ ──────────► │     Backend      │ ─────────► │    Ollama    │
│  React/Vite  │  :3000      │  FastAPI/Python  │  :8001     │   llama3.2   │
│  Tailwind    │ ◄────────── │  SQLAlchemy      │ ◄───────── │   :11434     │
└──────────────┘    JSON     └────────┬─────────┘    JSON    └──────────────┘
                                      │
                                      │ SQL
                                      ▼
                              ┌──────────────┐
                              │  PostgreSQL   │
                              │    :5432      │
                              └──────────────┘
```

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React 19, Vite 6, Tailwind CSS v4            |
| Backend  | Python 3.13, FastAPI, SQLAlchemy, httpx       |
| Database | PostgreSQL                                   |
| LLM      | Ollama (llama3.2:3b, configurable)           |
| Platform | Android Termux (aarch64)                     |

---

## Setup (Termux)

### Prerequisites

```bash
pkg install python postgresql nodejs-lts
```

Ensure **Ollama** is installed and running:
```bash
ollama serve &
ollama pull llama3.2:3b
```

### 1. Initialize PostgreSQL

```bash
initdb $PREFIX/var/lib/postgresql
pg_ctl -D $PREFIX/var/lib/postgresql start
createdb dendrite-llm-db
```

### 2. Clone & Configure

```bash
git clone <your-repo-url> Dendrite-LLM
cd Dendrite-LLM

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env if your DB credentials differ
```

### 3. Start Everything

```bash
chmod +x start.sh stop.sh
./start.sh
```

This will:
- Create a Python venv & install backend deps
- Install frontend npm packages
- Launch backend on **:8001** and frontend on **:3000**

### 4. Stop

```bash
./stop.sh
```

---

## Configuration

All configuration is via **environment variables** (loaded from `backend/.env`):

| Variable              | Default                                            | Description                         |
|-----------------------|----------------------------------------------------|-------------------------------------|
| `DATABASE_URL`        | `postgresql://postgres:postgres@localhost:5432/dendrite-llm-db` | PostgreSQL connection string   |
| `OLLAMA_BASE_URL`     | `http://localhost:11434`                           | Ollama server URL                   |
| `OLLAMA_MODEL`        | `llama3.2:3b`                                      | Model to use for chat               |
| `OLLAMA_TIMEOUT`      | `120`                                              | Request timeout (seconds)           |
| `CONTEXT_WINDOW_SIZE` | `10`                                               | Past messages sent as context       |

Frontend API URL is set in `frontend/.env`:
```
VITE_API_BASE_URL=http://192.168.1.6:8001
```

---

## API Endpoints

| Method   | Path                         | Description                        |
|----------|------------------------------|------------------------------------|
| `GET`    | `/`                          | Health check                       |
| `POST`   | `/conversations`            | Create a new conversation          |
| `GET`    | `/conversations`             | List all conversations             |
| `GET`    | `/conversations/{id}`        | Get conversation with messages     |
| `DELETE` | `/conversations/{id}`        | Delete a conversation              |
| `POST`   | `/chat`                     | Send a message & get AI response   |

---

## Project Structure

```
Dendrite-LLM/
├── backend/
│   ├── config.py           # Settings from env vars
│   ├── database.py         # SQLAlchemy setup
│   ├── models.py           # ORM models
│   ├── schemas.py          # Pydantic schemas
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── conversations.py
│   │   └── chat.py
│   └── services/
│       └── ollama.py       # Ollama API client
├── frontend/
│   ├── src/
│   │   ├── api/client.js   # Axios API layer
│   │   ├── components/     # UI components
│   │   └── pages/Home.jsx  # Main page
│   ├── .env
│   └── package.json
├── start.sh                # Launch everything
├── stop.sh                 # Stop everything
└── README.md
```

---

## License

MIT
