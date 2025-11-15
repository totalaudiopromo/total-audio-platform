#!/bin/bash
#
# Quick one-time cleanup - shows you immediate results
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "🧹 Running one-time directory cleanup..."
echo ""

# Show current mess
echo "📊 Current state:"
echo "   Root .md files: $(ls -1 *.md 2>/dev/null | wc -l)"
echo "   Root .txt files: $(ls -1 *.txt 2>/dev/null | wc -l)"
echo ""

# Run auto-tidy once
bash .claude/auto-tidy-daemon.sh once

echo ""
echo "📊 After cleanup:"
echo "   Root .md files: $(ls -1 *.md 2>/dev/null | wc -l)"
echo "   Root .txt files: $(ls -1 *.txt 2>/dev/null | wc -l)"
echo ""

# Show what's left
echo "📁 Remaining files in root directory:"
ls -1 *.md 2>/dev/null | while read file; do
  echo "   ✓ $file (protected or active)"
done

echo ""
echo "📂 Archived files can be found in:"
find archive -type d -maxdepth 2 2>/dev/null | sort | while read dir; do
  count=$(find "$dir" -type f 2>/dev/null | wc -l)
  if [ $count -gt 0 ]; then
    echo "   $dir ($count files)"
  fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "  • Review the report: cat .claude/tmp/tidy-report-*.md"
echo "  • Start auto-tidy daemon: bash .claude/start-auto-tidy.sh"
echo "  • Or add to startup (automatic on every session)"
echo ""
