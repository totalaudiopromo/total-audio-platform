# Audio Intel Enrichment Test Suite Summary

## Overview

Comprehensive regression test suite for the Audio Intel contact enrichment pipeline, validating all bulletproof error recovery features and performance characteristics documented in `ENRICHMENT_BULLETPROOF.md`.

## Test Coverage

### 1. Timeout Handling (`timeout.test.ts`)

**7 test cases**covering 10-second timeout protection:

-  Timeout after 10 seconds per contact
-  No retries on timeout (fail fast)
-  Graceful degradation with fallback intelligence
-  Successful enrichment within timeout
-  Timeout rate tracking in batch metrics
-  Timeout logging with processing time

**Key Configuration:**

- `CONTACT_TIMEOUT_MS = 10000` (10 seconds)

**Expected Behaviour:**

- Contacts exceeding 10s timeout fail immediately
- No retry attempts for timeouts
- Fallback intelligence returned: "Enrichment timed out - contact research service temporarily unavailable"

### 2. Retry Logic (`retry.test.ts`)

**10 test cases**covering automatic retry mechanism:

-  Retry failed contacts once (MAX_RETRIES = 1)
-  Exponential backoff timing (1s → 2s)
-  Rate limit detection (429 status, error message)
-  Rate limit handling with 2x delay
-  No retries for timeouts
-  Fail after max retries exceeded
-  Retry count tracking in metrics
-  Success on retry with retried flag

**Key Configuration:**

- `MAX_RETRIES = 1`
- `RETRY_DELAY_MS = 1000` (1 second base)

**Expected Behaviour:**

- First failure: wait 1s (RETRY_DELAY_MS \* 2^0), retry once
- Rate limit error: wait 2s (2x delay), retry once
- Timeout error: no retry (fail fast)

### 3. Partial Success Responses (`partial-success.test.ts`)

**10 test cases**covering partial success handling:

-  Always returns `success: true` for partial success
-  Includes both enriched and failed contacts
-  Provides accurate metrics (success/failure rates)
-  Handles 100% failure gracefully
-  Includes timeout information in failed contacts
-  Includes retry information in successful contacts
-  Calculates cost only for successful enrichments
-  Maintains consistent response structure
-  Returns contacts in same order as input

**Key Principle:**

> "API always returns success: true for partial success - never fails entire batch"

**Expected Response Structure:**

```typescript
{
  success: true,               // ALWAYS true for partial success
  enriched: [...],            // All contacts (successful + fallback)
  summary: {
    total: number,
    enriched: number,         // Successfully enriched
    failed: number,           // Fallback intelligence
    retried: number,
    timedOut: number,
    cost: number              // Only successful enrichments
  },
  metrics: {
    totalTime: string,
    successRate: string,
    retryRate: string,
    timeoutRate: string,
    contactsPerSecond: number
  }
}
```

### 4. Parallel Batch Processing (`parallel-batching.test.ts`)

**10 test cases**covering parallel processing performance:

-  Process 5 contacts in parallel (BATCH_SIZE = 5)
-  Add 500ms delay between batches
-  75-80% faster than sequential processing
-  Large batch processing (50 contacts) efficiency
-  Correct batch count calculation
-  Respect batch size limits
-  Consistent throughput across batches
-  No delay after last batch
-  Average time per contact calculation
-  Contacts processed in correct order
-  Throughput measurement (contacts/second)

**Key Configuration:**

- `BATCH_SIZE = 5`
- `BATCH_DELAY_MS = 500` (500ms)

**Performance Expectations:**

| Contacts | Sequential | Parallel | Speedup |
| -------- | ---------- | -------- | ------- |
| 10       | 30-50s     | 15-20s   | 50%     |
| 50       | 150-240s   | 30-50s   | 75%     |
| 100      | 300-480s   | 60-90s   | 80%     |

**Expected Behaviour:**

- Process 5 contacts simultaneously per batch
- Wait 500ms between batches (except last)
- Maintain 1-2 contacts/second throughput

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

### Run Individual Test Files

```bash
npm run test -- timeout.test.ts
npm run test -- retry.test.ts
npm run test -- partial-success.test.ts
npm run test -- parallel-batching.test.ts
```

### Run with Vitest UI

```bash
npm run test:ui
```

### Run All Tests Once

```bash
npm run test:run
```

## Test Execution Times

Expected execution times for test suites:

- **timeout.test.ts**: ~60-90 seconds (includes 10s+ timeouts)
- **retry.test.ts**: ~30-45 seconds (includes retry delays)
- **partial-success.test.ts**: ~5-10 seconds (fast unit tests)
- **parallel-batching.test.ts**: ~60-120 seconds (performance tests)

**Total suite runtime**: ~2-4 minutes

## Integration with Existing Tests

The enrichment test suite integrates seamlessly with the existing Audio Intel test infrastructure:

### Current Test Structure

```
packages/testing/
 src/
    config/           # Playwright configuration
    validators/       # Accessibility, performance, responsive
    helpers/          # Test utilities
    agents/           # Agent testing
    enrichment/       #  NEW: Enrichment tests
        timeout.test.ts
        retry.test.ts
        partial-success.test.ts
        parallel-batching.test.ts
        index.ts
        README.md
 vitest.config.ts      #  NEW: Vitest configuration
 package.json          #  UPDATED: Added Vitest scripts
```

### Test Commands

```bash
# Run mobile tests (Playwright)
npm run test:mobile

# Run enrichment tests (Vitest)
npm run test:enrichment

# Run all tests
npm run test
```

## Key Validations

The test suite validates these critical behaviours:

### Error Recovery 

- Graceful degradation with fallback intelligence
- Automatic retry with exponential backoff
- Timeout protection (10s per contact)
- Partial success responses (never fail batch)
- Rate limit detection and handling

### Performance 

- Parallel batch processing (5 contacts)
- Batch delay timing (500ms)
- 75-80% faster than sequential
- 1-2 contacts/second throughput
- Average time per contact <1s

### Response Structure 

- Always `success: true` for partial success
- All contacts included (enriched + fallback)
- Accurate summary metrics
- Correct cost calculation
- Consistent timing measurements

### Business Logic 

- $0.003 cost per successful enrichment
- No cost for failed/fallback contacts
- Proper confidence levels (High/Medium/Low)
- Intelligence fields populated correctly
- Source tracking (claude/fallback/error)

## Success Criteria

All tests should pass with these characteristics:

 **37 total test cases**
 **100% pass rate**
 **Execution time: 2-4 minutes**
 **No unexpected timeouts**
 **Timing assertions within variance**

## Troubleshooting

### Tests Timing Out

Increase test timeout in `vitest.config.ts`:

```typescript
testTimeout: 30000, // 30 seconds (default)
```

### Inconsistent Timing Tests

Network latency can affect timing. Tests allow reasonable variance:

```typescript
// Example: 10s timeout ± 500ms variance
expect(elapsedTime).toBeGreaterThanOrEqual(10000);
expect(elapsedTime).toBeLessThan(10500);
```

### Resource Constraints

Parallel tests may fail under load:

```bash
# Check system resources
top
ps aux | grep node
```

## Maintenance

When updating enrichment pipeline:

1.  Update production code (`route.ts`)
2.  Update test configuration (`TEST_CONFIG`)
3.  Run test suite to verify
4.  Update documentation (`ENRICHMENT_BULLETPROOF.md`)

## CI/CD Integration

Recommended GitHub Actions workflow:

```yaml
name: Audio Intel Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install Dependencies
        run: |
          cd packages/testing
          npm install

      - name: Run Enrichment Tests
        run: |
          cd packages/testing
          npm run test:enrichment

      - name: Run Mobile Tests
        run: |
          cd apps/audio-intel
          npm run test:mobile
```

## References

### Production Implementation

- **API Route**: `apps/audio-intel/app/api/enrich-claude/route.ts`
- **Service**: `apps/audio-intel/utils/claudeEnrichmentService.ts`
- **Prompts**: `apps/audio-intel/utils/enrichmentPrompts.ts`

### Documentation

- **System Docs**: `apps/audio-intel/docs/ENRICHMENT_BULLETPROOF.md`
- **Test README**: `packages/testing/src/enrichment/README.md`
- **API Docs**: `apps/audio-intel/docs/ENRICHMENT_API.md`

### Configuration

- **Vitest Config**: `packages/testing/vitest.config.ts`
- **Package Config**: `packages/testing/package.json`
- **TypeScript Config**: `packages/testing/tsconfig.json`

## Support

For questions or issues:

- Review test output for specific failures
- Check production logs for error patterns
- Consult `ENRICHMENT_BULLETPROOF.md` for system behaviour
- Run tests locally to reproduce issues

---

**Version**: 2.1.0 (matches ENRICHMENT_BULLETPROOF.md)
**Last Updated**: November 2025
**Status**:  Production Ready
**Total Test Cases**: 37
**Coverage**: Timeout, Retry, Partial Success, Parallel Batching
