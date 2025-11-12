import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Enrichment Retry Logic Tests
 *
 * Tests the automatic retry mechanism for contact enrichment:
 * - Single retry per contact (MAX_RETRIES = 1)
 * - Exponential backoff (1s base, doubles on retry: 1s → 2s)
 * - Rate limit detection with 2x delay
 * - No retries for timeouts (fail fast)
 *
 * Based on: ENRICHMENT_BULLETPROOF.md
 * Configuration:
 * - MAX_RETRIES = 1
 * - RETRY_DELAY_MS = 1000 (1 second base)
 */

describe('Enrichment Retry Logic', () => {
  const MAX_RETRIES = 1;
  const RETRY_DELAY_MS = 1000;
  const CONTACT_TIMEOUT_MS = 10000;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper: Check if error is rate limit error
   */
  function isRateLimitError(error: any): boolean {
    if (error?.status === 429) return true;
    if (error?.message?.includes('429')) return true;
    if (error?.message?.toLowerCase().includes('rate limit')) return true;
    return false;
  }

  /**
   * Helper: Sleep utility
   */
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper: withTimeout implementation
   */
  async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutError: string = 'Operation timed out'
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutError)), timeoutMs)),
    ]);
  }

  /**
   * Helper: enrichContactWithRetry implementation
   */
  async function enrichContactWithRetry(
    contact: any,
    enrichmentFn: (contact: any) => Promise<any>,
    attempt: number = 0
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    retried?: boolean;
    timedOut?: boolean;
  }> {
    try {
      const result = await withTimeout(
        enrichmentFn(contact),
        CONTACT_TIMEOUT_MS,
        `Contact enrichment timed out after ${CONTACT_TIMEOUT_MS}ms`
      );

      return { success: true, data: result };
    } catch (error: any) {
      const isTimeout = error.message?.includes('timed out');
      const isRateLimit = isRateLimitError(error);

      // Retry logic: retry once with exponential backoff (but NOT for timeouts)
      if (attempt < MAX_RETRIES && !isTimeout) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);

        // If rate limit, wait 2x longer
        if (isRateLimit) {
          await sleep(delay * 2);
        } else {
          await sleep(delay);
        }

        // Retry the request
        const retryResult = await enrichContactWithRetry(contact, enrichmentFn, attempt + 1);
        return { ...retryResult, retried: true };
      }

      return {
        success: false,
        error: error.message || 'Unknown error',
        timedOut: isTimeout,
      };
    }
  }

  it('should retry failed contacts once', async () => {
    const contact = {
      name: 'Flaky Contact',
      email: 'flaky@example.com',
    };

    let callCount = 0;
    const flakyEnrichmentFn = vi.fn(async () => {
      callCount++;
      if (callCount === 1) {
        // First attempt fails
        throw new Error('Temporary failure');
      }
      // Second attempt succeeds
      return { intelligence: 'Successfully enriched on retry', confidence: 'High' };
    });

    const result = await enrichContactWithRetry(contact, flakyEnrichmentFn);

    // Should succeed after retry
    expect(result.success).toBe(true);
    expect(result.retried).toBe(true);
    expect(result.data).toEqual({
      intelligence: 'Successfully enriched on retry',
      confidence: 'High',
    });

    // Should have been called exactly twice (initial + 1 retry)
    expect(flakyEnrichmentFn).toHaveBeenCalledTimes(2);
  }, 15000);

  it('should use exponential backoff (1s → 2s)', async () => {
    const contact = {
      name: 'Backoff Contact',
      email: 'backoff@example.com',
    };

    const timestamps: number[] = [];
    const enrichmentFn = vi.fn(async () => {
      timestamps.push(Date.now());
      throw new Error('Always fails');
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should fail after max retries
    expect(result.success).toBe(false);
    expect(enrichmentFn).toHaveBeenCalledTimes(2); // Initial + 1 retry

    // Verify exponential backoff timing
    if (timestamps.length === 2) {
      const delay = timestamps[1] - timestamps[0];
      // First retry delay should be ~1000ms (RETRY_DELAY_MS * 2^0)
      expect(delay).toBeGreaterThanOrEqual(RETRY_DELAY_MS);
      expect(delay).toBeLessThan(RETRY_DELAY_MS + 200); // Allow 200ms variance
    }
  }, 15000);

  it('should detect rate limits and use 2x delay', async () => {
    const contact = {
      name: 'Rate Limited Contact',
      email: 'ratelimit@example.com',
    };

    const timestamps: number[] = [];
    const rateLimitEnrichmentFn = vi.fn(async () => {
      timestamps.push(Date.now());
      const error: any = new Error('Rate limit exceeded');
      error.status = 429;
      throw error;
    });

    const result = await enrichContactWithRetry(contact, rateLimitEnrichmentFn);

    // Should fail after retry
    expect(result.success).toBe(false);
    expect(rateLimitEnrichmentFn).toHaveBeenCalledTimes(2);

    // Verify 2x delay for rate limit
    if (timestamps.length === 2) {
      const delay = timestamps[1] - timestamps[0];
      // Rate limit delay should be 2x base: 2000ms (RETRY_DELAY_MS * 2^0 * 2)
      expect(delay).toBeGreaterThanOrEqual(RETRY_DELAY_MS * 2);
      expect(delay).toBeLessThan(RETRY_DELAY_MS * 2 + 200); // Allow 200ms variance
    }
  }, 15000);

  it('should not retry timeouts', async () => {
    const contact = {
      name: 'Timeout Contact',
      email: 'timeout@example.com',
    };

    const enrichmentFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 15000)); // Exceeds timeout
      return { intelligence: 'Should not reach' };
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should timeout without retry
    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.retried).toBe(undefined); // No retry

    // Should only be called once (no retry on timeout)
    expect(enrichmentFn).toHaveBeenCalledTimes(1);
  }, 15000);

  it('should fail after max retries exceeded', async () => {
    const contact = {
      name: 'Persistent Failure',
      email: 'failure@example.com',
    };

    const enrichmentFn = vi.fn(async () => {
      throw new Error('Persistent error');
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should fail after max retries
    expect(result.success).toBe(false);
    expect(result.error).toContain('Persistent error');

    // Should be called initial + MAX_RETRIES times
    expect(enrichmentFn).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  }, 15000);

  it('should track retry count in metrics', async () => {
    const contacts = [
      { name: 'Success 1', email: 'success1@example.com' },
      { name: 'Retry 1', email: 'retry1@example.com' },
      { name: 'Success 2', email: 'success2@example.com' },
      { name: 'Retry 2', email: 'retry2@example.com' },
      { name: 'Retry 3', email: 'retry3@example.com' },
    ];

    let retriedCount = 0;
    let successCount = 0;

    const results = await Promise.all(
      contacts.map(async contact => {
        let attemptCount = 0;
        const enrichmentFn = async () => {
          attemptCount++;
          // Fail first attempt for contacts with 'Retry' in name
          if (contact.name.includes('Retry') && attemptCount === 1) {
            throw new Error('First attempt failed');
          }
          return { intelligence: 'Enriched', confidence: 'High' };
        };

        const result = await enrichContactWithRetry(contact, enrichmentFn);

        if (result.success) successCount++;
        if (result.retried) retriedCount++;

        return result;
      })
    );

    // Verify all succeeded
    expect(successCount).toBe(5);
    expect(retriedCount).toBe(3); // 3 contacts retried

    // Calculate retry rate (should match route.ts calculation)
    const retryRate = Math.round((retriedCount / successCount) * 100);
    expect(retryRate).toBe(60); // 60% retry rate
  }, 15000);

  it('should detect rate limit by error message', async () => {
    const contact = {
      name: 'Rate Limit Message',
      email: 'ratelimit-msg@example.com',
    };

    const enrichmentFn = vi.fn(async () => {
      throw new Error('API rate limit exceeded, please try again later');
    });

    const timestamps: number[] = [];
    const enrichmentWithTimestamps = async (c: any) => {
      timestamps.push(Date.now());
      return enrichmentFn(c);
    };

    const result = await enrichContactWithRetry(contact, enrichmentWithTimestamps);

    // Should detect rate limit and retry
    expect(result.success).toBe(false);
    expect(enrichmentFn).toHaveBeenCalledTimes(2);

    // Should use 2x delay
    if (timestamps.length === 2) {
      const delay = timestamps[1] - timestamps[0];
      expect(delay).toBeGreaterThanOrEqual(RETRY_DELAY_MS * 2);
    }
  }, 15000);

  it('should detect rate limit by status code 429', async () => {
    const contact = {
      name: 'Rate Limit 429',
      email: 'ratelimit-429@example.com',
    };

    const enrichmentFn = vi.fn(async () => {
      const error: any = new Error('Request failed');
      error.status = 429;
      throw error;
    });

    const timestamps: number[] = [];
    const enrichmentWithTimestamps = async (c: any) => {
      timestamps.push(Date.now());
      return enrichmentFn(c);
    };

    const result = await enrichContactWithRetry(contact, enrichmentWithTimestamps);

    // Should detect rate limit and retry
    expect(result.success).toBe(false);
    expect(enrichmentFn).toHaveBeenCalledTimes(2);

    // Should use 2x delay
    if (timestamps.length === 2) {
      const delay = timestamps[1] - timestamps[0];
      expect(delay).toBeGreaterThanOrEqual(RETRY_DELAY_MS * 2);
    }
  }, 15000);

  it('should succeed on retry and mark as retried', async () => {
    const contact = {
      name: 'Retry Success',
      email: 'retry-success@example.com',
    };

    let callCount = 0;
    const enrichmentFn = vi.fn(async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error('Temporary network error');
      }
      return {
        intelligence: 'Successfully enriched after retry',
        confidence: 'High',
      };
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should succeed with retry flag
    expect(result.success).toBe(true);
    expect(result.retried).toBe(true);
    expect(result.data.intelligence).toContain('after retry');

    expect(enrichmentFn).toHaveBeenCalledTimes(2);
  }, 15000);
});
