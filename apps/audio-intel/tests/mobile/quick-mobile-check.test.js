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
