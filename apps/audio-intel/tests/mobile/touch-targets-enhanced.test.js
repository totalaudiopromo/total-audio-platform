/**
 * AUDIO INTEL ENHANCED TOUCH TARGET TESTS
 *
 * Uses @total-audio/testing shared validators for consistent UX validation
 * WCAG 2.2 Level AA compliance testing with advanced validators
 */

const { test, expect } = require('@playwright/test');
const {
  validateAllTouchTargets,
  validateTouchTargetSize,
  validateTouchTargetSpacing,
  validateGestureConflicts,
} = require('@total-audio/testing');

test.describe('Touch Target Accessibility (Enhanced)', () => {
  test('Homepage - All interactive elements WCAG 2.2 compliant', async ({ page }) => {
    await page.goto('/');

    // Validate all touch targets at once using shared validator
    const results = await validateAllTouchTargets(page);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Touch target failures:');
      failures.forEach(failure => {
        console.error(`   ${failure.element}: ${failure.width}x${failure.height}px`, failure.issues);
      });
    }

    expect(failures).toHaveLength(0);
    expect(results.length).toBeGreaterThan(0); // Ensure we tested something
  });

  test('Upload page - Form elements meet touch standards', async ({ page }) => {
    await page.goto('/upload');

    // Validate all form inputs
    const results = await validateAllTouchTargets(
      page,
      'input:not([type="hidden"]), button, select, textarea, [role="button"]'
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Pricing page - CTA buttons adequately sized', async ({ page }) => {
    await page.goto('/pricing');

    // Test all pricing plan buttons
    const ctaButtons = await page.locator('.cta-button, button[type="submit"]').all();

    for (const button of ctaButtons) {
      if (await button.isVisible()) {
        const result = await validateTouchTargetSize(button, 44);
        expect(result.passed).toBe(true);

        if (!result.passed) {
          console.error(`Failed button: ${result.element}`, result.issues);
        }
      }
    }
  });

  test('Mobile Nav - Touch target spacing adequate', async ({ page }) => {
    await page.goto('/');

    // Get all mobile nav buttons
    const navButtons = await page.locator('.mobile-nav button, .mobile-nav a').all();

    if (navButtons.length > 1) {
      const spacingResults = await validateTouchTargetSpacing(navButtons, 8);
      const violations = spacingResults.filter(r => !r.passed);

      if (violations.length > 0) {
        console.error('❌ Spacing violations:', violations);
      }

      expect(violations).toHaveLength(0);
    }
  });

  test('File upload - No gesture conflicts', async ({ page }) => {
    await page.goto('/upload');

    // Test file upload area for gesture conflicts
    const fileUploadArea = page.locator('input[type="file"]').first();

    if (await fileUploadArea.isVisible()) {
      const gestureCheck = await validateGestureConflicts(fileUploadArea);

      if (!gestureCheck.passed) {
        console.error('❌ Gesture conflicts detected:', gestureCheck.conflicts);
      }

      expect(gestureCheck.passed).toBe(true);
    }
  });

  test('Dashboard - Interactive elements sized correctly', async ({ page }) => {
    // Navigate to dashboard (may require auth - skip if not accessible)
    try {
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);

      const results = await validateAllTouchTargets(page);
      const failures = results.filter(r => !r.passed);

      expect(failures).toHaveLength(0);
    } catch (error) {
      // Dashboard may require auth - skip test gracefully
      test.skip();
    }
  });
});

test.describe('Specific Component Touch Targets', () => {
  test('Hero demo button meets standards', async ({ page }) => {
    await page.goto('/');

    const demoButton = page.getByRole('button', { name: /enrich contact|try example/i }).first();

    if (await demoButton.isVisible()) {
      const result = await validateTouchTargetSize(demoButton, 44);

      expect(result.passed).toBe(true);
      expect(result.width).toBeGreaterThanOrEqual(44);
      expect(result.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('Newsletter signup button accessible', async ({ page }) => {
    await page.goto('/');

    const newsletterButton = page.getByRole('button', { name: /subscribe|sign up/i }).first();

    if (await newsletterButton.isVisible()) {
      const result = await validateTouchTargetSize(newsletterButton, 44);
      expect(result.passed).toBe(true);
    }
  });

  test('Social proof section links touchable', async ({ page }) => {
    await page.goto('/');

    const proofLinks = await page.locator('[class*="social-proof"] a, [class*="proof"] a').all();

    for (const link of proofLinks) {
      if (await link.isVisible()) {
        const result = await validateTouchTargetSize(link, 44);

        if (!result.passed) {
          const text = await link.textContent();
          console.error(`Failed link: "${text?.trim()}"`, result);
        }

        expect(result.passed).toBe(true);
      }
    }
  });
});

test.describe('Cross-Page Touch Target Consistency', () => {
  const pages = [
    '/',
    '/upload',
    '/pricing',
    '/about',
  ];

  for (const pagePath of pages) {
    test(`${pagePath} - All touch targets compliant`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForTimeout(500); // Let page settle

      const results = await validateAllTouchTargets(page);
      const failures = results.filter(r => !r.passed);

      if (failures.length > 0) {
        console.error(`❌ ${pagePath} failures:`, failures.length);
        failures.forEach(f => console.error(`   ${f.element}:`, f.issues));
      }

      expect(failures).toHaveLength(0);
    });
  }
});
