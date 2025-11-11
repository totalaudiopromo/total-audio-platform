/**
 * AUTO-GENERATED RESPONSIVE TEST
 * Component: EmailVerificationBanner
 * Source: apps/tracker/components/auth/EmailVerificationBanner.tsx
 */

const { test, expect } = require('@playwright/test');
const {
  validateBreakpoints,
  validateMobileLayout,
  commonBreakpoints,
} = require('@total-audio/testing');

test.describe('EmailVerificationBanner - Responsive', () => {
  test('Responsive across all breakpoints', async ({ page }) => {
    await page.goto('/');

    const results = await validateBreakpoints(page, commonBreakpoints);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Breakpoint failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Mobile layout requirements', async ({ page }) => {
    await page.goto('/');

    const results = await validateMobileLayout(page);

    if (!results.passed) {
      console.error('❌ Mobile layout issues:', results.issues);
    }

    expect(results.passed).toBe(true);
    expect(results.checks.hasViewportMeta).toBe(true);
    expect(results.checks.hasHorizontalScroll).toBe(false);
  });
});
