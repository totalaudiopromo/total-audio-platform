# Audio Intel Enrichment Test Suite

Comprehensive regression tests for the Audio Intel contact enrichment pipeline.

## Overview

This test suite validates the bulletproof enrichment system documented in `ENRICHMENT_BULLETPROOF.md`. It covers all critical error recovery features and performance characteristics.

## Test Files

### 1. `timeout.test.ts` - Timeout Handling

Tests the 10-second timeout protection per contact:

- ✅ Timeout after 10 seconds per contact
- ✅ No retries on timeout (fail fast)
- ✅ Graceful degradation with fallback intelligence
- ✅ Timeout rate tracking in metrics

**Configuration:**

- `CONTACT_TIMEOUT_MS = 10000` (10 seconds)

**Key Tests:**

```typescript
it('should timeout after 10 seconds per contact');
it('should not retry timeouts (fail fast)');
it('should return fallback intelligence on timeout');
```

### 2. `retry.test.ts` - Retry Logic

Tests the automatic retry mechanism with exponential backoff:

- ✅ Single retry per contact (MAX_RETRIES = 1)
- ✅ Exponential backoff timing (1s → 2s)
- ✅ Rate limit detection with 2x delay
- ✅ Retry count tracking in metrics

**Configuration:**

- `MAX_RETRIES = 1`
- `RETRY_DELAY_MS = 1000` (1 second base)

**Key Tests:**

```typescript
it('should retry failed contacts once');
it('should use exponential backoff (1s → 2s)');
it('should detect rate limits and use 2x delay');
```

### 3. `partial-success.test.ts` - Partial Success Responses

Tests the partial success handling that never fails entire batches:

- ✅ Always returns `success: true` for partial success
- ✅ Includes both enriched and failed contacts
- ✅ Accurate metrics for success/failure rates
- ✅ Cost calculation only for successful enrichments

**Key Principle:**

> "API always returns success: true for partial success"

**Key Tests:**

```typescript
it('should always return success: true for partial success');
it('should include both enriched and failed contacts');
it('should handle 100% failure gracefully');
```

### 4. `parallel-batching.test.ts` - Parallel Batch Processing

Tests the parallel processing that makes enrichment 75-80% faster:

- ✅ Process 5 contacts in parallel (BATCH_SIZE = 5)
- ✅ 500ms delay between batches
- ✅ 75-80% faster than sequential processing
- ✅ Maintains consistent throughput

**Configuration:**

- `BATCH_SIZE = 5`
- `BATCH_DELAY_MS = 500` (500ms)

**Performance Expectations:**
| Contacts | Sequential | Parallel | Improvement |
|----------|-----------|----------|-------------|
| 10 | 30-50s | 15-20s | 50% faster |
| 50 | 150-240s | 30-50s | 75% faster |
| 100 | 300-480s | 60-90s | 80% faster |

**Key Tests:**

```typescript
it('should process 5 contacts in parallel');
it('should add 500ms delay between batches');
it('should be 75-80% faster than sequential');
```

## Running Tests

### Install Dependencies

```bash
cd packages/testing
npm install
```

### Run All Enrichment Tests

```bash
npm run test:enrichment
```

### Run Specific Test File

```bash
npm run test -- timeout.test.ts
npm run test -- retry.test.ts
npm run test -- partial-success.test.ts
npm run test -- parallel-batching.test.ts
```

### Run with UI (Vitest UI)

```bash
npm run test:ui
```

### Run in Watch Mode

```bash
npm run test
```

### Run All Tests Once

```bash
npm run test:run
```

## Test Coverage

The test suite validates:

### Error Recovery Features

- ✅ Graceful degradation (fallback intelligence)
- ✅ Automatic retry logic (exponential backoff)
- ✅ Timeout protection (10s per contact)
- ✅ Partial success responses (never fail batch)
- ✅ Rate limit detection and handling

### Performance Characteristics

- ✅ Parallel batch processing (5 contacts)
- ✅ Batch delay timing (500ms)
- ✅ Sequential vs parallel speedup (75-80%)
- ✅ Throughput measurement (contacts/second)
- ✅ Average time per contact calculation

### Response Structure

- ✅ Success flag (always true for partial success)
- ✅ Enriched contacts array (successful + fallback)
- ✅ Summary metrics (total, enriched, failed, retried, timedOut, cost)
- ✅ Performance metrics (totalTime, successRate, retryRate, timeoutRate)
- ✅ Error recovery configuration

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run Enrichment Tests
  run: |
    cd packages/testing
    npm install
    npm run test:enrichment
```

## Test Configuration

All test configuration matches the production values from `route.ts`:

```typescript
export const TEST_CONFIG = {
  BATCH_SIZE: 5, // Contacts per batch
  BATCH_DELAY_MS: 500, // Delay between batches
  CONTACT_TIMEOUT_MS: 10000, // Timeout per contact
  MAX_RETRIES: 1, // Retry count
  RETRY_DELAY_MS: 1000, // Base retry delay
  AVG_ENRICHMENT_TIME_MS: 2500, // Expected enrichment time
} as const;
```

## Expected Test Results

All tests should pass with these characteristics:

### Timeout Tests (7 tests)

- ✅ All timeout tests complete within expected timeframes
- ✅ No unexpected retries on timeout
- ✅ Fallback intelligence provided

### Retry Tests (10 tests)

- ✅ Retry logic executes correctly
- ✅ Exponential backoff timing verified
- ✅ Rate limit handling confirmed

### Partial Success Tests (10 tests)

- ✅ Always returns success: true
- ✅ All contacts included in response
- ✅ Metrics calculated accurately

### Parallel Batching Tests (10 tests)

- ✅ Parallel processing 75-80% faster
- ✅ Batch sizing and delays correct
- ✅ Throughput meets expectations

## Troubleshooting

### Tests Timing Out

If tests are timing out, increase the test timeout in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 30000, // Increase to 30 seconds
  },
});
```

### Inconsistent Timing

Network latency and system load can affect timing tests. Tests allow for reasonable variance:

```typescript
// Example: timeout test allows 100ms variance
expect(elapsedTime).toBeGreaterThanOrEqual(TIMEOUT_MS);
expect(elapsedTime).toBeLessThan(TIMEOUT_MS + 500);
```

### Failed Parallel Tests

If parallel tests fail, check system resources:

```bash
# Check CPU and memory
top

# Check if other processes are affecting performance
ps aux | grep node
```

## References

- **Production Implementation**: `apps/audio-intel/app/api/enrich-claude/route.ts`
- **Documentation**: `apps/audio-intel/docs/ENRICHMENT_BULLETPROOF.md`
- **Service Implementation**: `apps/audio-intel/utils/claudeEnrichmentService.ts`

## Maintenance

When updating the enrichment pipeline:

1. ✅ Update production code first
2. ✅ Update tests to match new configuration
3. ✅ Update `ENRICHMENT_BULLETPROOF.md` documentation
4. ✅ Run full test suite to verify
5. ✅ Update this README if configuration changes

## Support

For issues or questions:

- Check `ENRICHMENT_BULLETPROOF.md` for system documentation
- Review production logs for error patterns
- Run tests locally to reproduce issues
- Contact the Audio Intel team

---

**Last Updated**: November 2025
**Version**: 2.1.0 (matches ENRICHMENT_BULLETPROOF.md)
**Status**: ✅ Production Ready
