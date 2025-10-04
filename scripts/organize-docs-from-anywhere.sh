#!/bin/bash

# TAP Documentation Organizer - Works from ANY directory
# 
# This script finds the monorepo root and runs the organizer
# Usage:
#   bash scripts/organize-docs-from-anywhere.sh [--dry-run] [--verbose] [app-name]
#
# Or create an alias in your shell:
#   alias organize-docs='bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh'

set -e

# Find the monorepo root (look for package.json with workspaces)
find_repo_root() {
  local current_dir="$PWD"
  
  while [[ "$current_dir" != "/" ]]; do
    if [[ -f "$current_dir/package.json" ]] && grep -q '"workspaces"' "$current_dir/package.json" 2>/dev/null; then
      echo "$current_dir"
      return 0
    fi
    current_dir=$(dirname "$current_dir")
  done
  
  echo "Error: Could not find monorepo root (looking for package.json with workspaces)" >&2
  exit 1
}

REPO_ROOT=$(find_repo_root)

echo "📂 Found monorepo root: $REPO_ROOT"
echo ""

cd "$REPO_ROOT"
node scripts/organize-docs.js "$@"

