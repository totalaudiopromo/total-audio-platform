/**
 * Trace and Watchdog Tests
 */

import {
  TraceCollector,
  loadTrace,
  getTraceSummary,
  type TraceEvent,
} from '../trace';
import {
  formatTraceEvent,
  formatTraceTimeline,
  groupEventsByAgent,
  calculateEventStats,
} from '../traceFormatter';
import {
  AgentWatchdog,
  WatchdogTimer,
  executeWithWatchdog,
  DEFAULT_WATCHDOG_CONFIG,
} from '../../stability/watchdog';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentRole } from '../../types';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => Promise.resolve({ error: null })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
          })
        ),
      })),
    })),
  })),
} as unknown as SupabaseClient;

describe('TraceCollector', () => {
  let collector: TraceCollector;

  beforeEach(() => {
    collector = new TraceCollector(mockSupabase, 'mission-123', 'run-123');
    jest.clearAllMocks();
  });

  it('should add events to timeline', async () => {
    const event: TraceEvent = {
      id: 'event-1',
      timestamp: new Date().toISOString(),
      type: 'run_start',
      triggerType: 'manual',
      mode: 'suggest',
    };

    await collector.add(event);

    const timeline = collector.getTimeline();
    expect(timeline).toHaveLength(1);
    expect(timeline[0]).toEqual(event);
  });

  it('should filter events by type', async () => {
    await collector.add({
      id: 'event-1',
      timestamp: new Date().toISOString(),
      type: 'run_start',
      triggerType: 'manual',
      mode: 'suggest',
    });

    await collector.add({
      id: 'event-2',
      timestamp: new Date().toISOString(),
      type: 'agent_start',
      agentRole: 'strategist',
    });

    await collector.add({
      id: 'event-3',
      timestamp: new Date().toISOString(),
      type: 'agent_start',
      agentRole: 'pitch',
    });

    const agentEvents = collector.getEventsByType('agent_start');
    expect(agentEvents).toHaveLength(2);
  });

  it('should persist events to database', async () => {
    const event: TraceEvent = {
      id: 'event-1',
      timestamp: new Date().toISOString(),
      type: 'decision_made',
      taskId: 'task-1',
      decision: 'approve',
      confidence: 0.9,
    };

    await collector.add(event);

    expect(mockSupabase.from).toHaveBeenCalledWith('autopilot_logs');
  });
});

describe('loadTrace', () => {
  it('should load trace events from database', async () => {
    const mockEvents = [
      {
        metadata: {
          id: 'event-1',
          timestamp: new Date().toISOString(),
          type: 'run_start',
        },
      },
    ];

    const mockFrom = mockSupabase.from as jest.Mock;
    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: mockEvents,
              error: null,
            })
          ),
        })),
      })),
    });

    const events = await loadTrace(mockSupabase, 'mission-123', 'run-123');

    expect(events).toHaveLength(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('autopilot_logs');
  });
});

describe('getTraceSummary', () => {
  it('should calculate trace summary', () => {
    const events: TraceEvent[] = [
      {
        id: 'event-1',
        timestamp: '2025-01-01T00:00:00Z',
        type: 'run_start',
        triggerType: 'manual',
        mode: 'suggest',
      },
      {
        id: 'event-2',
        timestamp: '2025-01-01T00:05:00Z',
        type: 'agent_start',
        agentRole: 'strategist',
      },
      {
        id: 'event-3',
        timestamp: '2025-01-01T00:10:00Z',
        type: 'agent_end',
        agentRole: 'strategist',
      },
      {
        id: 'event-4',
        timestamp: '2025-01-01T00:15:00Z',
        type: 'run_end',
        status: 'completed',
      },
    ];

    const summary = getTraceSummary(events);

    expect(summary.totalEvents).toBe(4);
    expect(summary.duration).toBeGreaterThan(0);
    expect(summary.agentsInvolved).toBe(1);
  });

  it('should count error events', () => {
    const events: TraceEvent[] = [
      {
        id: 'event-1',
        timestamp: new Date().toISOString(),
        type: 'error_occurred',
        taskId: 'task-1',
        error: 'Network timeout',
      },
      {
        id: 'event-2',
        timestamp: new Date().toISOString(),
        type: 'error_occurred',
        taskId: 'task-2',
        error: 'Invalid response',
      },
    ];

    const summary = getTraceSummary(events);

    expect(summary.errorsCount).toBe(2);
  });
});

describe('formatTraceEvent', () => {
  it('should format event with color and icon', () => {
    const event: TraceEvent = {
      id: 'event-1',
      timestamp: new Date().toISOString(),
      type: 'agent_start',
      agentRole: 'strategist',
    };

    const formatted = formatTraceEvent(event);

    expect(formatted.color).toBeDefined();
    expect(formatted.icon).toBeDefined();
    expect(formatted.message).toBeDefined();
  });

  it('should format decision events with confidence', () => {
    const event: TraceEvent = {
      id: 'event-1',
      timestamp: new Date().toISOString(),
      type: 'decision_made',
      taskId: 'task-1',
      decision: 'approve',
      confidence: 0.9,
    };

    const formatted = formatTraceEvent(event);

    expect(formatted.message).toContain('approve');
    expect(formatted.details.confidence).toBe(0.9);
  });
});

describe('formatTraceTimeline', () => {
  it('should sort events chronologically', () => {
    const events: TraceEvent[] = [
      {
        id: 'event-2',
        timestamp: '2025-01-01T00:05:00Z',
        type: 'agent_start',
        agentRole: 'strategist',
      },
      {
        id: 'event-1',
        timestamp: '2025-01-01T00:00:00Z',
        type: 'run_start',
        triggerType: 'manual',
        mode: 'suggest',
      },
    ];

    const timeline = formatTraceTimeline(events);

    expect(timeline[0].id).toBe('event-1');
    expect(timeline[1].id).toBe('event-2');
  });
});

describe('groupEventsByAgent', () => {
  it('should group events by agent role', () => {
    const events: TraceEvent[] = [
      {
        id: 'event-1',
        timestamp: new Date().toISOString(),
        type: 'agent_start',
        agentRole: 'strategist',
      },
      {
        id: 'event-2',
        timestamp: new Date().toISOString(),
        type: 'agent_start',
        agentRole: 'pitch',
      },
      {
        id: 'event-3',
        timestamp: new Date().toISOString(),
        type: 'agent_end',
        agentRole: 'strategist',
      },
    ];

    const grouped = groupEventsByAgent(events);

    expect(grouped.get('strategist')).toHaveLength(2);
    expect(grouped.get('pitch')).toHaveLength(1);
  });
});

describe('calculateEventStats', () => {
  it('should calculate event statistics', () => {
    const events: TraceEvent[] = [
      {
        id: 'event-1',
        timestamp: new Date().toISOString(),
        type: 'run_start',
        triggerType: 'manual',
        mode: 'suggest',
      },
      {
        id: 'event-2',
        timestamp: new Date().toISOString(),
        type: 'agent_start',
        agentRole: 'strategist',
      },
      {
        id: 'event-3',
        timestamp: new Date().toISOString(),
        type: 'agent_start',
        agentRole: 'pitch',
      },
    ];

    const stats = calculateEventStats(events);

    expect(stats.totalEvents).toBe(3);
    expect(stats.eventsByType.run_start).toBe(1);
    expect(stats.eventsByType.agent_start).toBe(2);
  });
});

describe('WatchdogTimer', () => {
  jest.useFakeTimers();

  it('should trigger timeout callback', () => {
    const onTimeout = jest.fn();
    const watchdog = new WatchdogTimer(1000, onTimeout);

    watchdog.start();
    jest.advanceTimersByTime(1000);

    expect(onTimeout).toHaveBeenCalled();
  });

  it('should not trigger if stopped', () => {
    const onTimeout = jest.fn();
    const watchdog = new WatchdogTimer(1000, onTimeout);

    watchdog.start();
    watchdog.stop();
    jest.advanceTimersByTime(1000);

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('should track elapsed time', () => {
    const watchdog = new WatchdogTimer(5000, jest.fn());

    watchdog.start();
    jest.advanceTimersByTime(2000);

    expect(watchdog.elapsed()).toBe(2000);
    expect(watchdog.remaining()).toBe(3000);
  });
});

describe('AgentWatchdog', () => {
  jest.useFakeTimers();

  let watchdog: AgentWatchdog;

  beforeEach(() => {
    watchdog = new AgentWatchdog(DEFAULT_WATCHDOG_CONFIG);
  });

  it('should watch task execution', () => {
    const onTimeout = jest.fn();

    watchdog.watch('task-1', 'strategist' as AgentRole, onTimeout);

    expect(watchdog.isWatching('task-1')).toBe(true);
  });

  it('should use agent-specific timeouts', () => {
    const onTimeout = jest.fn();

    watchdog.watch('task-1', 'strategist' as AgentRole, onTimeout);
    const remaining = watchdog.remaining('task-1');

    expect(remaining).toBeLessThanOrEqual(180000); // 3 minutes for strategist
  });

  it('should trigger timeout for long-running agents', () => {
    const onTimeout = jest.fn();

    watchdog.watch('task-1', 'scheduler' as AgentRole, onTimeout);
    jest.advanceTimersByTime(30000); // 30 seconds

    expect(onTimeout).toHaveBeenCalled();
  });

  it('should unwatch completed tasks', () => {
    const onTimeout = jest.fn();

    watchdog.watch('task-1', 'strategist' as AgentRole, onTimeout);
    watchdog.unwatch('task-1');

    expect(watchdog.isWatching('task-1')).toBe(false);

    jest.advanceTimersByTime(180000);
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('should kill all active watchdogs', () => {
    watchdog.watch('task-1', 'strategist' as AgentRole, jest.fn());
    watchdog.watch('task-2', 'pitch' as AgentRole, jest.fn());

    const stats = watchdog.getStats();
    expect(stats.activeWatchdogs).toBe(2);

    watchdog.killAll();

    const newStats = watchdog.getStats();
    expect(newStats.activeWatchdogs).toBe(0);
  });
});

describe('executeWithWatchdog', () => {
  jest.useFakeTimers();

  it('should execute function successfully', async () => {
    const watchdog = new AgentWatchdog(DEFAULT_WATCHDOG_CONFIG);
    const fn = jest.fn(() => Promise.resolve('success'));

    const promise = executeWithWatchdog(watchdog, 'task-1', 'strategist' as AgentRole, fn);

    // Fast-forward to allow promise to resolve
    await Promise.resolve();

    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalled();
    expect(watchdog.isWatching('task-1')).toBe(false);
  });

  it('should timeout if function takes too long', async () => {
    const watchdog = new AgentWatchdog(DEFAULT_WATCHDOG_CONFIG);
    const fn = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 999999);
        })
    );

    const promise = executeWithWatchdog(
      watchdog,
      'task-1',
      'scheduler' as AgentRole, // 30s timeout
      fn
    );

    jest.advanceTimersByTime(30000);

    await expect(promise).rejects.toThrow('timed out');
  });

  it('should handle function errors', async () => {
    const watchdog = new AgentWatchdog(DEFAULT_WATCHDOG_CONFIG);
    const fn = jest.fn(() => Promise.reject(new Error('Test error')));

    const promise = executeWithWatchdog(watchdog, 'task-1', 'strategist' as AgentRole, fn);

    await expect(promise).rejects.toThrow('Test error');
    expect(watchdog.isWatching('task-1')).toBe(false);
  });
});
