/**
 * Trace System
 *
 * Structured tracing for all autopilot operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { TraceEvent, TraceEventType } from './traceEvents';
import { createBaseEvent } from './traceEvents';

export class TraceCollector {
  private events: TraceEvent[] = [];
  private supabase: SupabaseClient;
  private missionId: string;
  private runId?: string;

  constructor(supabase: SupabaseClient, missionId: string, runId?: string) {
    this.supabase = supabase;
    this.missionId = missionId;
    this.runId = runId;
  }

  /**
   * Add trace event
   */
  async add(event: TraceEvent): Promise<void> {
    this.events.push(event);

    // Store in database (autopilot_logs table)
    await this.supabase.from('autopilot_logs').insert({
      mission_id: this.missionId,
      run_id: this.runId,
      level: this.getLogLevel(event.type),
      message: this.formatEventMessage(event),
      metadata: event,
      created_at: event.timestamp,
    });
  }

  /**
   * Get all events
   */
  getEvents(): TraceEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type
   */
  getEventsByType(type: TraceEventType): TraceEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  /**
   * Get events for task
   */
  getEventsForTask(taskId: string): TraceEvent[] {
    return this.events.filter((e) => e.taskId === taskId);
  }

  /**
   * Get timeline (events sorted by timestamp)
   */
  getTimeline(): TraceEvent[] {
    return [...this.events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  /**
   * Clear events (for testing)
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Map event type to log level
   */
  private getLogLevel(type: TraceEventType): string {
    switch (type) {
      case 'error_occurred':
        return 'error';
      case 'watchdog_triggered':
      case 'retry_attempted':
        return 'warning';
      case 'run_start':
      case 'run_end':
      case 'agent_start':
      case 'agent_end':
        return 'info';
      default:
        return 'debug';
    }
  }

  /**
   * Format event as human-readable message
   */
  private formatEventMessage(event: TraceEvent): string {
    switch (event.type) {
      case 'run_start':
        return `Run started (${event.triggerType}, ${event.mode} mode)`;
      case 'run_end':
        return `Run ended (${event.status}, ${event.tasksExecuted} tasks, ${event.duration}ms)`;
      case 'agent_start':
        return `Agent ${event.agentRole} started (${event.taskType})`;
      case 'agent_end':
        return `Agent ${event.agentRole} ended (${event.success ? 'success' : 'failed'}, ${event.duration}ms)`;
      case 'task_start':
        return `Task ${event.taskId} started (${event.agentRole}: ${event.taskType})`;
      case 'task_end':
        return `Task ${event.taskId} ended (${event.success ? 'success' : 'failed'}, ${event.duration}ms)`;
      case 'decision_made':
        return `Decision by ${event.agentRole}: ${event.decision} (confidence: ${event.confidence})`;
      case 'confidence_calculated':
        return `Confidence calculated: ${event.score} (escalate: ${event.shouldEscalate})`;
      case 'negotiation_started':
        return `Negotiation started (${event.conflictType}, agents: ${event.agents.join(', ')})`;
      case 'negotiation_resolved':
        return `Negotiation ${event.resolved ? 'resolved' : 'failed'} (${event.strategy}, ${event.rounds} rounds)`;
      case 'retry_attempted':
        return `Retry attempt ${event.attemptNumber} (backoff: ${event.backoffMs}ms)`;
      case 'error_occurred':
        return `Error (${event.severity}): ${event.error}`;
      case 'approval_requested':
        return `Approval requested for ${event.actionType} (reason: ${event.reason})`;
      case 'watchdog_triggered':
        return `Watchdog triggered for ${event.agentRole} (timeout: ${event.timeoutMs}ms)`;
      default:
        return `Event: ${event.type}`;
    }
  }
}

/**
 * Create trace collector
 */
export function createTraceCollector(
  supabase: SupabaseClient,
  missionId: string,
  runId?: string
): TraceCollector {
  return new TraceCollector(supabase, missionId, runId);
}

/**
 * Load trace from database
 */
export async function loadTrace(
  supabase: SupabaseClient,
  missionId: string,
  runId?: string
): Promise<TraceEvent[]> {
  const query = supabase
    .from('autopilot_logs')
    .select('*')
    .eq('mission_id', missionId)
    .order('created_at', { ascending: true });

  if (runId) {
    query.eq('run_id', runId);
  }

  const { data } = await query;

  if (!data) return [];

  return data.map((log) => log.metadata as TraceEvent).filter(Boolean);
}

/**
 * Get trace summary statistics
 */
export function getTraceSummary(events: TraceEvent[]): {
  totalEvents: number;
  eventsByType: Record<string, number>;
  totalDuration: number;
  errorCount: number;
  retryCount: number;
  agentExecutions: number;
} {
  const eventsByType: Record<string, number> = {};

  events.forEach((event) => {
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
  });

  const runEndEvents = events.filter((e) => e.type === 'run_end');
  const totalDuration = runEndEvents.reduce(
    (sum, e: any) => sum + (e.duration || 0),
    0
  );

  return {
    totalEvents: events.length,
    eventsByType,
    totalDuration,
    errorCount: eventsByType.error_occurred || 0,
    retryCount: eventsByType.retry_attempted || 0,
    agentExecutions: eventsByType.agent_end || 0,
  };
}
