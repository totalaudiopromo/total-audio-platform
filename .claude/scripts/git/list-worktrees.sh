#!/bin/bash
#
# List all active git worktrees
#

set -e

echo ""
echo "🌳 Active Git Worktrees"
echo ""

git worktree list

echo ""
echo "💡 To remove a worktree:"
echo "   git worktree remove <path>"
echo ""
