#!/bin/bash
#
# TAP Session End Script
# Records session work and next priorities
#

# Configuration - auto-detect repo root (portable)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TAP_ROOT="${TAP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
STATE_FILE="$TAP_ROOT/.claude/tmp/session-state.txt"

# Ensure tmp directory exists
mkdir -p "$TAP_ROOT/.claude/tmp"

# Navigate to repo
cd "$TAP_ROOT" || { echo "Error: Cannot access $TAP_ROOT"; exit 1; }

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     TAP SESSION END                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Prompt for session summary
echo "What did you work on? (one line):"
read -r WORKED_ON

echo ""
echo "What is the next priority? (one line):"
read -r NEXT_PRIORITY

# Get current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Append to session state
echo "" >> "$STATE_FILE"
echo "---" >> "$STATE_FILE"
echo "Session: $(date '+%Y-%m-%d %H:%M')" >> "$STATE_FILE"
echo "Branch: $BRANCH" >> "$STATE_FILE"
echo "Worked on: $WORKED_ON" >> "$STATE_FILE"
echo "Next: $NEXT_PRIORITY" >> "$STATE_FILE"

echo ""
echo "✅ Session recorded"
echo ""

# Show git status as reminder
echo "🔀 GIT STATUS (reminder to commit/stash):"
echo "──────────────────────────────────────────"
git status --short
echo ""

# Count uncommitted changes
CHANGES=$(git status --short | wc -l | tr -d ' ')
if [[ "$CHANGES" -gt 0 ]]; then
    echo "⚠️  You have $CHANGES uncommitted changes"
    echo ""
fi
