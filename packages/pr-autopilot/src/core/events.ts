/**
 * Event System
 *
 * Event types and simple event emitter for internal coordination.
 * For now, this is a simple TypeScript type system. In future, could integrate
 * with external event bus or pub/sub system.
 */

import type { AgentRole, ActionType, TaskStatus, MissionStatus } from '../types';

// ============================================
// Event Types
// ============================================

export type AutopilotEvent =
  | MissionStartedEvent
  | MissionPausedEvent
  | MissionCompletedEvent
  | MissionFailedEvent
  | TaskCreatedEvent
  | TaskStartedEvent
  | TaskCompletedEvent
  | TaskFailedEvent
  | TaskBlockedEvent
  | RunStartedEvent
  | RunCompletedEvent
  | ExternalActionRequestedEvent
  | ExternalActionExecutedEvent
  | ApprovalRequestedEvent
  | ApprovalGrantedEvent
  | ApprovalRejectedEvent;

export interface BaseEvent {
  type: string;
  timestamp: string;
  missionId: string;
}

export interface MissionStartedEvent extends BaseEvent {
  type: 'mission_started';
  userId: string;
  mode: string;
}

export interface MissionPausedEvent extends BaseEvent {
  type: 'mission_paused';
  reason?: string;
}

export interface MissionCompletedEvent extends BaseEvent {
  type: 'mission_completed';
  summary: Record<string, unknown>;
}

export interface MissionFailedEvent extends BaseEvent {
  type: 'mission_failed';
  error: string;
}

export interface TaskCreatedEvent extends BaseEvent {
  type: 'task_created';
  taskId: string;
  agentRole: AgentRole;
  taskType: string;
}

export interface TaskStartedEvent extends BaseEvent {
  type: 'task_started';
  taskId: string;
  agentRole: AgentRole;
}

export interface TaskCompletedEvent extends BaseEvent {
  type: 'task_completed';
  taskId: string;
  agentRole: AgentRole;
  output: Record<string, unknown>;
}

export interface TaskFailedEvent extends BaseEvent {
  type: 'task_failed';
  taskId: string;
  agentRole: AgentRole;
  error: string;
}

export interface TaskBlockedEvent extends BaseEvent {
  type: 'task_blocked';
  taskId: string;
  agentRole: AgentRole;
  reason: string;
}

export interface RunStartedEvent extends BaseEvent {
  type: 'run_started';
  runId: string;
  triggerType: string;
}

export interface RunCompletedEvent extends BaseEvent {
  type: 'run_completed';
  runId: string;
  status: string;
  summary: Record<string, unknown>;
}

export interface ExternalActionRequestedEvent extends BaseEvent {
  type: 'external_action_requested';
  actionType: ActionType;
  taskId: string;
  requiresApproval: boolean;
}

export interface ExternalActionExecutedEvent extends BaseEvent {
  type: 'external_action_executed';
  actionType: ActionType;
  taskId: string;
  success: boolean;
}

export interface ApprovalRequestedEvent extends BaseEvent {
  type: 'approval_requested';
  taskId: string;
  actionType: ActionType;
  details: Record<string, unknown>;
}

export interface ApprovalGrantedEvent extends BaseEvent {
  type: 'approval_granted';
  taskId: string;
  approvedBy: string;
}

export interface ApprovalRejectedEvent extends BaseEvent {
  type: 'approval_rejected';
  taskId: string;
  rejectedBy: string;
  reason?: string;
}

// ============================================
// Event Emitter
// ============================================

export type EventHandler = (event: AutopilotEvent) => void | Promise<void>;

export class AutopilotEventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Subscribe to events of a specific type
   */
  on(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  /**
   * Subscribe to all events
   */
  onAny(handler: EventHandler): void {
    this.on('*', handler);
  }

  /**
   * Unsubscribe from events
   */
  off(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit an event
   */
  async emit(event: AutopilotEvent): Promise<void> {
    // Emit to specific handlers
    const specificHandlers = this.handlers.get(event.type) || [];
    const wildcardHandlers = this.handlers.get('*') || [];
    const allHandlers = [...specificHandlers, ...wildcardHandlers];

    // Execute handlers (fire and forget, log errors)
    await Promise.allSettled(
      allHandlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`Event handler error for ${event.type}:`, error);
        }
      })
    );
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Create a base event with common fields
 */
export function createEvent(
  type: string,
  missionId: string,
  data: Record<string, unknown> = {}
): AutopilotEvent {
  return {
    type,
    timestamp: new Date().toISOString(),
    missionId,
    ...data,
  } as AutopilotEvent;
}

/**
 * Global event emitter instance (singleton pattern)
 */
let globalEmitter: AutopilotEventEmitter | null = null;

export function getGlobalEmitter(): AutopilotEventEmitter {
  if (!globalEmitter) {
    globalEmitter = new AutopilotEventEmitter();
  }
  return globalEmitter;
}

/**
 * Emit an event on the global emitter
 */
export async function emitGlobalEvent(event: AutopilotEvent): Promise<void> {
  const emitter = getGlobalEmitter();
  await emitter.emit(event);
}
