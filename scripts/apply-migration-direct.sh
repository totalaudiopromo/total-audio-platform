#!/bin/bash

# Direct SQL execution via Supabase REST API
# This script reads the migration file and executes it via curl

set -e

SUPABASE_URL="https://ucncbighzqudaszewjrv.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE"
MIGRATION_FILE="supabase/migrations/20251111_golden_verify_integration.sql"

echo "🚀 Applying Golden Verify + Testing Integration Migration"
echo ""
echo "⚠️  Note: Supabase REST API cannot execute DDL statements directly"
echo "This script will provide instructions for manual application"
echo ""

# Read the migration file
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "📝 Migration file found: $MIGRATION_FILE"
echo ""

# Verify tables don't exist yet
echo "🔍 Checking if tables exist..."
RESPONSE=$(curl -s -X GET "$SUPABASE_URL/rest/v1/golden_history?select=count" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Prefer: count=exact")

if echo "$RESPONSE" | grep -q "PGRST205"; then
  echo "✅ Tables do not exist - migration needs to be applied"
  echo ""
  echo "📋 MANUAL MIGRATION REQUIRED:"
  echo ""
  echo "1. Open Supabase SQL Editor:"
  echo "   https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new"
  echo ""
  echo "2. Copy the entire contents of:"
  echo "   $MIGRATION_FILE"
  echo ""
  echo "3. Paste into SQL Editor and click \"Run\""
  echo ""
  echo "4. After successful execution, verify with:"
  echo "   curl -s \"$SUPABASE_URL/rest/v1/golden_history?select=count\" \\"
  echo "     -H \"apikey: $SERVICE_KEY\" \\"
  echo "     -H \"Authorization: Bearer $SERVICE_KEY\" \\"
  echo "     -H \"Prefer: count=exact\""
  echo ""
  echo "📁 Migration file path:"
  echo "   $(pwd)/$MIGRATION_FILE"
  echo ""

  # Offer to open the file for easy copying
  if command -v cat >/dev/null 2>&1; then
    echo "💡 Tip: Copy the migration SQL to clipboard:"
    if command -v pbcopy >/dev/null 2>&1; then
      echo "   cat $MIGRATION_FILE | pbcopy"
    elif command -v xclip >/dev/null 2>&1; then
      echo "   cat $MIGRATION_FILE | xclip -selection clipboard"
    else
      echo "   cat $MIGRATION_FILE"
    fi
  fi
  echo ""

else
  # Tables exist - verify data
  GOLDEN_COUNT=$(echo "$RESPONSE" | jq -r '.[0].count // 0' 2>/dev/null || echo "unknown")

  echo "✅ golden_history table exists!"
  echo ""

  # Check testing_results table
  RESPONSE2=$(curl -s -X GET "$SUPABASE_URL/rest/v1/testing_results?select=count" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Prefer: count=exact")

  TESTING_COUNT=$(echo "$RESPONSE2" | jq -r '.[0].count // 0' 2>/dev/null || echo "unknown")

  if echo "$RESPONSE2" | grep -q "PGRST205"; then
    echo "⚠️  testing_results table not found - migration incomplete"
    exit 1
  else
    echo "✅ testing_results table exists!"
    echo ""
    echo "📊 Current Status:"
    echo "   - golden_history: $GOLDEN_COUNT records"
    echo "   - testing_results: $TESTING_COUNT records"
    echo ""
    echo "✨ Migration successfully applied and verified!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Verify tables in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor"
    echo ""
    echo "2. Test queries in SQL Editor"
    echo ""
    echo "3. Integrate with Command Centre Ops Console"
    echo ""
  fi
fi
