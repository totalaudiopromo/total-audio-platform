/**
 * Trace Formatter
 *
 * Format trace events for UI display
 */

import type { TraceEvent } from './traceEvents';

export interface FormattedTraceEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  details: string[];
  color: string;
  icon: string;
}

/**
 * Format trace event for UI
 */
export function formatTraceEvent(event: TraceEvent): FormattedTraceEvent {
  const { color, icon } = getEventStyle(event.type);

  return {
    id: event.id,
    timestamp: event.timestamp,
    type: event.type,
    message: getEventMessage(event),
    details: getEventDetails(event),
    color,
    icon,
  };
}

/**
 * Get event styling
 */
function getEventStyle(type: string): { color: string; icon: string } {
  switch (type) {
    case 'run_start':
      return { color: '#3AA9BE', icon: '▶' };
    case 'run_end':
      return { color: '#10B981', icon: '■' };
    case 'agent_start':
      return { color: '#3AA9BE', icon: '→' };
    case 'agent_end':
      return { color: '#8B5CF6', icon: '✓' };
    case 'task_start':
      return { color: '#3AA9BE', icon: '•' };
    case 'task_end':
      return { color: '#10B981', icon: '✓' };
    case 'decision_made':
      return { color: '#F59E0B', icon: '⚡' };
    case 'confidence_calculated':
      return { color: '#06B6D4', icon: '📊' };
    case 'negotiation_started':
      return { color: '#F59E0B', icon: '⚖' };
    case 'negotiation_resolved':
      return { color: '#10B981', icon: '✓' };
    case 'retry_attempted':
      return { color: '#F59E0B', icon: '↻' };
    case 'error_occurred':
      return { color: '#EF4444', icon: '✗' };
    case 'approval_requested':
      return { color: '#F59E0B', icon: '👤' };
    case 'watchdog_triggered':
      return { color: '#EF4444', icon: '⏱' };
    default:
      return { color: '#94A3B8', icon: '•' };
  }
}

/**
 * Get event message
 */
function getEventMessage(event: TraceEvent): string {
  switch (event.type) {
    case 'run_start':
      return `Run started (${event.mode} mode)`;
    case 'run_end':
      return `Run ${event.status} (${event.tasksExecuted} tasks, ${(event.duration / 1000).toFixed(1)}s)`;
    case 'agent_start':
      return `${event.agentRole} started`;
    case 'agent_end':
      return `${event.agentRole} ${event.success ? 'completed' : 'failed'} (${(event.duration / 1000).toFixed(2)}s)`;
    case 'task_start':
      return `Task: ${event.taskType}`;
    case 'task_end':
      return `Task ${event.success ? 'completed' : 'failed'}`;
    case 'decision_made':
      return `Decision: ${event.decision}`;
    case 'confidence_calculated':
      return `Confidence: ${(event.score * 100).toFixed(0)}%`;
    case 'negotiation_started':
      return `Negotiation: ${event.conflictType}`;
    case 'negotiation_resolved':
      return `Resolved via ${event.strategy}`;
    case 'retry_attempted':
      return `Retry attempt ${event.attemptNumber}`;
    case 'error_occurred':
      return `Error (${event.severity})`;
    case 'approval_requested':
      return `Approval needed: ${event.actionType}`;
    case 'watchdog_triggered':
      return `Timeout: ${event.agentRole}`;
    default:
      return event.type;
  }
}

/**
 * Get event details
 */
function getEventDetails(event: TraceEvent): string[] {
  const details: string[] = [];

  switch (event.type) {
    case 'run_start':
      details.push(`Trigger: ${event.triggerType}`);
      details.push(`Mode: ${event.mode}`);
      break;
    case 'agent_end':
      details.push(`Duration: ${(event.duration / 1000).toFixed(2)}s`);
      break;
    case 'decision_made':
      details.push(`Confidence: ${(event.confidence * 100).toFixed(0)}%`);
      event.reasoning.forEach((r) => details.push(r));
      break;
    case 'confidence_calculated':
      details.push(`Escalate: ${event.shouldEscalate ? 'Yes' : 'No'}`);
      Object.entries(event.breakdown).forEach(([key, value]) => {
        details.push(`${key}: ${(value * 100).toFixed(0)}%`);
      });
      break;
    case 'negotiation_started':
      details.push(`Agents: ${event.agents.join(', ')}`);
      break;
    case 'negotiation_resolved':
      details.push(`Rounds: ${event.rounds}`);
      details.push(`Strategy: ${event.strategy}`);
      break;
    case 'retry_attempted':
      details.push(`Backoff: ${event.backoffMs}ms`);
      details.push(`Reason: ${event.reason}`);
      break;
    case 'error_occurred':
      details.push(event.error);
      details.push(`Recoverable: ${event.recoverable ? 'Yes' : 'No'}`);
      break;
    case 'approval_requested':
      details.push(`Reason: ${event.reason}`);
      if (event.confidence) {
        details.push(`Confidence: ${(event.confidence * 100).toFixed(0)}%`);
      }
      break;
    case 'watchdog_triggered':
      details.push(`Timeout: ${event.timeoutMs}ms`);
      break;
  }

  if (event.taskId && event.type !== 'task_start' && event.type !== 'task_end') {
    details.push(`Task: ${event.taskId.substring(0, 8)}`);
  }

  return details;
}

/**
 * Format trace timeline for display
 */
export function formatTraceTimeline(events: TraceEvent[]): FormattedTraceEvent[] {
  return events
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(formatTraceEvent);
}

/**
 * Group events by agent
 */
export function groupEventsByAgent(events: TraceEvent[]): Map<string, TraceEvent[]> {
  const grouped = new Map<string, TraceEvent[]>();

  events.forEach((event) => {
    if (event.agentRole) {
      const key = event.agentRole;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    }
  });

  return grouped;
}

/**
 * Calculate event statistics
 */
export function calculateEventStats(events: TraceEvent[]): {
  totalDuration: number;
  avgTaskDuration: number;
  errorRate: number;
  successRate: number;
} {
  const taskEndEvents = events.filter((e) => e.type === 'task_end') as any[];
  const successfulTasks = taskEndEvents.filter((e) => e.success);
  const errors = events.filter((e) => e.type === 'error_occurred');

  const totalDuration = taskEndEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
  const avgTaskDuration =
    taskEndEvents.length > 0 ? totalDuration / taskEndEvents.length : 0;

  return {
    totalDuration,
    avgTaskDuration,
    errorRate: taskEndEvents.length > 0 ? errors.length / taskEndEvents.length : 0,
    successRate: taskEndEvents.length > 0 ? successfulTasks.length / taskEndEvents.length : 1,
  };
}
