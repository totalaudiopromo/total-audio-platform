#!/bin/bash

# Generate TypeScript types from Supabase schema
#
# This script connects to your Supabase project and generates TypeScript types
# based on your database schema. Run this after any schema changes.
#
# Prerequisites:
# - Supabase CLI installed (https://supabase.com/docs/guides/cli)
# - SUPABASE_PROJECT_ID environment variable set
#
# Usage:
#   pnpm --filter @total-audio/core-db generate:types

set -e

echo "🔄 Generating TypeScript types from Supabase schema..."

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

# Generate types
supabase gen types typescript \
  --project-id "$SUPABASE_PROJECT_ID" \
  --schema public \
  > src/types/database.ts

echo "✅ TypeScript types generated successfully!"
echo "   Location: packages/core-db/src/types/database.ts"
