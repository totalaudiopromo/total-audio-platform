#!/bin/bash

set -euo pipefail

echo "=== Audio Intel Enrichment Setup ==="

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT_DIR/apps/audio-intel"

if [ ! -d "$APP_DIR" ]; then
  echo "❌ Audio Intel app not found at $APP_DIR"
  exit 1
fi

echo "📦 Installing workspace deps (this may take a minute)"
cd "$ROOT_DIR"
npm install --silent

echo "📦 Ensuring Audio Intel deps are installed"
npm run install:audio-intel --silent || true

echo "🔧 Preparing environment (.env.local)"
cd "$APP_DIR"
if [ ! -f ".env.local" ]; then
  echo "➡️  Creating .env.local from setup script"
  bash ./setup-env.sh >/dev/null 2>&1 || true
else
  echo "ℹ️  .env.local already exists — leaving as is"
fi

echo "🧪 Verifying enrichment API availability"
DEV_PID=""

# Start dev server in background if not already running
if ! nc -z localhost 3000 >/dev/null 2>&1; then
  echo "🚀 Starting Audio Intel dev server on http://localhost:3000"
  npm run dev >/dev/null 2>&1 &
  DEV_PID=$!
  # Wait for server to become ready (max ~30s)
  for i in {1..60}; do
    if curl -sSf "http://localhost:3000/api/enrich-claude" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

if curl -sSf "http://localhost:3000/api/enrich-claude" >/dev/null 2>&1; then
  echo "✅ Enrichment API reachable: /api/enrich-claude"
else
  echo "❌ Enrichment API not reachable. Check dev server logs and .env.local"
  [ -n "$DEV_PID" ] && kill "$DEV_PID" >/dev/null 2>&1 || true
  exit 1
fi

echo "✨ Setup complete. You can now run:"
echo "   npm run audio-intel:enrich -- --input apps/audio-intel/sample-contacts.csv"

# Do not keep the dev server running from setup
[ -n "$DEV_PID" ] && kill "$DEV_PID" >/dev/null 2>&1 || true

exit 0
































