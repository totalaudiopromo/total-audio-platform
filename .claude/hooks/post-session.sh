#!/bin/bash
#
# Post-Session Hook - Auto-sync Notion docs after each Claude Code session
# This runs automatically when Claude Code session ends
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "📝 Syncing Notion docs..."
echo ""

# Check if NOTION_API_KEY is set
if [ -z "$NOTION_API_KEY" ]; then
  echo "⚠️  NOTION_API_KEY not set - skipping Notion sync"
  exit 0
fi

# Run Notion export script
if [ -f "scripts/notion/export-pages.js" ]; then
  node scripts/notion/export-pages.js --input tools/notion/pages.json --out notion-docs

  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Notion docs synced to notion-docs/"
    echo "   Last sync: $(date '+%Y-%m-%d %H:%M:%S')"
  else
    echo "❌ Notion sync failed"
  fi
else
  echo "⚠️  Export script not found at scripts/notion/export-pages.js"
fi

echo ""