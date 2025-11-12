/**
 * Enrichment Test Suite
 *
 * Comprehensive regression tests for Audio Intel enrichment pipeline.
 *
 * Test Coverage:
 * - Timeout handling (10s per contact, no retry on timeout)
 * - Retry logic (1 retry with exponential backoff)
 * - Partial success responses (always success: true)
 * - Parallel batch processing (5 contacts at once, 500ms delay)
 *
 * Usage:
 *   npm run test:enrichment              # Run all enrichment tests
 *   npm run test                          # Run all tests
 *   npm run test:ui                       # Open Vitest UI
 *
 * Based on: ENRICHMENT_BULLETPROOF.md v2.1.0
 */

// Export test utilities for external use
export * from './timeout.test';
export * from './retry.test';
export * from './partial-success.test';
export * from './parallel-batching.test';

// Test configuration constants (matches route.ts)
export const TEST_CONFIG = {
  BATCH_SIZE: 5,
  BATCH_DELAY_MS: 500,
  CONTACT_TIMEOUT_MS: 10000,
  MAX_RETRIES: 1,
  RETRY_DELAY_MS: 1000,
  AVG_ENRICHMENT_TIME_MS: 2500,
} as const;

// Test helper types
export interface MockContact {
  name: string;
  email: string;
  genre?: string;
  region?: string;
}

export interface EnrichmentResult {
  success: boolean;
  data?: any;
  error?: string;
  retried?: boolean;
  timedOut?: boolean;
}

export interface BatchResponse {
  success: boolean;
  enriched: any[];
  summary: {
    total: number;
    enriched: number;
    failed: number;
    retried: number;
    timedOut: number;
    cost: number;
  };
  metrics: {
    totalTime: string;
    enrichmentTime: string;
    averageTimePerContact: string;
    successRate: string;
    retryRate: string;
    timeoutRate: string;
    contactsPerSecond: number;
  };
}

// Test helper functions
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createMockContacts(count: number): MockContact[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@example.com`,
    genre: 'Alternative',
    region: 'UK',
  }));
}

export function calculateSuccessRate(enriched: number, total: number): string {
  return `${Math.round((enriched / total) * 100)}%`;
}

export function calculateRetryRate(retried: number, enriched: number): string {
  return enriched > 0 ? `${Math.round((retried / enriched) * 100)}%` : '0%';
}

export function calculateTimeoutRate(timedOut: number, total: number): string {
  return `${Math.round((timedOut / total) * 100)}%`;
}
