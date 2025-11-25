#!/bin/bash

# Fix all import paths for Next.js

cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo

echo "🔧 Fixing import paths for Next.js..."

# Fix all .tsx and .ts files in app/ and components/
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue

  # Fix relative imports to use @ alias
  sed -i '' \
    -e "s|from '../components/|from '@/components/|g" \
    -e "s|from './components/|from '@/components/|g" \
    -e "s|from '../../components/|from '@/components/|g" \
    -e "s|from '../lib/|from '@/lib/|g" \
    -e "s|from './lib/|from '@/lib/|g" \
    -e "s|from '../../lib/|from '@/lib/|g" \
    -e "s|from '../types'|from '@/lib/types'|g" \
    -e "s|from './types'|from '@/lib/types'|g" \
    -e "s|from '../../types'|from '@/lib/types'|g" \
    -e "s|from '../constants'|from '@/lib/constants'|g" \
    -e "s|from './constants'|from '@/lib/constants'|g" \
    "$file"
done

echo "✅ Import paths fixed!"

# Add 'use client' to pages that use hooks (only in app/ directory)
echo "🔧 Adding 'use client' directives..."

find app -type f -name "*.tsx" | while read file; do
  # Check if file uses client-side hooks
  if grep -q "useState\|useEffect\|useRouter\|useParams\|useSearchParams" "$file"; then
    # Check if 'use client' already exists
    if ! grep -q "'use client'" "$file"; then
      # Add 'use client' at the top
      echo "'use client'
$(cat "$file")" > "$file"
    fi
  fi
done

echo "✅ Client directives added!"

# Remove duplicate 'use client' directives
echo "🔧 Removing duplicate 'use client' directives..."

find app -type f -name "*.tsx" | while read file; do
  # Remove duplicate 'use client' lines
  awk '!seen[$0]++ || !/^'\''use client'\''$/' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done

echo "✅ Duplicates removed!"

echo ""
echo "✅ All imports fixed for Next.js!"
