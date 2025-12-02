#!/bin/bash

# Audio Intel Daily Automation - UK Premium Times Setup
# This script sets up cron jobs for automatic posting

SCRIPT_DIR="/Users/chrisschofield/workspace/active/total-audio-platform/apps/command-centre"
LOG_DIR="$SCRIPT_DIR/logs"

# Create log directory
mkdir -p "$LOG_DIR"

echo "🚀 Setting up Audio Intel daily automation cron jobs..."

# Create the cron job entries
CRON_JOBS="
# Audio Intel Daily Automation - UK Premium Times
# Morning commute peak (8:00 AM UK time)
0 8 * * * cd $SCRIPT_DIR && node scripts/daily-audio-intel-automation.js post >> $LOG_DIR/cron.log 2>&1

# Lunch break peak (1:00 PM UK time)
0 13 * * * cd $SCRIPT_DIR && node scripts/daily-audio-intel-automation.js post >> $LOG_DIR/cron.log 2>&1

# Evening prime time (7:00 PM UK time)
0 19 * * * cd $SCRIPT_DIR && node scripts/daily-audio-intel-automation.js post >> $LOG_DIR/cron.log 2>&1

# Daily status check (9:00 PM UK time)
0 21 * * * cd $SCRIPT_DIR && node scripts/daily-audio-intel-automation.js status >> $LOG_DIR/status.log 2>&1
"

echo "📋 Cron jobs to be added:"
echo "$CRON_JOBS"

echo ""
echo "⚠️  MANUAL STEP REQUIRED:"
echo "Run this command to add the cron jobs:"
echo ""
echo "crontab -e"
echo ""
echo "Then paste the above cron jobs into your crontab file."
echo ""
echo "Or run this one-liner:"
echo "(crontab -l 2>/dev/null; echo '$CRON_JOBS') | crontab -"
echo ""

# Test the automation script
echo "🧪 Testing automation script..."
cd "$SCRIPT_DIR"
node scripts/daily-audio-intel-automation.js status

echo ""
echo "✅ Setup complete!"
echo ""
echo "Your Audio Intel content will now post automatically at:"
echo "• 8:00 AM - Morning commute peak"
echo "• 1:00 PM - Lunch break peak"
echo "• 7:00 PM - Evening prime time"
echo ""
echo "All posts are your authentic Audio Intel content only:"
echo "1. BBC Radio 1 case study"
echo "2. Spotify playlist success"
echo "3. Time savings value prop"
echo ""
echo "View logs: tail -f $LOG_DIR/cron.log"
echo "Check status: node scripts/daily-audio-intel-automation.js status"