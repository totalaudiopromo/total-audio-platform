/**
 * Test environment URLs for Total Audio Platform apps
 */
export const testEnvironments = {
  development: {
    audioIntel: 'http://localhost:3010',
    pitchGenerator: 'http://localhost:3004',
    tracker: 'http://localhost:3001',
    totalAudio: 'http://localhost:3005',
    web: 'http://localhost:3000',
  },
  staging: {
    audioIntel: 'https://staging-intel.totalaudiopromo.com',
    pitchGenerator: 'https://staging-pitch.totalaudiopromo.com',
    tracker: 'https://staging-tracker.totalaudiopromo.com',
    totalAudio: 'https://staging.totalaud.io',
    web: 'https://staging.totalaudiopromo.com',
  },
  production: {
    audioIntel: 'https://intel.totalaudiopromo.com',
    pitchGenerator: 'https://pitch.totalaudiopromo.com',
    tracker: 'https://tracker.totalaudiopromo.com',
    totalAudio: 'https://totalaud.io',
    web: 'https://totalaudiopromo.com',
  },
};

/**
 * Get base URL for an app in a specific environment
 */
export function getBaseURL(
  app: keyof typeof testEnvironments.development,
  environment: 'development' | 'staging' | 'production' = 'development'
): string {
  return testEnvironments[environment][app];
}
