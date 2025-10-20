#!/bin/bash

# Context Preservation Script for Claude Code Sessions
# Run before conversation compacting to save critical state

echo "🧠 Preserving Claude Code Session Context..."

# Save current session memory
node tools/agents/memory-persistence-agent.js save "Audio Intel Development" "Sprint Week Active"

# Create context snapshot
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT_DIR="session-snapshots/$TIMESTAMP"
mkdir -p "$SNAPSHOT_DIR"

# Save critical files
cp CLAUDE.md "$SNAPSHOT_DIR/"
cp docs/BUSINESS_CONTEXT.md "$SNAPSHOT_DIR/"
cp package.json "$SNAPSHOT_DIR/"

# Save agent states
if [ -f tools/agents/session-memory.json ]; then
    cp tools/agents/session-memory.json "$SNAPSHOT_DIR/"
fi

# Save current git status
git status --porcelain > "$SNAPSHOT_DIR/git_status.txt"
git log -n 5 --oneline > "$SNAPSHOT_DIR/recent_commits.txt"

# Save MCP server status
claude mcp list > "$SNAPSHOT_DIR/mcp_status.txt" 2>&1

# Save agent health
npm run agents:health > "$SNAPSHOT_DIR/agent_health.txt" 2>&1

# Create restoration script
cat > "$SNAPSHOT_DIR/restore_session.md" << 'EOF'
# Session Restoration Guide

## Quick Context Recovery
1. Read `CLAUDE_CODE_SESSION_CONTEXT.md` for current development focus
2. Load session memory: `node tools/agents/memory-persistence-agent.js load`
3. Check agent health: `npm run agents:health`
4. Verify MCP servers: `claude mcp list`

## Critical Reminders
- Primary focus: Audio Intel contact enrichment SaaS
- Main workspace: /Users/chrisschofield/workspace/active/total-audio-platform/
- Development command: `npm run dev:audio-intel`
- Plan Mode protocol: PLAN → REVIEW → EXECUTE → TEST → DOCUMENT

## Current State Files
- Primary guide: CLAUDE.md (comprehensive project documentation)
- Business context: docs/BUSINESS_CONTEXT.md
- Session memory: tools/agents/session-memory.json
EOF

echo "✅ Context preserved in: $SNAPSHOT_DIR"
echo "🔄 Run the following to restore context after compacting:"
echo "   cat $SNAPSHOT_DIR/restore_session.md"
echo "   node tools/agents/memory-persistence-agent.js load"