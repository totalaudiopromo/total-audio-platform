#!/bin/bash

echo "🔪 KILLING STUCK PROCESSES"
echo "=========================="
echo ""

# Kill processes on port 3005
echo "1. Killing processes on port 3005..."
lsof -ti:3005 2>/dev/null | while read pid; do
  echo "   Killing PID $pid..."
  kill -9 $pid 2>/dev/null && echo "   ✅ Killed $pid" || echo "   ❌ Failed to kill $pid"
done

# Kill Next.js processes
echo ""
echo "2. Killing Next.js processes..."
pkill -9 -f "next dev" 2>/dev/null && echo "   ✅ Killed Next.js dev servers" || echo "   ℹ️  No Next.js dev servers found"
pkill -9 -f "next-server" 2>/dev/null && echo "   ✅ Killed Next.js servers" || echo "   ℹ️  No Next.js servers found"

# Kill node processes with high CPU
echo ""
echo "3. Checking for high CPU node processes..."
ps aux | grep node | awk '$3 > 50.0 {print $2}' | while read pid; do
  echo "   Killing high CPU node process $pid..."
  kill -9 $pid 2>/dev/null && echo "   ✅ Killed $pid" || echo "   ❌ Failed to kill $pid"
done

# Clean build artifacts
echo ""
echo "4. Cleaning build artifacts..."
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/liberty-demo
rm -rf .next 2>/dev/null && echo "   ✅ Removed .next directory" || echo "   ℹ️  No .next directory"
rm -rf node_modules/.cache 2>/dev/null && echo "   ✅ Removed node_modules/.cache" || echo "   ℹ️  No cache directory"
rm -f tsconfig.tsbuildinfo 2>/dev/null && echo "   ✅ Removed tsconfig.tsbuildinfo" || echo "   ℹ️  No tsconfig.tsbuildinfo"

echo ""
echo "=========================="
echo "✅ Cleanup complete"
echo ""
echo "You can now run: pnpm dev"

