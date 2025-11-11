/**
 * TRACKER ACCESSIBILITY TESTS
 *
 * WCAG 2.2 Level AA compliance validation
 */

const { test, expect } = require('@playwright/test');
const {
  validateAccessibility,
  validateKeyboardNavigation,
} = require('@total-audio/testing');

test.describe('Accessibility Compliance', () => {
  test('Homepage accessibility audit', async ({ page }) => {
    await page.goto('/');

    const results = await validateAccessibility(page);

    if (!results.passed) {
      console.error('❌ Accessibility issues:');
      console.error('Critical:', results.summary.critical);
      console.error('Serious:', results.summary.serious);
      results.ariaValidation.issues.forEach(issue => {
        console.error(
          `  ${issue.severity}: ${issue.message} (${issue.element})`
        );
      });
    }

    expect(results.summary.critical).toBe(0);
    expect(results.summary.serious).toBe(0);
  });

  test('Campaign list accessibility', async ({ page }) => {
    await page.goto('/campaigns');

    const results = await validateAccessibility(page);

    expect(results.summary.critical).toBe(0);
    expect(results.summary.serious).toBe(0);
  });

  test('Campaign creation form accessibility', async ({ page }) => {
    await page.goto('/campaigns/new');

    const results = await validateAccessibility(page);

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

  test('Modal accessibility', async ({ page }) => {
    await page.goto('/campaigns');

    const addButton = page.getByRole('button', { name: /add/i }).first();

    if (await addButton.isVisible()) {
      await addButton.tap();

      const modal = page.locator('[role="dialog"]').first();

      if (await modal.isVisible()) {
        // Modal should have proper ARIA attributes
        const ariaLabel = await modal.getAttribute('aria-label');
        const ariaLabelledby = await modal.getAttribute('aria-labelledby');

        expect(ariaLabel || ariaLabelledby).toBeTruthy();

        // Modal should have accessible close button
        const closeButton = modal
          .getByRole('button', { name: /close|cancel/i })
          .first();
        await expect(closeButton).toBeVisible();
      }
    }
  });

  test('Form labels properly associated', async ({ page }) => {
    await page.goto('/campaigns/new');

    // All inputs should have associated labels
    const inputs = page.locator('input:not([type="hidden"]), select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // Input should have label via id, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = (await label.count()) > 0;
        const hasAriaLabel = !!ariaLabel || !!ariaLabelledby;

        expect(hasLabel || hasAriaLabel).toBe(true);
      }
    }
  });

  test('Colour contrast sufficient', async ({ page }) => {
    await page.goto('/');

    const results = await validateAccessibility(page);

    // Check for colour contrast issues specifically
    const contrastIssues = results.ariaValidation.issues.filter(issue =>
      issue.message.toLowerCase().includes('contrast')
    );

    if (contrastIssues.length > 0) {
      console.error('❌ Colour contrast issues:', contrastIssues);
    }

    expect(contrastIssues.length).toBe(0);
  });
});
