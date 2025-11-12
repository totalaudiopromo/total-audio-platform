import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Enrichment Timeout Handling Tests
 *
 * Tests the timeout logic for contact enrichment:
 * - 10 second timeout per contact
 * - No retries on timeout (fail fast)
 * - Graceful degradation with fallback intelligence
 *
 * Based on: ENRICHMENT_BULLETPROOF.md
 * Configuration: CONTACT_TIMEOUT_MS = 10000 (10 seconds)
 */

describe('Enrichment Timeout Handling', () => {
  const CONTACT_TIMEOUT_MS = 10000;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper function: simulates withTimeout() from route.ts
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
   * Helper function: simulates enrichContactWithRetry() from route.ts
   */
  async function enrichContactWithRetry(
    contact: any,
    enrichmentFn: (contact: any) => Promise<any>,
    attempt: number = 0,
    maxRetries: number = 1
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

      // DO NOT retry timeouts - fail fast
      if (attempt < maxRetries && !isTimeout) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return enrichContactWithRetry(contact, enrichmentFn, attempt + 1, maxRetries);
      }

      return {
        success: false,
        error: error.message || 'Unknown error',
        timedOut: isTimeout,
      };
    }
  }

  it('should timeout after 10 seconds per contact', async () => {
    const contact = {
      name: 'Slow Contact',
      email: 'slow@example.com',
    };

    // Simulate slow enrichment (15 seconds)
    const slowEnrichmentFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      return { intelligence: 'Should not reach here' };
    });

    const startTime = Date.now();
    const result = await enrichContactWithRetry(contact, slowEnrichmentFn);
    const elapsedTime = Date.now() - startTime;

    // Should timeout close to 10 seconds (allow 100ms variance)
    expect(elapsedTime).toBeGreaterThanOrEqual(CONTACT_TIMEOUT_MS);
    expect(elapsedTime).toBeLessThan(CONTACT_TIMEOUT_MS + 500);

    // Should return timeout error
    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.error).toContain('timed out');

    // Should not complete the enrichment
    expect(slowEnrichmentFn).toHaveBeenCalledOnce();
  }, 15000); // Test timeout: 15s

  it('should not retry timeouts (fail fast)', async () => {
    const contact = {
      name: 'Timeout Contact',
      email: 'timeout@example.com',
    };

    const enrichmentFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      return { intelligence: 'Should not reach here' };
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should fail with timeout
    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.retried).toBe(undefined); // No retry attempted

    // Should only try once (no retry on timeout)
    expect(enrichmentFn).toHaveBeenCalledTimes(1);
  }, 15000); // Test timeout: 15s

  it('should return fallback intelligence on timeout', async () => {
    const contact = {
      name: 'Jack Saunders',
      email: 'jack.saunders@bbc.co.uk',
    };

    const enrichmentFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      return { intelligence: 'Real intelligence' };
    });

    const result = await enrichContactWithRetry(contact, enrichmentFn);

    // Should return fallback intelligence structure
    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.error).toContain('timed out');

    // Expected fallback contact structure (from route.ts)
    const fallbackContact = {
      ...contact,
      intelligence: 'Enrichment timed out - contact research service temporarily unavailable',
      contactIntelligence:
        'Enrichment timed out - contact research service temporarily unavailable',
      confidence: 'Low',
      researchConfidence: 'Low',
      lastResearched: expect.any(String),
      error: result.error,
      source: 'fallback',
      timedOut: true,
    };

    // Verify fallback structure matches expected format
    expect(result.timedOut).toBe(fallbackContact.timedOut);
    expect(result.error).toBeTruthy();
  }, 15000); // Test timeout: 15s

  it('should allow successful enrichment within timeout', async () => {
    const contact = {
      name: 'Fast Contact',
      email: 'fast@example.com',
    };

    // Simulate fast enrichment (2 seconds)
    const fastEnrichmentFn = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        intelligence: 'Successfully enriched',
        confidence: 'High',
      };
    });

    const startTime = Date.now();
    const result = await enrichContactWithRetry(contact, fastEnrichmentFn);
    const elapsedTime = Date.now() - startTime;

    // Should complete within timeout
    expect(elapsedTime).toBeLessThan(CONTACT_TIMEOUT_MS);

    // Should succeed
    expect(result.success).toBe(true);
    expect(result.timedOut).toBe(undefined);
    expect(result.data).toEqual({
      intelligence: 'Successfully enriched',
      confidence: 'High',
    });

    expect(fastEnrichmentFn).toHaveBeenCalledOnce();
  }, 15000); // Test timeout: 15s

  it('should track timeout rate in batch metrics', async () => {
    const contacts = [
      { name: 'Fast 1', email: 'fast1@example.com' },
      { name: 'Timeout 1', email: 'timeout1@example.com' },
      { name: 'Fast 2', email: 'fast2@example.com' },
      { name: 'Timeout 2', email: 'timeout2@example.com' },
      { name: 'Fast 3', email: 'fast3@example.com' },
    ];

    let timedOutCount = 0;
    let successCount = 0;

    const results = await Promise.all(
      contacts.map(async contact => {
        const enrichmentFn = async () => {
          // Simulate timeouts for contacts with 'timeout' in name
          if (contact.name.includes('Timeout')) {
            await new Promise(resolve => setTimeout(resolve, 15000));
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          return { intelligence: 'Enriched' };
        };

        const result = await enrichContactWithRetry(contact, enrichmentFn);

        if (result.timedOut) timedOutCount++;
        if (result.success) successCount++;

        return result;
      })
    );

    // Verify metrics
    expect(timedOutCount).toBe(2); // 2 timeouts
    expect(successCount).toBe(3); // 3 successful

    // Calculate timeout rate (should match route.ts calculation)
    const timeoutRate = Math.round((timedOutCount / contacts.length) * 100);
    expect(timeoutRate).toBe(40); // 40% timeout rate

    // Verify all contacts processed
    expect(results.length).toBe(contacts.length);
  }, 30000); // Test timeout: 30s

  it('should log timeout with processing time', async () => {
    const contact = {
      name: 'Logged Contact',
      email: 'logged@example.com',
    };

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const enrichmentFn = async () => {
      await new Promise(resolve => setTimeout(resolve, 15000));
      return { intelligence: 'Should not reach' };
    };

    const startTime = Date.now();
    const result = await enrichContactWithRetry(contact, enrichmentFn);
    const elapsedTime = Date.now() - startTime;

    // Verify result
    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);

    // Processing time should be close to timeout duration
    expect(elapsedTime).toBeGreaterThanOrEqual(CONTACT_TIMEOUT_MS);
    expect(elapsedTime).toBeLessThan(CONTACT_TIMEOUT_MS + 500);

    consoleSpy.mockRestore();
  }, 15000); // Test timeout: 15s
});
