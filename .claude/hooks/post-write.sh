#!/bin/bash
#
# Post-Write Hook - Auto-organize docs after Claude creates them
# This runs automatically after Claude writes documentation files
#

# Check if written file is a markdown doc in root
FILE_PATH="$1"
FILE_NAME="$(basename "$FILE_PATH")"
FILE_DIR="$(dirname "$FILE_PATH")"

# Only process markdown files written to repo root
if [[ "$FILE_DIR" == "." ]] && [[ "$FILE_NAME" == *.md ]]; then
  # Skip critical files that should stay in root
  case "$FILE_NAME" in
    README.md|SECURITY.md|AUDIO_INTEL_CONTEXT.md|WEEKLY_FOCUS.md|BUSINESS_NOTES.md)
      exit 0  # Don't organize these
      ;;
  esac

  # Run organization script
  bash "$(dirname "$0")/../auto-organize-docs.sh"
fi