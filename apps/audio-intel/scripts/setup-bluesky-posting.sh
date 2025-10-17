#!/bin/bash

# Bluesky Autonomous Posting - Quick Setup Script
# Run this after you've added your Bluesky credentials to Vercel

set -e

echo "🤖 Bluesky Autonomous Posting Agent - Setup"
echo "============================================"
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this from apps/audio-intel directory"
  exit 1
fi

# Check if bluesky package is installed
echo "📦 Checking dependencies..."
if ! grep -q "@atproto/api" package.json; then
  echo "❌ @atproto/api not found in package.json"
  echo "   Installing..."
  npm install @atproto/api
else
  echo "✅ @atproto/api already installed"
fi

echo ""

# Check if environment variables are set (local only)
echo "🔑 Checking local environment variables..."
if [ -f ".env.local" ]; then
  if grep -q "BLUESKY_IDENTIFIER" .env.local && grep -q "BLUESKY_APP_PASSWORD" .env.local; then
    echo "✅ Bluesky credentials found in .env.local"
  else
    echo "⚠️  Bluesky credentials not found in .env.local"
    echo "   Add these to .env.local for local testing:"
    echo ""
    echo "   BLUESKY_IDENTIFIER=yourname.bsky.social"
    echo "   BLUESKY_APP_PASSWORD=your-app-password"
    echo "   CRON_SECRET=your-random-secret"
    echo ""
  fi
else
  echo "⚠️  No .env.local file found"
  echo "   Create .env.local and add your Bluesky credentials for local testing"
fi

echo ""

# Check if vercel.json has cron configured
echo "⏰ Checking Vercel cron configuration..."
if grep -q "crons" vercel.json; then
  echo "✅ Vercel cron configured in vercel.json"
else
  echo "❌ Vercel cron not found in vercel.json"
  exit 1
fi

echo ""

# Check if API route exists
echo "🛣️  Checking API route..."
if [ -f "app/api/cron/social-posting/route.ts" ]; then
  echo "✅ Cron API route exists"
else
  echo "❌ Cron API route not found"
  exit 1
fi

echo ""

# Check if posting agent exists
echo "🤖 Checking Bluesky posting agent..."
if [ -f "lib/bluesky-posting-agent.ts" ]; then
  echo "✅ Bluesky posting agent exists"
else
  echo "❌ Bluesky posting agent not found"
  exit 1
fi

echo ""

# Check if content calendar exists
echo "📅 Checking content calendar..."
if [ -f "social-content/CONTENT_CALENDAR.json" ]; then
  echo "✅ Content calendar exists"
  BLUESKY_POSTS=$(grep -o '"platform": "Bluesky"' social-content/CONTENT_CALENDAR.json | wc -l | tr -d ' ')
  echo "   Found $BLUESKY_POSTS Bluesky posts scheduled"
else
  echo "❌ Content calendar not found"
  exit 1
fi

echo ""
echo "============================================"
echo "✅ Setup Check Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Add Bluesky credentials to Vercel:"
echo "   https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings/environment-variables"
echo ""
echo "   BLUESKY_IDENTIFIER=yourname.bsky.social"
echo "   BLUESKY_APP_PASSWORD=your-app-password"
echo "   CRON_SECRET=random-secret"
echo ""
echo "2. Deploy to Vercel:"
echo "   git add ."
echo "   git commit -m 'feat: add Bluesky autonomous posting'"
echo "   git push"
echo ""
echo "3. Monitor in Vercel logs:"
echo "   https://vercel.com/chris-projects-6ffe0e29/audio-intel/logs"
echo ""
echo "🎯 Posting Schedule: 9am and 5pm UK time (daily)"
echo "📊 Total Posts: $BLUESKY_POSTS Bluesky posts over 4 weeks"
echo ""
echo "📖 Full docs: BLUESKY_AUTONOMOUS_POSTING_SETUP.md"
echo ""
