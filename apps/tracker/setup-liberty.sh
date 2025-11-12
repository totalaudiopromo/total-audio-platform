#!/bin/bash
# Liberty Tracker Setup Script
# Run this to set up the Liberty Music PR Campaign Tracker

set -e

echo "🎵 Liberty Music PR Campaign Tracker Setup"
echo "=========================================="
echo ""

# Check if we're in the tracker directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from apps/tracker directory"
    exit 1
fi

# Check for Supabase credentials
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL not set"
    echo ""
    echo "Please set your Supabase credentials:"
    echo "  export NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'"
    echo "  export NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-key'"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Supabase credentials found"
echo ""

# Step 1: Apply migration
echo "📊 Step 1: Applying database migration..."
echo ""

if command -v supabase &> /dev/null; then
    echo "Using Supabase CLI to push migration..."
    npx supabase db push
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "Please apply the migration manually:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy contents of: supabase/migrations/20251119_tracker_production_schema.sql"
    echo "4. Run the SQL"
    echo ""
    read -p "Press Enter when migration is applied..."
fi

echo "✅ Migration applied"
echo ""

# Step 2: Import campaign data
echo "📥 Step 2: Importing Liberty campaign data..."
echo ""

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not set"
    echo ""
    echo "Please set: export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo "Then run: npx tsx scripts/import-liberty-campaigns.ts"
    echo ""
    read -p "Press Enter when data is imported..."
else
    echo "Running import script..."
    npx tsx scripts/import-liberty-campaigns.ts
    echo "✅ Campaign data imported"
fi

echo ""
echo "🚀 Step 3: Starting development server..."
echo ""

# Start the dev server
npm run dev

echo ""
echo "✨ Setup complete!"
echo ""
echo "Open your browser to: http://localhost:3001/dashboard/liberty"
echo ""
