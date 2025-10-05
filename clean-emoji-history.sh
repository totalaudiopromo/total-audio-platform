#!/bin/bash

# Script to remove emojis from Git commit history
# This will rewrite the entire Git history to remove emojis from commit messages

echo "🧹 Cleaning emoji history from Git repository..."

# Create a backup branch first
git branch backup-before-emoji-cleanup

# Define emoji patterns to remove
EMOJI_PATTERN="[🎯🚀🔍📝🛠️📊🎵🔵🚨⚠️✅🔄❌💡📈📉🎨🔧📱💻🌐🎪🎭🎬🎤🎧🎸🥁🎹🎺🎻🎷🎼🎵🎶🎸🎺🎻🎷🎼🎤🎧🎹🥁🎪🎭🎬🎨🔧📱💻🌐📊📈📉💡🚨⚠️✅🔄❌🚀🎯🔍📝🛠️🔵🤖✨]"

# Use git filter-branch to rewrite commit messages
git filter-branch --msg-filter '
    # Remove emojis from commit messages
    sed "s/[🎯🚀🔍📝🛠️📊🎵🔵🚨⚠️✅🔄❌💡📈📉🎨🔧📱💻🌐🎪🎭🎬🎤🎧🎸🥁🎹🎺🎻🎷🎼🎵🎶🎸🎺🎻🎷🎼🎤🎧🎹🥁🎪🎭🎬🎨🔧📱💻🌐📊📈📉💡🚨⚠️✅🔄❌🚀🎯🔍📝🛠️🔵🤖✨]//g" | \
    # Clean up multiple spaces
    sed "s/  */ /g" | \
    # Remove leading/trailing spaces
    sed "s/^ *//;s/ *$//"
' -- --all

echo "✅ Emoji cleanup complete!"
echo "📋 Summary of changes:"
echo "   - Removed all emojis from commit messages"
echo "   - Cleaned up extra spaces"
echo "   - Created backup branch: backup-before-emoji-cleanup"
echo ""
echo "⚠️  IMPORTANT: You'll need to force push to update remote repository:"
echo "   git push --force-with-lease origin main"
echo ""
echo "🔍 To verify the cleanup worked:"
echo "   git log --oneline | head -10"
