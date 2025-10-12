/**
 * Performance monitoring utilities for tracking Core Web Vitals
 * and application performance metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Report Web Vitals to analytics
 * Tracks: CLS, FID, FCP, LCP, TTFB
 */
export function reportWebVitals(metric: any) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id,
    });
  }

  // Send to analytics in production
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('performance', {
      props: {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      },
    });
  }
}

/**
 * Measure component render time
 */
export function measureComponentRender(componentName: string) {
  if (typeof performance === 'undefined') return;

  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    if (measure && process.env.NODE_ENV === 'development') {
      console.log(`[Render Time] ${componentName}:`, Math.round(measure.duration), 'ms');
    }

    // Cleanup
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
}

/**
 * Measure API call duration
 */
export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const start = performance.now();

  try {
    const result = await apiCall();
    const duration = performance.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Call] ${name}:`, Math.round(duration), 'ms');
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API Error] ${name}:`, Math.round(duration), 'ms', error);
    throw error;
  }
}

/**
 * Check if device has slow connection
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  if (!connection) return false;

  // Check for slow connection types
  const slowConnectionTypes = ['slow-2g', '2g'];
  if (slowConnectionTypes.includes(connection.effectiveType)) {
    return true;
  }

  // Check for save-data mode
  if (connection.saveData) {
    return true;
  }

  return false;
}

/**
 * Lazy load a component with performance tracking
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) {
  return async () => {
    const start = performance.now();

    try {
      const module = await importFn();
      const duration = performance.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Lazy Load] ${componentName}:`, Math.round(duration), 'ms');
      }

      return module;
    } catch (error) {
      console.error(`[Lazy Load Error] ${componentName}:`, error);
      throw error;
    }
  };
}

/**
 * Get performance recommendations based on device
 */
export interface PerformanceRecommendations {
  shouldPreload: boolean;
  shouldLazyLoad: boolean;
  imageQuality: 'high' | 'medium' | 'low';
  maxImageSize: number;
}

export function getPerformanceRecommendations(): PerformanceRecommendations {
  // Default high-performance settings
  const defaults: PerformanceRecommendations = {
    shouldPreload: true,
    shouldLazyLoad: false,
    imageQuality: 'high',
    maxImageSize: 1920,
  };

  if (typeof navigator === 'undefined') return defaults;

  const slowConnection = isSlowConnection();
  const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;

  if (slowConnection || lowMemory) {
    return {
      shouldPreload: false,
      shouldLazyLoad: true,
      imageQuality: slowConnection ? 'low' : 'medium',
      maxImageSize: slowConnection ? 800 : 1200,
    };
  }

  return defaults;
}
