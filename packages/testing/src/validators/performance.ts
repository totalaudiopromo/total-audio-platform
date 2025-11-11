import type { Page } from '@playwright/test';

export interface PerformanceMetrics {
  cls: number; // Cumulative Layout Shift
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  tti: number; // Time to Interactive (ms)
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
}

export interface PerformanceValidationResult {
  passed: boolean;
  metrics: PerformanceMetrics;
  thresholds: {
    cls: { value: number; threshold: number; passed: boolean };
    lcp: { value: number; threshold: number; passed: boolean };
    fid: { value: number; threshold: number; passed: boolean };
    tti: { value: number; threshold: number; passed: boolean };
  };
  issues: string[];
}

/**
 * Measures Cumulative Layout Shift (CLS)
 * Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
 * @param page - Playwright Page object
 * @param duration - Duration to measure in ms (default: 5000ms)
 * @returns CLS score
 */
export async function measureCLS(page: Page, duration: number = 5000): Promise<number> {
  return await page.evaluate((measureDuration) => {
    return new Promise<number>((resolve) => {
      let cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            cls += layoutShift.value;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      setTimeout(() => {
        observer.disconnect();
        resolve(cls);
      }, measureDuration);
    });
  }, duration);
}

/**
 * Measures Largest Contentful Paint (LCP)
 * Good: < 2500ms, Needs improvement: 2500-4000ms, Poor: > 4000ms
 * @param page - Playwright Page object
 * @returns LCP in milliseconds
 */
export async function measureLCP(page: Page): Promise<number> {
  return await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        resolve(lastEntry.renderTime || lastEntry.loadTime);
        observer.disconnect();
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 10000);
    });
  });
}

/**
 * Measures First Contentful Paint (FCP)
 * Good: < 1800ms, Needs improvement: 1800-3000ms, Poor: > 3000ms
 * @param page - Playwright Page object
 * @returns FCP in milliseconds
 */
export async function measureFCP(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  });
}

/**
 * Measures Time to First Byte (TTFB)
 * Good: < 800ms, Needs improvement: 800-1800ms, Poor: > 1800ms
 * @param page - Playwright Page object
 * @returns TTFB in milliseconds
 */
export async function measureTTFB(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;
  });
}

/**
 * Measures Time to Interactive (TTI)
 * Good: < 3800ms, Needs improvement: 3800-7300ms, Poor: > 7300ms
 * @param page - Playwright Page object
 * @returns TTI in milliseconds (approximation)
 */
export async function measureTTI(page: Page): Promise<number> {
  return await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      // Simplified TTI measurement
      // Wait for network idle and long tasks to complete
      const startTime = performance.now();

      const checkInteractive = () => {
        const now = performance.now();

        // Check if no long tasks in the last 5 seconds
        const longTasks = performance.getEntriesByType('longtask') as any[];
        const recentLongTasks = longTasks.filter(
          (task) => task.startTime > now - 5000
        );

        if (recentLongTasks.length === 0) {
          resolve(now - startTime);
        } else {
          setTimeout(checkInteractive, 500);
        }
      };

      // Start checking after initial load
      setTimeout(checkInteractive, 1000);

      // Fallback timeout
      setTimeout(() => resolve(performance.now() - startTime), 10000);
    });
  });
}

/**
 * Measures First Input Delay (FID)
 * Good: < 100ms, Needs improvement: 100-300ms, Poor: > 300ms
 * Note: FID requires actual user interaction, so this returns 0 in automated tests
 * @param page - Playwright Page object
 * @returns FID in milliseconds (0 in automated tests)
 */
export async function measureFID(page: Page): Promise<number> {
  // FID requires real user interaction
  // In automated tests, we return 0 as it cannot be accurately measured
  return 0;
}

/**
 * Measures all Core Web Vitals
 * @param page - Playwright Page object
 * @returns All performance metrics
 */
export async function measureAllMetrics(page: Page): Promise<PerformanceMetrics> {
  const [cls, lcp, fcp, ttfb, tti, fid] = await Promise.all([
    measureCLS(page),
    measureLCP(page),
    measureFCP(page),
    measureTTFB(page),
    measureTTI(page),
    measureFID(page),
  ]);

  return {
    cls: Math.round(cls * 1000) / 1000, // Round to 3 decimal places
    lcp: Math.round(lcp),
    fcp: Math.round(fcp),
    ttfb: Math.round(ttfb),
    tti: Math.round(tti),
    fid: Math.round(fid),
  };
}

/**
 * Validates performance metrics against WCAG and Core Web Vitals thresholds
 * @param page - Playwright Page object
 * @param customThresholds - Optional custom thresholds
 * @returns Validation results with pass/fail status
 */
export async function validatePerformance(
  page: Page,
  customThresholds?: {
    cls?: number;
    lcp?: number;
    fid?: number;
    tti?: number;
  }
): Promise<PerformanceValidationResult> {
  const metrics = await measureAllMetrics(page);

  const thresholds = {
    cls: customThresholds?.cls ?? 0.1, // Good: < 0.1
    lcp: customThresholds?.lcp ?? 2500, // Good: < 2500ms
    fid: customThresholds?.fid ?? 100, // Good: < 100ms
    tti: customThresholds?.tti ?? 3800, // Good: < 3800ms
  };

  const issues: string[] = [];

  const clsCheck = {
    value: metrics.cls,
    threshold: thresholds.cls,
    passed: metrics.cls < thresholds.cls,
  };

  if (!clsCheck.passed) {
    issues.push(
      `CLS score ${metrics.cls} exceeds threshold ${thresholds.cls} (Poor: visual stability)`
    );
  }

  const lcpCheck = {
    value: metrics.lcp,
    threshold: thresholds.lcp,
    passed: metrics.lcp < thresholds.lcp,
  };

  if (!lcpCheck.passed) {
    issues.push(
      `LCP ${metrics.lcp}ms exceeds threshold ${thresholds.lcp}ms (Poor: loading performance)`
    );
  }

  const fidCheck = {
    value: metrics.fid,
    threshold: thresholds.fid,
    passed: metrics.fid === 0 || metrics.fid < thresholds.fid,
  };

  if (!fidCheck.passed) {
    issues.push(
      `FID ${metrics.fid}ms exceeds threshold ${thresholds.fid}ms (Poor: interactivity)`
    );
  }

  const ttiCheck = {
    value: metrics.tti,
    threshold: thresholds.tti,
    passed: metrics.tti < thresholds.tti,
  };

  if (!ttiCheck.passed) {
    issues.push(
      `TTI ${metrics.tti}ms exceeds threshold ${thresholds.tti}ms (Poor: time to interactive)`
    );
  }

  const passed = clsCheck.passed && lcpCheck.passed && fidCheck.passed && ttiCheck.passed;

  return {
    passed,
    metrics,
    thresholds: {
      cls: clsCheck,
      lcp: lcpCheck,
      fid: fidCheck,
      tti: ttiCheck,
    },
    issues,
  };
}

/**
 * Measures page load time
 * @param page - Playwright Page object
 * @returns Load time in milliseconds
 */
export async function measurePageLoadTime(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.fetchStart : 0;
  });
}

/**
 * Measures resource loading performance
 * @param page - Playwright Page object
 * @returns Resource loading statistics
 */
export async function measureResourceLoading(page: Page): Promise<{
  totalResources: number;
  totalSize: number;
  slowestResource: {
    name: string;
    duration: number;
    size: number;
  } | null;
  resourcesByType: Record<string, { count: number; totalSize: number; avgDuration: number }>;
}> {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    let totalSize = 0;
    let slowestResource: { name: string; duration: number; size: number } | null = null;
    const byType: Record<string, { count: number; totalSize: number; totalDuration: number }> = {};

    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      const duration = resource.duration;
      const type = resource.initiatorType || 'other';

      totalSize += size;

      // Track slowest resource
      if (!slowestResource || duration > slowestResource.duration) {
        slowestResource = {
          name: resource.name,
          duration,
          size,
        };
      }

      // Group by type
      if (!byType[type]) {
        byType[type] = { count: 0, totalSize: 0, totalDuration: 0 };
      }
      byType[type].count++;
      byType[type].totalSize += size;
      byType[type].totalDuration += duration;
    });

    // Calculate averages
    const resourcesByType: Record<string, { count: number; totalSize: number; avgDuration: number }> = {};
    for (const [type, stats] of Object.entries(byType)) {
      resourcesByType[type] = {
        count: stats.count,
        totalSize: stats.totalSize,
        avgDuration: Math.round(stats.totalDuration / stats.count),
      };
    }

    return {
      totalResources: resources.length,
      totalSize,
      slowestResource,
      resourcesByType,
    };
  });
}
