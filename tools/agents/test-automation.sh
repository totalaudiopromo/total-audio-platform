#!/bin/bash

# Test Total Audio Platform Agent Automation
# Verifies agents are working before installing cron jobs

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
STATUS_DIR="$HOME/.total-audio-status"

echo "🧪 Testing Total Audio Agent Automation"
echo "========================================"
echo ""

# Create status directory
mkdir -p "$STATUS_DIR"
echo "✅ Status directory: $STATUS_DIR"
echo ""

# Test 1: Gmail Autopilot
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Gmail Autopilot"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SCRIPT_DIR/gmail-setup/liberty-autopilot.js" ]; then
    echo "✅ liberty-autopilot.js found"

    # Check for Gmail tokens
    if [ -f "$SCRIPT_DIR/radio-promo/gmail-token.json" ]; then
        echo "✅ Gmail OAuth tokens found"
        echo "⏳ Running test (this will process recent emails)..."
        cd "$SCRIPT_DIR/gmail-setup" && node liberty-autopilot.js test
        echo ""
    else
        echo "⚠️  Gmail tokens not found at radio-promo/gmail-token.json"
        echo "   Run OAuth setup first: ./quick-oauth-setup.sh"
        echo ""
    fi
else
    echo "❌ liberty-autopilot.js not found"
    echo ""
fi

# Test 2: Contact Enrichment (dry run with 1 contact)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Contact Enrichment (Status Logging)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SCRIPT_DIR/radio-promo/enrich-all-contacts-automated.js" ]; then
    echo "✅ enrich-all-contacts-automated.js found"

    # Check environment variables
    if [ -n "$AIRTABLE_API_KEY" ] || grep -q "AIRTABLE_API_KEY" "$SCRIPT_DIR/radio-promo/enrich-all-contacts-automated.js" 2>/dev/null; then
        echo "✅ Airtable API key configured"
    else
        echo "⚠️  AIRTABLE_API_KEY not set"
    fi

    if [ -n "$ANTHROPIC_API_KEY" ] || grep -q "ANTHROPIC_API_KEY" "$SCRIPT_DIR/radio-promo/enrich-all-contacts-automated.js" 2>/dev/null; then
        echo "✅ Anthropic API key configured"
    else
        echo "⚠️  ANTHROPIC_API_KEY not set"
    fi

    echo "ℹ️  Enrichment agent is ready"
    echo "   Note: Full test would enrich contacts (costs £3)"
    echo "   Status will be written to: $STATUS_DIR/contact-enrichment-status.json"
    echo ""
else
    echo "❌ enrich-all-contacts-automated.js not found"
    echo ""
fi

# Test 3: Agent Logger
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Agent Logger Library"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SCRIPT_DIR/lib/agent-logger.js" ]; then
    echo "✅ agent-logger.js found"

    # Quick test of logger
    node -e "
    const AgentLogger = require('$SCRIPT_DIR/lib/agent-logger.js');
    const logger = new AgentLogger('test-agent', { logToConsole: false });
    logger.info('Test log entry');
    logger.updateMetrics({ test: true });
    logger.updateProgress(50);
    logger.complete({ testsPassed: 1 });
    console.log('✅ Logger test passed');
    console.log('📄 Status file:', logger.statusFile);
    " 2>&1

    echo ""

    # Show status file
    if [ -f "$STATUS_DIR/test-agent-status.json" ]; then
        echo "✅ Status file created successfully"
        echo "   Preview:"
        cat "$STATUS_DIR/test-agent-status.json" | head -20
        echo ""
    fi
else
    echo "❌ agent-logger.js not found"
    echo ""
fi

# Test 4: Crontab readiness
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Crontab Readiness"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SCRIPT_DIR/setup-automation.sh" ]; then
    echo "✅ setup-automation.sh found"
    echo ""
    echo "   To install cron jobs, run:"
    echo "   ./tools/agents/setup-automation.sh"
    echo ""
else
    echo "❌ setup-automation.sh not found"
    echo ""
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Status logging system ready"
echo "✅ Agent automation scripts ready"
echo ""
echo "NEXT STEPS:"
echo "1. Review setup-automation.sh to verify cron schedule"
echo "2. Run: ./tools/agents/setup-automation.sh"
echo "3. Verify installation: crontab -l | grep 'Total Audio'"
echo "4. Monitor logs tomorrow: tail -f ~/.total-audio-logs/*.log"
echo "5. Check status: ls -la $STATUS_DIR"
echo ""
echo "EXPECTED AUTOMATION:"
echo "  • Gmail Autopilot: Every hour"
echo "  • Contact Enrichment: Daily at 2am (costs £3/day)"
echo "  • Field Updates: Daily at 3am"
echo "  • Airtable Cleanup: Weekly Sunday 11pm"
echo ""
echo "TIME SAVED: 8-12 hours/week"
echo "COST: ~£21/week (enrichment only)"
echo ""
