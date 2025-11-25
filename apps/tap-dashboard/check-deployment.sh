#!/bin/bash

# Check tap-dashboard deployment status and diagnose issues

echo "🔍 Checking tap-dashboard deployment status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

REPO_DIR="/Users/chrisschofield/workspace/active/total-audio-platform"
BRANCH="fix/tap-dashboard-workspace-setup"

cd "$REPO_DIR" || exit 1

# Check git status
echo "📦 Git Status:"
echo "   Current branch: $(git branch --show-current)"
echo "   Latest commit: $(git log -1 --oneline)"
echo ""

# Check if branch is pushed
echo "🌐 Remote Status:"
git fetch origin "$BRANCH" 2>/dev/null
LOCAL=$(git rev-parse "$BRANCH" 2>/dev/null)
REMOTE=$(git rev-parse "origin/$BRANCH" 2>/dev/null)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "   ✅ Branch is up to date with remote"
else
  echo "   ⚠️  Branch is NOT up to date!"
  echo "   Local:  ${LOCAL:0:8}"
  echo "   Remote: ${REMOTE:0:8}"
  echo ""
  echo "   💡 Run: git push origin $BRANCH"
fi
echo ""

# Check Vercel deployments
echo "🚀 Vercel Deployments:"
cd "$REPO_DIR/apps/tap-dashboard" || exit 1
vercel ls 2>&1 | head -5
echo ""

# Check Vercel project settings
echo "⚙️  Vercel Project Info:"
vercel project 2>&1 | grep -E "(name|git|production)" || echo "   (Run 'vercel project' for full details)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Common Issues:"
echo ""
echo "1. Feature branches don't auto-deploy to Production"
echo "   → Vercel only auto-deploys 'main' branch to Production"
echo "   → Feature branches create Preview deployments"
echo ""
echo "2. Git integration not connected"
echo "   → Check: https://vercel.com/chris-projects-6ffe0e29/tap-dashboard/settings/git"
echo ""
echo "3. Production branch not set correctly"
echo "   → Should be set to 'main' in Vercel settings"
echo ""
echo "🔗 Quick Links:"
echo "   GitHub: https://github.com/totalaudiopromo/total-audio-platform/tree/$BRANCH"
echo "   Vercel: https://vercel.com/chris-projects-6ffe0e29/tap-dashboard/deployments"
echo ""


