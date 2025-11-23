/**
 * PR Autopilot Error Classes
 *
 * Custom error types for the PR Autopilot system.
 */

export class AutopilotError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AutopilotError';
    Object.setPrototypeOf(this, AutopilotError.prototype);
  }
}

export class MissionNotFoundError extends AutopilotError {
  constructor(missionId: string) {
    super(
      `Mission not found: ${missionId}`,
      'MISSION_NOT_FOUND',
      { missionId }
    );
    this.name = 'MissionNotFoundError';
    Object.setPrototypeOf(this, MissionNotFoundError.prototype);
  }
}

export class TaskNotFoundError extends AutopilotError {
  constructor(taskId: string) {
    super(
      `Task not found: ${taskId}`,
      'TASK_NOT_FOUND',
      { taskId }
    );
    this.name = 'TaskNotFoundError';
    Object.setPrototypeOf(this, TaskNotFoundError.prototype);
  }
}

export class PolicyViolationError extends AutopilotError {
  constructor(message: string, policyType: string, metadata?: Record<string, unknown>) {
    super(
      message,
      'POLICY_VIOLATION',
      { policyType, ...metadata }
    );
    this.name = 'PolicyViolationError';
    Object.setPrototypeOf(this, PolicyViolationError.prototype);
  }
}

export class ModeNotAllowedError extends AutopilotError {
  constructor(mode: string, allowedModes: string[]) {
    super(
      `Mode '${mode}' is not allowed. Allowed modes: ${allowedModes.join(', ')}`,
      'MODE_NOT_ALLOWED',
      { mode, allowedModes }
    );
    this.name = 'ModeNotAllowedError';
    Object.setPrototypeOf(this, ModeNotAllowedError.prototype);
  }
}

export class ApprovalRequiredError extends AutopilotError {
  constructor(actionType: string, taskId?: string) {
    super(
      `Action '${actionType}' requires approval`,
      'APPROVAL_REQUIRED',
      { actionType, taskId }
    );
    this.name = 'ApprovalRequiredError';
    Object.setPrototypeOf(this, ApprovalRequiredError.prototype);
  }
}

export class TaskBlockedError extends AutopilotError {
  constructor(taskId: string, reason: string) {
    super(
      `Task ${taskId} is blocked: ${reason}`,
      'TASK_BLOCKED',
      { taskId, reason }
    );
    this.name = 'TaskBlockedError';
    Object.setPrototypeOf(this, TaskBlockedError.prototype);
  }
}

export class AgentExecutionError extends AutopilotError {
  constructor(agentRole: string, originalError: Error, metadata?: Record<string, unknown>) {
    super(
      `Agent '${agentRole}' execution failed: ${originalError.message}`,
      'AGENT_EXECUTION_ERROR',
      { agentRole, originalError: originalError.message, ...metadata }
    );
    this.name = 'AgentExecutionError';
    Object.setPrototypeOf(this, AgentExecutionError.prototype);
  }
}

export class InvalidConfigError extends AutopilotError {
  constructor(message: string, configField?: string) {
    super(
      `Invalid configuration: ${message}`,
      'INVALID_CONFIG',
      { configField }
    );
    this.name = 'InvalidConfigError';
    Object.setPrototypeOf(this, InvalidConfigError.prototype);
  }
}

export class ResourceLimitError extends AutopilotError {
  constructor(resource: string, limit: number, current: number) {
    super(
      `Resource limit exceeded for '${resource}': ${current}/${limit}`,
      'RESOURCE_LIMIT_EXCEEDED',
      { resource, limit, current }
    );
    this.name = 'ResourceLimitError';
    Object.setPrototypeOf(this, ResourceLimitError.prototype);
  }
}

export class ContextBuildError extends AutopilotError {
  constructor(reason: string, metadata?: Record<string, unknown>) {
    super(
      `Failed to build agent context: ${reason}`,
      'CONTEXT_BUILD_ERROR',
      metadata
    );
    this.name = 'ContextBuildError';
    Object.setPrototypeOf(this, ContextBuildError.prototype);
  }
}

/**
 * Utility to check if an error is an AutopilotError
 */
export function isAutopilotError(error: unknown): error is AutopilotError {
  return error instanceof AutopilotError;
}

/**
 * Utility to extract error details safely
 */
export function getErrorDetails(error: unknown): {
  message: string;
  code: string;
  metadata?: Record<string, unknown>;
} {
  if (isAutopilotError(error)) {
    return {
      message: error.message,
      code: error.code,
      metadata: error.metadata,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
  };
}
