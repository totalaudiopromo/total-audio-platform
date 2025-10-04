#!/bin/bash
#
# Setup Notion Auto-Sync for Business Docs
# Sets up a cron job to sync WEEKLY_FOCUS, AUDIO_INTEL_CONTEXT, BUSINESS_NOTES
#

set -e

REPO_ROOT="/Users/chrisschofield/workspace/active/total-audio-platform"
SCRIPT_PATH="$REPO_ROOT/.claude/sync-notion-docs.js"

echo "🔧 Setting up Notion auto-sync..."

# Make sync script executable
chmod +x "$SCRIPT_PATH"

# Create a wrapper script that loads env vars properly
cat > "$REPO_ROOT/.claude/cron-sync-notion.sh" << 'EOF'
#!/bin/bash
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.nvm/versions/node/v20.11.0/bin"
cd /Users/chrisschofield/workspace/active/total-audio-platform
source .env 2>/dev/null || true
node .claude/sync-notion-docs.js >> .claude/notion-sync.log 2>&1
EOF

chmod +x "$REPO_ROOT/.claude/cron-sync-notion.sh"

# Set up cron job - sync every 5 minutes
CRON_CMD="*/5 * * * * $REPO_ROOT/.claude/cron-sync-notion.sh"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "cron-sync-notion.sh"; then
  echo "⚠️  Cron job already exists"
else
  # Add cron job
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
  echo "✅ Cron job added - syncing every 5 minutes"
fi

# Create log file
touch "$REPO_ROOT/.claude/notion-sync.log"

echo ""
echo "📋 Configuration needed:"
echo "Add these to your .env file:"
echo ""
echo "NOTION_API_KEY=your_api_key_here"
echo "NOTION_WEEKLY_FOCUS_ID=your_page_id_here"
echo "NOTION_CONTEXT_ID=your_page_id_here"
echo "NOTION_NOTES_ID=your_page_id_here"
echo ""
echo "To find page IDs: Open Notion page → Share → Copy link → Extract ID from URL"
echo ""
echo "✅ Setup complete! Docs will sync every 5 minutes."
echo "📊 View sync log: tail -f .claude/notion-sync.log"
echo ""
echo "🧪 Test sync now: node .claude/sync-notion-docs.js"
