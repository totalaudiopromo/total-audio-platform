#!/bin/bash

# Monitor tap-dashboard GitHub pushes and Vercel deployments
# Usage: ./monitor-deployment.sh [interval_seconds]

INTERVAL=${1:-30}  # Default 30 seconds
REPO_DIR="/Users/chrisschofield/workspace/active/total-audio-platform"
BRANCH="fix/tap-dashboard-workspace-setup"
LAST_COMMIT=""

echo "🔍 Monitoring tap-dashboard deployments..."
echo "📦 Branch: $BRANCH"
echo "⏱️  Check interval: ${INTERVAL}s"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$REPO_DIR" || exit 1

# Get initial commit
LAST_COMMIT=$(git rev-parse "origin/$BRANCH" 2>/dev/null)
echo "📍 Starting from commit: ${LAST_COMMIT:0:8}"
echo ""

while true; do
  # Fetch latest from GitHub
  git fetch origin "$BRANCH" > /dev/null 2>&1
  
  # Get latest commit on remote
  REMOTE_COMMIT=$(git rev-parse "origin/$BRANCH" 2>/dev/null)
  
  if [ "$REMOTE_COMMIT" != "$LAST_COMMIT" ] && [ -n "$REMOTE_COMMIT" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 NEW PUSH DETECTED!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"
    echo "📝 Commit: ${REMOTE_COMMIT:0:8}"
    echo "📋 Message: $(git log -1 --pretty=%B "origin/$BRANCH")"
    echo ""
    echo "⏳ Checking Vercel deployment status..."
    
    # Check Vercel deployments
    cd "$REPO_DIR/apps/tap-dashboard" || exit 1
    echo "📊 Latest Deployments:"
    vercel ls 2>/dev/null | head -5
    echo ""
    echo "🔗 GitHub: https://github.com/totalaudiopromo/total-audio-platform/commits/$BRANCH"
    echo "🔗 Vercel: https://vercel.com/chris-projects-6ffe0e29/tap-dashboard/deployments"
    echo ""
    
    LAST_COMMIT="$REMOTE_COMMIT"
  else
    # Show status every 5 checks (to avoid spam)
    CHECK_COUNT=$((CHECK_COUNT + 1))
    if [ $((CHECK_COUNT % 5)) -eq 0 ]; then
      echo "[$(date '+%H:%M:%S')] ✅ No new pushes. Latest: ${REMOTE_COMMIT:0:8}"
    fi
  fi
  
  sleep "$INTERVAL"
done
