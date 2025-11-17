/**
 * Event Bus - Event routing and processing for automation triggers
 * Routes incoming events to matching automation flows
 */

import type { TriggerContext, EventBusConfig, EventHandler } from './types';
import { listFlowsForUser } from './flowStore';
import { buildGraph } from './graphModel';
import { shouldTriggerFlow } from './triggers';
import { startExecution } from './runtime';
import { logger } from './utils/logger';

/**
 * Event bus state
 */
let config: EventBusConfig = {
  enableLogging: true,
  maxConcurrentExecutions: 10,
};

const eventHandlers: Map<string, EventHandler[]> = new Map();
const activeExecutions: Set<string> = new Set();

/**
 * Initialize event bus with configuration
 */
export function initEventBus(busConfig: Partial<EventBusConfig> = {}): void {
  config = { ...config, ...busConfig };
  logger.info('Event bus initialized', config);
}

/**
 * Emit an automation event
 * This is the main entry point for external systems to trigger automations
 */
export async function emitAutomationEvent(event: TriggerContext): Promise<void> {
  if (config.enableLogging) {
    logger.info(`Event emitted: ${event.type}`, {
      type: event.type,
      source: event.source,
      timestamp: event.timestamp,
    });
  }

  // Add timestamp if not provided
  if (!event.timestamp) {
    event.timestamp = new Date();
  }

  // Process event asynchronously
  // In production, this might be queued to a job system (BullMQ, etc.)
  setImmediate(() => {
    processAutomationEvent(event).catch((error) => {
      logger.error(`Failed to process event: ${event.type}`, error);
    });
  });
}

/**
 * Process automation event
 * Finds matching flows and triggers executions
 */
export async function processAutomationEvent(event: TriggerContext): Promise<void> {
  try {
    // Check concurrent execution limit
    if (activeExecutions.size >= config.maxConcurrentExecutions!) {
      logger.warn(
        `Max concurrent executions reached (${config.maxConcurrentExecutions}), queueing event`,
        { type: event.type }
      );
      // In production, this would queue the event for later processing
      return;
    }

    // Find all active event-based flows
    // Note: In production, this would be optimized with indexing or caching
    const matchingFlows = await findMatchingFlows(event);

    if (matchingFlows.length === 0) {
      if (config.enableLogging) {
        logger.debug(`No matching flows for event: ${event.type}`);
      }
      return;
    }

    logger.info(`Found ${matchingFlows.length} matching flow(s) for event: ${event.type}`);

    // Trigger executions for all matching flows
    const executionPromises = matchingFlows.map(async (flowId) => {
      const executionId = `exec_${flowId}_${Date.now()}`;
      activeExecutions.add(executionId);

      try {
        const execution = await startExecution(flowId, event);
        logger.info(`Started execution ${execution.id} for flow ${flowId}`);
        return execution;
      } catch (error) {
        logger.error(`Failed to start execution for flow ${flowId}`, error);
        throw error;
      } finally {
        activeExecutions.delete(executionId);
      }
    });

    // Wait for all executions to start
    await Promise.allSettled(executionPromises);

    // Call registered event handlers
    await callEventHandlers(event);
  } catch (error) {
    logger.error('Error processing automation event', { event, error });
    throw error;
  }
}

/**
 * Find flows that match the incoming event
 */
async function findMatchingFlows(event: TriggerContext): Promise<string[]> {
  const matchingFlowIds: string[] = [];

  // TODO: Optimize this with proper indexing
  // For now, we'll need to query flows by user
  // In production, we'd want:
  // 1. Index flows by trigger type
  // 2. Cache active flows
  // 3. Use a more efficient matching system

  // For MVP, we'll return empty array and rely on manual triggering
  // or user-specific event routing (where userId is in event.metadata)

  if (event.metadata?.userId) {
    const userId = event.metadata.userId;
    const userFlows = await listFlowsForUser(userId);

    for (const flow of userFlows) {
      if (!flow.isActive || flow.triggerType !== 'event') {
        continue;
      }

      // Load flow graph to get trigger node
      const graph = await buildGraph(flow.id);

      if (shouldTriggerFlow(flow, event, graph.triggerNode)) {
        matchingFlowIds.push(flow.id);
      }
    }
  }

  return matchingFlowIds;
}

/**
 * Register an event handler
 * Allows external code to listen for automation events
 */
export function onEvent(eventType: string, handler: EventHandler): () => void {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, []);
  }

  eventHandlers.get(eventType)!.push(handler);

  // Return unsubscribe function
  return () => {
    const handlers = eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  };
}

/**
 * Call registered event handlers
 */
async function callEventHandlers(event: TriggerContext): Promise<void> {
  const handlers = eventHandlers.get(event.type) || [];
  const globalHandlers = eventHandlers.get('*') || [];

  const allHandlers = [...handlers, ...globalHandlers];

  if (allHandlers.length === 0) {
    return;
  }

  await Promise.allSettled(
    allHandlers.map((handler) =>
      handler(event).catch((error) => {
        logger.error(`Event handler error for ${event.type}`, error);
      })
    )
  );
}

/**
 * Get event bus status
 */
export function getEventBusStatus(): {
  activeExecutions: number;
  maxConcurrentExecutions: number;
  registeredHandlers: Record<string, number>;
} {
  const registeredHandlers: Record<string, number> = {};

  for (const [eventType, handlers] of eventHandlers.entries()) {
    registeredHandlers[eventType] = handlers.length;
  }

  return {
    activeExecutions: activeExecutions.size,
    maxConcurrentExecutions: config.maxConcurrentExecutions!,
    registeredHandlers,
  };
}

/**
 * Clear all event handlers (useful for testing)
 */
export function clearEventHandlers(): void {
  eventHandlers.clear();
  logger.debug('All event handlers cleared');
}

/**
 * Manually trigger a flow (for manual trigger type flows)
 */
export async function manualTriggerFlow(
  flowId: string,
  manualContext: Record<string, any> = {}
): Promise<void> {
  const event: TriggerContext = {
    type: 'manual_trigger',
    source: 'manual',
    payload: manualContext,
    timestamp: new Date(),
  };

  logger.info(`Manual trigger for flow ${flowId}`);

  try {
    const execution = await startExecution(flowId, event);
    logger.info(`Manual execution started: ${execution.id}`);
  } catch (error) {
    logger.error(`Failed to manually trigger flow ${flowId}`, error);
    throw error;
  }
}
