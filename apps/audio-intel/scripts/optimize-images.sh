#!/bin/bash

# Image Optimization Script for Audio Intel
# Converts PNG images to WebP format for 70-80% size reduction

echo "🖼️  Audio Intel Image Optimization"
echo "=================================="

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "⚠️  cwebp not found. Installing via Homebrew..."
    brew install webp
fi

cd "$(dirname "$0")/../public/assets/loading-states"

echo ""
echo "Optimizing mascot images..."

# Optimize each PNG to WebP with quality 75
for file in *.png; do
    if [ -f "$file" ]; then
        output="${file%.png}.webp"
        original_size=$(ls -lh "$file" | awk '{print $5}')

        cwebp -q 75 "$file" -o "$output" 2>/dev/null

        if [ -f "$output" ]; then
            new_size=$(ls -lh "$output" | awk '{print $5}')
            echo "✓ $file ($original_size) → $output ($new_size)"
        fi
    fi
done

# Optimize founder photo
cd ../../images
if [ -f "chris-schofield-founder.jpg" ]; then
    original_size=$(ls -lh "chris-schofield-founder.jpg" | awk '{print $5}')
    cwebp -q 80 "chris-schofield-founder.jpg" -o "chris-schofield-founder.webp" 2>/dev/null
    new_size=$(ls -lh "chris-schofield-founder.webp" | awk '{print $5}')
    echo "✓ chris-schofield-founder.jpg ($original_size) → chris-schofield-founder.webp ($new_size)"
fi

echo ""
echo "✅ Optimization complete!"
echo ""
echo "Next steps:"
echo "1. Update image references in page.tsx to use .webp files"
echo "2. Keep original .png/.jpg files as fallbacks for older browsers"
