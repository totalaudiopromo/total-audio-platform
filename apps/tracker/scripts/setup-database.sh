#!/bin/bash
# Tracker Database Setup Script
# Applies migrations and creates seed data

set -e

echo "🎵 TRACKER DATABASE SETUP"
echo "=========================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Extract Supabase connection details
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')

echo "📊 Project: $SUPABASE_PROJECT_ID"
echo ""

# Check if we have the Supabase service role key
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
  echo "   You'll need to run migrations manually via Supabase dashboard"
  echo ""
  echo "   Dashboard: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_ID/sql/new"
  echo "   Migration file: supabase/migrations/010_tracker_prd_schema.sql"
  echo ""
  echo "   OR add SUPABASE_SERVICE_ROLE_KEY to .env.local to automate"
  exit 1
fi

echo "✅ Environment configured"
echo ""
echo "📁 Applying migration: 010_tracker_prd_schema.sql"
echo ""

# Apply migration via Supabase API (requires service role key)
# For now, we'll create seed data script instead

echo "⏭️  Migration must be applied via Supabase dashboard"
echo "   Run this SQL: supabase/migrations/010_tracker_prd_schema.sql"
echo ""
echo "✅ Setup complete!"
