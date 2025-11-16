#!/bin/bash
#
# wt - Git Worktree wrapper for parallel Claude development
# IndyDevDan's signature parallelization technique
#
# Usage: bash .claude/scripts/git/wt.sh "task description"
# Example: bash .claude/scripts/git/wt.sh "fix mobile UX issues"
#

set -e

TASK_DESCRIPTION="$1"

if [ -z "$TASK_DESCRIPTION" ]; then
  echo "❌ Error: Task description required"
  echo ""
  echo "Usage: bash .claude/scripts/git/wt.sh \"task description\""
  echo ""
  echo "Examples:"
  echo "  bash .claude/scripts/git/wt.sh \"fix mobile UX\""
  echo "  bash .claude/scripts/git/wt.sh \"add new tests\""
  echo "  bash .claude/scripts/git/wt.sh \"update docs\""
  echo ""
  exit 1
fi

# Get repository root
REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"

# Create branch name from task description
BRANCH_NAME="feature/$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')-$(date +%s)"

# Create worktree directory (sibling to main repo)
WORKTREE_DIR="$(dirname "$REPO_ROOT")/worktrees/$REPO_NAME-$BRANCH_NAME"

echo ""
echo "🌳 Creating worktree for: $TASK_DESCRIPTION"
echo ""
echo "📍 Location: $WORKTREE_DIR"
echo "🌿 Branch: $BRANCH_NAME"
echo ""

# Create worktree
git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME"

# Copy Claude configuration to worktree
if [ -d ".claude" ]; then
  cp -r .claude "$WORKTREE_DIR/.claude"
  echo "📋 Copied .claude configuration"
fi

# Create task-specific context file
cat > "$WORKTREE_DIR/.claude/TASK.md" <<EOF
# Task: $TASK_DESCRIPTION

**Branch:** $BRANCH_NAME
**Created:** $(date '+%Y-%m-%d %H:%M:%S')
**Worktree:** $WORKTREE_DIR

---

## Your Only Job This Session

$TASK_DESCRIPTION

---

## Quick Commands

\`\`\`bash
# Test your changes
pnpm test

# Build
pnpm build

# Lint and typecheck
pnpm run lint
pnpm run typecheck

# Commit your work
git add .
git commit -m "feat: $TASK_DESCRIPTION"

# Push to remote
git push -u origin $BRANCH_NAME

# Create pull request
gh pr create --base main --fill
\`\`\`

---

## When Done

1. Commit and push your changes
2. Create a pull request
3. Return to main worktree: \`cd $REPO_ROOT\`
4. Clean up this worktree: \`git worktree remove $WORKTREE_DIR\`

---

**Tip:** This worktree is isolated. Work here without affecting the main repository.
EOF

echo "📝 Created TASK.md with instructions"
echo ""

# Determine terminal emulator and open new window
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - use Terminal.app or iTerm2
  if command -v osascript &> /dev/null; then
    osascript <<EOF_OSASCRIPT
tell application "Terminal"
    do script "cd '$WORKTREE_DIR' && clear && cat .claude/TASK.md && echo '' && echo '🚀 Ready to work on: $TASK_DESCRIPTION' && echo '' && exec \$SHELL"
    activate
end tell
EOF_OSASCRIPT
    echo "✅ Opened new Terminal window"
  fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux - try various terminal emulators
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --working-directory="$WORKTREE_DIR" -- bash -c "cat .claude/TASK.md && echo '' && echo '🚀 Ready to work on: $TASK_DESCRIPTION' && echo '' && exec bash" &
    echo "✅ Opened new gnome-terminal window"
  elif command -v konsole &> /dev/null; then
    konsole --workdir "$WORKTREE_DIR" -e bash -c "cat .claude/TASK.md && echo '' && echo '🚀 Ready to work on: $TASK_DESCRIPTION' && echo '' && exec bash" &
    echo "✅ Opened new konsole window"
  elif command -v xterm &> /dev/null; then
    xterm -e "cd '$WORKTREE_DIR' && cat .claude/TASK.md && echo '' && echo '🚀 Ready to work on: $TASK_DESCRIPTION' && echo '' && exec bash" &
    echo "✅ Opened new xterm window"
  else
    echo "⚠️  Could not auto-open terminal. Manually run:"
    echo "   cd $WORKTREE_DIR"
  fi
else
  echo "⚠️  Platform not supported for auto-open. Manually run:"
  echo "   cd $WORKTREE_DIR"
fi

echo ""
echo "✅ Worktree created successfully!"
echo ""
echo "📂 Next steps:"
echo "   1. Work in the new terminal window"
echo "   2. Code, test, commit as usual"
echo "   3. Push and create PR when done"
echo "   4. Clean up: git worktree remove $WORKTREE_DIR"
echo ""
echo "💡 Tip: You can create multiple worktrees for parallel work!"
echo ""
