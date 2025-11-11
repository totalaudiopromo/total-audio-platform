/**
 * AUDIO INTEL PERFORMANCE METRICS TESTS
 *
 * Validates Core Web Vitals and performance standards
 * Uses @total-audio/testing shared performance validators
 */

const { test, expect } = require('@playwright/test');
const {
  validatePerformance,
  measureAllMetrics,
  measureCLS,
  measureLCP,
  measurePageLoadTime,
} = require('@total-audio/testing');

test.describe('Core Web Vitals', () => {
  test('Homepage meets Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');

    const results = await validatePerformance(page);

    if (!results.passed) {
      console.error('❌ Performance issues detected:');
      results.issues.forEach(issue => console.error(`   ${issue}`));
      console.error('Metrics:', JSON.stringify(results.metrics, null, 2));
    }

    // Assert Core Web Vitals pass
    expect(results.passed).toBe(true);
    expect(results.metrics.cls).toBeLessThan(0.1); // Good CLS
    expect(results.metrics.lcp).toBeLessThan(2500); // Good LCP
  });

  test('Upload page maintains good performance', async ({ page }) => {
    await page.goto('/upload');

    const results = await validatePerformance(page);

    expect(results.passed).toBe(true);
    expect(results.metrics.cls).toBeLessThan(0.1);
  });

  test('Pricing page fast load', async ({ page }) => {
    await page.goto('/pricing');

    const loadTime = await measurePageLoadTime(page);
    console.log(`📊 Pricing page load time: ${loadTime}ms`);

    // Pricing page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('Layout Stability', () => {
  test('Homepage has minimal layout shift', async ({ page }) => {
    await page.goto('/');

    // Measure CLS over 5 seconds
    const cls = await measureCLS(page, 5000);
    console.log(`📊 Homepage CLS: ${cls}`);

    // CLS should be < 0.1 for good rating
    expect(cls).toBeLessThan(0.1);
  });

  test('Upload page stable during file preview', async ({ page }) => {
    await page.goto('/upload');

    // Measure initial CLS
    const initialCLS = await measureCLS(page, 2000);

    // Upload a test file (simulated)
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'test.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('name,email\nTest,test@example.com'),
      });

      // Wait for preview to render
      await page.waitForTimeout(1000);

      // Measure CLS after file upload
      const afterUploadCLS = await measureCLS(page, 2000);

      console.log(`📊 Upload CLS: Initial ${initialCLS}, After upload ${afterUploadCLS}`);

      // No significant layout shift during file preview
      expect(afterUploadCLS).toBeLessThan(0.1);
    }
  });
});

test.describe('Loading Performance', () => {
  test('Homepage achieves good LCP', async ({ page }) => {
    await page.goto('/');

    const lcp = await measureLCP(page);
    console.log(`📊 Homepage LCP: ${lcp}ms`);

    // LCP should be < 2500ms for good rating
    expect(lcp).toBeLessThan(2500);
  });

  test('All pages load within acceptable time', async ({ page }) => {
    const pages = ['/', '/upload', '/pricing', '/about'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const loadTime = await measurePageLoadTime(page);

      console.log(`📊 ${pagePath} load time: ${loadTime}ms`);

      // All pages should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });
});

test.describe('Performance Metrics Summary', () => {
  test('Generate comprehensive metrics report', async ({ page }) => {
    const pages = ['/', '/upload', '/pricing'];
    const report = [];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const metrics = await measureAllMetrics(page);
      report.push({
        page: pagePath,
        ...metrics,
      });
    }

    // Log full report
    console.log('\n📊 Performance Metrics Report:');
    console.log('─'.repeat(60));
    report.forEach(({ page: p, cls, lcp, fcp, ttfb, tti }) => {
      console.log(`${p.padEnd(20)} CLS: ${cls.toFixed(3)}  LCP: ${lcp}ms  FCP: ${fcp}ms  TTI: ${tti}ms`);
    });
    console.log('─'.repeat(60));

    // All pages should meet basic standards
    report.forEach(({ page: p, cls, lcp }) => {
      expect(cls).toBeLessThan(0.1);
      expect(lcp).toBeLessThan(2500);
    });
  });
});

test.describe('Mobile Performance', () => {
  test('Performance acceptable on slow 3G', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms latency
    });

    await page.goto('/');

    const loadTime = await measurePageLoadTime(page);
    console.log(`📊 Load time on slow 3G: ${loadTime}ms`);

    // Should still be usable on slow network (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });
});
