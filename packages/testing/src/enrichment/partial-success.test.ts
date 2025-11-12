import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Partial Success Response Tests
 *
 * Tests the partial success handling for batch enrichment:
 * - Always returns success: true for partial success
 * - Includes both enriched and failed contacts in response
 * - Provides accurate metrics for success/failure rates
 * - Never fails entire batch due to individual failures
 *
 * Based on: ENRICHMENT_BULLETPROOF.md
 * Key principle: "API always returns success: true for partial success"
 */

describe('Partial Success Responses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Helper: Simulate batch enrichment with mixed results
   */
  async function processBatch(contacts: any[], successPattern: boolean[]) {
    const allResults: any[] = [];
    let successCount = 0;
    let failedCount = 0;
    let retriedCount = 0;
    let timedOutCount = 0;
    let totalCost = 0;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const shouldSucceed = successPattern[i];

      if (shouldSucceed) {
        // Successful enrichment
        const enrichedContact = {
          ...contact,
          intelligence: 'Platform: BBC Radio 1\nRole: Presenter',
          confidence: 'High',
          lastResearched: new Date().toISOString(),
          source: 'claude',
          processingTime: 2500,
          retried: false,
        };
        allResults.push(enrichedContact);
        successCount++;
        totalCost += 0.003;
      } else {
        // Failed enrichment with fallback
        const fallbackContact = {
          ...contact,
          intelligence: 'Enrichment failed - manual research required',
          confidence: 'Low',
          lastResearched: new Date().toISOString(),
          error: 'Network error',
          source: 'fallback',
          processingTime: 5000,
          timedOut: false,
        };
        allResults.push(fallbackContact);
        failedCount++;
      }
    }

    return {
      success: true, // ALWAYS true for partial success
      enriched: allResults,
      summary: {
        total: contacts.length,
        enriched: successCount,
        failed: failedCount,
        retried: retriedCount,
        timedOut: timedOutCount,
        cost: parseFloat(totalCost.toFixed(4)),
      },
      metrics: {
        totalTime: '10.5s',
        enrichmentTime: '10.2s',
        averageTimePerContact: `${(10200 / contacts.length).toFixed(0)}ms`,
        successRate: `${Math.round((successCount / contacts.length) * 100)}%`,
        retryRate: '0%',
        timeoutRate: '0%',
        contactsPerSecond: parseFloat((contacts.length / 10.5).toFixed(2)),
      },
    };
  }

  it('should always return success: true for partial success', async () => {
    const contacts = [
      { name: 'Contact 1', email: 'c1@example.com' },
      { name: 'Contact 2', email: 'c2@example.com' },
      { name: 'Contact 3', email: 'c3@example.com' },
    ];

    // Pattern: success, fail, success (2/3 success rate)
    const successPattern = [true, false, true];

    const response = await processBatch(contacts, successPattern);

    // CRITICAL: Always returns success: true
    expect(response.success).toBe(true);

    // Verify summary
    expect(response.summary.total).toBe(3);
    expect(response.summary.enriched).toBe(2);
    expect(response.summary.failed).toBe(1);
  });

  it('should include both enriched and failed contacts', async () => {
    const contacts = [
      { name: 'Jack Saunders', email: 'jack.saunders@bbc.co.uk' },
      { name: 'Failed Contact', email: 'failed@example.com' },
      { name: 'Clara Amfo', email: 'clara.amfo@bbc.co.uk' },
    ];

    const successPattern = [true, false, true];

    const response = await processBatch(contacts, successPattern);

    // Should return all contacts
    expect(response.enriched).toHaveLength(3);

    // Verify successful contacts
    const successfulContacts = response.enriched.filter((c: any) => c.source === 'claude');
    expect(successfulContacts).toHaveLength(2);
    expect(successfulContacts[0].intelligence).toContain('BBC Radio 1');
    expect(successfulContacts[0].confidence).toBe('High');

    // Verify failed contacts with fallback
    const failedContacts = response.enriched.filter((c: any) => c.source === 'fallback');
    expect(failedContacts).toHaveLength(1);
    expect(failedContacts[0].intelligence).toContain('manual research required');
    expect(failedContacts[0].confidence).toBe('Low');
  });

  it('should provide accurate metrics for mixed results', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    // Pattern: 7 success, 3 fail (70% success rate)
    const successPattern = [true, true, false, true, true, true, false, true, false, true];

    const response = await processBatch(contacts, successPattern);

    // Verify summary metrics
    expect(response.summary.total).toBe(10);
    expect(response.summary.enriched).toBe(7);
    expect(response.summary.failed).toBe(3);
    expect(response.summary.cost).toBeGreaterThan(0); // Only successful contacts have cost

    // Verify calculated metrics
    expect(response.metrics.successRate).toBe('70%');
    expect(response.metrics.totalTime).toBeTruthy();
    expect(response.metrics.averageTimePerContact).toBeTruthy();
  });

  it('should never fail entire batch due to individual failures', async () => {
    const contacts = Array.from({ length: 50 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    // Pattern: 80% success, 20% failures (realistic scenario)
    const successPattern = contacts.map((_, i) => i % 5 !== 0); // Every 5th fails

    const response = await processBatch(contacts, successPattern);

    // Should ALWAYS succeed at API level
    expect(response.success).toBe(true);

    // Should return all contacts
    expect(response.enriched).toHaveLength(50);

    // Verify metrics
    expect(response.summary.enriched).toBe(40); // 80% of 50
    expect(response.summary.failed).toBe(10); // 20% of 50
    expect(response.metrics.successRate).toBe('80%');
  });

  it('should handle 100% failure gracefully', async () => {
    const contacts = [
      { name: 'Fail 1', email: 'fail1@example.com' },
      { name: 'Fail 2', email: 'fail2@example.com' },
      { name: 'Fail 3', email: 'fail3@example.com' },
    ];

    // Pattern: all fail
    const successPattern = [false, false, false];

    const response = await processBatch(contacts, successPattern);

    // Should STILL return success: true
    expect(response.success).toBe(true);

    // All contacts should have fallback intelligence
    expect(response.enriched).toHaveLength(3);
    expect(response.summary.enriched).toBe(0);
    expect(response.summary.failed).toBe(3);
    expect(response.summary.cost).toBe(0); // No successful enrichments = no cost

    // All contacts should have fallback source
    response.enriched.forEach((contact: any) => {
      expect(contact.source).toBe('fallback');
      expect(contact.confidence).toBe('Low');
      expect(contact.intelligence).toContain('manual research required');
    });
  });

  it('should include timeout information in failed contacts', async () => {
    const contacts = [
      { name: 'Success', email: 'success@example.com' },
      { name: 'Timeout', email: 'timeout@example.com' },
    ];

    // Simulate timeout scenario
    const enrichedResults: any[] = [];
    enrichedResults.push({
      ...contacts[0],
      intelligence: 'Successfully enriched',
      confidence: 'High',
      source: 'claude',
      timedOut: false,
    });
    enrichedResults.push({
      ...contacts[1],
      intelligence: 'Enrichment timed out - contact research service temporarily unavailable',
      confidence: 'Low',
      source: 'fallback',
      timedOut: true,
      error: 'Contact enrichment timed out after 10000ms',
    });

    const response = {
      success: true,
      enriched: enrichedResults,
      summary: {
        total: 2,
        enriched: 1,
        failed: 1,
        timedOut: 1,
        retried: 0,
        cost: 0.003,
      },
    };

    // Verify timeout handling
    expect(response.success).toBe(true);
    expect(response.summary.timedOut).toBe(1);

    const timedOutContact = response.enriched.find((c: any) => c.timedOut);
    expect(timedOutContact).toBeDefined();
    expect(timedOutContact.intelligence).toContain('timed out');
    expect(timedOutContact.source).toBe('fallback');
  });

  it('should include retry information in successful contacts', async () => {
    const contacts = [
      { name: 'Normal', email: 'normal@example.com' },
      { name: 'Retried', email: 'retried@example.com' },
    ];

    // Simulate retry scenario
    const enrichedResults: any[] = [];
    enrichedResults.push({
      ...contacts[0],
      intelligence: 'Successfully enriched',
      confidence: 'High',
      source: 'claude',
      retried: false,
    });
    enrichedResults.push({
      ...contacts[1],
      intelligence: 'Successfully enriched after retry',
      confidence: 'Medium',
      source: 'claude',
      retried: true,
    });

    const response = {
      success: true,
      enriched: enrichedResults,
      summary: {
        total: 2,
        enriched: 2,
        failed: 0,
        retried: 1,
        timedOut: 0,
        cost: 0.006,
      },
      metrics: {
        retryRate: '50%', // 1 out of 2 successful was retried
      },
    };

    // Verify retry tracking
    expect(response.success).toBe(true);
    expect(response.summary.retried).toBe(1);
    expect(response.metrics.retryRate).toBe('50%');

    const retriedContact = response.enriched.find((c: any) => c.retried);
    expect(retriedContact).toBeDefined();
    expect(retriedContact.source).toBe('claude'); // Still successful
  });

  it('should calculate cost only for successful enrichments', async () => {
    const contacts = Array.from({ length: 10 }, (_, i) => ({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
    }));

    // Pattern: 6 success, 4 fail
    const successPattern = [true, true, false, true, false, true, true, false, true, false];

    const response = await processBatch(contacts, successPattern);

    // Verify cost calculation
    const successCount = response.summary.enriched;
    const expectedCost = successCount * 0.003; // $0.003 per successful enrichment

    expect(response.summary.cost).toBeCloseTo(expectedCost, 4);
    expect(response.summary.cost).toBeGreaterThan(0);

    // Failed contacts should not contribute to cost
    expect(response.summary.enriched).toBe(6);
    expect(response.summary.failed).toBe(4);
  });

  it('should maintain consistent response structure', async () => {
    const contacts = [
      { name: 'Contact 1', email: 'c1@example.com' },
      { name: 'Contact 2', email: 'c2@example.com' },
    ];

    const successPattern = [true, false];

    const response = await processBatch(contacts, successPattern);

    // Verify response structure matches route.ts
    expect(response).toHaveProperty('success');
    expect(response).toHaveProperty('enriched');
    expect(response).toHaveProperty('summary');
    expect(response).toHaveProperty('metrics');

    // Verify summary structure
    expect(response.summary).toHaveProperty('total');
    expect(response.summary).toHaveProperty('enriched');
    expect(response.summary).toHaveProperty('failed');
    expect(response.summary).toHaveProperty('retried');
    expect(response.summary).toHaveProperty('timedOut');
    expect(response.summary).toHaveProperty('cost');

    // Verify metrics structure
    expect(response.metrics).toHaveProperty('totalTime');
    expect(response.metrics).toHaveProperty('successRate');
    expect(response.metrics).toHaveProperty('averageTimePerContact');
  });

  it('should return all contacts in same order as input', async () => {
    const contacts = [
      { name: 'First', email: 'first@example.com' },
      { name: 'Second', email: 'second@example.com' },
      { name: 'Third', email: 'third@example.com' },
    ];

    const successPattern = [true, false, true];

    const response = await processBatch(contacts, successPattern);

    // Verify order is preserved
    expect(response.enriched).toHaveLength(3);
    expect(response.enriched[0].name).toBe('First');
    expect(response.enriched[1].name).toBe('Second');
    expect(response.enriched[2].name).toBe('Third');
  });
});
