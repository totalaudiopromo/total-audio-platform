#!/bin/bash
#
# One-command installation for auto-tidy system
# Run this once, never think about directory mess again
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "🧹 Installing Auto-Tidy System..."
echo ""

# Create necessary directories
mkdir -p .claude/tmp
mkdir -p archive/{completed-tasks,summaries,phases,status-reports,test-outputs,deployment,demos,audits,migrations,fixes,logs}

# Check files are in place
if [ ! -f ".claude/auto-tidy-daemon.sh" ]; then
  echo "❌ Error: auto-tidy-daemon.sh not found"
  exit 1
fi

# Make scripts executable
chmod +x .claude/{auto-tidy-daemon.sh,tidy-now.sh,start-auto-tidy.sh,stop-auto-tidy.sh,tidy-status.sh}

echo "✅ Scripts prepared"
echo ""

# Run one-time cleanup to show immediate results
echo "📊 Current directory state:"
echo "   Root .md files: $(ls -1 *.md 2>/dev/null | wc -l)"
echo "   Root .txt files: $(ls -1 *.txt 2>/dev/null | wc -l)"
echo ""

read -p "🧹 Run cleanup now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  bash .claude/tidy-now.sh
fi

echo ""
echo "📋 Auto-Tidy System Options:"
echo ""
echo "1. Auto-start on every session (recommended)"
echo "2. Manual start/stop (you control when it runs)"
echo "3. One-time cleanup only (no daemon)"
echo ""

read -p "Choose option (1-3): " -n 1 -r OPTION
echo
echo ""

case $OPTION in
  1)
    # Auto-start option - add to shell startup
    if [ -f "$HOME/.bashrc" ]; then
      SHELL_RC="$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
      SHELL_RC="$HOME/.zshrc"
    else
      echo "⚠️  Could not find shell config file"
      SHELL_RC=""
    fi

    if [ -n "$SHELL_RC" ]; then
      # Check if already added
      if ! grep -q "auto-tidy-daemon" "$SHELL_RC" 2>/dev/null; then
        cat >> "$SHELL_RC" <<'SHELLEOF'

# Total Audio Platform - Auto-tidy daemon
if [ -d "$HOME/workspace/active/total-audio-platform/.claude" ]; then
  cd "$HOME/workspace/active/total-audio-platform"
  if [ ! -f .claude/tmp/auto-tidy.pid ]; then
    bash .claude/start-auto-tidy.sh > /dev/null 2>&1
  fi
  cd - > /dev/null
fi
SHELLEOF
        echo "✅ Auto-start configured in $SHELL_RC"
        echo "   Auto-tidy will start automatically on next terminal session"
      else
        echo "✅ Auto-start already configured"
      fi
    fi

    # Start now
    bash .claude/start-auto-tidy.sh
    ;;

  2)
    echo "📋 Manual mode selected"
    echo ""
    echo "Commands:"
    echo "  Start:  bash .claude/start-auto-tidy.sh"
    echo "  Stop:   bash .claude/stop-auto-tidy.sh"
    echo "  Status: bash .claude/tidy-status.sh"
    echo ""
    ;;

  3)
    echo "✅ One-time cleanup complete"
    echo ""
    echo "To run cleanup again anytime:"
    echo "  bash .claude/tidy-now.sh"
    echo ""
    ;;

  *)
    echo "❌ Invalid option"
    exit 1
    ;;
esac

echo ""
echo "✅ Auto-Tidy System Installed!"
echo ""
echo "📚 Quick Reference:"
echo "   • Run cleanup now:  bash .claude/tidy-now.sh"
echo "   • Start daemon:     bash .claude/start-auto-tidy.sh"
echo "   • Stop daemon:      bash .claude/stop-auto-tidy.sh"
echo "   • Check status:     bash .claude/tidy-status.sh"
echo "   • Config file:      .claude/auto-tidy-rules.json"
echo ""
echo "🎯 What gets tidied automatically:"
echo "   • *_COMPLETE.md → archive/completed-tasks/"
echo "   • *_SUMMARY.md → archive/summaries/"
echo "   • PHASE_*.md → archive/phases/"
echo "   • *_STATUS.md → archive/status-reports/"
echo "   • test-*.txt → archive/test-outputs/"
echo "   • Old DEMO/AUDIT/DEPLOY files → archive/"
echo ""
echo "🔒 Protected files (never moved):"
echo "   • README.md, SECURITY.md, CHANGELOG.md"
echo "   • AUDIO_INTEL_CONTEXT.md, BUSINESS_NOTES.md"
echo "   • WEEKLY_FOCUS.md, DEPLOYMENT.md, INCIDENTS.md"
echo ""
echo "📁 Your directory will now stay clean automatically!"
echo ""
