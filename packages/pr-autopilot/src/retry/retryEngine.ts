/**
 * Retry & Recovery Engine
 *
 * Handles automatic retry logic with exponential backoff for failed tasks
 */

import type { AutopilotTask } from '../types';

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

export interface RetryDecision {
  shouldRetry: boolean;
  reason?: string;
  backoffMs?: number;
  attemptNumber?: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 2000, // 2 seconds
  maxDelayMs: 60000, // 60 seconds max
  exponentialBase: 4, // 2s -> 8s -> 32s
};

/**
 * Errors that should trigger retries
 */
const RETRYABLE_ERROR_PATTERNS = [
  /timeout/i,
  /network/i,
  /connection/i,
  /ECONNREFUSED/i,
  /ETIMEDOUT/i,
  /rate limit/i,
  /429/,
  /503/,
  /500/,
  /temporarily unavailable/i,
  /try again/i,
];

/**
 * Errors that should NOT trigger retries
 */
const NON_RETRYABLE_ERROR_PATTERNS = [
  /unauthorized/i,
  /forbidden/i,
  /401/,
  /403/,
  /404/,
  /invalid/i,
  /malformed/i,
  /bad request/i,
  /400/,
  /permission denied/i,
];

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;

  // First check non-retryable errors (takes precedence)
  for (const pattern of NON_RETRYABLE_ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      return false;
    }
  }

  // Then check retryable errors
  for (const pattern of RETRYABLE_ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      return true;
    }
  }

  // Default: don't retry unknown errors
  return false;
}

/**
 * Calculate backoff delay with exponential backoff
 */
export function calculateBackoff(
  attemptNumber: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = config.baseDelayMs * Math.pow(config.exponentialBase, attemptNumber - 1);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Determine if a task should be retried
 */
export function shouldRetry(
  task: AutopilotTask,
  error: Error | string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): RetryDecision {
  const currentRetryCount = task.retry_count || 0;

  // Check max retries
  if (currentRetryCount >= config.maxRetries) {
    return {
      shouldRetry: false,
      reason: `Maximum retry attempts (${config.maxRetries}) reached`,
    };
  }

  // Check if task is in retryable state
  if (task.status !== 'failed') {
    return {
      shouldRetry: false,
      reason: `Task status is ${task.status}, not failed`,
    };
  }

  // Check if error is retryable
  if (!isRetryableError(error)) {
    return {
      shouldRetry: false,
      reason: 'Error is not retryable (permanent failure)',
    };
  }

  // Calculate backoff for next attempt
  const nextAttempt = currentRetryCount + 1;
  const backoffMs = calculateBackoff(nextAttempt, config);

  return {
    shouldRetry: true,
    backoffMs,
    attemptNumber: nextAttempt,
    reason: `Retryable error detected, scheduling retry #${nextAttempt} after ${backoffMs}ms`,
  };
}

/**
 * Execute a function with automatic retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attemptNumber: number, error: Error, backoffMs: number) => void
): Promise<T> {
  let lastError: Error;
  let attemptNumber = 0;

  while (attemptNumber <= config.maxRetries) {
    try {
      attemptNumber++;
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the last attempt, throw the error
      if (attemptNumber > config.maxRetries) {
        throw lastError;
      }

      // Check if error is retryable
      if (!isRetryableError(lastError)) {
        throw lastError;
      }

      // Calculate backoff
      const backoffMs = calculateBackoff(attemptNumber, config);

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attemptNumber, lastError, backoffMs);
      }

      // Wait before retrying
      await sleep(backoffMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}

/**
 * Execute a function with retry and circuit breaker
 */
export async function executeWithRetryAndCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitBreaker: CircuitBreaker,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attemptNumber: number, error: Error, backoffMs: number) => void
): Promise<T> {
  // Check if circuit is open
  if (circuitBreaker.isOpen()) {
    throw new Error(`Circuit breaker is open for ${circuitBreaker.name}`);
  }

  try {
    const result = await executeWithRetry(fn, config, onRetry);
    circuitBreaker.recordSuccess();
    return result;
  } catch (error) {
    circuitBreaker.recordFailure();
    throw error;
  }
}

/**
 * Simple sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    public name: string,
    private failureThreshold: number = 5,
    private resetTimeoutMs: number = 60000 // 1 minute
  ) {}

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    // If circuit is open, check if reset timeout has passed
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.resetTimeoutMs) {
        this.state = 'half-open';
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Record a successful operation
   */
  recordSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  /**
   * Record a failed operation
   */
  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): {
    state: 'closed' | 'open' | 'half-open';
    failures: number;
    threshold: number;
  } {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.failureThreshold,
    };
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

/**
 * Retry strategy types
 */
export type RetryStrategy =
  | 'exponential' // Standard exponential backoff
  | 'linear' // Linear backoff
  | 'constant' // Constant delay
  | 'jitter'; // Exponential with random jitter

/**
 * Calculate backoff with different strategies
 */
export function calculateBackoffWithStrategy(
  attemptNumber: number,
  strategy: RetryStrategy,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  let delay: number;

  switch (strategy) {
    case 'exponential':
      delay = config.baseDelayMs * Math.pow(config.exponentialBase, attemptNumber - 1);
      break;

    case 'linear':
      delay = config.baseDelayMs * attemptNumber;
      break;

    case 'constant':
      delay = config.baseDelayMs;
      break;

    case 'jitter':
      // Exponential with random jitter (50-100% of calculated delay)
      const exponentialDelay =
        config.baseDelayMs * Math.pow(config.exponentialBase, attemptNumber - 1);
      const jitter = 0.5 + Math.random() * 0.5; // 50-100%
      delay = exponentialDelay * jitter;
      break;

    default:
      delay = config.baseDelayMs;
  }

  return Math.min(delay, config.maxDelayMs);
}

/**
 * Get retry statistics for a task
 */
export function getRetryStats(task: AutopilotTask): {
  retryCount: number;
  maxRetries: number;
  canRetry: boolean;
  nextBackoffMs?: number;
} {
  const retryCount = task.retry_count || 0;
  const maxRetries = DEFAULT_RETRY_CONFIG.maxRetries;
  const canRetry = retryCount < maxRetries;

  return {
    retryCount,
    maxRetries,
    canRetry,
    nextBackoffMs: canRetry ? calculateBackoff(retryCount + 1) : undefined,
  };
}
