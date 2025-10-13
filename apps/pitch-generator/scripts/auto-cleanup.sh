#!/bin/bash

# Automatic Directory Cleanup Script
# Runs periodically to keep the project clean and organized

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🤖 Auto-cleanup starting for Pitch Generator..."
echo "📍 Working directory: $PROJECT_ROOT"
echo ""

# Track what was cleaned
CLEANED_COUNT=0

# 1. Remove common temporary files
echo "🗑️  Removing temporary files..."

TEMP_PATTERNS=(
    ".DS_Store"
    "*.log"
    "*.tmp"
    "*~"
    ".*.swp"
    ".*.swo"
    "Thumbs.db"
)

for pattern in "${TEMP_PATTERNS[@]}"; do
    files=$(find . -name "$pattern" -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" 2>/dev/null || true)
    if [ -n "$files" ]; then
        echo "$files" | while read -r file; do
            if [ -f "$file" ]; then
                echo "  → Removing: $file"
                rm "$file"
                ((CLEANED_COUNT++))
            fi
        done
    fi
done

# 2. Clean up empty directories (except specific ones)
echo ""
echo "📁 Removing empty directories..."

# Find empty directories, excluding protected paths
# Only remove empty directories in safe locations (scripts, temp, etc.)
find . -type d -empty \
    -not -path "./node_modules*" \
    -not -path "./.next*" \
    -not -path "./.git*" \
    -not -path "./public*" \
    -not -path "./app*" \
    -not -path "./components*" \
    -not -path "./lib*" \
    -not -path "./docs*" \
    -not -path "./styles*" \
    -not -path "./types*" \
    -not -path "./utils*" \
    2>/dev/null | while read -r dir; do
    if [ -d "$dir" ] && [ "$dir" != "." ]; then
        echo "  → Removing empty directory: $dir"
        rmdir "$dir" 2>/dev/null || true
        ((CLEANED_COUNT++))
    fi
done

# 3. Check for duplicate files in root
echo ""
echo "🔍 Checking for duplicate documentation..."

# Check for README duplicates
readme_count=0
for file in README.md readme.md README.MD; do
    if [ -f "$file" ]; then
        ((readme_count++))
    fi
done

if [ $readme_count -gt 1 ]; then
    echo "  ⚠️  Multiple README files found"
    echo "     Consider consolidating these files"
fi

# Check for QUICKSTART duplicates
quickstart_count=0
for file in QUICKSTART.md QUICK_START.md; do
    if [ -f "$file" ]; then
        ((quickstart_count++))
    fi
done

if [ $quickstart_count -gt 1 ]; then
    echo "  ⚠️  Multiple QUICKSTART files found"
    echo "     Consider consolidating these files"
fi

# 4. Organize stray markdown files
echo ""
echo "📝 Checking for misplaced documentation..."

# Find markdown files in root (excluding known good ones)
KEEP_IN_ROOT=(
    "README.md"
    "PRIORITY_AUDIT_REPORT.md"
    "CHANGELOG.md"
    "LICENSE.md"
)

misplaced_docs=$(find . -maxdepth 1 -name "*.md" -type f | grep -v -E "$(IFS='|'; echo "${KEEP_IN_ROOT[*]}")" || true)

if [ -n "$misplaced_docs" ]; then
    echo "  📌 Found documentation that could be organized:"
    echo "$misplaced_docs" | while read -r file; do
        echo "     - $file (consider moving to docs/)"
    done
else
    echo "  ✓ All documentation properly organized"
fi

# 5. Check for oversized files (excluding node_modules, .next)
echo ""
echo "📦 Checking for large files..."

large_files=$(find . -type f -size +10M \
    -not -path "./node_modules/*" \
    -not -path "./.next/*" \
    -not -path "./.git/*" \
    -not -path "./public/*" \
    2>/dev/null || true)

if [ -n "$large_files" ]; then
    echo "  ⚠️  Large files found (>10MB):"
    echo "$large_files" | while read -r file; do
        size=$(du -h "$file" | cut -f1)
        echo "     - $file ($size)"
    done
    echo "     Consider optimizing or moving to cloud storage"
else
    echo "  ✓ No oversized files found"
fi

# 6. Clean up old build artifacts (optional)
echo ""
echo "🏗️  Checking build artifacts..."

if [ -d ".next" ]; then
    size=$(du -sh .next 2>/dev/null | cut -f1)
    echo "  📊 .next directory size: $size"
    echo "     Run 'rm -rf .next' to clean build cache if needed"
fi

# 7. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Auto-cleanup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Cleanup summary:"
echo "  - Temporary files removed: $CLEANED_COUNT"
echo "  - Project size: $(du -sh . 2>/dev/null | cut -f1)"
echo ""

# 8. Optional: Show directory structure
if [ "$1" = "--show-tree" ]; then
    echo "📁 Current directory structure:"
    tree -L 2 -I 'node_modules|.next|.git' --dirsfirst || \
    find . -maxdepth 2 -type d \
        -not -path "./node_modules*" \
        -not -path "./.next*" \
        -not -path "./.git*" \
        | sort
fi

echo "💡 Tips:"
echo "  - Run with --show-tree to see directory structure"
echo "  - Add to cron/scheduled tasks for automatic cleanup"
echo "  - Schedule: 0 0 * * 0 (weekly on Sunday)"
echo ""
