#!/bin/bash

# Total Audio Platform - Agent Automation Setup
# Phase 1: Immediate Wins (Gmail Autopilot, Contact Enrichment, Data Cleanup)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_DIR="$HOME/.total-audio-logs"

echo "🤖 Total Audio Platform - Agent Automation Setup"
echo "=================================================="
echo ""

# Create log directory
mkdir -p "$LOG_DIR"
echo "✅ Created log directory: $LOG_DIR"

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
sed -i '' '/# Total Audio Agent Automation/,/# End Total Audio/d' /tmp/new_crontab 2>/dev/null || true

# Add new automation entries
cat >> /tmp/new_crontab << EOF

# Total Audio Agent Automation - Phase 1
# Generated: $(date)

# 1. Gmail Autopilot - Hourly
# Saves: 2-3 hrs/week | Auto-organizes Gmail (Otter AI, Gemini, WARM, Machina)
0 * * * * cd "$SCRIPT_DIR/gmail-setup" && node liberty-autopilot.js run >> "$LOG_DIR/gmail-autopilot.log" 2>&1

# 2. Contact Enrichment - Daily at 2am UK time
# Saves: 5-8 hrs/week | Cost: ~£3/day | Core Audio Intel functionality
0 2 * * * cd "$SCRIPT_DIR/radio-promo" && node enrich-all-contacts.js >> "$LOG_DIR/contact-enrichment.log" 2>&1

# 3. Airtable Cleanup - Weekly Sunday at 11pm
# Saves: 1 hr/week | Removes duplicates and invalid contacts
0 23 * * 0 cd "$SCRIPT_DIR/radio-promo" && node clean-airtable-contacts.js >> "$LOG_DIR/airtable-cleanup.log" 2>&1

# 4. Contact Field Updates - Daily at 3am (after enrichment)
# Syncs enrichment data to proper Airtable fields
0 3 * * * cd "$SCRIPT_DIR/radio-promo" && node update-fields-from-enrichment.js >> "$LOG_DIR/field-updates.log" 2>&1

# End Total Audio Agent Automation

EOF

# Install new crontab
crontab /tmp/new_crontab

echo ""
echo "✅ Cron jobs installed successfully!"
echo ""
echo "📋 AUTOMATION SCHEDULE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ HOURLY       → Gmail Autopilot (saves 2-3 hrs/week)"
echo "⏰ DAILY 2am    → Contact Enrichment (saves 5-8 hrs/week, costs £3/day)"
echo "⏰ DAILY 3am    → Field Updates (syncs enrichment data)"
echo "⏰ WEEKLY Sun   → Airtable Cleanup (saves 1 hr/week)"
echo ""
echo "📁 LOG FILES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • Gmail:      $LOG_DIR/gmail-autopilot.log"
echo "  • Enrichment: $LOG_DIR/contact-enrichment.log"
echo "  • Updates:    $LOG_DIR/field-updates.log"
echo "  • Cleanup:    $LOG_DIR/airtable-cleanup.log"
echo ""
echo "💰 EXPECTED SAVINGS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • Time saved:  8-12 hours/week"
echo "  • Cost:        ~£21/week (£3/day enrichment)"
echo "  • ROI:         4-6x return on time invested"
echo ""
echo "🔍 VERIFY INSTALLATION:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  crontab -l | grep 'Total Audio'"
echo ""
echo "📊 MONITOR LOGS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  tail -f $LOG_DIR/gmail-autopilot.log"
echo "  tail -f $LOG_DIR/contact-enrichment.log"
echo ""
echo "🧪 TEST AGENTS NOW:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  cd $SCRIPT_DIR/gmail-setup && node liberty-autopilot.js run"
echo "  cd $SCRIPT_DIR/radio-promo && node enrich-all-contacts.js"
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Gmail autopilot will start running every hour"
echo "  2. Contact enrichment runs overnight at 2am"
echo "  3. Check logs tomorrow morning to verify successful runs"
echo "  4. Enrichment costs ~£3/day (Claude API usage)"
echo "  5. All agents have error handling and graceful failures"
echo ""
echo "🎉 Phase 1 automation complete! Next: Build Command Centre dashboard."
echo ""
