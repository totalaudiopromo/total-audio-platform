#!/bin/bash
#
# Auto-Sync Notion Docs
# Syncs Notion workspace to local markdown files
#

set -e

REPO_ROOT="/Users/chrisschofield/workspace/active/total-audio-platform"
cd "$REPO_ROOT"

# Load environment variables (safer method)
if [ -f ".env" ]; then
  source <(grep -v '^#' .env | grep -v '^\s*$' | sed 's/^/export /')
fi

# Check if NOTION_API_KEY is set
if [ -z "$NOTION_API_KEY" ]; then
  echo "⚠️  NOTION_API_KEY not set - skipping Notion sync"
  exit 0
fi

# Run Notion export script
if [ -f "scripts/notion/export-pages.js" ]; then
  node scripts/notion/export-pages.js --input tools/notion/pages.json --out notion-docs > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ✅ Notion docs synced to notion-docs/"
  else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ❌ Notion sync failed"
  fi
else
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ⚠️  Export script not found"
fi