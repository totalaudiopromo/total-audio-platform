#!/bin/bash
#
# Clean up a git worktree
# Usage: bash .claude/scripts/git/cleanup-worktree.sh <worktree-path>
#

set -e

WORKTREE_PATH="$1"

if [ -z "$WORKTREE_PATH" ]; then
  echo "❌ Error: Worktree path required"
  echo ""
  echo "Usage: bash .claude/scripts/git/cleanup-worktree.sh <worktree-path>"
  echo ""
  echo "Available worktrees:"
  git worktree list
  echo ""
  exit 1
fi

echo ""
echo "🧹 Cleaning up worktree: $WORKTREE_PATH"
echo ""

# Remove the worktree
git worktree remove "$WORKTREE_PATH"

echo "✅ Worktree removed"
echo ""
