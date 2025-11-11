/**
 * PITCH GENERATOR RESPONSIVE BREAKPOINT TESTS
 *
 * Validates layout across mobile/tablet/desktop breakpoints
 */

const { test, expect } = require('@playwright/test');
const {
  validateBreakpoints,
  validateMobileLayout,
  commonBreakpoints,
} = require('@total-audio/testing');

test.describe('Responsive Breakpoints', () => {
  test('Homepage responsive across all breakpoints', async ({ page }) => {
    await page.goto('/');

    const results = await validateBreakpoints(page, commonBreakpoints);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Breakpoint failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Pitch form responsive', async ({ page }) => {
    await page.goto('/pitch/new');

    const results = await validateBreakpoints(
      page,
      commonBreakpoints.filter(bp => bp.name.includes('mobile') || bp.name.includes('tablet'))
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Mobile layout requirements', async ({ page }) => {
    await page.goto('/');

    const layoutResults = await validateMobileLayout(page);

    if (!layoutResults.passed) {
      console.error('❌ Mobile layout issues:', layoutResults.issues);
    }

    expect(layoutResults.passed).toBe(true);
    expect(layoutResults.checks.hasViewportMeta).toBe(true);
    expect(layoutResults.checks.hasHorizontalScroll).toBe(false);
  });
});
