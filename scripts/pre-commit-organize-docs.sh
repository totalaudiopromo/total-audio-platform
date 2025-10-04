#!/bin/bash

# Pre-commit hook to organize docs automatically
# Install: ln -s ../../scripts/pre-commit-organize-docs.sh .git/hooks/pre-commit

set -e

# Only organize docs if .md files have changed
MD_FILES=$(git diff --cached --name-only --diff-filter=AM | grep '\.md$' || true)

if [ -z "$MD_FILES" ]; then
  # No markdown files changed, skip
  exit 0
fi

echo "📝 Markdown files changed, organizing docs..."

# Run the organizer
node scripts/organize-docs.js

# Add any newly organized files to the commit
git add apps/*/docs/

echo "✅ Docs organized and staged"

exit 0

