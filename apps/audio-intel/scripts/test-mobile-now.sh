#!/bin/bash

# 📱 AUDIO INTEL IMMEDIATE MOBILE TESTING SCRIPT
# Quick mobile testing setup for revenue-critical issues

echo "🎵 Audio Intel Mobile Testing Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the Audio Intel root directory"
    echo "Expected: /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel"
    exit 1
fi

# Create necessary directories
echo "📁 Setting up test directories..."
mkdir -p tests/mobile
mkdir -p screenshots/mobile
mkdir -p reports/mobile

# Install testing dependencies if not present
echo "📦 Installing mobile testing dependencies..."

# Check if Playwright is installed
if ! npm list @playwright/test >/dev/null 2>&1; then
    echo "Installing Playwright for mobile testing..."
    npm install --save-dev @playwright/test
    npx playwright install
else
    echo "✅ Playwright already installed"
fi

# Check if localtunnel is installed for mobile device testing
if ! npm list localtunnel >/dev/null 2>&1; then
    echo "Installing localtunnel for mobile device testing..."
    npm install --save-dev localtunnel
else
    echo "✅ Localtunnel already installed"
fi

# Start local development server for mobile testing
echo "🚀 Starting Audio Intel for mobile testing..."

# Check if dev server is already running
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Development server already running on port 3000"
    DEV_RUNNING=true
else
    echo "Starting development server..."
    npm run dev:audio-intel &
    DEV_PID=$!
    echo "Started dev server with PID: $DEV_PID"

    # Wait for server to start
    echo "Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 >/dev/null; then
            echo "✅ Development server ready!"
            break
        fi
        sleep 1
        echo -n "."
    done
    DEV_RUNNING=false
fi

# Create mobile testing configuration
echo "⚙️ Creating mobile test configuration..."

cat > playwright.config.js << 'EOF'
// Audio Intel Mobile Testing Configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/mobile',
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for mobile testing
  reporter: [
    ['html', { outputFolder: './reports/mobile' }],
    ['json', { outputFile: './reports/mobile/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Mobile device configurations for UK market
  projects: [
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'Mobile Safari iPad',
      use: { ...devices['iPad Pro'] },
    }
  ],

  // Local server setup
  webServer: {
    command: 'npm run dev:audio-intel',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
EOF

# Create quick mobile test runner
echo "🧪 Creating quick mobile test runner..."

cat > tests/mobile/quick-mobile-check.test.js << 'EOF'
/**
 * QUICK MOBILE CHECK - Critical Issues Only
 * Run this first to identify blocking mobile problems
 */

const { test, expect, devices } = require('@playwright/test');

test.describe('Critical Mobile Issues Check', () => {
  test.use({ ...devices['iPhone 13'] });

  test('Homepage loads and CTA is accessible', async ({ page }) => {
    await page.goto('/');

    // Check page loads within 3 seconds
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    if (loadTime > 3000) {
      console.warn(`⚠️ SLOW MOBILE LOAD: ${loadTime}ms (target: <3000ms)`);
    }

    // Find main CTA button
    const ctaButton = page.locator('button').filter({ hasText: /try|demo|start|get started/i }).first();
    await expect(ctaButton).toBeVisible();

    // Check button size is touch-friendly
    const buttonBox = await ctaButton.boundingBox();
    expect(buttonBox.height).toBeGreaterThan(44, 'CTA button too small for mobile');
  });

  test('Upload page mobile usability', async ({ page }) => {
    await page.goto('/upload');

    // Check upload UI is visible
    await expect(page.getByText('Upload Contacts')).toBeVisible();

    // Test file input accessibility
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();

    // Check form fits mobile viewport
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const formBox = await form.boundingBox();
      const viewport = page.viewportSize();
      expect(formBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test('Critical errors and console logs', async ({ page }) => {
    const errors = [];
    const consoleMessages = [];

    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for critical JavaScript errors
    const criticalErrors = errors.filter(error =>
      error.includes('ReferenceError') ||
      error.includes('TypeError') ||
      error.includes('SyntaxError')
    );

    if (criticalErrors.length > 0) {
      console.error('🚨 CRITICAL MOBILE ERRORS:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });
});
EOF

# Expose local server to mobile devices
echo "📱 Setting up mobile device access..."

# Start localtunnel in background for mobile device testing
npx localtunnel --port 3000 --subdomain audio-intel-mobile-test > tunnel.log 2>&1 &
TUNNEL_PID=$!

sleep 3

if [ -f tunnel.log ]; then
    TUNNEL_URL=$(grep -o 'https://[^[:space:]]*' tunnel.log | head -1)
    echo "📱 Mobile access URL: $TUNNEL_URL"
    echo "   Use this URL to test on real mobile devices"
    echo "   (URL saved to tunnel.log)"
else
    echo "⚠️  Tunnel setup may have failed - check tunnel.log"
fi

# Run quick mobile tests
echo "🧪 Running critical mobile tests..."
echo "This will test the most important mobile issues that could block customers"

npx playwright test tests/mobile/quick-mobile-check.test.js --reporter=line

# Generate mobile test report
echo "📊 Generating mobile test report..."

# Create simple mobile test report
cat > reports/mobile/MOBILE_TEST_SUMMARY.md << EOF
# Audio Intel Mobile Test Results
Generated: $(date)

## Test Environment
- Local Server: http://localhost:3000
- Mobile Access: $TUNNEL_URL
- Test Device: iPhone 13 emulation

## Quick Mobile Check Results
$(if [ $? -eq 0 ]; then echo "✅ All critical mobile tests passed"; else echo "❌ Some mobile tests failed - check detailed report"; fi)

## Next Steps
1. Check detailed test report in reports/mobile/
2. Test on real mobile devices using: $TUNNEL_URL
3. Fix any identified mobile issues
4. Re-run tests after fixes

## Manual Testing Checklist
- [ ] Test file upload on actual iPhone
- [ ] Test file upload on actual Android device
- [ ] Complete full user journey on mobile
- [ ] Test form validation on mobile
- [ ] Check results table scrolling on mobile
- [ ] Verify export download on mobile

## Performance Check
- [ ] Homepage loads in under 3 seconds on mobile
- [ ] No JavaScript errors in console
- [ ] All buttons are thumb-friendly (44px min)
- [ ] Forms work with mobile keyboards
EOF

echo ""
echo "✅ Mobile testing setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Check the mobile test report: reports/mobile/MOBILE_TEST_SUMMARY.md"
echo "2. Test on real devices using: $TUNNEL_URL"
echo "3. Run full mobile test suite: npx playwright test tests/mobile/"
echo "4. Fix any mobile issues found"
echo ""
echo "💡 Pro tip: Keep this terminal open to maintain the tunnel for mobile device testing"
echo ""

# Save process IDs for cleanup
echo "$DEV_PID" > .dev-server.pid 2>/dev/null
echo "$TUNNEL_PID" > .tunnel.pid 2>/dev/null

# Create cleanup script
cat > scripts/cleanup-mobile-test.sh << 'EOF'
#!/bin/bash
echo "Cleaning up mobile testing processes..."

if [ -f .dev-server.pid ]; then
    kill $(cat .dev-server.pid) 2>/dev/null
    rm .dev-server.pid
    echo "✅ Development server stopped"
fi

if [ -f .tunnel.pid ]; then
    kill $(cat .tunnel.pid) 2>/dev/null
    rm .tunnel.pid
    echo "✅ Tunnel stopped"
fi

echo "🧹 Mobile testing cleanup complete"
EOF

chmod +x scripts/cleanup-mobile-test.sh

echo "🛑 To stop mobile testing: ./scripts/cleanup-mobile-test.sh"