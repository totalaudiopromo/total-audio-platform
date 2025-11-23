/**
 * Trace Events
 *
 * Structured event types for tracing
 */

import type { AgentRole, ActionType } from '../types';

export type TraceEventType =
  | 'run_start'
  | 'run_end'
  | 'agent_start'
  | 'agent_end'
  | 'task_start'
  | 'task_end'
  | 'decision_made'
  | 'confidence_calculated'
  | 'negotiation_started'
  | 'negotiation_resolved'
  | 'retry_attempted'
  | 'error_occurred'
  | 'approval_requested'
  | 'watchdog_triggered';

export interface BaseTraceEvent {
  id: string;
  type: TraceEventType;
  timestamp: string;
  missionId: string;
  runId?: string;
  taskId?: string;
  agentRole?: AgentRole;
}

export interface RunStartEvent extends BaseTraceEvent {
  type: 'run_start';
  triggerType: 'manual' | 'schedule' | 'event';
  mode: 'suggest' | 'semi_auto' | 'full_auto';
}

export interface RunEndEvent extends BaseTraceEvent {
  type: 'run_end';
  status: 'completed' | 'failed' | 'partial';
  duration: number;
  tasksExecuted: number;
}

export interface AgentStartEvent extends BaseTraceEvent {
  type: 'agent_start';
  agentRole: AgentRole;
  taskType: string;
}

export interface AgentEndEvent extends BaseTraceEvent {
  type: 'agent_end';
  agentRole: AgentRole;
  duration: number;
  success: boolean;
}

export interface TaskStartEvent extends BaseTraceEvent {
  type: 'task_start';
  taskId: string;
  agentRole: AgentRole;
  taskType: string;
}

export interface TaskEndEvent extends BaseTraceEvent {
  type: 'task_end';
  taskId: string;
  duration: number;
  success: boolean;
  output?: Record<string, unknown>;
}

export interface DecisionMadeEvent extends BaseTraceEvent {
  type: 'decision_made';
  agentRole: AgentRole;
  decision: string;
  reasoning: string[];
  confidence: number;
}

export interface ConfidenceCalculatedEvent extends BaseTraceEvent {
  type: 'confidence_calculated';
  taskId: string;
  score: number;
  breakdown: Record<string, number>;
  shouldEscalate: boolean;
}

export interface NegotiationStartedEvent extends BaseTraceEvent {
  type: 'negotiation_started';
  conflictType: string;
  agents: AgentRole[];
}

export interface NegotiationResolvedEvent extends BaseTraceEvent {
  type: 'negotiation_resolved';
  strategy: string;
  rounds: number;
  resolved: boolean;
}

export interface RetryAttemptedEvent extends BaseTraceEvent {
  type: 'retry_attempted';
  taskId: string;
  attemptNumber: number;
  backoffMs: number;
  reason: string;
}

export interface ErrorOccurredEvent extends BaseTraceEvent {
  type: 'error_occurred';
  taskId?: string;
  error: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

export interface ApprovalRequestedEvent extends BaseTraceEvent {
  type: 'approval_requested';
  taskId: string;
  actionType: ActionType;
  reason: string;
  confidence?: number;
}

export interface WatchdogTriggeredEvent extends BaseTraceEvent {
  type: 'watchdog_triggered';
  taskId: string;
  agentRole: AgentRole;
  timeoutMs: number;
}

export type TraceEvent =
  | RunStartEvent
  | RunEndEvent
  | AgentStartEvent
  | AgentEndEvent
  | TaskStartEvent
  | TaskEndEvent
  | DecisionMadeEvent
  | ConfidenceCalculatedEvent
  | NegotiationStartedEvent
  | NegotiationResolvedEvent
  | RetryAttemptedEvent
  | ErrorOccurredEvent
  | ApprovalRequestedEvent
  | WatchdogTriggeredEvent;

/**
 * Create trace event ID
 */
export function createTraceEventId(): string {
  return `trace_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Create base trace event
 */
export function createBaseEvent(
  type: TraceEventType,
  missionId: string,
  options?: {
    runId?: string;
    taskId?: string;
    agentRole?: AgentRole;
  }
): BaseTraceEvent {
  return {
    id: createTraceEventId(),
    type,
    timestamp: new Date().toISOString(),
    missionId,
    runId: options?.runId,
    taskId: options?.taskId,
    agentRole: options?.agentRole,
  };
}
