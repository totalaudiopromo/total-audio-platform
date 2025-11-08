import { defineConfig, devices } from '@playwright/test';

/**
 * Total Audio Platform - Root Playwright Configuration
 * Demo-Critical Functional Testing for Liberty Music PR Presentation
 *
 * Tests all three apps: Audio Intel, Pitch Generator, Campaign Tracker
 * Focus: Core functionality that will be demonstrated, not edge cases
 */

export default defineConfig({
  testDir: './tests',

  /* Run tests sequentially to avoid port conflicts */
  fullyParallel: false,

  /* Fail build if test.only is accidentally left */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once */
  retries: 1,

  /* Single worker to ensure apps don't conflict */
  workers: 1,

  /* Reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list'],
  ],

  /* Shared test settings */
  use: {
    /* Collect trace on failure for debugging */
    trace: 'retain-on-failure',

    /* Screenshots and video on failure */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Generous timeouts for real-world conditions */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Test timeout - 2 minutes per test */
  timeout: 120000,

  /* Global timeout - 30 minutes for full suite */
  globalTimeout: 30 * 60 * 1000,

  /* Configure for desktop Chrome only - matches Liberty demo environment */
  projects: [
    {
      name: 'demo-tests',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // Standard demo resolution
      },
    },
  ],

  /*
   * Web servers for all three apps
   * Each app runs on its default Next.js port
   */
  webServer: [
    {
      command: 'cd apps/audio-intel && PORT=3000 npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'cd apps/pitch-generator && PORT=3001 npm run dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'cd apps/tracker && PORT=3004 npm run dev',
      url: 'http://localhost:3004',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
