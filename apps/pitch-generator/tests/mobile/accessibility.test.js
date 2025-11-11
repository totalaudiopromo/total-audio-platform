/**
 * PITCH GENERATOR ACCESSIBILITY TESTS
 *
 * WCAG 2.2 Level AA compliance validation
 */

const { test, expect } = require('@playwright/test');
const { validateAccessibility, validateKeyboardNavigation } = require('@total-audio/testing');

test.describe('Accessibility Compliance', () => {
  test('Homepage accessibility audit', async ({ page }) => {
    await page.goto('/');

    const results = await validateAccessibility(page);

    if (!results.passed) {
      console.error('❌ Accessibility issues:');
      console.error('Critical:', results.summary.critical);
      console.error('Serious:', results.summary.serious);
      results.ariaValidation.issues.forEach(issue => {
        console.error(`  ${issue.severity}: ${issue.message} (${issue.element})`);
      });
    }

    expect(results.summary.critical).toBe(0);
    expect(results.summary.serious).toBe(0);
  });

  test('Keyboard navigation functional', async ({ page }) => {
    await page.goto('/');

    const keyboardResults = await validateKeyboardNavigation(page);

    if (!keyboardResults.passed) {
      console.error('❌ Keyboard navigation issues:', keyboardResults.issues);
    }

    expect(keyboardResults.focusableElements).toBeGreaterThan(0);
  });

  test('Form accessibility', async ({ page }) => {
    await page.goto('/pitch/new');

    const results = await validateAccessibility(page);
    expect(results.summary.critical).toBe(0);
  });
});
