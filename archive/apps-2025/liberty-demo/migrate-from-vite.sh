#!/bin/bash

# Migration script from Vite liberty-dashboard to Next.js liberty-demo
# Run this after you've committed your work in the old directory

OLD_DIR="/Users/chrisschofield/workspace/liberty-music-pr/liberty-dashboard"
NEW_DIR="/Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo"

echo "🚀 Migrating Liberty Dashboard from Vite to Next.js..."
echo ""

# Check if old directory exists
if [ ! -d "$OLD_DIR" ]; then
  echo "❌ Old directory not found: $OLD_DIR"
  exit 1
fi

# Backup components
echo "📦 Copying components..."
if [ -d "$OLD_DIR/components" ]; then
  cp -r "$OLD_DIR/components"/* "$NEW_DIR/components/" 2>/dev/null
  echo "✅ Components copied"
else
  echo "⚠️  No components directory found in old project"
fi

# Copy assets
echo "📦 Copying public assets..."
if [ -d "$OLD_DIR/public" ]; then
  cp -r "$OLD_DIR/public"/* "$NEW_DIR/public/" 2>/dev/null
  echo "✅ Public assets copied"
fi

# Copy images/logos from root
if [ -f "$OLD_DIR/logo_black.png" ]; then
  cp "$OLD_DIR/logo_black.png" "$NEW_DIR/public/"
  echo "✅ logo_black.png copied to public/"
fi

if [ -f "$OLD_DIR/logo_dog.png" ]; then
  cp "$OLD_DIR/logo_dog.png" "$NEW_DIR/public/"
  echo "✅ logo_dog.png copied to public/"
fi

# Copy lib/utilities
echo "📦 Copying lib/utilities..."
if [ -d "$OLD_DIR/lib" ]; then
  cp -r "$OLD_DIR/lib"/* "$NEW_DIR/lib/" 2>/dev/null
  echo "✅ Lib copied"
fi

# Copy types
echo "📦 Copying types..."
if [ -f "$OLD_DIR/types.ts" ]; then
  cp "$OLD_DIR/types.ts" "$NEW_DIR/lib/types.ts"
  echo "✅ types.ts copied to lib/"
fi

# Copy constants
if [ -f "$OLD_DIR/constants.ts" ]; then
  cp "$OLD_DIR/constants.ts" "$NEW_DIR/lib/constants.ts"
  echo "✅ constants.ts copied to lib/"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo ""
echo "1. Convert pages from React Router to Next.js App Router:"
echo "   - Check $OLD_DIR/pages/ or $OLD_DIR/App.tsx for routes"
echo "   - Create corresponding app/*/page.tsx files"
echo ""
echo "2. Update import statements:"
echo "   - Change relative imports to use @/ alias or @total-audio/ui"
echo "   - Update React Router imports to Next.js navigation"
echo ""
echo "3. Update routing:"
echo "   - Replace <Link to=\"/path\"> with <Link href=\"/path\">"
echo "   - Replace useNavigate() with useRouter() from 'next/navigation'"
echo ""
echo "4. Test the app:"
echo "   cd $NEW_DIR"
echo "   pnpm dev"
echo ""
echo "5. Review and commit changes"
echo ""
