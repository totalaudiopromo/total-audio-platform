#!/bin/bash

set -e  # Exit on error

echo "🎵 Total Audio Platform - Development Setup"
echo "=============================================="
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    echo "   Install it with: npm install -g pnpm@10"
    exit 1
fi

echo "✓ pnpm found: $(pnpm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   (This will regenerate pnpm-lock.yaml to match .npmrc settings)"
pnpm install

echo ""
echo "🔐 Setting up environment variables..."

# Copy environment files for active apps
for app in audio-intel pitch-generator tracker web api; do
  if [ -f "apps/$app/.env.example" ] && [ ! -f "apps/$app/.env.local" ]; then
    cp "apps/$app/.env.example" "apps/$app/.env.local"
    echo "  ✓ Created apps/$app/.env.local"
  elif [ -f "apps/$app/.env.local" ]; then
    echo "  ⚠️  apps/$app/.env.local already exists (skipped)"
  fi
done

echo ""
echo "🔧 Checking required tools..."

if command -v supabase &> /dev/null; then
    echo "  ✓ Supabase CLI: $(supabase --version)"
else
    echo "  ⚠️  Supabase CLI not found (optional)"
    echo "     Install: https://supabase.com/docs/guides/cli"
fi

if command -v vercel &> /dev/null; then
    echo "  ✓ Vercel CLI: $(vercel --version)"
else
    echo "  ⚠️  Vercel CLI not found (optional)"
    echo "     Install: npm install -g vercel"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Fill in .env.local files with your credentials"
echo "   2. Check WEEKLY_FOCUS.md for current priorities"
echo "   3. Run 'pnpm dev:all' to start all apps (or use specific commands below)"
echo ""
echo "🚀 Quick start commands:"
echo "   pnpm --filter audio-intel dev       # Start Audio Intel (port 3000)"
echo "   pnpm --filter pitch-generator dev   # Start Pitch Generator (port 3004)"
echo "   pnpm --filter tracker dev           # Start Tracker (port 3001)"
echo ""
echo "📚 Documentation:"
echo "   WEEKLY_FOCUS.md         - Current week priorities"
echo "   AUDIO_INTEL_CONTEXT.md  - Business model & product context"
echo "   BUSINESS_NOTES.md       - Running log of decisions"
echo ""
