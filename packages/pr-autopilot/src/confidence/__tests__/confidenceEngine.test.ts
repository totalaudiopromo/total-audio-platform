/**
 * Confidence Engine Tests
 */

import { calculateConfidence, getConfidenceLabel } from '../confidenceEngine';
import type { AutopilotTask, AutopilotMission } from '../../types';

describe('ConfidenceEngine', () => {
  const mockTask: AutopilotTask = {
    id: 'task-1',
    mission_id: 'mission-1',
    agent_role: 'strategist',
    task_type: 'initial-plan',
    status: 'pending',
    input: {},
    priority: 2,
    sequence_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockMission: AutopilotMission = {
    id: 'mission-1',
    user_id: 'user-1',
    title: 'Test Mission',
    mode: 'semi_auto',
    status: 'active',
    config: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('calculateConfidence', () => {
    it('should return high confidence for complete data', () => {
      const result = calculateConfidence({
        agentRole: 'strategist',
        task: mockTask,
        mission: mockMission,
        fusionContext: {
          artist: { name: 'Test Artist', genre: ['indie'] },
          release: { title: 'Test Release', releaseDate: '2025-01-01' },
          contacts: [],
          campaigns: [],
          successProfiles: [],
        },
        availableData: { complete: true },
      });

      expect(result.score).toBeGreaterThan(0.7);
      expect(result.shouldEscalate).toBe(false);
    });

    it('should return low confidence for missing data', () => {
      const result = calculateConfidence({
        agentRole: 'strategist',
        task: mockTask,
        mission: mockMission,
        availableData: {},
      });

      expect(result.score).toBeLessThan(0.5);
      expect(result.shouldEscalate).toBe(true);
      expect(result.blockers.length).toBeGreaterThan(0);
    });

    it('should penalize paused missions', () => {
      const pausedMission = { ...mockMission, status: 'paused' as const };
      const result = calculateConfidence({
        agentRole: 'strategist',
        task: mockTask,
        mission: pausedMission,
        availableData: {},
      });

      expect(result.blockers).toContain('Mission is paused - cannot execute tasks');
    });
  });

  describe('getConfidenceLabel', () => {
    it('should return correct labels', () => {
      expect(getConfidenceLabel(0.95)).toBe('Very High');
      expect(getConfidenceLabel(0.8)).toBe('High');
      expect(getConfidenceLabel(0.6)).toBe('Moderate');
      expect(getConfidenceLabel(0.4)).toBe('Low');
      expect(getConfidenceLabel(0.2)).toBe('Very Low');
    });
  });
});
