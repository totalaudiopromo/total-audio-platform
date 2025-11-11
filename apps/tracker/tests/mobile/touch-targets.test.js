/**
 * TRACKER TOUCH TARGET TESTS
 *
 * WCAG 2.2 Level AA compliance validation
 */

const { test, expect } = require('@playwright/test');
const { validateAllTouchTargets } = require('@total-audio/testing');

test.describe('Campaign Tracker Touch Targets', () => {
  test('Homepage - All interactive elements compliant', async ({ page }) => {
    await page.goto('/');

    const results = await validateAllTouchTargets(page);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Touch target failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Campaign list - All actions accessible', async ({ page }) => {
    await page.goto('/campaigns');

    const results = await validateAllTouchTargets(
      page,
      'button, a, [role="button"], [data-campaign], [class*="campaign-card"]'
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Campaign creation form - All inputs accessible', async ({ page }) => {
    await page.goto('/campaigns/new');

    const results = await validateAllTouchTargets(
      page,
      'input, button, select, textarea, [role="button"], [role="combobox"]'
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Navigation elements - Touch-friendly', async ({ page }) => {
    await page.goto('/');

    const navResults = await validateAllTouchTargets(page, 'nav a, nav button, header a, header button');
    const failures = navResults.filter(r => !r.passed);

    expect(failures).toHaveLength(0);
  });

  test('Submission tracking modals - Touch-friendly', async ({ page }) => {
    await page.goto('/campaigns');

    // Test modal interactions
    const modalTriggers = page.locator('[data-modal-trigger], [class*="add-submission"]');

    if ((await modalTriggers.count()) > 0) {
      const results = await validateAllTouchTargets(page, '[data-modal-trigger], [class*="add-submission"]');
      const failures = results.filter(r => !r.passed);

      expect(failures).toHaveLength(0);
    }
  });

  test('Cross-page consistency', async ({ page }) => {
    const pages = ['/', '/campaigns', '/campaigns/new', '/settings'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const results = await validateAllTouchTargets(page);
      const failures = results.filter(r => !r.passed);

      if (failures.length > 0) {
        console.error(`❌ ${pagePath} failures:`, failures.length);
      }

      expect(failures).toHaveLength(0);
    }
  });
});
