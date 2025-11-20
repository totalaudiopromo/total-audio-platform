/**
 * Campaign Tracker Playwright Configuration
 *
 * Uses shared configuration from @total-audio/testing for consistency across apps.
 * UK market devices: iPhone 13, Galaxy S9+, iPad Pro
 */
import { defineConfig } from '@playwright/test';
import { basePlaywrightConfig, ukMarketDevices } from '@total-audio/testing';

export default defineConfig({
  ...basePlaywrightConfig,

  testDir: './tests',

  /* Base URL for all tests */
  use: {
    baseURL: 'http://localhost:3004',
  },

  /* Tracker specific: mobile tests in separate directory */
  projects: [
    ...ukMarketDevices.map(device => ({
      ...device,
      testDir: './tests/mobile',
      testMatch: '**/*.test.js',
    })),
  ],

  /* Run local dev server before starting tests */
      webServer: process.env.TEST_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3004',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
