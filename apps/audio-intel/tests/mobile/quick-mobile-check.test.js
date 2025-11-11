/**
 * QUICK MOBILE CHECK - Critical Issues Only
 * Run this first to identify blocking mobile problems
 */

const { test, expect, devices } = require('@playwright/test');

// Configure mobile device at top level
test.use({ ...devices['iPhone 13'] });

test.describe('Critical Mobile Issues Check', () => {
  test('Homepage loads and CTA is accessible', async ({ page }) => {
    await page.goto('/');

    // Check page loads within 3 seconds
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    if (loadTime > 3000) {
      console.warn(`⚠️ SLOW MOBILE LOAD: ${loadTime}ms (target: <3000ms)`);
    }

    // Find main CTA button (updated selector for actual button text)
    const ctaButton = page
      .locator('a.cta-button, a')
      .filter({ hasText: /get my free trial/i })
      .first();
    await expect(ctaButton).toBeVisible();

    // Check button size is touch-friendly
    const buttonBox = await ctaButton.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44, 'CTA button too small for mobile');
  });

  test('Demo page mobile usability', async ({ page }) => {
    await page.goto('/demo');

    // Check demo page loads and has enrichment functionality
    await expect(
      page.getByText(/contact enrichment|see it in action|enrich contact/i).first()
    ).toBeVisible();

    // Test email input accessibility
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();

    // Check enrich button is visible and accessible
    const enrichButton = page
      .locator('button')
      .filter({ hasText: /enrich contact/i })
      .first();
    await expect(enrichButton).toBeVisible();

    // Verify button meets touch target size
    const buttonBox = await enrichButton.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44, 'Enrich button too small for mobile');
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
    const criticalErrors = errors.filter(
      error =>
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
