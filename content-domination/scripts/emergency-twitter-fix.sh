#!/bin/bash

# Emergency Twitter Rate Limit Fix
# Immediately disables Twitter API to prevent further rate limiting
# Redirects system to LinkedIn-focused zero-cost operation

echo "🚨 EMERGENCY TWITTER RATE LIMIT FIX"
echo "====================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Copying from .env.economy..."
    cp .env.economy .env
fi

echo "🔧 Disabling Twitter API usage..."

# Disable Twitter features immediately
echo "" >> .env
echo "# === EMERGENCY TWITTER RATE LIMIT FIX ===" >> .env
echo "ENABLE_TWITTER_SCANNING=false" >> .env
echo "ENABLE_TWITTER_POSTING=false" >> .env
echo "TWITTER_API_DISABLED=true" >> .env
echo "RATE_LIMIT_EXCEEDED=true" >> .env
echo "" >> .env

echo "📱 Switching to LinkedIn-focused operation..."

# Switch to LinkedIn as primary platform
echo "# === LINKEDIN PRIMARY PLATFORM ===" >> .env
echo "PRIMARY_SOCIAL_PLATFORM=linkedin" >> .env
echo "ENABLE_LINKEDIN_POSTING=true" >> .env
echo "LINKEDIN_FREQUENCY_BOOST=true" >> .env
echo "" >> .env

echo "🎨 Enabling template-only mode for now..."

# Enable template mode to avoid AI costs
echo "# === TEMPLATE-ONLY MODE (ZERO COST) ===" >> .env
echo "TEMPLATE_MODE_ONLY=true" >> .env
echo "CLAUDE_MIN_SCORE_FOR_AI=0.99" >> .env
echo "ENABLE_TEMPLATE_FALLBACK=true" >> .env
echo "TEMPLATE_PRIORITY=cost_saving" >> .env
echo "" >> .env

echo "📊 Enabling strict cost monitoring..."

# Enable aggressive cost monitoring
echo "# === STRICT COST CONTROLS ===" >> .env
echo "MAX_MONTHLY_SPEND_GBP=0" >> .env
echo "EMERGENCY_SHUTDOWN_ON_COSTS=true" >> .env
echo "REQUIRE_MANUAL_APPROVAL_FOR_COSTS=true" >> .env
echo "ENABLE_COST_TRACKING=true" >> .env
echo "" >> .env

echo "⏰ Ensuring business hours only operation..."

# Ensure business hours only to conserve resources
echo "# === BUSINESS HOURS ONLY ===" >> .env
echo "BUSINESS_HOURS_ONLY=true" >> .env
echo "WEEKEND_MODE=off" >> .env
echo "ECONOMY_RSS_SCAN_INTERVAL=60" >> .env
echo "" >> .env

echo ""
echo "✅ EMERGENCY FIX APPLIED!"
echo ""
echo "📋 WHAT WAS CHANGED:"
echo "   • Twitter API completely disabled"
echo "   • LinkedIn set as primary platform"
echo "   • Template-only mode enabled (zero AI costs)"
echo "   • Strict cost monitoring active"
echo "   • Business hours only operation"
echo ""
echo "📈 YOUR SYSTEM WILL NOW:"
echo "   • Continue RSS monitoring (FREE)"
echo "   • Generate content via templates (FREE)"
echo "   • Focus on LinkedIn posting (FREE tier)"
echo "   • Send email alerts (FREE)"
echo "   • Store in Notion (FREE)"
echo "   • Operate with ZERO ongoing costs"
echo ""
echo "🎯 NEXT STEPS:"
echo "   1. Run: npm run verify-setup"
echo "   2. Check: npm run cost-dashboard (should show £0.00)"
echo "   3. Test: npm run start:economy"
echo ""
echo "📅 TWITTER RATE LIMITS RESET:"
echo "   • Monthly limits reset on the 1st of each month"
echo "   • You can re-enable Twitter next month if desired"
echo "   • For now, LinkedIn + manual Twitter posting recommended"
echo ""
echo "💡 MANUAL TWITTER STRATEGY:"
echo "   • AI generates content → Review in Notion → Copy to Twitter manually"
echo "   • This actually gives you more control and better engagement"
echo "   • Zero API costs while maintaining content quality"
echo ""

# Create a status file
echo "$(date): Emergency Twitter rate limit fix applied" > .twitter-fix-applied

echo "🚀 Ready to run zero-cost operation!"
echo ""
echo "Run this to start:"
echo "   npm run start:economy"
echo ""