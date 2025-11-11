/**
 * AUTO-GENERATED TOUCH TARGET TEST
 * Component: AddActivityModal
 * Source: apps/tracker/components/campaigns/AddActivityModal.tsx
 * Issues found: SMALL_SPACING
 */

const { test, expect } = require('@playwright/test');
const {
  validateAllTouchTargets,
  validateTouchTargetSize,
} = require('@total-audio/testing');

test.describe('AddActivityModal - Touch Targets', () => {
  test('All interactive elements meet 44px minimum', async ({ page }) => {
    await page.goto('/'); // Update with actual route

    // Validate all touch targets
    const results = await validateAllTouchTargets(page);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Touch target failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Specific components have adequate spacing', async ({ page }) => {
    await page.goto('/');

    // Test specific interactive elements
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const result = await validateTouchTargetSize(button, 44);

      if (!result.passed) {
        console.error(`Button ${i} failed: ${result.width}x${result.height}`);
      }

      expect(result.passed).toBe(true);
    }
  });
});
