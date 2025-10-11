#!/bin/bash

###############################################################################
# WEEKLY NEWSLETTER AUTOMATION SETUP
#
# This script sets up a cron job to automatically generate and send
# "The Unsigned Advantage" newsletter to ConvertKit as a draft every Monday at 9am.
#
# Usage: ./setup-weekly-newsletter.sh
###############################################################################

echo ""
echo "🎵 THE UNSIGNED ADVANTAGE - Weekly Automation Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get the absolute path to the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NEWSLETTER_SCRIPT="$SCRIPT_DIR/generate-and-send-newsletter.js"

# Check if script exists
if [ ! -f "$NEWSLETTER_SCRIPT" ]; then
    echo "❌ Error: Newsletter script not found at $NEWSLETTER_SCRIPT"
    exit 1
fi

echo "📋 Newsletter script: $NEWSLETTER_SCRIPT"
echo ""

# Create log directory
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"
echo "📂 Log directory: $LOG_DIR"
echo ""

# Create the cron command
# Every Monday at 9:00 AM
CRON_SCHEDULE="0 9 * * 1"
CRON_COMMAND="cd $SCRIPT_DIR && /usr/local/bin/node generate-and-send-newsletter.js >> $LOG_DIR/newsletter-\$(date +\%Y-\%m-\%d).log 2>&1"

echo "⏰ Schedule: Every Monday at 9:00 AM"
echo "📝 Command: $CRON_COMMAND"
echo ""

# Check if cron job already exists
EXISTING_CRON=$(crontab -l 2>/dev/null | grep "generate-and-send-newsletter.js" | grep -v "^#")

if [ ! -z "$EXISTING_CRON" ]; then
    echo "⚠️  Existing cron job found:"
    echo "   $EXISTING_CRON"
    echo ""
    read -p "❓ Replace existing cron job? (y/n): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi

    # Remove existing cron job
    crontab -l 2>/dev/null | grep -v "generate-and-send-newsletter.js" | crontab -
    echo "✓ Removed existing cron job"
    echo ""
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "# The Unsigned Advantage - Weekly Newsletter Automation"; echo "$CRON_SCHEDULE $CRON_COMMAND") | crontab -

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ WEEKLY AUTOMATION CONFIGURED!"
echo ""
echo "📅 Schedule: Every Monday at 9:00 AM"
echo "🤖 Action: Generate newsletter + Create ConvertKit draft"
echo "📧 Approval: You review and approve in ConvertKit dashboard"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 WHAT HAPPENS EACH MONDAY:"
echo ""
echo "1. 9:00 AM - Script fetches latest music industry news from RSS feeds"
echo "2. Script selects top 3 indie-relevant stories"
echo "3. Claude API generates newsletter content with your voice + tool philosophy"
echo "4. ConvertKit draft broadcast is created (NOT auto-sent)"
echo "5. You get notification to review draft at https://app.convertkit.com/broadcasts"
echo "6. You approve and schedule when ready"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 MONITORING:"
echo ""
echo "View logs: ls -lh $LOG_DIR"
echo "Latest log: tail -f $LOG_DIR/newsletter-\$(date +%Y-%m-%d).log"
echo "List cron jobs: crontab -l"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🛠️  MANAGEMENT COMMANDS:"
echo ""
echo "Run manually now:"
echo "  cd $SCRIPT_DIR && node generate-and-send-newsletter.js"
echo ""
echo "Remove automation:"
echo "  crontab -l | grep -v 'generate-and-send-newsletter.js' | crontab -"
echo ""
echo "Edit schedule:"
echo "  crontab -e"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💰 COST: ~£0.01-0.03 per newsletter (basically free)"
echo "⏱️  TIME SAVED: ~1 hour manual work per week"
echo ""
echo "✅ Setup complete! First automated newsletter: Next Monday at 9:00 AM"
echo ""
