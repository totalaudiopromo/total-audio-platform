#!/bin/bash
# Automated fix for Tracker brand colours
# Changes blue (Audio Intel) → purple (Tracker brand)

echo "🎨 Fixing Tracker brand colours (blue → purple)..."
echo ""

# Count violations before
BEFORE=$(node scripts/check-brand-colours.js 2>&1 | grep -c "Line")

echo "📊 Violations found: $BEFORE"
echo ""

# Create backup
echo "💾 Creating backup..."
mkdir -p .colour-fix-backup
tar -czf .colour-fix-backup/before-colour-fix-$(date +%Y%m%d-%H%M%S).tar.gz \
  components/ app/ tailwind.config.ts 2>/dev/null

# Fix tailwind.config.ts
echo "🔧 Fixing tailwind.config.ts..."
if [ -f "tailwind.config.ts" ]; then
  sed -i '' 's/#1E88E5/#7C3AED/g' tailwind.config.ts  # blue-600 → purple-600
  sed -i '' 's/#1976D2/#9333EA/g' tailwind.config.ts  # blue-700 → purple-700
fi

# Fix all TypeScript/TSX files
echo "🔧 Fixing component files..."

# Primary replacements (most common)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/blue-600/purple-600/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/blue-700/purple-700/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/blue-800/purple-800/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/blue-900/purple-900/g' {} \;

# Fix text colours
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/text-blue-600/text-purple-600/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/text-blue-700/text-purple-700/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/text-blue-800/text-purple-800/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/text-blue-900/text-purple-900/g' {} \;

# Fix backgrounds
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/bg-blue-600/bg-purple-600/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/bg-blue-700/bg-purple-700/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/bg-blue-800/bg-purple-800/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/bg-blue-900/bg-purple-900/g' {} \;

# Fix hover states
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/hover:bg-blue-700/hover:bg-purple-700/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/hover:bg-blue-800/hover:bg-purple-800/g' {} \;

# Fix borders
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/border-blue-500/border-purple-500/g' {} \;

# Fix gradients (from-blue, to-blue)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/from-blue-500/from-purple-500/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/to-blue-600/to-purple-600/g' {} \;

# Fix amber (Pitch Generator colour)
echo "🔧 Fixing amber colours..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/amber-700/purple-700/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./scripts/*" \
  -exec sed -i '' 's/amber-100/purple-100/g' {} \;

echo ""
echo "✅ Colour replacements complete!"
echo ""
echo "🧪 Running validation..."
node scripts/check-brand-colours.js

echo ""
echo "💾 Backup saved in: .colour-fix-backup/"
echo "🔄 To restore: tar -xzf .colour-fix-backup/before-colour-fix-*.tar.gz"
