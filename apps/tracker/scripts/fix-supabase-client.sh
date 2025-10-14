#!/bin/bash
# Fix Supabase client usage in integration files

echo "🔧 Fixing Supabase client usage in integration files..."

# Fix google-sheets-sync.ts
echo "Fixing google-sheets-sync.ts..."
FILE="lib/integrations/google-sheets-sync.ts"

# Read the file and apply fixes
if [ -f "$FILE" ]; then
  # Backup
  cp "$FILE" "${FILE}.backup"

  # Replace class declaration
  sed -i '' 's/private supabase = createClient();/private async getSupabaseClient() { return await createClient(); }/g' "$FILE"

  # Replace this.supabase usage in methods (will need manual review for context)
  echo "  - Replaced supabase client initialization"
  echo "  ⚠️  Manual review needed for method-level replacements"
else
  echo "  ❌ File not found: $FILE"
fi

# Fix oauth-handler.ts
echo "Fixing oauth-handler.ts..."
FILE="lib/integrations/oauth-handler.ts"

if [ -f "$FILE" ]; then
  cp "$FILE" "${FILE}.backup"

  # Similar fixes
  echo "  - Processing oauth-handler.ts"
  echo "  ⚠️  Manual review needed"
else
  echo "  ❌ File not found: $FILE"
fi

# Fix API route
echo "Fixing app/api/cron/sync-integrations/route.ts..."
FILE="app/api/cron/sync-integrations/route.ts"

if [ -f "$FILE" ]; then
  cp "$FILE" "${FILE}.backup"
  echo "  - Processing sync-integrations route"
  echo "  ⚠️  Manual review needed"
else
  echo "  ❌ File not found: $FILE"
fi

echo ""
echo "✅ Initial fixes applied!"
echo "⚠️  Manual review required for:"
echo "   - lib/integrations/google-sheets-sync.ts"
echo "   - lib/integrations/oauth-handler.ts"
echo "   - app/api/cron/sync-integrations/route.ts"
echo ""
echo "Backups created with .backup extension"
