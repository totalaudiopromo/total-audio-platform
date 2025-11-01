#!/bin/bash

# Run Supabase migrations
#
# This script runs all pending migrations against your Supabase database.
# Migrations should be stored in packages/core-db/supabase/migrations/
#
# Prerequisites:
# - Supabase CLI installed (https://supabase.com/docs/guides/cli)
# - SUPABASE_PROJECT_ID and SUPABASE_DB_PASSWORD environment variables set
#
# Usage:
#   pnpm --filter @total-audio/core-db migrate

set -e

echo "🚀 Running Supabase migrations..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed."
    echo "   Install it with: brew install supabase/tap/supabase"
    echo "   Or see: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if SUPABASE_PROJECT_ID is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ Error: SUPABASE_PROJECT_ID environment variable is not set."
    echo "   Set it with: export SUPABASE_PROJECT_ID=your-project-id"
    exit 1
fi

# Check if SUPABASE_DB_PASSWORD is set
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "❌ Error: SUPABASE_DB_PASSWORD environment variable is not set."
    echo "   Set it with: export SUPABASE_DB_PASSWORD=your-db-password"
    exit 1
fi

# Link to project (if not already linked)
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 Linking to Supabase project..."
    supabase link --project-ref "$SUPABASE_PROJECT_ID"
fi

# Run migrations
supabase db push

echo "✅ Migrations completed successfully!"
echo "   Run 'pnpm --filter @total-audio/core-db generate:types' to update types."
