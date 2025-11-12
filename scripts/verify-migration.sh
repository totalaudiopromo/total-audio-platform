#!/bin/bash

# Verify Golden Verify + Testing Integration Migration
# Quick status check after manual application

set -e

SUPABASE_URL="https://ucncbighzqudaszewjrv.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE"

echo "🔍 Verifying Golden Verify + Testing Integration Migration"
echo ""

# Check golden_history table
echo "📊 Checking golden_history table..."
GOLDEN_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/golden_history?select=*&limit=1" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY")

if echo "$GOLDEN_RESPONSE" | grep -q "PGRST205"; then
  echo "❌ golden_history table NOT found"
  echo "   Migration has not been applied yet"
  GOLDEN_EXISTS=false
else
  GOLDEN_COUNT=$(curl -s "$SUPABASE_URL/rest/v1/golden_history?select=count" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Prefer: count=exact" | grep -o 'count":[0-9]*' | grep -o '[0-9]*')
  echo "✅ golden_history table exists ($GOLDEN_COUNT records)"
  GOLDEN_EXISTS=true
fi

# Check testing_results table
echo ""
echo "📊 Checking testing_results table..."
TESTING_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/testing_results?select=*&limit=1" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY")

if echo "$TESTING_RESPONSE" | grep -q "PGRST205"; then
  echo "❌ testing_results table NOT found"
  echo "   Migration has not been applied yet"
  TESTING_EXISTS=false
else
  TESTING_COUNT=$(curl -s "$SUPABASE_URL/rest/v1/testing_results?select=count" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Prefer: count=exact" | grep -o 'count":[0-9]*' | grep -o '[0-9]*')
  echo "✅ testing_results table exists ($TESTING_COUNT records)"
  TESTING_EXISTS=true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$GOLDEN_EXISTS" = true ] && [ "$TESTING_EXISTS" = true ]; then
  echo "✨ Migration successfully applied!"
  echo ""
  echo "📊 Current Status:"
  echo "   - golden_history: $GOLDEN_COUNT records"
  echo "   - testing_results: $TESTING_COUNT records"
  echo ""
  echo "🎯 Next Steps:"
  echo "1. View tables in Supabase Dashboard:"
  echo "   https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor"
  echo ""
  echo "2. Test queries:"
  echo "   SELECT * FROM get_latest_golden_status();"
  echo "   SELECT * FROM get_testing_pass_rate(NULL, 7);"
  echo ""
  echo "3. Integrate with Command Centre Ops Console"
  echo ""
  exit 0
else
  echo "❌ Migration NOT applied"
  echo ""
  echo "📋 To apply migration:"
  echo "1. Open: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new"
  echo "2. Copy SQL: cat supabase/migrations/20251111_golden_verify_integration.sql | pbcopy"
  echo "3. Paste and click 'Run'"
  echo "4. Re-run: bash scripts/verify-migration.sh"
  echo ""
  exit 1
fi
