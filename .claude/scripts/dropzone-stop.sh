#!/usr/bin/env bash

# Stop the drop zone daemon

set -euo pipefail

PID_FILE=".claude/tmp/dropzone-daemon.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "⚠️  Drop zone daemon is not running (no PID file found)"
  exit 0
fi

PID=$(cat "$PID_FILE")

if ! kill -0 "$PID" 2>/dev/null; then
  echo "⚠️  Drop zone daemon is not running (PID $PID not found)"
  rm "$PID_FILE"
  exit 0
fi

echo "🛑 Stopping drop zone daemon (PID: $PID)..."
kill "$PID"

# Wait for process to stop
for i in {1..5}; do
  if ! kill -0 "$PID" 2>/dev/null; then
    rm "$PID_FILE"
    echo "✅ Drop zone daemon stopped successfully"
    exit 0
  fi
  sleep 1
done

# Force kill if still running
if kill -0 "$PID" 2>/dev/null; then
  echo "⚠️  Process didn't stop gracefully, force killing..."
  kill -9 "$PID"
  rm "$PID_FILE"
  echo "✅ Drop zone daemon stopped (force killed)"
else
  rm "$PID_FILE"
  echo "✅ Drop zone daemon stopped successfully"
fi
