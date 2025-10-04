// Audio Intel Mobile Testing Configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/mobile',
  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for mobile testing
  reporter: [
    ['html', { outputFolder: './reports/mobile' }],
    ['json', { outputFile: './reports/mobile/results.json' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:3010',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Mobile device configurations for UK market
  projects: [
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'Mobile Safari iPad',
      use: { ...devices['iPad Pro'] },
    }
  ],

  // Local server setup
  webServer: {
    command: 'npm run dev:tests',
    port: 3010,
    reuseExistingServer: !process.env.CI,
  },
});
