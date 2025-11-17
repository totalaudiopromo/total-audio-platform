/**
 * Marketing Automation Layer (MAL)
 * Main entry point for the automations engine
 *
 * @packageDocumentation
 */

// Core types
export * from './types';

// Flow store operations
export {
  initFlowStore,
  getFlow,
  listFlowsForUser,
  createFlow,
  updateFlow,
  deleteFlow,
  getNode,
  getNodesForFlow,
  saveNode,
  updateNode,
  deleteNode,
  getEdgesForFlow,
  saveEdge,
  deleteEdge,
  createExecution,
  updateExecutionStatus,
  getExecution,
  listExecutionsForFlow,
  createExecutionStep,
  updateExecutionStep,
  getStepsForExecution,
} from './flowStore';

// Graph model
export {
  buildGraph,
  validateGraph,
  getReachableNodes,
  getNextNodes,
  detectCycles,
  topologicalSort,
  findPathsToNode,
  validateAndBuildGraph,
} from './graphModel';

// Execution context
export {
  buildExecutionContext,
  setClientFactory,
} from './executionContext';

// Triggers
export {
  shouldTriggerFlow,
  buildInitialNodeContext,
  validateTriggerConfig,
} from './triggers';

// Conditions
export {
  evaluateConditionNode,
  validateConditionConfig,
} from './conditions';

// Actions
export {
  runActionNode,
  validateActionConfig,
} from './actions';

// Event bus
export {
  initEventBus,
  emitAutomationEvent,
  processAutomationEvent,
  onEvent,
  getEventBusStatus,
  clearEventHandlers,
  manualTriggerFlow,
} from './eventBus';

// Runtime
export {
  startExecution,
  resumeExecution,
  cancelExecution,
  getExecutionProgress,
} from './runtime';

// Utilities
export { AutomationLogger, logger } from './utils/logger';
export {
  AutomationError,
  FlowValidationError,
  ExecutionError,
  NodeExecutionError,
  LimitExceededError,
  TriggerError,
  ConditionError,
  ActionError,
} from './utils/errors';
