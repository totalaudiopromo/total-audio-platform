/**
 * AUTO-GENERATED PERFORMANCE TEST
 * Component: UKSocialMediaHub
 * Source: apps/audio-intel/components/UKSocialMediaHub.tsx
 */

const { test, expect } = require('@playwright/test');
const { validatePerformance, measureCLS, measureLCP } = require('@total-audio/testing');

test.describe('UKSocialMediaHub - Performance', () => {
  test('Meets Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    const results = await validatePerformance(page);

    if (!results.passed) {
      console.error('❌ Performance issues:', results.metrics);
    }

    expect(results.passed).toBe(true);
    expect(results.metrics.cls).toBeLessThan(0.1);
    expect(results.metrics.lcp).toBeLessThan(2500);
  });

  test('No layout shift during component mount', async ({ page }) => {
    await page.goto('/');

    const cls = await measureCLS(page, 3000);
    console.log(`📊 CLS: ${cls}`);

    expect(cls).toBeLessThan(0.1);
  });
});
