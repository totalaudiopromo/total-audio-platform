#!/bin/bash

# Setup Audio Intel for Contact Enrichment
# This script gets Audio Intel running so we can enrich all contacts

echo "🎵 Setting up Audio Intel for Contact Enrichment..."
echo ""

# Check if we're in the right directory
if [ ! -d "../../../apps/audio-intel" ]; then
    echo "❌ Audio Intel directory not found. Please run from the correct location."
    exit 1
fi

# Navigate to Audio Intel
cd ../../../apps/audio-intel

echo "📁 Navigated to Audio Intel directory"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Audio Intel dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating Audio Intel environment file..."
    cat > .env.local << EOF
# Audio Intel Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
PERPLEXITY_API_KEY=your_perplexity_api_key_here
# Add other required API keys here
EOF
    echo "✅ Created .env.local file"
    echo "📝 Please add your API keys to .env.local"
    echo ""
fi

echo "🚀 Starting Audio Intel..."
echo "   URL: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

# Start Audio Intel in development mode
npm run dev
