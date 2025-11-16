#!/usr/bin/env bash

# Start the drop zone daemon in the background

set -euo pipefail

DAEMON_SCRIPT=".claude/dropzone-daemon.sh"
PID_FILE=".claude/tmp/dropzone-daemon.pid"
LOG_FILE=".claude/tmp/dropzone-daemon.log"

# Check if already running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "❌ Drop zone daemon is already running (PID: $PID)"
    exit 1
  else
    echo "⚠️  Stale PID file found, removing..."
    rm "$PID_FILE"
  fi
fi

# Check for required dependencies
if ! command -v inotifywait &> /dev/null && ! command -v fswatch &> /dev/null; then
  echo "❌ ERROR: Neither inotifywait nor fswatch found"
  echo ""
  echo "Please install the appropriate tool:"
  echo "  Linux: sudo apt-get install inotify-tools"
  echo "  macOS: brew install fswatch"
  exit 1
fi

# Start daemon in background
echo "🚀 Starting drop zone daemon..."
bash "$DAEMON_SCRIPT" >> "$LOG_FILE" 2>&1 &
DAEMON_PID=$!

# Wait a moment to ensure it started successfully
sleep 1

if kill -0 "$DAEMON_PID" 2>/dev/null; then
  echo "✅ Drop zone daemon started successfully (PID: $DAEMON_PID)"
  echo ""
  echo "Drop files into these directories for auto-processing:"
  echo "  📧 .claude/dropzones/contacts-to-enrich/incoming/"
  echo "  🧪 .claude/dropzones/test-this/incoming/"
  echo "  🔍 .claude/dropzones/review-this/incoming/"
  echo "  📝 .claude/dropzones/changelog-from-commits/incoming/"
  echo ""
  echo "View logs: tail -f $LOG_FILE"
  echo "Stop daemon: bash .claude/scripts/dropzone-stop.sh"
else
  echo "❌ Failed to start drop zone daemon"
  echo "Check logs: cat $LOG_FILE"
  exit 1
fi
