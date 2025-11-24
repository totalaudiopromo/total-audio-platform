/**
 * Conditions - Condition node evaluation logic
 * Evaluates conditional branches in workflows
 */

import type {
  AutomationNode,
  ExecutionContext,
  ConditionResult,
  ConditionSubtype,
  IfFieldMatchConfig,
} from './types';
import { ConditionError } from './utils/errors';
import { logger } from './utils/logger';

/**
 * Evaluate a condition node
 * Returns outcome ('true', 'false', or 'skip') and optional output data
 */
export async function evaluateConditionNode(
  node: AutomationNode,
  ctx: ExecutionContext,
  stepInput: any
): Promise<ConditionResult> {
  const subtype = node.subtype as ConditionSubtype;
  const config = node.config;

  try {
    switch (subtype) {
      case 'if_field_match':
        return await evaluateIfFieldMatch(config, stepInput, ctx);

      case 'if_segment_contains':
        return await evaluateIfSegmentContains(config, stepInput, ctx);

      case 'if_metric_greater':
        return await evaluateIfMetricGreater(config, stepInput, ctx);

      case 'if_tag_present':
        return await evaluateIfTagPresent(config, stepInput, ctx);

      case 'if_time_elapsed':
        return await evaluateIfTimeElapsed(config, stepInput, ctx);

      case 'if_campaign_status':
        return await evaluateIfCampaignStatus(config, stepInput, ctx);

      default:
        throw new ConditionError(`Unknown condition subtype: ${subtype}`);
    }
  } catch (error) {
    if (error instanceof ConditionError) {
      throw error;
    }
    throw new ConditionError(
      `Failed to evaluate condition ${subtype}: ${(error as Error).message}`,
      { node, stepInput, error }
    );
  }
}

/**
 * If field match condition
 * Checks if a field in the execution context matches a value
 */
async function evaluateIfFieldMatch(
  config: IfFieldMatchConfig,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { field, operator, value } = config;

  // Get field value from step input
  const fieldValue = getFieldValue(stepInput, field);

  let matches = false;

  switch (operator) {
    case 'equals':
      matches = fieldValue === value;
      break;

    case 'not_equals':
      matches = fieldValue !== value;
      break;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        matches = fieldValue.toLowerCase().includes(value.toLowerCase());
      } else if (Array.isArray(fieldValue)) {
        matches = fieldValue.includes(value);
      }
      break;

    case 'greater_than':
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        matches = fieldValue > value;
      }
      break;

    case 'less_than':
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        matches = fieldValue < value;
      }
      break;

    default:
      throw new ConditionError(`Unknown operator: ${operator}`);
  }

  return {
    outcome: matches ? 'true' : 'false',
    output: { fieldValue, matches },
  };
}

/**
 * If segment contains condition
 * Checks if a contact belongs to a specific segment
 */
async function evaluateIfSegmentContains(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { segmentId, contactIdField = 'event.contactId' } = config;

  if (!segmentId) {
    throw new ConditionError('segmentId is required for if_segment_contains');
  }

  const contactId = getFieldValue(stepInput, contactIdField);

  if (!contactId) {
    logger.warn('No contactId found in stepInput for if_segment_contains');
    return { outcome: 'false', output: { contactId: null } };
  }

  try {
    const segmentContacts = await ctx.clients.listBuilder.getSegmentContacts(segmentId);
    const contains = segmentContacts.includes(contactId);

    return {
      outcome: contains ? 'true' : 'false',
      output: { contactId, segmentId, contains },
    };
  } catch (error) {
    throw new ConditionError(
      `Failed to check segment membership: ${(error as Error).message}`,
      { segmentId, contactId }
    );
  }
}

/**
 * If metric greater condition
 * Checks if a campaign metric exceeds a threshold
 */
async function evaluateIfMetricGreater(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { metric, threshold, campaignIdField = 'event.campaignId' } = config;

  if (!metric || threshold === undefined) {
    throw new ConditionError('metric and threshold are required for if_metric_greater');
  }

  const campaignId = getFieldValue(stepInput, campaignIdField);

  if (!campaignId) {
    logger.warn('No campaignId found in stepInput for if_metric_greater');
    return { outcome: 'false', output: { campaignId: null } };
  }

  try {
    const metrics = await ctx.clients.tracker.getCampaignMetrics(campaignId);
    const metricValue = (metrics as any)[metric];

    if (metricValue === undefined) {
      throw new ConditionError(`Unknown metric: ${metric}`);
    }

    const isGreater = metricValue > threshold;

    return {
      outcome: isGreater ? 'true' : 'false',
      output: { metric, metricValue, threshold, isGreater },
    };
  } catch (error) {
    throw new ConditionError(
      `Failed to check campaign metrics: ${(error as Error).message}`,
      { campaignId, metric }
    );
  }
}

/**
 * If tag present condition
 * Checks if a contact has a specific tag
 */
async function evaluateIfTagPresent(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { tag, contactIdField = 'event.contactId' } = config;

  if (!tag) {
    throw new ConditionError('tag is required for if_tag_present');
  }

  const contactId = getFieldValue(stepInput, contactIdField);

  if (!contactId) {
    logger.warn('No contactId found in stepInput for if_tag_present');
    return { outcome: 'false', output: { contactId: null } };
  }

  // Note: This would need a method to fetch contact tags from the appropriate client
  // For now, check if tags are in stepInput
  const contactTags = getFieldValue(stepInput, 'event.tags') || [];

  const hasTag = Array.isArray(contactTags) && contactTags.includes(tag);

  return {
    outcome: hasTag ? 'true' : 'false',
    output: { contactId, tag, hasTag, contactTags },
  };
}

/**
 * If time elapsed condition
 * Checks if a certain amount of time has passed since a timestamp
 */
async function evaluateIfTimeElapsed(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { timestampField, elapsedSeconds } = config;

  if (!timestampField || !elapsedSeconds) {
    throw new ConditionError(
      'timestampField and elapsedSeconds are required for if_time_elapsed'
    );
  }

  const timestamp = getFieldValue(stepInput, timestampField);

  if (!timestamp) {
    logger.warn('No timestamp found in stepInput for if_time_elapsed');
    return { outcome: 'false', output: { timestamp: null } };
  }

  const eventTime = new Date(timestamp);
  const now = new Date();
  const elapsedMs = now.getTime() - eventTime.getTime();
  const elapsedSec = elapsedMs / 1000;

  const hasElapsed = elapsedSec >= elapsedSeconds;

  return {
    outcome: hasElapsed ? 'true' : 'false',
    output: { timestamp, elapsedSec, requiredSeconds: elapsedSeconds, hasElapsed },
  };
}

/**
 * If campaign status condition
 * Checks if a campaign has a specific status
 */
async function evaluateIfCampaignStatus(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ConditionResult> {
  const { expectedStatus, campaignIdField = 'event.campaignId' } = config;

  if (!expectedStatus) {
    throw new ConditionError('expectedStatus is required for if_campaign_status');
  }

  const campaignId = getFieldValue(stepInput, campaignIdField);

  if (!campaignId) {
    logger.warn('No campaignId found in stepInput for if_campaign_status');
    return { outcome: 'false', output: { campaignId: null } };
  }

  // Get campaign status from stepInput or context
  const currentStatus =
    getFieldValue(stepInput, 'event.status') ||
    getFieldValue(stepInput, 'campaignContext.status');

  const matches = currentStatus === expectedStatus;

  return {
    outcome: matches ? 'true' : 'false',
    output: { campaignId, currentStatus, expectedStatus, matches },
  };
}

/**
 * Helper: Get field value from object using dot notation
 * Example: getFieldValue(obj, 'event.contactId') -> obj.event.contactId
 */
function getFieldValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;

  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Validate condition node configuration
 * Returns array of validation errors (empty if valid)
 */
export function validateConditionConfig(node: AutomationNode): string[] {
  const errors: string[] = [];
  const config = node.config;
  const subtype = node.subtype as ConditionSubtype;

  switch (subtype) {
    case 'if_field_match':
      if (!config.field) {
        errors.push('field is required');
      }
      if (!config.operator) {
        errors.push('operator is required');
      }
      if (config.value === undefined) {
        errors.push('value is required');
      }
      break;

    case 'if_segment_contains':
      if (!config.segmentId) {
        errors.push('segmentId is required');
      }
      break;

    case 'if_metric_greater':
      if (!config.metric) {
        errors.push('metric is required');
      }
      if (config.threshold === undefined) {
        errors.push('threshold is required');
      }
      break;

    case 'if_tag_present':
      if (!config.tag) {
        errors.push('tag is required');
      }
      break;

    case 'if_time_elapsed':
      if (!config.timestampField) {
        errors.push('timestampField is required');
      }
      if (config.elapsedSeconds === undefined) {
        errors.push('elapsedSeconds is required');
      }
      break;

    case 'if_campaign_status':
      if (!config.expectedStatus) {
        errors.push('expectedStatus is required');
      }
      break;
  }

  return errors;
}
