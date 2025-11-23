/**
 * Triggers - Trigger evaluation and matching logic
 * Determines if an incoming event should trigger a flow
 */

import type {
  AutomationFlow,
  AutomationNode,
  TriggerContext,
  TriggerSubtype,
  EmailOpenTriggerConfig,
} from './types';
import { TriggerError } from './utils/errors';
import { logger } from './utils/logger';

/**
 * Determine if an incoming event should trigger a specific flow
 */
export function shouldTriggerFlow(
  flow: AutomationFlow,
  incomingEvent: TriggerContext,
  triggerNode?: AutomationNode
): boolean {
  // Only event-based flows can be triggered by events
  if (flow.triggerType !== 'event') {
    return false;
  }

  // Flow must be active
  if (!flow.isActive) {
    return false;
  }

  // If no trigger node provided, we can't evaluate (this should not happen in practice)
  if (!triggerNode) {
    logger.warn(`Flow ${flow.id} has no trigger node`);
    return false;
  }

  // Match event type to trigger subtype
  if (triggerNode.subtype !== incomingEvent.type) {
    return false;
  }

  // Evaluate trigger-specific filters from config
  return evaluateTriggerConfig(triggerNode, incomingEvent);
}

/**
 * Evaluate trigger node configuration against incoming event
 * Returns true if event matches trigger filters
 */
function evaluateTriggerConfig(
  triggerNode: AutomationNode,
  incomingEvent: TriggerContext
): boolean {
  const config = triggerNode.config;
  const subtype = triggerNode.subtype as TriggerSubtype;

  switch (subtype) {
    case 'email_open':
      return evaluateEmailOpenTrigger(config, incomingEvent);

    case 'email_click':
      return evaluateEmailClickTrigger(config, incomingEvent);

    case 'email_reply':
      return evaluateEmailReplyTrigger(config, incomingEvent);

    case 'campaign_created':
      return evaluateCampaignCreatedTrigger(config, incomingEvent);

    case 'campaign_status_changed':
      return evaluateCampaignStatusChangedTrigger(config, incomingEvent);

    case 'asset_uploaded':
      return evaluateAssetUploadedTrigger(config, incomingEvent);

    case 'release_approaching':
      return evaluateReleaseApproachingTrigger(config, incomingEvent);

    case 'manual_trigger':
      // Manual triggers always match (user explicitly triggered)
      return true;

    case 'segment_updated':
      return evaluateSegmentUpdatedTrigger(config, incomingEvent);

    case 'contact_added':
      return evaluateContactAddedTrigger(config, incomingEvent);

    default:
      logger.warn(`Unknown trigger subtype: ${subtype}`);
      return false;
  }
}

/**
 * Email open trigger evaluation
 */
function evaluateEmailOpenTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // If specific campaign ID is configured, filter by it
  if (config.campaignId && event.payload.campaignId !== config.campaignId) {
    return false;
  }

  // If allCampaigns is explicitly false and no campaignId, don't trigger
  if (config.allCampaigns === false && !config.campaignId) {
    return false;
  }

  return true;
}

/**
 * Email click trigger evaluation
 */
function evaluateEmailClickTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Similar to email open - filter by campaign if specified
  if (config.campaignId && event.payload.campaignId !== config.campaignId) {
    return false;
  }

  // Optional: filter by specific link URL
  if (config.linkUrl && event.payload.linkUrl !== config.linkUrl) {
    return false;
  }

  return true;
}

/**
 * Email reply trigger evaluation
 */
function evaluateEmailReplyTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  if (config.campaignId && event.payload.campaignId !== config.campaignId) {
    return false;
  }

  // Optional: filter by sentiment or keywords in reply
  if (config.requiredKeywords && Array.isArray(config.requiredKeywords)) {
    const replyText = (event.payload.replyText || '').toLowerCase();
    const hasKeyword = config.requiredKeywords.some((keyword: string) =>
      replyText.includes(keyword.toLowerCase())
    );
    if (!hasKeyword) {
      return false;
    }
  }

  return true;
}

/**
 * Campaign created trigger evaluation
 */
function evaluateCampaignCreatedTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Optional: filter by campaign type or genre
  if (config.campaignType && event.payload.campaignType !== config.campaignType) {
    return false;
  }

  if (config.genre && event.payload.genre !== config.genre) {
    return false;
  }

  return true;
}

/**
 * Campaign status changed trigger evaluation
 */
function evaluateCampaignStatusChangedTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Filter by specific status transitions
  if (config.newStatus && event.payload.newStatus !== config.newStatus) {
    return false;
  }

  if (config.oldStatus && event.payload.oldStatus !== config.oldStatus) {
    return false;
  }

  // Filter by specific campaign
  if (config.campaignId && event.payload.campaignId !== config.campaignId) {
    return false;
  }

  return true;
}

/**
 * Asset uploaded trigger evaluation
 */
function evaluateAssetUploadedTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Filter by asset type (e.g., 'audio', 'image', 'press_kit')
  if (config.assetType && event.payload.assetType !== config.assetType) {
    return false;
  }

  return true;
}

/**
 * Release approaching trigger evaluation
 */
function evaluateReleaseApproachingTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Filter by days until release
  if (config.daysUntilRelease !== undefined) {
    const eventDays = event.payload.daysUntilRelease;
    if (eventDays !== config.daysUntilRelease) {
      return false;
    }
  }

  // Filter by release type
  if (config.releaseType && event.payload.releaseType !== config.releaseType) {
    return false;
  }

  return true;
}

/**
 * Segment updated trigger evaluation
 */
function evaluateSegmentUpdatedTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Filter by specific segment
  if (config.segmentId && event.payload.segmentId !== config.segmentId) {
    return false;
  }

  return true;
}

/**
 * Contact added trigger evaluation
 */
function evaluateContactAddedTrigger(
  config: Record<string, any>,
  event: TriggerContext
): boolean {
  // Filter by source (e.g., 'manual', 'import', 'api')
  if (config.source && event.payload.source !== config.source) {
    return false;
  }

  // Filter by tags
  if (config.requiredTags && Array.isArray(config.requiredTags)) {
    const contactTags = event.payload.tags || [];
    const hasAllTags = config.requiredTags.every((tag: string) =>
      contactTags.includes(tag)
    );
    if (!hasAllTags) {
      return false;
    }
  }

  return true;
}

/**
 * Build initial execution context from trigger node and event
 * This provides the starting data for the workflow execution
 */
export function buildInitialNodeContext(
  triggerNode: AutomationNode,
  incomingEvent: TriggerContext
): Record<string, any> {
  const context: Record<string, any> = {
    trigger: {
      type: incomingEvent.type,
      source: incomingEvent.source,
      timestamp: incomingEvent.timestamp || new Date(),
    },
    event: incomingEvent.payload,
    metadata: incomingEvent.metadata || {},
  };

  // Add trigger-specific context enrichment
  const subtype = triggerNode.subtype as TriggerSubtype;

  switch (subtype) {
    case 'email_open':
    case 'email_click':
    case 'email_reply':
      context.emailContext = {
        emailId: incomingEvent.payload.emailId,
        campaignId: incomingEvent.payload.campaignId,
        contactId: incomingEvent.payload.contactId,
      };
      break;

    case 'campaign_created':
    case 'campaign_status_changed':
      context.campaignContext = {
        campaignId: incomingEvent.payload.campaignId,
        status: incomingEvent.payload.newStatus || incomingEvent.payload.status,
      };
      break;

    case 'asset_uploaded':
      context.assetContext = {
        assetId: incomingEvent.payload.assetId,
        assetType: incomingEvent.payload.assetType,
      };
      break;

    case 'release_approaching':
      context.releaseContext = {
        releaseId: incomingEvent.payload.releaseId,
        daysUntilRelease: incomingEvent.payload.daysUntilRelease,
      };
      break;
  }

  return context;
}

/**
 * Validate trigger node configuration
 * Returns array of validation errors (empty if valid)
 */
export function validateTriggerConfig(
  triggerNode: AutomationNode
): string[] {
  const errors: string[] = [];
  const config = triggerNode.config;
  const subtype = triggerNode.subtype as TriggerSubtype;

  // Type-specific validation
  switch (subtype) {
    case 'email_open':
    case 'email_click':
      if (config.campaignId && typeof config.campaignId !== 'string') {
        errors.push('campaignId must be a string');
      }
      if (config.allCampaigns !== undefined && typeof config.allCampaigns !== 'boolean') {
        errors.push('allCampaigns must be a boolean');
      }
      break;

    case 'campaign_status_changed':
      if (config.newStatus && typeof config.newStatus !== 'string') {
        errors.push('newStatus must be a string');
      }
      if (config.oldStatus && typeof config.oldStatus !== 'string') {
        errors.push('oldStatus must be a string');
      }
      break;

    case 'release_approaching':
      if (config.daysUntilRelease !== undefined && typeof config.daysUntilRelease !== 'number') {
        errors.push('daysUntilRelease must be a number');
      }
      break;
  }

  return errors;
}
