#!/bin/bash

# Fix amber colours to teal across Tracker app
# Teal brand colour: #14B8A6

echo "Fixing amber colours to teal in Tracker components..."

# Find all TSX files in components directory
find ./components -name "*.tsx" -type f | while read file; do
  # Replace amber with teal
  sed -i '' 's/bg-amber-/bg-teal-/g' "$file"
  sed -i '' 's/text-amber-/text-teal-/g' "$file"
  sed -i '' 's/border-amber-/border-teal-/g' "$file"
  sed -i '' 's/from-amber-/from-teal-/g' "$file"
  sed -i '' 's/to-amber-/to-teal-/g' "$file"
  sed -i '' 's/hover:bg-amber-/hover:bg-teal-/g' "$file"
  sed -i '' 's/focus:ring-amber-/focus:ring-teal-/g' "$file"
  sed -i '' 's/focus:border-amber-/focus:border-teal-/g' "$file"
  echo "Fixed: $file"
done

# Fix app pages
find ./app -name "*.tsx" -type f | while read file; do
  sed -i '' 's/bg-amber-/bg-teal-/g' "$file"
  sed -i '' 's/text-amber-/text-teal-/g' "$file"
  sed -i '' 's/border-amber-/border-teal-/g' "$file"
  sed -i '' 's/from-amber-/from-teal-/g' "$file"
  sed -i '' 's/to-amber-/to-teal-/g' "$file"
  sed -i '' 's/hover:bg-amber-/hover:bg-teal-/g' "$file"
  sed -i '' 's/focus:ring-amber-/focus:ring-teal-/g' "$file"
  sed -i '' 's/focus:border-amber-/focus:border-teal-/g' "$file"
  echo "Fixed: $file"
done

echo "✅ Amber to teal conversion complete!"
echo "Replaced bg-amber-, text-amber-, border-amber-, gradients, hover, and focus states"
