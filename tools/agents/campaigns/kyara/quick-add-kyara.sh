#!/bin/bash

# Quick script to add KYARA campaign with service role key
# Usage: SERVICE_KEY="your-key" ./quick-add-kyara.sh

if [ -z "$SERVICE_KEY" ]; then
  echo ""
  echo "📋 QUICK SETUP:"
  echo "1. Copy your service_role key from: https://app.supabase.com/project/ucncbighzqudaszewjrv/settings/api"
  echo "2. Run: SERVICE_KEY=\"paste-key-here\" ./quick-add-kyara.sh"
  echo ""
  exit 1
fi

echo "🚀 Adding KYARA campaign to tracker..."
export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY"
node add-kyara-campaign-to-tracker.js

