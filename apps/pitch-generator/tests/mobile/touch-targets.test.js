/**
 * PITCH GENERATOR TOUCH TARGET TESTS
 *
 * WCAG 2.2 Level AA compliance validation
 */

const { test, expect } = require('@playwright/test');
const { validateAllTouchTargets } = require('@total-audio/testing');

test.describe('Pitch Generator Touch Targets', () => {
  test('Homepage - All interactive elements compliant', async ({ page }) => {
    await page.goto('/');

    const results = await validateAllTouchTargets(page);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Touch target failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Pitch creation form - All inputs accessible', async ({ page }) => {
    await page.goto('/pitch/new');

    const results = await validateAllTouchTargets(
      page,
      'input, button, select, textarea, [role="button"], [role="combobox"]'
    );

    const failures = results.filter(r => !r.passed);
    expect(failures).toHaveLength(0);
  });

  test('Navigation elements - Touch-friendly', async ({ page }) => {
    await page.goto('/');

    const navResults = await validateAllTouchTargets(
      page,
      'nav a, nav button, header a, header button'
    );
    const failures = navResults.filter(r => !r.passed);

    expect(failures).toHaveLength(0);
  });

  test('Cross-page consistency', async ({ page }) => {
    const pages = ['/', '/pitch/new', '/pitch/history', '/pricing'];

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
