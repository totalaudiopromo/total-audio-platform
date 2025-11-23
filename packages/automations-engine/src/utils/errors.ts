/**
 * Custom error classes for Marketing Automation Layer
 */

export class AutomationError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'AutomationError';
  }
}

export class FlowValidationError extends AutomationError {
  constructor(message: string, details?: any) {
    super(message, 'FLOW_VALIDATION_ERROR', details);
    this.name = 'FlowValidationError';
  }
}

export class ExecutionError extends AutomationError {
  constructor(message: string, public executionId?: string, details?: any) {
    super(message, 'EXECUTION_ERROR', details);
    this.name = 'ExecutionError';
  }
}

export class NodeExecutionError extends AutomationError {
  constructor(
    message: string,
    public nodeId?: string,
    public nodeType?: string,
    details?: any
  ) {
    super(message, 'NODE_EXECUTION_ERROR', details);
    this.name = 'NodeExecutionError';
  }
}

export class LimitExceededError extends AutomationError {
  constructor(message: string, public limitType: string, details?: any) {
    super(message, 'LIMIT_EXCEEDED', details);
    this.name = 'LimitExceededError';
  }
}

export class TriggerError extends AutomationError {
  constructor(message: string, details?: any) {
    super(message, 'TRIGGER_ERROR', details);
    this.name = 'TriggerError';
  }
}

export class ConditionError extends AutomationError {
  constructor(message: string, details?: any) {
    super(message, 'CONDITION_ERROR', details);
    this.name = 'ConditionError';
  }
}

export class ActionError extends AutomationError {
  constructor(message: string, public actionType?: string, details?: any) {
    super(message, 'ACTION_ERROR', details);
    this.name = 'ActionError';
  }
}
