import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Base Playwright configuration for all Total Audio apps
 * Provides consistent testing setup across Audio Intel, Pitch Generator, Tracker, and TotalAud.io
 */
export const basePlaywrightConfig: Pick<
  PlaywrightTestConfig,
  'fullyParallel' | 'retries' | 'workers' | 'use' | 'reporter'
> = {
  fullyParallel: false, // Run tests sequentially for mobile stability
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for mobile testing consistency
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  reporter: [
    ['html', { outputFolder: './reports/test-results' }],
    ['json', { outputFile: './reports/results.json' }],
    ['list'],
  ],
};

/**
 * Mobile-specific base configuration
 * Optimised for UK market devices
 */
export const baseMobileConfig: Pick<
  PlaywrightTestConfig,
  'fullyParallel' | 'retries' | 'workers' | 'use' | 'reporter'
> = {
  ...basePlaywrightConfig,
  use: {
    ...basePlaywrightConfig.use,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }, // iPhone 13 default
  },
};
