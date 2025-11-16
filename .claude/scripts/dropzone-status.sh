#!/usr/bin/env bash

# Check status of drop zone daemon

set -euo pipefail

PID_FILE=".claude/tmp/dropzone-daemon.pid"
LOG_FILE=".claude/tmp/dropzone-daemon.log"

echo "🔍 Drop Zone Daemon Status"
echo ""

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
  echo "Status: ❌ Not running (no PID file)"
  exit 0
fi

PID=$(cat "$PID_FILE")

# Check if process is running
if ! kill -0 "$PID" 2>/dev/null; then
  echo "Status: ❌ Not running (PID $PID not found)"
  echo "⚠️  Stale PID file exists - run dropzone-start.sh to restart"
  exit 0
fi

echo "Status: ✅ Running (PID: $PID)"
echo ""

# Show dropzone directories and file counts
echo "📁 Dropzone Status:"
echo ""

for dropzone in contacts-to-enrich test-this review-this changelog-from-commits; do
  INCOMING_COUNT=$(find ".claude/dropzones/$dropzone/incoming" -type f ! -name "*.processing" 2>/dev/null | wc -l || echo 0)
  PROCESSED_COUNT=$(find ".claude/dropzones/$dropzone/processed" -type f 2>/dev/null | wc -l || echo 0)
  FAILED_COUNT=$(find ".claude/dropzones/$dropzone/failed" -type f 2>/dev/null | wc -l || echo 0)

  echo "  $dropzone:"
  echo "    Incoming: $INCOMING_COUNT files"
  echo "    Processed: $PROCESSED_COUNT files"
  echo "    Failed: $FAILED_COUNT files"
  echo ""
done

# Show recent log entries
if [ -f "$LOG_FILE" ]; then
  echo "📋 Recent Activity (last 5 lines):"
  tail -5 "$LOG_FILE" | sed 's/^/  /'
  echo ""
  echo "View full logs: tail -f $LOG_FILE"
fi
