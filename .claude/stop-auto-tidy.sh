#!/bin/bash
#
# Stop auto-tidy daemon
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PID_FILE=".claude/tmp/auto-tidy.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "⚠️  Auto-tidy daemon not running (no PID file)"
  exit 0
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
  kill "$PID"
  rm "$PID_FILE"
  echo "✅ Auto-tidy daemon stopped (PID: $PID)"
else
  echo "⚠️  Auto-tidy daemon not running (stale PID)"
  rm "$PID_FILE"
fi
