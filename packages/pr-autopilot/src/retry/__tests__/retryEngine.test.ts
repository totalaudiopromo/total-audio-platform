/**
 * Retry Engine Tests
 */

import {
  isRetryableError,
  calculateBackoff,
  shouldRetry,
  DEFAULT_RETRY_CONFIG,
} from '../retryEngine';
import type { AutopilotTask } from '../../types';

describe('RetryEngine', () => {
  const mockTask: Partial<AutopilotTask> = {
    id: 'task-1',
    status: 'failed',
    retry_count: 0,
  };

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      expect(isRetryableError(new Error('Connection timeout'))).toBe(true);
      expect(isRetryableError(new Error('Network error'))).toBe(true);
      expect(isRetryableError(new Error('429 Rate limit'))).toBe(true);
      expect(isRetryableError(new Error('503 Service unavailable'))).toBe(true);
    });

    it('should identify non-retryable errors', () => {
      expect(isRetryableError(new Error('401 Unauthorized'))).toBe(false);
      expect(isRetryableError(new Error('403 Forbidden'))).toBe(false);
      expect(isRetryableError(new Error('404 Not found'))).toBe(false);
      expect(isRetryableError(new Error('Invalid input'))).toBe(false);
    });
  });

  describe('calculateBackoff', () => {
    it('should calculate exponential backoff', () => {
      expect(calculateBackoff(1)).toBe(2000); // 2s
      expect(calculateBackoff(2)).toBe(8000); // 8s
      expect(calculateBackoff(3)).toBe(32000); // 32s
    });

    it('should respect max delay', () => {
      expect(calculateBackoff(10)).toBe(60000); // Max 60s
    });
  });

  describe('shouldRetry', () => {
    it('should retry for retryable errors', () => {
      const result = shouldRetry(
        mockTask as AutopilotTask,
        new Error('Network timeout')
      );

      expect(result.shouldRetry).toBe(true);
      expect(result.backoffMs).toBe(2000);
      expect(result.attemptNumber).toBe(1);
    });

    it('should not retry for non-retryable errors', () => {
      const result = shouldRetry(
        mockTask as AutopilotTask,
        new Error('401 Unauthorized')
      );

      expect(result.shouldRetry).toBe(false);
      expect(result.reason).toContain('not retryable');
    });

    it('should not retry after max attempts', () => {
      const task = { ...mockTask, retry_count: 3 };
      const result = shouldRetry(
        task as AutopilotTask,
        new Error('Network timeout')
      );

      expect(result.shouldRetry).toBe(false);
      expect(result.reason).toContain('Maximum retry attempts');
    });
  });
});
