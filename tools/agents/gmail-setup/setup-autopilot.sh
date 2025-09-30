#!/bin/bash
# Setup Liberty Gmail Autopilot - Runs hourly to maintain organization

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOPILOT_SCRIPT="$SCRIPT_DIR/liberty-autopilot.js"

echo "🚁 Setting up Liberty Gmail Autopilot..."
echo ""

# Check if script exists
if [ ! -f "$AUTOPILOT_SCRIPT" ]; then
    echo "❌ Error: liberty-autopilot.js not found at $AUTOPILOT_SCRIPT"
    exit 1
fi

# Make scripts executable
chmod +x "$SCRIPT_DIR/liberty-gmail-fix.js"
chmod +x "$SCRIPT_DIR/liberty-bulk-fix.js"
chmod +x "$SCRIPT_DIR/liberty-autopilot.js"

echo "✅ Made scripts executable"
echo ""

# Create cron job entry
CRON_COMMAND="0 * * * * cd $SCRIPT_DIR && /usr/local/bin/node liberty-autopilot.js run >> autopilot.log 2>&1"

echo "📝 Cron job to be added:"
echo "$CRON_COMMAND"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "liberty-autopilot.js"; then
    echo "⚠️  Autopilot cron job already exists"
    echo ""
    read -p "Replace existing cron job? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 0
    fi

    # Remove existing job
    crontab -l 2>/dev/null | grep -v "liberty-autopilot.js" | crontab -
    echo "🗑️  Removed old cron job"
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

echo "✅ Cron job added - autopilot will run every hour"
echo ""

# Show current crontab
echo "📋 Current crontab:"
crontab -l | grep "liberty-autopilot"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📧 Autopilot will:"
echo "  - Run every hour (on the hour)"
echo "  - Check for misclassified emails"
echo "  - Auto-organize Otter AI, Gemini, WARM, Machina, etc."
echo "  - Create campaign sub-labels automatically"
echo "  - Log all actions to: $SCRIPT_DIR/autopilot.log"
echo ""
echo "💡 Commands:"
echo "  Test now:     node liberty-autopilot.js test"
echo "  Run now:      node liberty-autopilot.js run"
echo "  View log:     tail -f $SCRIPT_DIR/autopilot.log"
echo "  Remove cron:  crontab -l | grep -v liberty-autopilot | crontab -"
echo ""
