#!/bin/bash
# Golden Pipeline Emergency Rollback
# Phase 10A - 3-App Scope (audio-intel, tracker, pitch-generator)
# Usage: ./scripts/rollback-latest.sh
set -e

echo "🚨 Initiating Golden Pipeline rollback..."
echo "📊 Scope: audio-intel, tracker, pitch-generator"
echo ""

pnpm tsx scripts/golden-rollback.ts || {
  echo ""
  echo "❌ Manual rollback failed. Check logs and Vercel dashboard."
  echo "📍 Vercel Dashboard: https://vercel.com/chris-projects-6ffe0e29"
  exit 1
}

echo ""
echo "✅ Rollback complete."
echo "📝 Check reports/golden/rollback/ for detailed logs."
