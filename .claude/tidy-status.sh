#!/bin/bash
#
# Check auto-tidy daemon status
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PID_FILE=".claude/tmp/auto-tidy.pid"
LOG_FILE=".claude/tmp/auto-tidy.log"

echo ""
echo "🧹 Auto-Tidy Status"
echo ""

# Check if daemon is running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p "$PID" > /dev/null 2>&1; then
    echo "✅ Daemon running (PID: $PID)"

    # Show uptime
    START_TIME=$(ps -p "$PID" -o lstart= 2>/dev/null)
    echo "   Started: $START_TIME"
  else
    echo "❌ Daemon not running (stale PID file)"
  fi
else
  echo "❌ Daemon not running"
fi

echo ""
echo "📊 Directory status:"
echo "   Root .md files: $(ls -1 *.md 2>/dev/null | wc -l)"
echo "   Root .txt files: $(ls -1 *.txt 2>/dev/null | wc -l)"

echo ""
echo "📂 Archive contents:"
if [ -d "archive" ]; then
  find archive -type f 2>/dev/null | wc -l | xargs -I {} echo "   Total archived files: {}"
  find archive -type d -maxdepth 2 2>/dev/null | while read dir; do
    count=$(find "$dir" -type f 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
      echo "   $dir: $count files"
    fi
  done
else
  echo "   No archive directory yet"
fi

echo ""
echo "📝 Recent activity:"
if [ -f "$LOG_FILE" ]; then
  tail -n 5 "$LOG_FILE" | while read line; do
    echo "   $line"
  done
else
  echo "   No activity yet"
fi

echo ""
echo "📋 Latest report:"
LATEST_REPORT=$(ls -t .claude/tmp/tidy-report-*.md 2>/dev/null | head -n 1)
if [ -n "$LATEST_REPORT" ]; then
  echo "   $LATEST_REPORT"
  echo ""
  cat "$LATEST_REPORT" | head -n 20
else
  echo "   No reports yet"
fi

echo ""
