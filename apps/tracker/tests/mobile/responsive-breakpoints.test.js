/**
 * TRACKER RESPONSIVE BREAKPOINT TESTS
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

  test('Campaign list responsive', async ({ page }) => {
    await page.goto('/campaigns');

    const results = await validateBreakpoints(
      page,
      commonBreakpoints.filter(
        bp => bp.name.includes('mobile') || bp.name.includes('tablet')
      )
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Campaign creation form responsive', async ({ page }) => {
    await page.goto('/campaigns/new');

    const results = await validateBreakpoints(
      page,
      commonBreakpoints.filter(
        bp => bp.name.includes('mobile') || bp.name.includes('tablet')
      )
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

  test('Campaign cards stack properly on mobile', async ({ page }) => {
    await page.goto('/campaigns');

    const viewport = page.viewportSize();
    const campaignCards = page.locator(
      '[data-campaign], [class*="campaign-card"]'
    );

    if ((await campaignCards.count()) > 1) {
      const firstCard = campaignCards.first();
      const secondCard = campaignCards.nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        // Cards should stack vertically on mobile (second card below first)
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);

        // Cards should fit viewport width
        expect(firstBox.width).toBeLessThanOrEqual(viewport.width - 32);
        expect(secondBox.width).toBeLessThanOrEqual(viewport.width - 32);
      }
    }
  });
});
