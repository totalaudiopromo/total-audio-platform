#!/bin/bash

# Total Audio Platform - FREE AUTOMATION SETUP
# Zero monthly costs, 15-23 hours/week saved
# Contact enrichment is MANUAL TRIGGER ONLY (costs £3/run)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_DIR="$HOME/.total-audio-logs"

echo "🆓 Total Audio Platform - FREE AUTOMATION SETUP"
echo "================================================"
echo ""
echo "💰 Monthly Cost: £0"
echo "⏰ Time Saved: 15-23 hours/week"
echo "🎯 Strategy: Automate free agents, manual trigger for paid ones"
echo ""

# Create log directory
mkdir -p "$LOG_DIR"
echo "✅ Created log directory: $LOG_DIR"
echo ""

# Check if crontab exists
if ! crontab -l &>/dev/null; then
    echo "📝 No existing crontab found. Creating new one..."
    touch /tmp/new_crontab
else
    echo "📝 Backing up existing crontab..."
    crontab -l > /tmp/existing_crontab
    cp /tmp/existing_crontab /tmp/new_crontab
fi

# Remove old Total Audio automation entries (if any)
sed -i '' '/# Total Audio Free Automation/,/# End Total Audio Free Automation/d' /tmp/new_crontab 2>/dev/null || true

# Add FREE automation entries only
cat >> /tmp/new_crontab << EOF

# Total Audio Free Automation - Zero Monthly Costs
# Generated: $(date)
# Time Saved: 15-23 hrs/week | Cost: £0/month

# 1. Gmail Autopilot - Every hour (FREE)
# Saves: 2-3 hrs/week | Auto-organizes Gmail
0 * * * * cd "$SCRIPT_DIR/gmail-setup" && node liberty-autopilot.js run >> "$LOG_DIR/gmail-autopilot.log" 2>&1

# 2. Social Media Calendar - Weekly Sunday 8pm (FREE)
# Saves: 5-8 hrs/week | Generate calendar → Buffer import
0 20 * * 0 cd "$SCRIPT_DIR/active" && node social-media-scheduler.js generate >> "$LOG_DIR/social-calendar.log" 2>&1

# 3. Newsletter Generator - Weekly Monday 9am (FREE)
# Saves: 3-4 hrs/week | Generate draft → Chris review → Send
0 9 * * 1 cd "$SCRIPT_DIR/core-agents/content" && node newsletter-automation-agent.js >> "$LOG_DIR/newsletter.log" 2>&1

# 4. Airtable Cleanup - Weekly Sunday 11pm (FREE)
# Saves: 1-2 hrs/week | Remove duplicates/invalid contacts
0 23 * * 0 cd "$SCRIPT_DIR/radio-promo" && node clean-airtable-contacts.js >> "$LOG_DIR/airtable-cleanup.log" 2>&1

# 5. Station Discovery - Weekly Tuesday 9am (FREE)
# Saves: 4-6 hrs/week | Discover new radio stations (WARM API free trial)
0 9 * * 2 cd "$SCRIPT_DIR/radio-promo" && node station-discovery-system.js >> "$LOG_DIR/station-discovery.log" 2>&1

# NOTE: Contact enrichment is MANUAL TRIGGER ONLY (costs £3/run)
# Run manually when needed: cd $SCRIPT_DIR/radio-promo && node enrich-all-contacts.js

# End Total Audio Free Automation

EOF

# Install new crontab
crontab /tmp/new_crontab

echo ""
echo "✅ FREE automation installed successfully!"
echo ""
echo "📋 AUTOMATION SCHEDULE (ALL FREE):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ HOURLY         → Gmail Autopilot (2-3 hrs/week saved)"
echo "⏰ WEEKLY Sun 8pm → Social Calendar (5-8 hrs/week saved)"
echo "⏰ WEEKLY Mon 9am → Newsletter Gen (3-4 hrs/week saved)"
echo "⏰ WEEKLY Sun 11pm→ Data Cleanup (1-2 hrs/week saved)"
echo "⏰ WEEKLY Tue 9am → Station Discovery (4-6 hrs/week saved)"
echo ""
echo "📁 LOG FILES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • Gmail:      $LOG_DIR/gmail-autopilot.log"
echo "  • Social:     $LOG_DIR/social-calendar.log"
echo "  • Newsletter: $LOG_DIR/newsletter.log"
echo "  • Cleanup:    $LOG_DIR/airtable-cleanup.log"
echo "  • Discovery:  $LOG_DIR/station-discovery.log"
echo ""
echo "💰 COST BREAKDOWN:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • Gmail Autopilot:      £0/month (Gmail API free)"
echo "  • Social Calendar:      £0/month (local generation)"
echo "  • Newsletter Gen:       £0/month (content only)"
echo "  • Data Cleanup:         £0/month (Airtable free tier)"
echo "  • Station Discovery:    £0/month (WARM trial access)"
echo "  ────────────────────────────────────────────────────"
echo "  • TOTAL MONTHLY COST:   £0"
echo ""
echo "⏱️  TIME SAVINGS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • Time saved:  15-23 hours/week"
echo "  • Cost:        £0/month"
echo "  • ROI:         ∞ (infinite - free automation)"
echo ""
echo "⚠️  MANUAL TRIGGER ONLY (COSTS MONEY):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Contact Enrichment: £3/run (~1000 contacts)"
echo "  Run manually when needed:"
echo "    cd $SCRIPT_DIR/radio-promo"
echo "    node enrich-all-contacts.js"
echo ""
echo "🔍 VERIFY INSTALLATION:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  crontab -l | grep 'Total Audio'"
echo ""
echo "📊 MONITOR LOGS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  tail -f $LOG_DIR/gmail-autopilot.log"
echo "  tail -f $LOG_DIR/social-calendar.log"
echo "  tail -f $LOG_DIR/newsletter.log"
echo ""
echo "🧪 TEST AGENTS NOW:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  # Gmail autopilot"
echo "  cd $SCRIPT_DIR/gmail-setup && node liberty-autopilot.js run"
echo ""
echo "  # Social calendar"
echo "  cd $SCRIPT_DIR/active && node social-media-scheduler.js generate"
echo ""
echo "  # Newsletter (generates draft)"
echo "  cd $SCRIPT_DIR/core-agents/content && node newsletter-automation-agent.js"
echo ""
echo "📅 WEEKLY WORKFLOW:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Monday 9am:   Newsletter draft ready (review + send)"
echo "  Tuesday 9am:  New stations discovered (review findings)"
echo "  Sunday 8pm:   Social calendar ready (upload to Buffer)"
echo "  Sunday 11pm:  Data cleanup runs (automatic)"
echo "  Every hour:   Gmail organized (automatic)"
echo ""
echo "🎯 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Check logs tomorrow morning to verify runs"
echo "  2. Review Monday's newsletter draft (approve + send)"
echo "  3. Review Sunday's social calendar (upload to Buffer)"
echo "  4. Manual enrichment when needed (£3 budget)"
echo ""
echo "🎉 FREE automation complete! Zero costs, 15-23 hrs/week saved."
echo ""
