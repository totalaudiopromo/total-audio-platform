/**
 * Error Classes Tests
 */

import {
  AutopilotError,
  MissionNotFoundError,
  PolicyViolationError,
  isAutopilotError,
  getErrorDetails,
} from '../errors';

describe('Error Classes', () => {
  describe('AutopilotError', () => {
    it('should create error with code and metadata', () => {
      const error = new AutopilotError('Test error', 'TEST_CODE', {
        detail: 'extra info',
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.metadata).toEqual({ detail: 'extra info' });
      expect(error.name).toBe('AutopilotError');
    });
  });

  describe('MissionNotFoundError', () => {
    it('should create mission not found error', () => {
      const error = new MissionNotFoundError('mission-123');

      expect(error.message).toContain('mission-123');
      expect(error.code).toBe('MISSION_NOT_FOUND');
      expect(error.metadata).toEqual({ missionId: 'mission-123' });
    });
  });

  describe('PolicyViolationError', () => {
    it('should create policy violation error', () => {
      const error = new PolicyViolationError(
        'Max limit exceeded',
        'max_emails_per_day',
        { limit: 50, requested: 100 }
      );

      expect(error.message).toBe('Max limit exceeded');
      expect(error.code).toBe('POLICY_VIOLATION');
      expect(error.metadata?.policyType).toBe('max_emails_per_day');
      expect(error.metadata?.limit).toBe(50);
    });
  });

  describe('isAutopilotError', () => {
    it('should return true for AutopilotError instances', () => {
      const error = new AutopilotError('Test', 'TEST');

      expect(isAutopilotError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');

      expect(isAutopilotError(error)).toBe(false);
    });
  });

  describe('getErrorDetails', () => {
    it('should extract details from AutopilotError', () => {
      const error = new AutopilotError('Test error', 'TEST_CODE', {
        detail: 'info',
      });

      const details = getErrorDetails(error);

      expect(details.message).toBe('Test error');
      expect(details.code).toBe('TEST_CODE');
      expect(details.metadata).toEqual({ detail: 'info' });
    });

    it('should handle regular Error', () => {
      const error = new Error('Regular error');

      const details = getErrorDetails(error);

      expect(details.message).toBe('Regular error');
      expect(details.code).toBe('UNKNOWN_ERROR');
    });

    it('should handle non-Error objects', () => {
      const details = getErrorDetails('string error');

      expect(details.message).toBe('string error');
      expect(details.code).toBe('UNKNOWN_ERROR');
    });
  });
});
