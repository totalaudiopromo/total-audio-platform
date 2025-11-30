#!/bin/bash
#
# TAP Session Start Script
# Displays context and priorities at the start of each coding session
#

# Configuration - adjust if repo location changes
TAP_ROOT="${TAP_ROOT:-/Users/chrisschofield/workspace/active/total-audio-platform}"
STATE_FILE="$TAP_ROOT/.claude/tmp/session-state.txt"

# Ensure tmp directory exists
mkdir -p "$TAP_ROOT/.claude/tmp"

# Navigate to repo
cd "$TAP_ROOT" || { echo "Error: Cannot access $TAP_ROOT"; exit 1; }

# Header
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    TAP SESSION START                          ║"
echo "║                $(date '+%A, %d %B %Y %H:%M')                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Weekly Focus (first 50 lines)
echo "📋 WEEKLY FOCUS (first 50 lines):"
echo "─────────────────────────────────"
head -50 WEEKLY_FOCUS.md 2>/dev/null || echo "WEEKLY_FOCUS.md not found"
echo ""
echo "─────────────────────────────────"
echo ""

# Git status
echo "🔀 GIT STATUS:"
echo "─────────────"
git status --short --branch
echo ""

# Last session state
if [[ -f "$STATE_FILE" ]]; then
    echo "📝 LAST SESSION:"
    echo "────────────────"
    # Get the last session block (everything after the last "---")
    tac "$STATE_FILE" | sed '/^---$/q' | tac | tail -n +2
    echo ""
fi

# Revenue reminder
echo "╭────────────────────────────────────────────────────────────────╮"
echo "│  💰 REVENUE CHECK: What will you do TODAY to get closer       │"
echo "│     to £500/month?                                            │"
echo "│                                                                │"
echo "│  Current: £0/month  →  Target: £500/month                     │"
echo "╰────────────────────────────────────────────────────────────────╯"
echo ""
