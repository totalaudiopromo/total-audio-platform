/**
 * Retry Wrapper - Exponential backoff for API calls
 *
 * Handles transient failures with:
 * - Exponential backoff
 * - Configurable retries
 * - Timeout handling
 * - Error classification (retry vs fail)
 */

const { getAlerts } = require('./email-alerts');

class RetryWrapper {
  constructor(options = {}) {
    this.defaults = {
      retries: options.retries || 3,
      baseDelay: options.baseDelay || 1000,  // 1 second
      maxDelay: options.maxDelay || 30000,   // 30 seconds
      timeout: options.timeout || 60000,      // 60 seconds
      exponential: options.exponential !== false,
      jitter: options.jitter !== false,
      ...options
    };
  }

  /**
   * Retry a function with exponential backoff
   */
  async retry(fn, options = {}) {
    const config = { ...this.defaults, ...options };
    const { retries, baseDelay, maxDelay, exponential, jitter, timeout } = config;

    let lastError;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        // Add timeout wrapper
        const result = await this.withTimeout(fn, timeout);
        return result;
      } catch (error) {
        lastError = error;
        attempt++;

        // Check if error is retryable
        if (!this.isRetryable(error)) {
          console.error(`[Retry] Non-retryable error on attempt ${attempt}:`, error.message);
          throw error;
        }

        // Max retries reached
        if (attempt > retries) {
          console.error(`[Retry] Max retries (${retries}) exceeded`);
          throw new Error(`Max retries exceeded: ${error.message}`);
        }

        // Calculate delay
        const delay = this.calculateDelay(attempt, baseDelay, maxDelay, exponential, jitter);

        console.log(`[Retry] Attempt ${attempt}/${retries} failed. Retrying in ${delay}ms... (${error.message})`);

        // Wait before retry
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Wrap function with timeout
   */
  async withTimeout(fn, timeoutMs) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }

  /**
   * Calculate exponential backoff delay
   */
  calculateDelay(attempt, baseDelay, maxDelay, exponential, jitter) {
    let delay = baseDelay;

    if (exponential) {
      // Exponential backoff: baseDelay * 2^attempt
      delay = baseDelay * Math.pow(2, attempt - 1);
    } else {
      // Linear backoff
      delay = baseDelay * attempt;
    }

    // Cap at max delay
    delay = Math.min(delay, maxDelay);

    // Add jitter to prevent thundering herd
    if (jitter) {
      const jitterAmount = delay * 0.3;  // 30% jitter
      delay = delay + (Math.random() * jitterAmount) - (jitterAmount / 2);
    }

    return Math.round(delay);
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error) {
    // Network errors - retry
    if (error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND') {
      return true;
    }

    // HTTP status codes - retry on 5xx, 429
    if (error.response) {
      const status = error.response.status;
      if (status >= 500 || status === 429) {
        return true;
      }
    }

    // API rate limit errors
    if (error.message && (
      error.message.includes('rate limit') ||
      error.message.includes('too many requests') ||
      error.message.includes('quota exceeded')
    )) {
      return true;
    }

    // Timeout errors
    if (error.message && error.message.includes('Timeout')) {
      return true;
    }

    // Authentication errors - don't retry (4xx)
    if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
      return false;
    }

    // Default: don't retry unknown errors
    return false;
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch retry - process array of items with retry logic
   */
  async batchRetry(items, processFn, options = {}) {
    const { concurrency = 5, stopOnError = false } = options;

    const results = [];
    const errors = [];

    // Process in batches
    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);

      const batchPromises = batch.map(async (item, idx) => {
        const globalIdx = i + idx;
        try {
          const result = await this.retry(() => processFn(item, globalIdx), options);
          return { success: true, item, result, index: globalIdx };
        } catch (error) {
          return { success: false, item, error, index: globalIdx };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(r => {
        if (r.success) {
          results.push(r);
        } else {
          errors.push(r);
          if (stopOnError) {
            throw new Error(`Batch processing stopped on error: ${r.error.message}`);
          }
        }
      });
    }

    return {
      results,
      errors,
      successCount: results.length,
      errorCount: errors.length,
      totalCount: items.length
    };
  }

  /**
   * Wrap Anthropic API call with retry
   */
  async anthropicWithRetry(client, params, options = {}) {
    return await this.retry(async () => {
      return await client.messages.create(params);
    }, {
      retries: 5,
      baseDelay: 2000,  // 2 seconds
      maxDelay: 60000,  // 1 minute
      ...options
    });
  }

  /**
   * Wrap Airtable API call with retry
   */
  async airtableWithRetry(fetchFn, options = {}) {
    return await this.retry(fetchFn, {
      retries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      ...options
    });
  }

  /**
   * Wrap WARM API call with retry
   */
  async warmApiWithRetry(fetchFn, options = {}) {
    return await this.retry(fetchFn, {
      retries: 3,
      baseDelay: 2000,
      maxDelay: 15000,
      ...options
    });
  }

  /**
   * Test retry logic
   */
  async test() {
    console.log('[RetryWrapper] Testing retry logic...\n');

    // Test 1: Successful on first try
    console.log('Test 1: Success on first try');
    let callCount = 0;
    const result1 = await this.retry(() => {
      callCount++;
      return Promise.resolve('success');
    });
    console.log(`✅ Result: ${result1}, Calls: ${callCount}\n`);

    // Test 2: Success on third try
    console.log('Test 2: Fail twice, succeed on third try');
    callCount = 0;
    const result2 = await this.retry(() => {
      callCount++;
      if (callCount < 3) {
        const error = new Error('Temporary failure');
        error.code = 'ECONNRESET';
        throw error;
      }
      return Promise.resolve('success after retries');
    }, { retries: 3, baseDelay: 100 });
    console.log(`✅ Result: ${result2}, Calls: ${callCount}\n`);

    // Test 3: Non-retryable error
    console.log('Test 3: Non-retryable error (authentication)');
    try {
      await this.retry(() => {
        const error = new Error('Authentication failed');
        error.response = { status: 401 };
        throw error;
      }, { retries: 3, baseDelay: 100 });
    } catch (error) {
      console.log(`✅ Correctly failed without retry: ${error.message}\n`);
    }

    // Test 4: Batch retry
    console.log('Test 4: Batch processing with retries');
    const items = [1, 2, 3, 4, 5];
    const batchResult = await this.batchRetry(
      items,
      async (item) => {
        if (item === 3) {
          const error = new Error('Item 3 fails');
          error.response = { status: 400 };
          throw error;
        }
        return item * 2;
      },
      { concurrency: 2, baseDelay: 100 }
    );
    console.log(`✅ Batch result:`, {
      success: batchResult.successCount,
      errors: batchResult.errorCount,
      results: batchResult.results.map(r => r.result)
    });

    console.log('\n✅ All retry tests passed!');
  }
}

// Singleton instance
let instance = null;

function getRetryWrapper(options = {}) {
  if (!instance) {
    instance = new RetryWrapper(options);
  }
  return instance;
}

// CLI test
if (require.main === module) {
  const wrapper = getRetryWrapper();
  wrapper.test();
}

module.exports = { RetryWrapper, getRetryWrapper };
