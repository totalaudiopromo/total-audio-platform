#!/bin/bash

# Music Newsjacker 3000 - API Keys Setup Script
# Run this script to securely add your API keys to .env.local

echo "🎵 Setting up Music Newsjacker 3000 API Keys..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    touch .env.local
fi

# Add NewsAPI key
echo "Adding NewsAPI key..."
if grep -q "NEWS_API_KEY" .env.local; then
    echo "⚠️  NEWS_API_KEY already exists in .env.local"
    echo "Please manually update it with: d7d51afda66046e287a7139bc9d5e1d8"
else
    echo "NEWS_API_KEY=d7d51afda66046e287a7139bc9d5e1d8" >> .env.local
    echo "✅ NewsAPI key added"
fi

# Add Anthropic API key
echo "Adding Anthropic API key..."
if grep -q "ANTHROPIC_API_KEY" .env.local; then
    echo "⚠️  ANTHROPIC_API_KEY already exists in .env.local"
    echo "Please manually update it with: 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"
else
    echo "ANTHROPIC_API_KEY=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" >> .env.local
    echo "✅ Anthropic API key added"
fi

# Add security comment
if ! grep -q "Music Newsjacker" .env.local; then
    echo "" >> .env.local
    echo "# Music Newsjacker 3000 API Keys" >> .env.local
    echo "# Keep this file secure and never commit to version control" >> .env.local
    echo "" >> .env.local
fi

echo ""
echo "🎉 API keys setup complete!"
echo ""
echo "Your .env.local file now contains:"
echo "✅ NEWS_API_KEY (NewsAPI)"
echo "✅ ANTHROPIC_API_KEY (Claude AI)"
echo ""
echo "Next steps:"
echo "1. Restart your development server"
echo "2. Go to /newsletter-dashboard"
echo "3. Click '🎯 Run Newsjacker' to test"
echo ""
echo "⚠️  Security reminder:"
echo "- Never commit .env.local to version control"
echo "- Keep your API keys secure"
echo "- Rotate keys regularly for security"
