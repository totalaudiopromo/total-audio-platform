#!/bin/bash
#
# Auto-Organise Documentation
# Automatically organises docs created by Claude into proper directories
# Run this after Claude creates new docs to keep repo tidy
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

echo "🗂️  Auto-organising documentation..."

# Create organized doc structure if it doesn't exist
mkdir -p docs/business
mkdir -p docs/technical
mkdir -p docs/reports
mkdir -p docs/security
mkdir -p docs/guides

# Define doc patterns and their destinations
# Format: "PATTERN:DESTINATION:DESCRIPTION"
declare -a DOC_RULES=(
  "AUDIO_INTEL_CONTEXT.md:docs/business:Business context (KEEP IN ROOT - frequently referenced)"
  "WEEKLY_FOCUS.md:docs/business:Weekly priorities (KEEP IN ROOT - frequently referenced)"
  "BUSINESS_NOTES.md:docs/business:Business notes (KEEP IN ROOT - frequently referenced)"
  "*_AUDIT*.md:docs/reports:Audit reports"
  "*_REPORT*.md:docs/reports:Analysis reports"
  "*_SUMMARY*.md:docs/reports:Summary documents"
  "*_COMPLETE*.md:docs/reports:Completion reports"
  "SECURITY*.md:docs/security:Security docs (except SECURITY.md)"
  "*SETUP*.md:docs/guides:Setup guides"
  "*GUIDE*.md:docs/guides:User guides"
  "*WORKFLOW*.md:docs/technical:Workflow documentation"
  "AGENT_OS*.md:docs/technical:Agent OS documentation"
  "QUICK_*.md:docs/guides:Quick reference guides"
  "*CHECKLIST*.md:docs/guides:Checklists"
)

# Function to check if file should stay in root
should_keep_in_root() {
  local file="$1"
  case "$file" in
    README.md|SECURITY.md|AUDIO_INTEL_CONTEXT.md|WEEKLY_FOCUS.md|BUSINESS_NOTES.md)
      return 0  # Keep in root
      ;;
    *)
      return 1  # Can be moved
      ;;
  esac
}

# Function to find matching rule for a file
find_destination() {
  local file="$1"
  local filename="$(basename "$file")"

  # Check if should stay in root
  if should_keep_in_root "$filename"; then
    echo "ROOT"
    return
  fi

  # Check each rule
  for rule in "${DOC_RULES[@]}"; do
    local pattern="$(echo "$rule" | cut -d: -f1)"
    local dest="$(echo "$rule" | cut -d: -f2)"

    # Skip rules that say KEEP IN ROOT
    if [[ "$dest" == *"KEEP IN ROOT"* ]]; then
      continue
    fi

    # Check if filename matches pattern
    if [[ "$filename" == $pattern ]]; then
      echo "$dest"
      return
    fi
  done

  # Default destination for unmatched docs
  echo "docs/misc"
}

# Find all markdown files in root (excluding README and SECURITY)
moved_count=0
skipped_count=0

echo ""
echo "📋 Processing root-level documentation..."
echo ""

for file in *.md; do
  # Skip if file doesn't exist (in case no .md files)
  [ -e "$file" ] || continue

  # Get destination
  dest=$(find_destination "$file")

  if [ "$dest" = "ROOT" ]; then
    echo "  ✓ Keeping in root: $file"
    ((skipped_count++))
    continue
  fi

  # Create destination directory
  mkdir -p "$dest"

  # Move file
  if [ -f "$dest/$file" ]; then
    echo "  ⚠️  Skipping $file (already exists in $dest)"
    ((skipped_count++))
  else
    mv "$file" "$dest/"
    echo "  ✅ Moved: $file → $dest/"
    ((moved_count++))
  fi
done

echo ""
echo "✨ Organisation complete!"
echo "  📦 Moved: $moved_count files"
echo "  📌 Kept in root: $skipped_count files"
echo ""
echo "📁 Current structure:"
echo "  Root: AUDIO_INTEL_CONTEXT.md, WEEKLY_FOCUS.md, BUSINESS_NOTES.md, README.md, SECURITY.md"
echo "  Reports: docs/reports/"
echo "  Guides: docs/guides/"
echo "  Security: docs/security/"
echo "  Technical: docs/technical/"
echo "  Business: docs/business/"
echo ""
echo "💡 To organise again: bash .claude/auto-organise-docs.sh"