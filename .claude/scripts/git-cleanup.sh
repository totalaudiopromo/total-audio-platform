#!/bin/bash
#
# Git Branch Cleanup
# Removes merged branches and prunes stale remote refs
#

# Auto-detect repo root (portable)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TAP_ROOT="${TAP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
cd "$TAP_ROOT" || exit 1

DRY_RUN=${1:-"--dry-run"}

echo "🧹 Git Branch Cleanup"
echo "────────────────────"
echo ""

# Fetch and prune remote refs
echo "Fetching and pruning remote refs..."
git fetch --prune
echo ""

# Find merged branches
MERGED=$(git branch --merged main 2>/dev/null | grep -v -E "^\*|main|develop|master")

if [[ -z "$MERGED" ]]; then
    echo "✅ No merged branches to clean up"
    echo ""

    # Also show experiment/claude branches that might be stale
    echo "Checking for stale exp/ and claude/ branches..."
    STALE=$(git branch | grep -E "^[* ]*(exp|claude)[/-]" | sed 's/^[* ]*//' | head -10)
    if [[ -n "$STALE" ]]; then
        echo "Found potential stale branches (not auto-deleted):"
        echo "$STALE"
        echo ""
        echo "To delete manually: git branch -d <branch-name>"
    fi
    exit 0
fi

echo "Branches merged into main:"
echo "$MERGED"
echo ""

if [[ "$DRY_RUN" == "--live" ]]; then
    echo "Deleting branches..."
    echo "$MERGED" | xargs git branch -d
    echo ""
    echo "✅ Cleanup complete"
else
    echo "───────────────────────────────────────"
    echo "DRY RUN MODE - no branches deleted"
    echo ""
    echo "To actually delete these branches, run:"
    echo "  .claude/scripts/git-cleanup.sh --live"
    echo ""
fi

# Show worktree status
echo ""
echo "📁 Worktree status:"
git worktree list
echo ""
echo "To prune stale worktrees: git worktree prune"
