/**
 * Run Determinism Tests
 */

import {
  generateSeed,
  SeededRandom,
  sortTasksDeterministic,
  generateExecutionPlan,
  validateExecutionOrder,
  DEFAULT_DETERMINISTIC_CONFIG,
} from '../runDeterminism';
import type { AutopilotTask } from '../../types';

describe('Run Determinism', () => {
  const mockTasks: Partial<AutopilotTask>[] = [
    {
      id: 'task-1',
      agent_role: 'strategist',
      task_type: 'analyze',
      priority: 2,
      sequence_order: 1,
      status: 'pending',
      dependencies: [],
    },
    {
      id: 'task-2',
      agent_role: 'pitch',
      task_type: 'draft',
      priority: 1,
      sequence_order: 2,
      status: 'pending',
      dependencies: ['task-1'],
    },
    {
      id: 'task-3',
      agent_role: 'contact',
      task_type: 'find',
      priority: 1,
      sequence_order: 3,
      status: 'pending',
      dependencies: [],
    },
  ];

  describe('generateSeed', () => {
    it('should generate consistent seeds for same mission ID', () => {
      const missionId = 'mission-123';
      const seed1 = generateSeed(missionId);
      const seed2 = generateSeed(missionId);

      expect(seed1).toBe(seed2);
    });

    it('should generate different seeds for different mission IDs', () => {
      const seed1 = generateSeed('mission-123');
      const seed2 = generateSeed('mission-456');

      expect(seed1).not.toBe(seed2);
    });

    it('should generate positive numbers', () => {
      const seed = generateSeed('mission-test');
      expect(seed).toBeGreaterThan(0);
    });
  });

  describe('SeededRandom', () => {
    it('should generate consistent random sequence with same seed', () => {
      const seed = 12345;
      const rng1 = new SeededRandom(seed);
      const rng2 = new SeededRandom(seed);

      const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
      const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(sequence1).toEqual(sequence2);
    });

    it('should generate different sequences with different seeds', () => {
      const rng1 = new SeededRandom(12345);
      const rng2 = new SeededRandom(67890);

      const val1 = rng1.next();
      const val2 = rng2.next();

      expect(val1).not.toBe(val2);
    });

    it('should generate values between 0 and 1', () => {
      const rng = new SeededRandom(12345);
      const values = Array.from({ length: 100 }, () => rng.next());

      values.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('sortTasksDeterministic', () => {
    it('should sort tasks consistently with same config', () => {
      const sorted1 = sortTasksDeterministic(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );
      const sorted2 = sortTasksDeterministic(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );

      expect(sorted1.map((t) => t.id)).toEqual(sorted2.map((t) => t.id));
    });

    it('should respect priority order', () => {
      const sorted = sortTasksDeterministic(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );

      // Higher priority (lower number) should come first
      const priorities = sorted.map((t) => t.priority);
      expect(priorities[0]).toBeLessThanOrEqual(priorities[1]);
    });

    it('should respect dependencies', () => {
      const sorted = sortTasksDeterministic(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );

      const taskIds = sorted.map((t) => t.id);
      const task2Index = taskIds.indexOf('task-2');
      const task1Index = taskIds.indexOf('task-1');

      // task-2 depends on task-1, so task-1 should come first
      expect(task1Index).toBeLessThan(task2Index);
    });

    it('should use sequence_order as tiebreaker when enabled', () => {
      const config = { ...DEFAULT_DETERMINISTIC_CONFIG, useSequenceOrder: true };

      const tasksWithSamePriority: Partial<AutopilotTask>[] = [
        { ...mockTasks[1], priority: 1, sequence_order: 2, dependencies: [] },
        { ...mockTasks[2], priority: 1, sequence_order: 1, dependencies: [] },
      ];

      const sorted = sortTasksDeterministic(
        tasksWithSamePriority as AutopilotTask[],
        config
      );

      expect(sorted[0].sequence_order).toBeLessThan(sorted[1].sequence_order);
    });
  });

  describe('generateExecutionPlan', () => {
    it('should generate ordered list of task IDs', () => {
      const plan = generateExecutionPlan(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );

      expect(plan).toHaveLength(mockTasks.length);
      expect(plan).toContain('task-1');
      expect(plan).toContain('task-2');
      expect(plan).toContain('task-3');
    });

    it('should respect dependency order', () => {
      const plan = generateExecutionPlan(
        mockTasks as AutopilotTask[],
        DEFAULT_DETERMINISTIC_CONFIG
      );

      const task1Index = plan.indexOf('task-1');
      const task2Index = plan.indexOf('task-2');

      expect(task1Index).toBeLessThan(task2Index);
    });
  });

  describe('validateExecutionOrder', () => {
    it('should validate correct execution order', () => {
      const plan = ['task-1', 'task-2', 'task-3'];
      const executedTaskIds = ['task-1', 'task-2', 'task-3'];

      const result = validateExecutionOrder(plan, executedTaskIds);

      expect(result.isValid).toBe(true);
      expect(result.deviations).toHaveLength(0);
    });

    it('should detect out-of-order execution', () => {
      const plan = ['task-1', 'task-2', 'task-3'];
      const executedTaskIds = ['task-2', 'task-1', 'task-3'];

      const result = validateExecutionOrder(plan, executedTaskIds);

      expect(result.isValid).toBe(false);
      expect(result.deviations.length).toBeGreaterThan(0);
    });

    it('should detect missing tasks', () => {
      const plan = ['task-1', 'task-2', 'task-3'];
      const executedTaskIds = ['task-1', 'task-3'];

      const result = validateExecutionOrder(plan, executedTaskIds);

      expect(result.isValid).toBe(false);
      expect(result.deviations).toContainEqual({
        type: 'missing',
        taskId: 'task-2',
        expectedIndex: 1,
        actualIndex: -1,
      });
    });

    it('should detect extra tasks', () => {
      const plan = ['task-1', 'task-2'];
      const executedTaskIds = ['task-1', 'task-2', 'task-3'];

      const result = validateExecutionOrder(plan, executedTaskIds);

      expect(result.isValid).toBe(false);
      expect(result.deviations).toContainEqual({
        type: 'extra',
        taskId: 'task-3',
        expectedIndex: -1,
        actualIndex: 2,
      });
    });
  });
});
