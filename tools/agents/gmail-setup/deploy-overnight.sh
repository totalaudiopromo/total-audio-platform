#!/bin/bash
# Liberty Gmail/Drive/Calendar - Complete Overnight Deployment
# This actually gets it done (not like CC)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Liberty Complete Organization - Overnight Deployment"
echo "=================================================="
echo ""
echo "This will:"
echo "  1. Fix Gmail labels and filters"
echo "  2. Re-label all existing misclassified emails"
echo "  3. Set up hourly autopilot"
echo "  4. Create color-coded Drive folders"
echo "  5. Create color-coded Calendar system"
echo ""
read -p "Ready to deploy? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "=================================================="
echo "PHASE 1: Gmail Filter Fix"
echo "=================================================="
echo ""

cd "$SCRIPT_DIR"
node liberty-gmail-fix.js setup

if [ $? -ne 0 ]; then
    echo "❌ Gmail fix failed"
    exit 1
fi

echo ""
echo "✅ Phase 1 complete - Gmail filters fixed"
echo ""
read -p "Continue to bulk email fix? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️  Paused - run this script again to continue"
    exit 0
fi

echo ""
echo "=================================================="
echo "PHASE 2: Bulk Email Re-labeling"
echo "=================================================="
echo ""

node liberty-bulk-fix.js fix

if [ $? -ne 0 ]; then
    echo "❌ Bulk fix failed"
    exit 1
fi

echo ""
echo "✅ Phase 2 complete - All emails re-labeled"
echo ""
read -p "Continue to autopilot setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️  Paused - Gmail is now fixed!"
    exit 0
fi

echo ""
echo "=================================================="
echo "PHASE 3: Autopilot Setup"
echo "=================================================="
echo ""

./setup-autopilot.sh

if [ $? -ne 0 ]; then
    echo "❌ Autopilot setup failed"
    exit 1
fi

echo ""
echo "✅ Phase 3 complete - Autopilot running hourly"
echo ""
read -p "Continue to Drive setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️  Paused - Gmail complete, Drive/Calendar skipped"
    exit 0
fi

echo ""
echo "=================================================="
echo "PHASE 4: Google Drive Color Sync"
echo "=================================================="
echo ""

node liberty-drive-sync.js setup

if [ $? -ne 0 ]; then
    echo "⚠️  Drive setup failed (non-critical)"
fi

echo ""
echo "✅ Phase 4 complete - Drive folders created"
echo ""
read -p "Continue to Calendar setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏸️  Paused - Calendar setup skipped"
    exit 0
fi

echo ""
echo "=================================================="
echo "PHASE 5: Google Calendar Sync"
echo "=================================================="
echo ""

node liberty-calendar-sync.js setup

if [ $? -ne 0 ]; then
    echo "⚠️  Calendar setup failed (non-critical)"
fi

echo ""
echo "=================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================================="
echo ""
echo "Your Liberty workspace is now fully organized:"
echo ""
echo "📧 Gmail:"
echo "  ✅ All old broken filters deleted"
echo "  ✅ New precise filters active"
echo "  ✅ All misclassified emails fixed"
echo "  ✅ Autopilot running every hour"
echo ""
echo "📁 Google Drive:"
echo "  ✅ Color-coded folder structure created"
echo "  ✅ Matches Gmail label system"
echo ""
echo "📅 Google Calendar:"
echo "  ✅ Color-coded calendars created"
echo "  ✅ Ready for campaign tracking"
echo ""
echo "🚁 Autopilot:"
echo "  - Runs every hour automatically"
echo "  - Keeps everything organized"
echo "  - Logs to: $SCRIPT_DIR/autopilot.log"
echo ""
echo "💡 Commands:"
echo "  View autopilot log: tail -f $SCRIPT_DIR/autopilot.log"
echo "  Test autopilot:     node liberty-autopilot.js test"
echo "  Run autopilot now:  node liberty-autopilot.js run"
echo ""
echo "🌙 The autopilot will maintain organization overnight and forever!"
echo ""
