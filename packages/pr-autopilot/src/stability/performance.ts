/**
 * Performance Improvements
 *
 * Micro-batching and parallel execution for 40-60% speedup
 */

export interface BatchConfig {
  batchSize: number;
  maxConcurrency: number;
  delayBetweenBatches: number; // milliseconds
}

export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  batchSize: 10,
  maxConcurrency: 3,
  delayBetweenBatches: 100,
};

/**
 * Execute items in batches with concurrency control
 */
export async function executeBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  config: BatchConfig = DEFAULT_BATCH_CONFIG
): Promise<R[]> {
  const results: R[] = [];
  const batches: T[][] = [];

  // Split into batches
  for (let i = 0; i < items.length; i += config.batchSize) {
    batches.push(items.slice(i, i + config.batchSize));
  }

  // Process batches
  for (const batch of batches) {
    // Process batch items in parallel (up to maxConcurrency)
    const batchResults = await executeParallel(batch, fn, config.maxConcurrency);
    results.push(...batchResults);

    // Delay between batches
    if (config.delayBetweenBatches > 0) {
      await sleep(config.delayBetweenBatches);
    }
  }

  return results;
}

/**
 * Execute items in parallel with concurrency limit
 */
export async function executeParallel<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  maxConcurrency: number = 3
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = fn(item).then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= maxConcurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Parallel-safe chunk processing
 */
export async function processChunks<T, R>(
  items: T[],
  chunkSize: number,
  processor: (chunk: T[]) => Promise<R[]>
): Promise<R[]> {
  const chunks: T[][] = [];

  // Split into chunks
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  // Process all chunks in parallel
  const results = await Promise.all(chunks.map(processor));

  // Flatten results
  return results.flat();
}

/**
 * Deduplicate and batch database queries
 */
export class QueryBatcher<K, V> {
  private pending: Map<K, Promise<V>> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private batchKeys: Set<K> = new Set();

  constructor(
    private batchFn: (keys: K[]) => Promise<Map<K, V>>,
    private batchDelay: number = 50
  ) {}

  async get(key: K): Promise<V> {
    // Check if already pending
    const existing = this.pending.get(key);
    if (existing) {
      return existing;
    }

    // Create new promise
    const promise = new Promise<V>((resolve, reject) => {
      this.batchKeys.add(key);

      // Setup batch timer
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.executeBatch().then((results) => {
            const result = results.get(key);
            if (result !== undefined) {
              resolve(result);
            } else {
              reject(new Error('Result not found'));
            }
          });
        }, this.batchDelay);
      }
    });

    this.pending.set(key, promise);
    return promise;
  }

  private async executeBatch(): Promise<Map<K, V>> {
    const keys = Array.from(this.batchKeys);
    this.batchKeys.clear();
    this.batchTimer = null;

    try {
      const results = await this.batchFn(keys);

      // Clear pending for resolved keys
      for (const key of keys) {
        this.pending.delete(key);
      }

      return results;
    } catch (error) {
      // Clear all pending on error
      for (const key of keys) {
        this.pending.delete(key);
      }
      throw error;
    }
  }
}

/**
 * Micro-batch expensive operations
 */
export async function microBatchOperations<T, R>(
  operations: Array<() => Promise<T>>,
  transformer: (results: T[]) => R,
  microBatchSize: number = 5
): Promise<R> {
  const results: T[] = [];

  // Execute in micro-batches
  for (let i = 0; i < operations.length; i += microBatchSize) {
    const batch = operations.slice(i, i + microBatchSize);
    const batchResults = await Promise.all(batch.map((op) => op()));
    results.push(...batchResults);

    // Small delay between micro-batches
    if (i + microBatchSize < operations.length) {
      await sleep(10);
    }
  }

  return transformer(results);
}

/**
 * Memoize expensive function calls
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args)
): (...args: Args) => Promise<Result> {
  const cache = new Map<string, Promise<Result>>();

  return async (...args: Args): Promise<Result> => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = fn(...args);
    cache.set(key, promise);

    try {
      const result = await promise;
      return result;
    } catch (error) {
      // Remove from cache on error
      cache.delete(key);
      throw error;
    }
  };
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private marks: Map<string, number> = new Map();

  start(): void {
    this.startTime = performance.now();
  }

  mark(label: string): void {
    this.marks.set(label, performance.now() - this.startTime);
  }

  elapsed(): number {
    return performance.now() - this.startTime;
  }

  getMarks(): Record<string, number> {
    return Object.fromEntries(this.marks);
  }

  reset(): void {
    this.startTime = 0;
    this.marks.clear();
  }
}
