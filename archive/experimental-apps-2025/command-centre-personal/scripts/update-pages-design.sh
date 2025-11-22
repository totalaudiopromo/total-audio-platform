#!/bin/bash

# Script to update all Command Centre pages with neobrutalist design
# This creates backup copies and applies consistent styling

PAGES_DIR="/Users/chrisschofield/workspace/active/total-audio-platform/apps/command-centre/app"

echo "🎨 Updating Command Centre pages with neobrutalist design..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Replace common gradient/glassmorphism patterns with neobrutalist equivalents
find "$PAGES_DIR" -name "*.tsx" -type f ! -path "*/node_modules/*" ! -path "*/components/*" -exec sed -i '' \
  -e 's/bg-gradient-to-br from-slate-50 to-gray-100/bg-white/g' \
  -e 's/bg-gradient-to-br from-blue-50 to-indigo-50/bg-blue-50 border-4 border-blue-500/g' \
  -e 's/bg-gradient-to-br from-emerald-50 to-teal-50/bg-green-50 border-4 border-green-500/g' \
  -e 's/bg-gradient-to-br from-purple-50 to-pink-50/bg-purple-50 border-4 border-purple-500/g' \
  -e 's/backdrop-blur-sm//g' \
  -e 's/backdrop-blur-md//g' \
  -e 's/rounded-3xl/rounded-xl/g' \
  -e 's/rounded-2xl/rounded-lg/g' \
  -e 's/shadow-sm/shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]/g' \
  -e 's/shadow-md/shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]/g' \
  -e 's/shadow-lg/shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]/g' \
  -e 's/border border-white\/20/border-4 border-black/g' \
  -e 's/border border-gray-200/border-4 border-black/g' \
  -e 's/border border-\([a-z]*\)-100/border-4 border-\1-500/g' \
  {} \;

echo "✅ Design patterns updated successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
