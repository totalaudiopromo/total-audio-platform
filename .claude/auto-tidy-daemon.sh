#!/bin/bash
#
# Auto-Tidy Daemon - Automatically cleans up directory mess
# Runs in background, applies rules from auto-tidy-rules.json
# SAFE: Never deletes, only moves files to archive/
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

RULES_FILE=".claude/auto-tidy-rules.json"
LOG_FILE=".claude/tmp/auto-tidy.log"
REPORT_FILE=".claude/tmp/tidy-report-$(date +%Y%m%d-%H%M%S).md"

mkdir -p .claude/tmp

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if file is protected
is_protected() {
  local file="$1"
  local basename=$(basename "$file")

  # Check protected files
  if echo "$basename" | grep -qE "^(README|SECURITY|CHANGELOG|AUDIO_INTEL_CONTEXT|BUSINESS_NOTES|WEEKLY_FOCUS|DEPLOYMENT|INCIDENTS|LICENSE)\.md$"; then
    return 0
  fi

  # Check protected directories
  if echo "$file" | grep -qE "^(\.git|node_modules|apps|packages|tools|scripts|\.claude|\.github)/"; then
    return 0
  fi

  return 1
}

# Archive a file
archive_file() {
  local file="$1"
  local destination="$2"
  local reason="$3"

  # Replace placeholders in destination
  local year=$(date +%Y)
  local month=$(date +%m)
  destination="${destination//\{year\}/$year}"
  destination="${destination//\{month\}/$month}"

  # Create destination directory
  mkdir -p "$destination"

  # Move file
  local basename=$(basename "$file")
  local target="$destination/$basename"

  # If file exists at target, append timestamp
  if [ -f "$target" ]; then
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local name="${basename%.*}"
    local ext="${basename##*.}"
    target="$destination/${name}-${timestamp}.${ext}"
  fi

  mv "$file" "$target"

  echo "  ✓ $file → $target" >> "$REPORT_FILE"
  echo "    Reason: $reason" >> "$REPORT_FILE"

  return 0
}

# Main tidy function
run_tidy() {
  local changes_made=0

  echo "# Auto-Tidy Report" > "$REPORT_FILE"
  echo "**Date:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"

  log "🧹 Starting auto-tidy..."

  # Rule 1: Archive completion files
  for file in *_COMPLETE.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/completed-tasks/$(date +%Y)" "Task completion documentation"
      ((changes_made++))
    fi
  done

  # Rule 2: Archive summary files
  for file in *_SUMMARY.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/summaries/$(date +%Y)" "Session/phase summary"
      ((changes_made++))
    fi
  done

  # Rule 3: Archive phase files
  for file in PHASE_*.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/phases/$(date +%Y)" "Development phase documentation"
      ((changes_made++))
    fi
  done

  # Rule 4: Archive status files
  for file in *_STATUS.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/status-reports/$(date +%Y)" "Status snapshot"
      ((changes_made++))
    fi
  done

  # Rule 5: Archive test output files
  for file in test-*.txt; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/test-outputs/$(date +%Y)/$(date +%m)" "Test run output"
      ((changes_made++))
    fi
  done

  # Rule 6: Archive deployment debug files
  for file in *DEPLOY*.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file" && [ "$file" != "DEPLOYMENT.md" ]; then
      archive_file "$file" "archive/deployment/$(date +%Y)" "Deployment debugging"
      ((changes_made++))
    fi
  done

  # Rule 7: Archive demo/audit files (but not current ones)
  for file in *DEMO*.md; do
    [ -e "$file" ] || continue
    # Keep DEMO files less than 7 days old
    if [ $(find "$file" -mtime +7 2>/dev/null | wc -l) -gt 0 ]; then
      if ! is_protected "$file"; then
        archive_file "$file" "archive/demos/$(date +%Y)" "Demo preparation (>7 days old)"
        ((changes_made++))
      fi
    fi
  done

  # Rule 8: Archive audit files (older than 30 days)
  for file in *AUDIT*.md; do
    [ -e "$file" ] || continue
    if [ $(find "$file" -mtime +30 2>/dev/null | wc -l) -gt 0 ]; then
      if ! is_protected "$file"; then
        archive_file "$file" "archive/audits/$(date +%Y)" "Audit report (>30 days old)"
        ((changes_made++))
      fi
    fi
  done

  # Rule 9: Archive migration files
  for file in MIGRATION*.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/migrations/$(date +%Y)" "Migration documentation"
      ((changes_made++))
    fi
  done

  # Rule 10: Archive fix tracking files
  for file in FIX_*.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/fixes/$(date +%Y)/$(date +%m)" "Issue fix tracking"
      ((changes_made++))
    fi
  done

  # Rule 11: Archive final-* files
  for file in final-*.txt final-*.md; do
    [ -e "$file" ] || continue
    if ! is_protected "$file"; then
      archive_file "$file" "archive/test-outputs/$(date +%Y)/$(date +%m)" "Final test output"
      ((changes_made++))
    fi
  done

  # Summary
  echo "" >> "$REPORT_FILE"
  echo "## Summary" >> "$REPORT_FILE"
  echo "- **Files archived:** $changes_made" >> "$REPORT_FILE"
  echo "- **Root directory files remaining:** $(ls -1 *.md 2>/dev/null | wc -l)" >> "$REPORT_FILE"

  if [ $changes_made -gt 0 ]; then
    log "✅ Auto-tidy complete: $changes_made files archived"
    echo ""
    echo -e "${GREEN}🧹 Auto-Tidy Complete${NC}"
    echo -e "   Archived: ${YELLOW}$changes_made${NC} files"
    echo -e "   Report: ${BLUE}$REPORT_FILE${NC}"
    echo ""

    # Show report
    cat "$REPORT_FILE"
  else
    log "✓ Auto-tidy complete: directory already clean"
  fi

  return $changes_made
}

# Daemon mode - run continuously
daemon_mode() {
  log "🤖 Auto-tidy daemon started (checking every 30 minutes)"
  echo "Press Ctrl+C to stop"

  while true; do
    run_tidy
    sleep 1800  # 30 minutes
  done
}

# One-shot mode - run once
oneshot_mode() {
  run_tidy
}

# Main execution
case "${1:-daemon}" in
  daemon)
    daemon_mode
    ;;
  once)
    oneshot_mode
    ;;
  *)
    echo "Usage: $0 [daemon|once]"
    echo "  daemon - Run continuously (default)"
    echo "  once   - Run once and exit"
    exit 1
    ;;
esac
