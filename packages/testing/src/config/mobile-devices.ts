import { devices, type PlaywrightTestProject } from '@playwright/test';

/**
 * UK Market Mobile Devices
 * Standard device configurations for Total Audio Platform testing
 */
export const ukMarketDevices: PlaywrightTestProject[] = [
  {
    name: 'Mobile Safari (iPhone 13)',
    use: {
      ...devices['iPhone 13'],
      hasTouch: true,
    },
  },
  {
    name: 'Mobile Chrome (Galaxy S9+)',
    use: {
      ...devices['Galaxy S9+'],
      hasTouch: true,
    },
  },
  {
    name: 'Mobile Safari (iPad Pro)',
    use: {
      ...devices['iPad Pro'],
      hasTouch: true,
    },
  },
];

/**
 * Additional device configurations for comprehensive testing
 */
export const extendedDevices: PlaywrightTestProject[] = [
  ...ukMarketDevices,
  {
    name: 'Mobile Safari (iPhone SE)',
    use: {
      ...devices['iPhone SE'],
      hasTouch: true,
    },
  },
  {
    name: 'Mobile Chrome (Pixel 5)',
    use: {
      ...devices['Pixel 5'],
      hasTouch: true,
    },
  },
];

/**
 * Desktop configurations for cross-platform testing
 */
export const desktopDevices: PlaywrightTestProject[] = [
  {
    name: 'Desktop Chrome',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'Desktop Firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
  },
  {
    name: 'Desktop Safari',
    use: {
      ...devices['Desktop Safari'],
    },
  },
];
