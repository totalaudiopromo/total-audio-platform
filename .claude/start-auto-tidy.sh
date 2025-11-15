#!/bin/bash
#
# Start auto-tidy daemon in background
# Runs automatically, checks every 30 minutes, keeps directory clean
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PID_FILE=".claude/tmp/auto-tidy.pid"
LOG_FILE=".claude/tmp/auto-tidy.log"

mkdir -p .claude/tmp

# Check if already running
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if ps -p "$OLD_PID" > /dev/null 2>&1; then
    echo "⚠️  Auto-tidy daemon already running (PID: $OLD_PID)"
    echo "   To restart: bash .claude/stop-auto-tidy.sh && bash .claude/start-auto-tidy.sh"
    exit 0
  else
    echo "🧹 Removing stale PID file..."
    rm "$PID_FILE"
  fi
fi

# Start daemon in background
nohup bash .claude/auto-tidy-daemon.sh daemon >> "$LOG_FILE" 2>&1 &
NEW_PID=$!

# Save PID
echo "$NEW_PID" > "$PID_FILE"

echo ""
echo "✅ Auto-tidy daemon started (PID: $NEW_PID)"
echo ""
echo "📋 Status:"
echo "   • Checks directory every 30 minutes"
echo "   • Automatically archives old completion/status files"
echo "   • Logs: $LOG_FILE"
echo "   • Reports: .claude/tmp/tidy-report-*.md"
echo ""
echo "🛠️  Management:"
echo "   • Stop: bash .claude/stop-auto-tidy.sh"
echo "   • Status: bash .claude/tidy-status.sh"
echo "   • Run now: bash .claude/tidy-now.sh"
echo ""
