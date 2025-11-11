/**
 * TRACKER PERFORMANCE TESTS
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

  test('Campaign list maintains good CLS', async ({ page }) => {
    await page.goto('/campaigns');

    const cls = await measureCLS(page, 3000);
    console.log(`📊 Campaign list CLS: ${cls}`);

    expect(cls).toBeLessThan(0.1);
  });

  test('Campaign creation form performance', async ({ page }) => {
    await page.goto('/campaigns/new');

    const cls = await measureCLS(page, 2000);
    console.log(`📊 Campaign form CLS: ${cls}`);

    expect(cls).toBeLessThan(0.1);
  });

  test('Cross-page performance report', async ({ page }) => {
    const pages = ['/', '/campaigns', '/campaigns/new', '/settings'];
    const report = [];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const metrics = await measureAllMetrics(page);
      report.push({ page: pagePath, ...metrics });
    }

    console.log('\n📊 Campaign Tracker Performance Report:');
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

  test('Modal opening performance', async ({ page }) => {
    await page.goto('/campaigns');

    const startCLS = await measureCLS(page, 1000);

    // Open modal
    const addButton = page.getByRole('button', { name: /add/i }).first();
    if (await addButton.isVisible()) {
      await addButton.tap();

      // Measure CLS during modal animation
      const endCLS = await measureCLS(page, 2000);

      // CLS should not increase significantly when opening modal
      expect(endCLS - startCLS).toBeLessThan(0.05);
    }
  });

  test('Campaign data loading performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/campaigns');

    // Wait for campaign cards to load
    const campaignCards = page.locator('[data-campaign], [class*="campaign-card"]');
    await campaignCards.first().waitFor({ timeout: 5000 }).catch(() => {});

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Campaign list load time: ${loadTime}ms`);

    // Campaign list should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
