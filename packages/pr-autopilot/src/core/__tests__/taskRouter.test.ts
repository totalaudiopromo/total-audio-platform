/**
 * TaskRouter Tests
 */

import { TaskRouter } from '../taskRouter';
import type { AutopilotTask } from '../../types';

const mockSupabase = {
  from: jest.fn(),
} as any;

describe('TaskRouter', () => {
  let router: TaskRouter;

  beforeEach(() => {
    router = new TaskRouter(mockSupabase);
    jest.clearAllMocks();
  });

  describe('getDownstreamTasks', () => {
    it('should route strategist completion to pitch and contact agents', () => {
      const task: AutopilotTask = {
        id: 'task-1',
        mission_id: 'mission-1',
        parent_task_id: null,
        agent_role: 'strategist',
        type: 'plan_campaign',
        input: {},
        output: null,
        status: 'completed',
        priority: 10,
        blocking_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      };

      const output = {
        strategy: { goals: ['goal1', 'goal2'] },
        contact_targeting: { primary_pool: {} },
        timeline: { start_date: '2024-01-01' },
      };

      // Access private method via reflection for testing
      const getDownstreamTasks = (router as any).getDownstreamTasks.bind(router);
      const downstreamTasks = getDownstreamTasks(task, output, 'suggest');

      expect(downstreamTasks).toHaveLength(3);
      expect(downstreamTasks.some((t: any) => t.agent_role === 'pitch')).toBe(true);
      expect(downstreamTasks.some((t: any) => t.agent_role === 'contact')).toBe(true);
      expect(downstreamTasks.some((t: any) => t.agent_role === 'scheduler')).toBe(true);
    });
  });

  describe('requiresApproval', () => {
    it('should require approval for all tasks in suggest mode', async () => {
      const task: AutopilotTask = {
        id: 'task-1',
        mission_id: 'mission-1',
        parent_task_id: null,
        agent_role: 'scheduler',
        type: 'execute_send_schedule',
        input: {},
        output: null,
        status: 'pending',
        priority: 10,
        blocking_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      };

      const requiresApproval = await router.requiresApproval(task, 'suggest');

      expect(requiresApproval).toBe(true);
    });

    it('should not require approval for non-critical tasks in full_auto mode', async () => {
      const task: AutopilotTask = {
        id: 'task-1',
        mission_id: 'mission-1',
        parent_task_id: null,
        agent_role: 'analyst',
        type: 'analyze_campaign_performance',
        input: {},
        output: null,
        status: 'pending',
        priority: 10,
        blocking_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      };

      const requiresApproval = await router.requiresApproval(task, 'full_auto');

      expect(requiresApproval).toBe(false);
    });
  });
});
