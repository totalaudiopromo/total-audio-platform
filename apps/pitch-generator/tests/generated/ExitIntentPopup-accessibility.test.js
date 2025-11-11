/**
 * AUTO-GENERATED ACCESSIBILITY TEST
 * Component: ExitIntentPopup
 * Source: apps/pitch-generator/components/ExitIntentPopup.tsx
 * Issues found: DIV_CLICKABLE
 */

const { test, expect } = require('@playwright/test');
const { validateAccessibility, validateKeyboardNavigation } = require('@total-audio/testing');

test.describe('ExitIntentPopup - Accessibility', () => {
  test('WCAG 2.2 Level AA compliance', async ({ page }) => {
    await page.goto('/');

    const results = await validateAccessibility(page);

    if (!results.passed) {
      console.error('❌ Accessibility issues:', results.summary);
      results.ariaValidation.issues.forEach(issue => {
        console.error(`  ${issue.severity}: ${issue.message}`);
      });
    }

    expect(results.summary.critical).toBe(0);
    expect(results.summary.serious).toBe(0);
  });

  test('Keyboard navigation functional', async ({ page }) => {
    await page.goto('/');

    const results = await validateKeyboardNavigation(page);

    if (!results.passed) {
      console.error('❌ Keyboard navigation issues:', results.issues);
    }

    expect(results.focusableElements).toBeGreaterThan(0);
    expect(results.passed).toBe(true);
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      expect(alt).toBeTruthy();
    }
  });
});
