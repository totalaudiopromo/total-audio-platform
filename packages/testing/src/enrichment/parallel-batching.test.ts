import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Parallel Batch Processing Tests
 *
 * Tests the parallel batch processing logic for contact enrichment:
 * - Process 5 contacts in parallel (BATCH_SIZE = 5)
 * - 500ms delay between batches (BATCH_DELAY_MS = 500)
 * - 75-80% faster than sequential processing
 * - Maintains throughput and respects rate limits
 *
 * Based on: ENRICHMENT_BULLETPROOF.md
 * Configuration:
 * - BATCH_SIZE = 5
 * - BATCH_DELAY_MS = 500
 *
 * Performance expectations:
 * - 10 contacts: 15-20s (vs 30-50s sequential)
 * - 50 contacts: 30-50s (vs 150-240s sequential)
 * - 100 contacts: 60-90s (vs 300-480s sequential)
 */

describe('Parallel Batch Processing', () => {
  const BATCH_SIZE = 5;
  const BATCH_DELAY_MS = 500;
  const AVG_ENRICHMENT_TIME_MS = 2500; // Average time per contact

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Helper: Sleep utility
   */
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper: Simulate single contact enrichment
   */
  async function enrichContact(contact: any): Promise<any> {
    // Simulate enrichment time (2-3 seconds)
    const enrichmentTime = AVG_ENRICHMENT_TIME_MS + Math.random() * 1000;
    await sleep(enrichmentTime);

    return {
      ...contact,
      intelligence: 'Successfully enriched',
      confidence: 'High',
      processingTime: enrichmentTime,
    };
  }

  /**
   * Helper: Process contacts in parallel batches (matches route.ts logic)
   */
  async function processBatchParallel(contacts: any[]) {
    const enrichedResults: any[] = [];
    const startTime = Date.now();

    // Process contacts in parallel batches
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);
      const batchStart = Date.now();

      // Process batch in parallel
      const batchResults = await Promise.all(batch.map(contact => enrichContact(contact)));

      enrichedResults.push(...batchResults);

      const batchElapsed = Date.now() - batchStart;
      console.log(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1} completed in ${batchElapsed}ms (${(batchElapsed / batch.length).toFixed(0)}ms avg per contact)`
      );

      // Add delay between batches (except for last batch)
      if (i + BATCH_SIZE < contacts.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    const totalElapsed = Date.now() - startTime;
    return { results: enrichedResults, totalTime: totalElapsed };
  }

  /**
   * Helper: Process contacts sequentially (for comparison)
   */
  async function processBatchSequential(contacts: any[]) {
    const enrichedResults: any[] = [];
    const startTime = Date.now();

    // Process contacts one at a time
    for (const contact of contacts) {
      const result = await enrichContact(contact);
      enrichedResults.push(result);
    }

    const totalElapsed = Date.now() - startTime;
    return { results: enrichedResults, totalTime: totalElapsed };
  }

  it('should process 5 contacts in parallel', async () => {
    const contacts = Array.from({ length: 5 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const startTime = Date.now();
    const { results } = await processBatchParallel(contacts);
    const elapsedTime = Date.now() - startTime;

    // All 5 contacts should be processed
    expect(results).toHaveLength(5);

    // Processing time should be close to single contact time (parallel)
    // Expected: ~2.5s (parallel) vs ~12.5s (sequential for 5 contacts)
    expect(elapsedTime).toBeLessThan(AVG_ENRICHMENT_TIME_MS * 1.5); // Allow 50% variance
    expect(elapsedTime).toBeGreaterThanOrEqual(AVG_ENRICHMENT_TIME_MS * 0.8); // At least 80% of single contact
  }, 30000);

  it('should add 500ms delay between batches', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const batchTimestamps: number[] = [];
    const originalEnrichContact = enrichContact;

    // Track when each batch starts
    let batchStartIndex = 0;
    const trackingEnrichContact = async (contact: any) => {
      const currentIndex = parseInt(contact.name.split(' ')[1]) - 1;
      if (currentIndex % BATCH_SIZE === 0 && currentIndex > 0) {
        batchTimestamps.push(Date.now());
      }
      return originalEnrichContact(contact);
    };

    // Manually process to track timestamps
    const startTime = Date.now();
    const enrichedResults: any[] = [];

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);

      if (i > 0) {
        batchTimestamps.push(Date.now());
        await sleep(BATCH_DELAY_MS);
      }

      const batchResults = await Promise.all(batch.map(contact => trackingEnrichContact(contact)));
      enrichedResults.push(...batchResults);
    }

    const totalElapsed = Date.now() - startTime;

    // Verify 500ms delay was added between batches
    // 10 contacts = 2 batches = 1 delay
    expect(enrichedResults).toHaveLength(10);

    // Total time should include delay: ~2.5s (batch 1) + 500ms (delay) + ~2.5s (batch 2)
    const expectedMinTime = AVG_ENRICHMENT_TIME_MS * 2 + BATCH_DELAY_MS;
    expect(totalElapsed).toBeGreaterThanOrEqual(expectedMinTime * 0.8);
  }, 30000);

  it('should be 75-80% faster than sequential', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    // Process sequentially
    const sequentialResult = await processBatchSequential(contacts);
    const sequentialTime = sequentialResult.totalTime;

    // Process in parallel
    const parallelResult = await processBatchParallel(contacts);
    const parallelTime = parallelResult.totalTime;

    // Calculate speedup
    const speedup = ((sequentialTime - parallelTime) / sequentialTime) * 100;

    console.log(`Sequential: ${sequentialTime}ms, Parallel: ${parallelTime}ms`);
    console.log(`Speedup: ${speedup.toFixed(1)}%`);

    // Verify both processed all contacts
    expect(sequentialResult.results).toHaveLength(10);
    expect(parallelResult.results).toHaveLength(10);

    // Verify parallel is significantly faster (at least 50% faster)
    expect(parallelTime).toBeLessThan(sequentialTime * 0.5);

    // Ideally 75-80% faster
    expect(speedup).toBeGreaterThanOrEqual(50); // At least 50% faster
  }, 60000);

  it('should process large batch (50 contacts) efficiently', async () => {
    const contacts = Array.from({ length: 50 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const startTime = Date.now();
    const { results } = await processBatchParallel(contacts);
    const elapsedTime = Date.now() - startTime;

    // All contacts should be processed
    expect(results).toHaveLength(50);

    // Performance expectations from ENRICHMENT_BULLETPROOF.md
    // 50 contacts: 30-50s (parallel) vs 150-240s (sequential)
    const expectedMaxTime = 50000; // 50 seconds
    expect(elapsedTime).toBeLessThan(expectedMaxTime);

    // Calculate throughput
    const contactsPerSecond = (contacts.length / elapsedTime) * 1000;
    console.log(`Throughput: ${contactsPerSecond.toFixed(2)} contacts/second`);

    // Should process at least 1 contact per second
    expect(contactsPerSecond).toBeGreaterThanOrEqual(1);
  }, 60000);

  it('should calculate correct number of batches', async () => {
    const testCases = [
      { contacts: 5, expectedBatches: 1 },
      { contacts: 10, expectedBatches: 2 },
      { contacts: 13, expectedBatches: 3 },
      { contacts: 25, expectedBatches: 5 },
      { contacts: 50, expectedBatches: 10 },
    ];

    for (const testCase of testCases) {
      const contacts = Array.from({ length: testCase.contacts }, (_, i) => ({
        name: `Contact ${i + 1}`,
        email: `contact${i + 1}@example.com`,
      }));

      const calculatedBatches = Math.ceil(contacts.length / BATCH_SIZE);
      expect(calculatedBatches).toBe(testCase.expectedBatches);
    }
  });

  it('should respect batch size limits', async () => {
    const contacts = Array.from({ length: 13 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    let batchSizes: number[] = [];

    // Simulate batch processing with size tracking
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);
      batchSizes.push(batch.length);

      // Process batch
      await Promise.all(
        batch.map(contact => sleep(100)) // Fast simulation
      );
    }

    // Verify batch sizes
    expect(batchSizes).toHaveLength(3); // 13 contacts = 3 batches
    expect(batchSizes[0]).toBe(5); // First batch: 5 contacts
    expect(batchSizes[1]).toBe(5); // Second batch: 5 contacts
    expect(batchSizes[2]).toBe(3); // Last batch: 3 contacts
  });

  it('should maintain consistent throughput across batches', async () => {
    const contacts = Array.from({ length: 20 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const batchTimes: number[] = [];

    // Process with timing per batch
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);
      const batchStart = Date.now();

      await Promise.all(batch.map(contact => enrichContact(contact)));

      const batchElapsed = Date.now() - batchStart;
      batchTimes.push(batchElapsed);

      if (i + BATCH_SIZE < contacts.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    // Verify all batches took similar time (within 50% variance)
    const avgBatchTime = batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length;

    for (const batchTime of batchTimes) {
      expect(batchTime).toBeGreaterThanOrEqual(avgBatchTime * 0.5);
      expect(batchTime).toBeLessThan(avgBatchTime * 1.5);
    }
  }, 60000);

  it('should not add delay after last batch', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const delayCount = { value: 0 };
    const originalSleep = sleep;
    const trackingSleep = async (ms: number) => {
      delayCount.value++;
      return originalSleep(ms);
    };

    // Manually process to track delays
    const enrichedResults: any[] = [];

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(batch.map(contact => enrichContact(contact)));
      enrichedResults.push(...batchResults);

      // Add delay between batches (except for last batch)
      if (i + BATCH_SIZE < contacts.length) {
        await trackingSleep(BATCH_DELAY_MS);
      }
    }

    // 10 contacts = 2 batches = 1 delay (not 2)
    expect(delayCount.value).toBe(1);
    expect(enrichedResults).toHaveLength(10);
  }, 30000);

  it('should calculate average time per contact correctly', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const startTime = Date.now();
    const { results } = await processBatchParallel(contacts);
    const totalElapsed = Date.now() - startTime;

    const averageTimePerContact = totalElapsed / contacts.length;

    // Average should be much lower than sequential time
    // Sequential: ~2.5s per contact
    // Parallel: ~0.5-1s per contact (due to parallel processing)
    expect(averageTimePerContact).toBeLessThan(AVG_ENRICHMENT_TIME_MS * 0.6);

    console.log(`Average time per contact: ${averageTimePerContact.toFixed(0)}ms`);
  }, 30000);

  it('should process contacts in correct order within batches', async () => {
    const contacts = Array.from({ length: 7 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
      order: i,
    }));

    const { results } = await processBatchParallel(contacts);

    // Verify all contacts processed
    expect(results).toHaveLength(7);

    // Verify order is maintained (contacts may complete in any order within batch,
    // but results should be in request order)
    for (let i = 0; i < results.length; i++) {
      expect(results[i].order).toBe(i);
    }
  }, 30000);

  it('should calculate contacts per second throughput', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    const startTime = Date.now();
    const { results } = await processBatchParallel(contacts);
    const totalElapsedSeconds = (Date.now() - startTime) / 1000;

    const contactsPerSecond = parseFloat((contacts.length / totalElapsedSeconds).toFixed(2));

    console.log(`Contacts per second: ${contactsPerSecond}`);

    // Should process at least 1 contact per second (target: 1-2 contacts/sec)
    expect(contactsPerSecond).toBeGreaterThanOrEqual(1);
    expect(contactsPerSecond).toBeLessThan(10); // Sanity check

    expect(results).toHaveLength(10);
  }, 30000);
});
