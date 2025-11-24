/**
 * Runtime - Core execution engine for automation workflows
 * Orchestrates flow execution from trigger through conditions and actions
 */

import type {
  AutomationExecution,
  TriggerContext,
  NodeExecutionResult,
  SafetyMetrics,
  AutomationNode,
} from './types';
import {
  createExecution,
  updateExecutionStatus,
  createExecutionStep,
  updateExecutionStep,
} from './flowStore';
import { validateAndBuildGraph, getNextNodes } from './graphModel';
import { buildExecutionContext } from './executionContext';
import { buildInitialNodeContext } from './triggers';
import { evaluateConditionNode } from './conditions';
import { runActionNode } from './actions';
import { ExecutionError, NodeExecutionError } from './utils/errors';
import { logger } from './utils/logger';

/**
 * Start a new automation execution
 * Main entry point for workflow execution
 */
export async function startExecution(
  flowId: string,
  triggerContext: TriggerContext
): Promise<AutomationExecution> {
  const executionLogger = logger.withContext(`exec:${flowId}`);
  executionLogger.info('Starting execution', { flowId, triggerType: triggerContext.type });

  let execution: AutomationExecution | null = null;

  try {
    // Validate and build workflow graph
    const graph = await validateAndBuildGraph(flowId);

    if (!graph.triggerNode) {
      throw new ExecutionError('Flow has no trigger node', undefined, { flowId });
    }

    // Build execution context
    const ctx = await buildExecutionContext(flowId, triggerContext);

    // Create execution record
    execution = await createExecution(flowId, triggerContext);

    // Initialize safety metrics
    const safetyMetrics: SafetyMetrics = {
      actionsExecuted: 0,
      externalWrites: 0,
      contactActionsPerformed: 0,
    };

    // Build initial node context from trigger
    const initialContext = buildInitialNodeContext(graph.triggerNode, triggerContext);

    // Execute workflow starting from trigger node
    await executeWorkflow(
      execution.id,
      graph.triggerNode,
      initialContext,
      ctx,
      graph,
      safetyMetrics
    );

    // Mark execution as succeeded
    await updateExecutionStatus(execution.id, 'succeeded');
    executionLogger.info('Execution succeeded', {
      executionId: execution.id,
      actionsExecuted: safetyMetrics.actionsExecuted,
    });

    // Reload and return execution
    const { getExecution } = await import('./flowStore');
    return (await getExecution(execution.id))!;
  } catch (error) {
    executionLogger.error('Execution failed', error);

    if (execution) {
      const status = error instanceof Error && 'limitType' in error ? 'partial' : 'failed';
      await updateExecutionStatus(execution.id, status, (error as Error).message);
    }

    throw new ExecutionError(
      `Execution failed: ${(error as Error).message}`,
      execution?.id,
      { flowId, triggerContext, error }
    );
  }
}

/**
 * Execute workflow starting from a node
 * Uses depth-first traversal with context passing
 */
async function executeWorkflow(
  executionId: string,
  currentNode: AutomationNode,
  nodeInput: any,
  ctx: any,
  graph: any,
  safetyMetrics: SafetyMetrics,
  visited: Set<string> = new Set()
): Promise<void> {
  // Prevent infinite loops (basic cycle detection)
  if (visited.has(currentNode.id)) {
    logger.warn(`Cycle detected at node ${currentNode.id}, skipping`);
    return;
  }

  visited.add(currentNode.id);

  // Execute current node
  const result = await runNode(currentNode, nodeInput, ctx, executionId, safetyMetrics);

  // Determine next nodes based on result
  const nextNodes = getNextNodes(
    currentNode.id,
    { conditionResult: result.outcome },
    graph
  );

  // Execute next nodes recursively
  for (const nextNode of nextNodes) {
    const nextInput = {
      ...nodeInput,
      previousNode: {
        id: currentNode.id,
        type: currentNode.type,
        output: result.output,
      },
    };

    await executeWorkflow(
      executionId,
      nextNode,
      nextInput,
      ctx,
      graph,
      safetyMetrics,
      new Set(visited) // Create new visited set for each branch
    );
  }
}

/**
 * Execute a single node
 * Delegates to appropriate handler based on node type
 */
async function runNode(
  node: AutomationNode,
  stepInput: any,
  ctx: any,
  executionId: string,
  safetyMetrics: SafetyMetrics
): Promise<NodeExecutionResult> {
  const nodeLogger = logger.withContext(`node:${node.id}`);

  // Create execution step record
  const step = await createExecutionStep(executionId, node.id);

  try {
    // Update step to running
    await updateExecutionStep(step.id, {
      status: 'running',
      input: stepInput,
      startedAt: new Date(),
    });

    nodeLogger.info(`Executing ${node.type} node: ${node.subtype}`);

    let result: NodeExecutionResult;

    switch (node.type) {
      case 'trigger':
        // Trigger nodes just pass through
        result = {
          status: 'succeeded',
          output: stepInput,
        };
        break;

      case 'condition':
        const conditionResult = await evaluateConditionNode(node, ctx, stepInput);
        result = {
          status: 'succeeded',
          output: conditionResult.output,
          outcome: conditionResult.outcome,
        };
        nodeLogger.info(`Condition evaluated: ${conditionResult.outcome}`);
        break;

      case 'action':
        const actionResult = await runActionNode(node, ctx, stepInput, safetyMetrics);
        result = {
          status: actionResult.success ? 'succeeded' : 'failed',
          output: actionResult.output,
          error: actionResult.error,
        };
        break;

      default:
        throw new NodeExecutionError(
          `Unknown node type: ${node.type}`,
          node.id,
          node.type
        );
    }

    // Update step with result
    await updateExecutionStep(step.id, {
      status: result.status,
      output: result.output,
      error: result.error,
      finishedAt: new Date(),
    });

    return result;
  } catch (error) {
    nodeLogger.error(`Node execution failed: ${node.subtype}`, error);

    // Update step with error
    await updateExecutionStep(step.id, {
      status: 'failed',
      error: (error as Error).message,
      finishedAt: new Date(),
    });

    throw new NodeExecutionError(
      `Node execution failed: ${(error as Error).message}`,
      node.id,
      node.type,
      { node, stepInput, error }
    );
  }
}

/**
 * Resume a paused execution
 * (Stub for future implementation)
 */
export async function resumeExecution(executionId: string): Promise<void> {
  logger.info(`Resume execution: ${executionId}`);
  // TODO: Implement execution resumption logic
  // This would require:
  // 1. Store execution state
  // 2. Support for pause/resume nodes
  // 3. State restoration
  throw new Error('Resume execution not yet implemented');
}

/**
 * Cancel a running execution
 * (Stub for future implementation)
 */
export async function cancelExecution(executionId: string): Promise<void> {
  logger.info(`Cancel execution: ${executionId}`);
  // TODO: Implement execution cancellation
  // This would require:
  // 1. Execution state tracking
  // 2. Graceful cancellation of in-flight actions
  // 3. Cleanup of partial state
  throw new Error('Cancel execution not yet implemented');
}

/**
 * Get execution progress
 * Returns current status and completed steps
 */
export async function getExecutionProgress(executionId: string): Promise<{
  execution: AutomationExecution | null;
  completedSteps: number;
  totalSteps: number;
  currentStatus: string;
}> {
  const { getExecution, getStepsForExecution } = await import('./flowStore');

  const execution = await getExecution(executionId);
  if (!execution) {
    return {
      execution: null,
      completedSteps: 0,
      totalSteps: 0,
      currentStatus: 'not_found',
    };
  }

  const steps = await getStepsForExecution(executionId);
  const completedSteps = steps.filter((s) => s.status === 'succeeded').length;

  return {
    execution,
    completedSteps,
    totalSteps: steps.length,
    currentStatus: execution.status,
  };
}
