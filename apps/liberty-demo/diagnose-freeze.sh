#!/bin/bash

echo "🔍 DIAGNOSING FREEZE ISSUE"
echo "=========================="
echo ""

echo "1. Checking for processes on port 3005..."
lsof -ti:3005 2>/dev/null | while read pid; do
  echo "   ⚠️  Process $pid using port 3005:"
  ps -p $pid -o pid,pcpu,pmem,command 2>/dev/null || echo "   (process not found)"
done || echo "   ✅ No process on port 3005"

echo ""
echo "2. Checking for Next.js processes..."
ps aux | grep -E "next|node.*dev" | grep -v grep | while read line; do
  echo "   ⚠️  $line"
done || echo "   ✅ No Next.js processes found"

echo ""
echo "3. Checking for high CPU processes..."
ps aux | awk '$3 > 50.0 {print "   ⚠️  PID", $2, "CPU:", $3"%", "CMD:", $11, $12, $13}' | head -5 || echo "   ✅ No high CPU processes"

echo ""
echo "4. Checking for .next directories..."
find /Users/chrisschofield/workspace/active/total-audio-platform/apps -name ".next" -type d 2>/dev/null | while read dir; do
  size=$(du -sh "$dir" 2>/dev/null | cut -f1)
  echo "   ⚠️  Found: $dir ($size)"
done || echo "   ✅ No .next directories found"

echo ""
echo "5. Checking for port conflicts..."
grep -r "3005" /Users/chrisschofield/workspace/active/total-audio-platform/apps/*/package.json 2>/dev/null | while read line; do
  echo "   ⚠️  $line"
done || echo "   ✅ No other apps using port 3005"

echo ""
echo "6. Checking for file watcher limits..."
echo "   Current limit: $(ulimit -n)"
echo "   (If < 1024, this could cause issues)"

echo ""
echo "7. Checking for zombie processes..."
ps aux | awk '$8 ~ /Z/ {print "   ⚠️  Zombie process:", $2, $11}' || echo "   ✅ No zombie processes"

echo ""
echo "8. Checking TypeScript build info..."
if [ -f "tsconfig.tsbuildinfo" ]; then
  size=$(du -sh tsconfig.tsbuildinfo 2>/dev/null | cut -f1)
  echo "   ⚠️  Found tsconfig.tsbuildinfo ($size) - this can cause issues"
else
  echo "   ✅ No tsconfig.tsbuildinfo"
fi

echo ""
echo "=========================="
echo "✅ Diagnosis complete"

