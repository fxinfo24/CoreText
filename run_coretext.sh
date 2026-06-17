#!/usr/bin/env bash
set -e

# CoreText directory (portable)
CORETEXT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Terminate background jobs on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "=================================================================="
echo "🚀 Booting CoreText Executive OS Full-Stack Compounding Platform"
echo "=================================================================="

# 1. Start Python FastAPI Backend in background
echo "⚡ Checking Python FastAPI environment (http://localhost:8000) ..."
cd "$CORETEXT_DIR/backend"

if [ ! -d ".venv" ]; then
  echo "🛠️ Creating Python virtual environment and installing backend packages..."
  python3 -m venv .venv
  ./.venv/bin/pip install --upgrade pip
  ./.venv/bin/pip install -r requirements.txt
fi

echo "⚡ Launching Python FastAPI server in background..."
./.venv/bin/python3 run.py &
FASTAPI_PID=$!

# Wait 3 seconds for backend boot
sleep 3

# 2. Start React + Vite Frontend
echo "🌐 Checking React Vite UI Proxy environment (http://localhost:3000) ..."
cd "$CORETEXT_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "🛠️ Installing frontend UI npm packages..."
  npm install
fi

echo "🌐 Launching React Vite UI Server..."
npm run dev