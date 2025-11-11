/**
 * PITCH GENERATOR PERFORMANCE TESTS
 *
 * Core Web Vitals and performance validation
 */

const { test, expect } = require('@playwright/test');
const { validatePerformance, measureAllMetrics, measureCLS } = require('@total-audio/testing');

test.describe('Performance Metrics', () => {
  test('Homepage meets Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    const results = await validatePerformance(page);

    if (!results.passed) {
      console.error('❌ Performance issues:', results.issues);
      console.error('Metrics:', results.metrics);
    }

    expect(results.passed).toBe(true);
    expect(results.metrics.cls).toBeLessThan(0.1);
    expect(results.metrics.lcp).toBeLessThan(2500);
  });

  test('Pitch generation maintains good CLS', async ({ page }) => {
    await page.goto('/pitch/new');

    const cls = await measureCLS(page, 3000);
    console.log(`📊 Pitch form CLS: ${cls}`);

    expect(cls).toBeLessThan(0.1);
  });

  test('Cross-page performance report', async ({ page }) => {
    const pages = ['/', '/pitch/new', '/pitch/history'];
    const report = [];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const metrics = await measureAllMetrics(page);
      report.push({ page: pagePath, ...metrics });
    }

    console.log('\n📊 Pitch Generator Performance Report:');
    console.log('─'.repeat(60));
    report.forEach(({ page: p, cls, lcp, fcp }) => {
      console.log(`${p.padEnd(20)} CLS: ${cls.toFixed(3)}  LCP: ${lcp}ms  FCP: ${fcp}ms`);
    });
    console.log('─'.repeat(60));

    report.forEach(({ cls, lcp }) => {
      expect(cls).toBeLessThan(0.1);
      expect(lcp).toBeLessThan(2500);
    });
  });
});
