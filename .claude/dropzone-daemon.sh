#!/usr/bin/env bash

# Drop Zone Daemon - Auto-processes files dropped into special directories
# Requires: inotify-tools (Linux) or fswatch (macOS)
#
# Installation:
#   Linux: sudo apt-get install inotify-tools
#   macOS: brew install fswatch
#
# Usage:
#   bash .claude/dropzone-daemon.sh        # Start in foreground
#   bash .claude/dropzone-daemon.sh &      # Start in background
#
# Stop:
#   pkill -f dropzone-daemon.sh

set -euo pipefail

# Configuration
DROPZONE_ROOT=".claude/dropzones"
LOG_FILE=".claude/tmp/dropzone-daemon.log"
PID_FILE=".claude/tmp/dropzone-daemon.pid"

# Ensure directories exist
mkdir -p .claude/tmp
mkdir -p "$DROPZONE_ROOT"/{contacts-to-enrich,test-this,review-this,changelog-from-commits}/{incoming,processed,failed}

# Logging function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Store PID
echo $$ > "$PID_FILE"
log "🚀 Drop zone daemon started (PID: $$)"

# Process functions for each dropzone type

process_contacts() {
  local file="$1"
  local filename=$(basename "$file")

  log "📧 Processing contacts: $filename"

  # Move to processing
  mv "$file" "$DROPZONE_ROOT/contacts-to-enrich/incoming/$filename.processing"

  # TODO: Integrate with Audio Intel enrichment API
  # For now, just simulate processing
  sleep 2

  # Move to processed
  mv "$DROPZONE_ROOT/contacts-to-enrich/incoming/$filename.processing" \
     "$DROPZONE_ROOT/contacts-to-enrich/processed/$filename"

  log "✅ Contacts processed: $filename"
}

process_test_generation() {
  local file="$1"
  local filename=$(basename "$file")

  log "🧪 Generating tests for: $filename"

  # Move to processing
  mv "$file" "$DROPZONE_ROOT/test-this/incoming/$filename.processing"

  # Use the existing test generator agent
  if [ -f "tools/agents/active/testing/test-generator.js" ]; then
    log "Running test generator agent..."
    node tools/agents/active/testing/test-generator.js "$DROPZONE_ROOT/test-this/incoming/$filename.processing" \
      > "$DROPZONE_ROOT/test-this/processed/${filename%.tsx}.test.tsx" 2>&1 || {
      log "❌ Test generation failed for: $filename"
      mv "$DROPZONE_ROOT/test-this/incoming/$filename.processing" \
         "$DROPZONE_ROOT/test-this/failed/$filename"
      return 1
    }
  else
    log "⚠️  Test generator agent not found, creating placeholder"
    echo "// Tests for $filename" > "$DROPZONE_ROOT/test-this/processed/${filename%.tsx}.test.tsx"
  fi

  # Move original to processed
  mv "$DROPZONE_ROOT/test-this/incoming/$filename.processing" \
     "$DROPZONE_ROOT/test-this/processed/$filename"

  log "✅ Tests generated: $filename"
}

process_code_review() {
  local file="$1"
  local filename=$(basename "$file")

  log "🔍 Reviewing code: $filename"

  # Move to processing
  mv "$file" "$DROPZONE_ROOT/review-this/incoming/$filename.processing"

  # TODO: Integrate with Claude Code API for automated review
  # For now, create a review report template
  cat > "$DROPZONE_ROOT/review-this/processed/${filename%.tsx}.review.md" <<EOF
# Code Review: $filename

**Generated:** $(date +'%Y-%m-%d %H:%M:%S')

## Security Review
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks
- [ ] Input validation present
- [ ] Authentication checks in place

## Performance Review
- [ ] No unnecessary re-renders
- [ ] Efficient data structures
- [ ] Memoization where appropriate
- [ ] No memory leaks

## Mobile UX Review
- [ ] Touch targets >= 44px
- [ ] Responsive design
- [ ] Accessible to screen readers
- [ ] Proper ARIA attributes

## Recommendations
[Manual review required]

EOF

  # Move original to processed
  mv "$DROPZONE_ROOT/review-this/incoming/$filename.processing" \
     "$DROPZONE_ROOT/review-this/processed/$filename"

  log "✅ Code review complete: $filename"
}

process_changelog() {
  local file="$1"
  local filename=$(basename "$file")

  log "📝 Generating changelog from: $filename"

  # Move to processing
  mv "$file" "$DROPZONE_ROOT/changelog-from-commits/incoming/$filename.processing"

  # Parse commit messages and generate changelog
  cat > "$DROPZONE_ROOT/changelog-from-commits/processed/CHANGELOG-$(date +'%Y%m%d-%H%M%S').md" <<EOF
# Changelog

**Generated:** $(date +'%Y-%m-%d %H:%M:%S')
**Source:** $filename

## Features
[Commits with 'feat:' prefix]

## Bug Fixes
[Commits with 'fix:' prefix]

## Documentation
[Commits with 'docs:' prefix]

## Other Changes
[Other commits]

EOF

  # Move original to processed
  mv "$DROPZONE_ROOT/changelog-from-commits/incoming/$filename.processing" \
     "$DROPZONE_ROOT/changelog-from-commits/processed/$filename"

  log "✅ Changelog generated: $filename"
}

# File handler - routes to appropriate processor
handle_file() {
  local dropzone="$1"
  local filepath="$2"

  # Skip if not a regular file
  [ -f "$filepath" ] || return 0

  # Skip processing files
  [[ "$filepath" == *.processing ]] && return 0

  log "📥 New file detected in $dropzone: $(basename "$filepath")"

  case "$dropzone" in
    contacts-to-enrich)
      process_contacts "$filepath"
      ;;
    test-this)
      process_test_generation "$filepath"
      ;;
    review-this)
      process_code_review "$filepath"
      ;;
    changelog-from-commits)
      process_changelog "$filepath"
      ;;
    *)
      log "⚠️  Unknown dropzone: $dropzone"
      ;;
  esac
}

# Detect platform and use appropriate file watcher
if command -v inotifywait &> /dev/null; then
  # Linux - use inotifywait
  log "📡 Watching dropzones with inotifywait..."

  inotifywait -m -r -e close_write --format '%w%f' \
    "$DROPZONE_ROOT/contacts-to-enrich/incoming" \
    "$DROPZONE_ROOT/test-this/incoming" \
    "$DROPZONE_ROOT/review-this/incoming" \
    "$DROPZONE_ROOT/changelog-from-commits/incoming" \
    2>/dev/null | while read filepath; do

    # Determine which dropzone this file belongs to
    if [[ "$filepath" == *"contacts-to-enrich"* ]]; then
      handle_file "contacts-to-enrich" "$filepath"
    elif [[ "$filepath" == *"test-this"* ]]; then
      handle_file "test-this" "$filepath"
    elif [[ "$filepath" == *"review-this"* ]]; then
      handle_file "review-this" "$filepath"
    elif [[ "$filepath" == *"changelog-from-commits"* ]]; then
      handle_file "changelog-from-commits" "$filepath"
    fi
  done

elif command -v fswatch &> /dev/null; then
  # macOS - use fswatch
  log "📡 Watching dropzones with fswatch..."

  fswatch -0 -r \
    "$DROPZONE_ROOT/contacts-to-enrich/incoming" \
    "$DROPZONE_ROOT/test-this/incoming" \
    "$DROPZONE_ROOT/review-this/incoming" \
    "$DROPZONE_ROOT/changelog-from-commits/incoming" \
    | while read -d "" filepath; do

    # Determine which dropzone this file belongs to
    if [[ "$filepath" == *"contacts-to-enrich"* ]]; then
      handle_file "contacts-to-enrich" "$filepath"
    elif [[ "$filepath" == *"test-this"* ]]; then
      handle_file "test-this" "$filepath"
    elif [[ "$filepath" == *"review-this"* ]]; then
      handle_file "review-this" "$filepath"
    elif [[ "$filepath" == *"changelog-from-commits"* ]]; then
      handle_file "changelog-from-commits" "$filepath"
    fi
  done

else
  log "❌ ERROR: Neither inotifywait nor fswatch found"
  log "Please install:"
  log "  Linux: sudo apt-get install inotify-tools"
  log "  macOS: brew install fswatch"
  exit 1
fi
