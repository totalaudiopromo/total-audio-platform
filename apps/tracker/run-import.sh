#!/bin/bash
# Quick import verification script
# Run this after applying the database migration

set -e

echo "🔍 Liberty Campaign Import - Quick Test"
echo "========================================"
echo ""

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check environment
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Missing .env.local file"
    echo "Please ensure .env.local exists with Supabase credentials"
    exit 1
fi

echo "✅ Environment configured"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Run import
echo "📥 Importing Liberty campaigns..."
echo ""

NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
npx tsx scripts/import-liberty-campaigns.ts

echo ""
echo "✅ Import complete!"
echo ""
echo "🌐 View dashboard at: http://localhost:3000/dashboard/liberty"
echo ""
