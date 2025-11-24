/**
 * Actions - Action node execution logic
 * Executes workflow actions by calling into existing subsystems
 */

import type {
  AutomationNode,
  ExecutionContext,
  ActionResult,
  ActionSubtype,
  SendEmailCampaignConfig,
  UpdateSegmentConfig,
  DelayConfig,
  SafetyMetrics,
} from './types';
import { ActionError, LimitExceededError } from './utils/errors';
import { logger } from './utils/logger';

/**
 * Execute an action node
 * Returns success status and optional output data
 */
export async function runActionNode(
  node: AutomationNode,
  ctx: ExecutionContext,
  stepInput: any,
  safetyMetrics: SafetyMetrics
): Promise<ActionResult> {
  const subtype = node.subtype as ActionSubtype;
  const config = node.config;

  // Check safety limits before executing
  checkSafetyLimits(subtype, safetyMetrics, ctx);

  try {
    let result: ActionResult;

    switch (subtype) {
      case 'send_email_campaign':
        result = await executeSendEmailCampaign(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        break;

      case 'schedule_followup':
        result = await executeScheduleFollowup(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        break;

      case 'update_segment':
        result = await executeUpdateSegment(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        safetyMetrics.contactActionsPerformed++;
        break;

      case 'create_release_task':
        result = await executeCreateReleaseTask(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        break;

      case 'notify_user':
        result = await executeNotifyUser(config, stepInput, ctx);
        break;

      case 'log_event':
        result = await executeLogEvent(config, stepInput, ctx);
        break;

      case 'update_cmg_node':
        result = await executeUpdateCMGNode(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        break;

      case 'tag_contact':
        result = await executeTagContact(config, stepInput, ctx);
        safetyMetrics.externalWrites++;
        safetyMetrics.contactActionsPerformed++;
        break;

      case 'delay':
        result = await executeDelay(config, stepInput, ctx);
        break;

      default:
        throw new ActionError(`Unknown action subtype: ${subtype}`, subtype);
    }

    safetyMetrics.actionsExecuted++;
    return result;
  } catch (error) {
    if (error instanceof ActionError || error instanceof LimitExceededError) {
      throw error;
    }
    throw new ActionError(
      `Failed to execute action ${subtype}: ${(error as Error).message}`,
      subtype,
      { node, stepInput, error }
    );
  }
}

/**
 * Check safety limits before executing action
 */
function checkSafetyLimits(
  actionType: string,
  safetyMetrics: SafetyMetrics,
  ctx: ExecutionContext
): void {
  if (safetyMetrics.actionsExecuted >= ctx.limits.maxActionsPerExecution) {
    throw new LimitExceededError(
      `Max actions per execution exceeded (${ctx.limits.maxActionsPerExecution})`,
      'maxActionsPerExecution',
      safetyMetrics
    );
  }

  if (safetyMetrics.externalWrites >= ctx.limits.maxExternalWrites) {
    throw new LimitExceededError(
      `Max external writes exceeded (${ctx.limits.maxExternalWrites})`,
      'maxExternalWrites',
      safetyMetrics
    );
  }

  if (safetyMetrics.contactActionsPerformed >= ctx.limits.maxContactActions) {
    throw new LimitExceededError(
      `Max contact actions exceeded (${ctx.limits.maxContactActions})`,
      'maxContactActions',
      safetyMetrics
    );
  }
}

/**
 * Send email campaign action
 * Uses email-engine to create and send a campaign
 */
async function executeSendEmailCampaign(
  config: SendEmailCampaignConfig,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { subject, body, fromEmail, toSegmentId, toContactIds, delay } = config;

  if (!subject || !body || !fromEmail) {
    throw new ActionError(
      'subject, body, and fromEmail are required for send_email_campaign',
      'send_email_campaign'
    );
  }

  if (!toSegmentId && !toContactIds) {
    throw new ActionError(
      'Either toSegmentId or toContactIds must be provided',
      'send_email_campaign'
    );
  }

  try {
    // Apply delay if configured
    if (delay && delay > 0) {
      logger.info(`Delaying email send by ${delay} seconds`);
      await sleep(delay * 1000);
    }

    // Create campaign via email-engine
    const { campaignId } = await ctx.clients.emailEngine.createCampaign({
      name: `Automation: ${subject}`,
      subject,
      body,
      fromEmail,
      toSegmentId,
      toContactIds,
    });

    // Send campaign
    await ctx.clients.emailEngine.sendCampaign(campaignId);

    logger.info(`Sent email campaign: ${campaignId}`);

    return {
      success: true,
      output: { campaignId },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to send email campaign: ${(error as Error).message}`,
      'send_email_campaign',
      { config, error }
    );
  }
}

/**
 * Schedule followup action
 * Uses email-engine to schedule a follow-up campaign
 */
async function executeScheduleFollowup(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { subject, body, fromEmail, delayDays, campaignIdField = 'event.campaignId' } = config;

  if (!subject || !body || !fromEmail || !delayDays) {
    throw new ActionError(
      'subject, body, fromEmail, and delayDays are required for schedule_followup',
      'schedule_followup'
    );
  }

  const originalCampaignId = getFieldValue(stepInput, campaignIdField);

  try {
    // Create follow-up campaign
    const { campaignId } = await ctx.clients.emailEngine.createCampaign({
      name: `Follow-up: ${subject}`,
      subject,
      body,
      fromEmail,
    });

    // Schedule for future
    const scheduleDate = new Date();
    scheduleDate.setDate(scheduleDate.getDate() + delayDays);

    await ctx.clients.emailEngine.scheduleCampaign(campaignId, scheduleDate);

    logger.info(`Scheduled follow-up campaign: ${campaignId} for ${scheduleDate}`);

    return {
      success: true,
      output: { campaignId, scheduleDate, originalCampaignId },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to schedule follow-up: ${(error as Error).message}`,
      'schedule_followup',
      { config, error }
    );
  }
}

/**
 * Update segment action
 * Uses list-builder to add/remove contacts from segments
 */
async function executeUpdateSegment(
  config: UpdateSegmentConfig,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { segmentId, action, contactIdField = 'event.contactId' } = config;

  if (!segmentId || !action) {
    throw new ActionError(
      'segmentId and action are required for update_segment',
      'update_segment'
    );
  }

  const contactId = getFieldValue(stepInput, contactIdField);

  if (!contactId) {
    throw new ActionError('No contactId found in stepInput', 'update_segment', {
      contactIdField,
      stepInput,
    });
  }

  try {
    if (action === 'add') {
      await ctx.clients.listBuilder.addContactToSegment(contactId, segmentId);
      logger.info(`Added contact ${contactId} to segment ${segmentId}`);
    } else if (action === 'remove') {
      await ctx.clients.listBuilder.removeContactFromSegment(contactId, segmentId);
      logger.info(`Removed contact ${contactId} from segment ${segmentId}`);
    } else {
      throw new ActionError(`Invalid segment action: ${action}`, 'update_segment');
    }

    return {
      success: true,
      output: { contactId, segmentId, action },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to update segment: ${(error as Error).message}`,
      'update_segment',
      { config, error }
    );
  }
}

/**
 * Create release task action
 * Uses release-planner to create tasks
 */
async function executeCreateReleaseTask(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { title, description, dueDateDays, releaseIdField = 'event.releaseId' } = config;

  if (!title) {
    throw new ActionError('title is required for create_release_task', 'create_release_task');
  }

  const releaseId = getFieldValue(stepInput, releaseIdField);

  if (!releaseId) {
    throw new ActionError('No releaseId found in stepInput', 'create_release_task', {
      releaseIdField,
      stepInput,
    });
  }

  try {
    let dueDate: Date | undefined;
    if (dueDateDays) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDateDays);
    }

    const { taskId } = await ctx.clients.releasePlanner.createTask({
      releaseId,
      title,
      description,
      dueDate,
    });

    logger.info(`Created release task: ${taskId} for release ${releaseId}`);

    return {
      success: true,
      output: { taskId, releaseId, title },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to create release task: ${(error as Error).message}`,
      'create_release_task',
      { config, error }
    );
  }
}

/**
 * Notify user action
 * Creates internal notification (stub implementation)
 */
async function executeNotifyUser(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { message, notificationType = 'info' } = config;

  if (!message) {
    throw new ActionError('message is required for notify_user', 'notify_user');
  }

  // TODO: Integrate with actual notification system
  logger.info(`[NOTIFICATION] ${notificationType.toUpperCase()}: ${message}`, {
    userId: ctx.userId,
    stepInput,
  });

  return {
    success: true,
    output: { message, notificationType, sentAt: new Date() },
  };
}

/**
 * Log event action
 * Logs event to automation execution logs
 */
async function executeLogEvent(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { message, level = 'info', data } = config;

  const logData = {
    message: message || 'Automation log event',
    level,
    userId: ctx.userId,
    stepInput,
    customData: data,
    timestamp: new Date(),
  };

  switch (level) {
    case 'info':
      logger.info(logData.message, logData);
      break;
    case 'warn':
      logger.warn(logData.message, logData);
      break;
    case 'error':
      logger.error(logData.message, logData);
      break;
    default:
      logger.debug(logData.message, logData);
  }

  return {
    success: true,
    output: logData,
  };
}

/**
 * Update CMG node action
 * Uses CMG client to log success patterns
 */
async function executeUpdateCMGNode(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const {
    outcome,
    logType = 'success',
    campaignIdField = 'event.campaignId',
    contactIdField = 'event.contactId',
  } = config;

  if (!outcome) {
    throw new ActionError('outcome is required for update_cmg_node', 'update_cmg_node');
  }

  const campaignId = getFieldValue(stepInput, campaignIdField);
  const contactId = getFieldValue(stepInput, contactIdField);

  try {
    const logParams = {
      campaignId,
      contactId,
      outcome,
      metadata: {
        source: 'automation',
        timestamp: new Date(),
        stepInput,
      },
    };

    if (logType === 'success') {
      await ctx.clients.cmg.logSuccessPattern(logParams);
    } else {
      await ctx.clients.cmg.logAttempt(logParams);
    }

    logger.info(`Updated CMG: ${logType} - ${outcome}`);

    return {
      success: true,
      output: { outcome, logType, campaignId, contactId },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to update CMG node: ${(error as Error).message}`,
      'update_cmg_node',
      { config, error }
    );
  }
}

/**
 * Tag contact action
 * Uses list-builder to apply tags to contacts
 */
async function executeTagContact(
  config: Record<string, any>,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { tag, contactIdField = 'event.contactId' } = config;

  if (!tag) {
    throw new ActionError('tag is required for tag_contact', 'tag_contact');
  }

  const contactId = getFieldValue(stepInput, contactIdField);

  if (!contactId) {
    throw new ActionError('No contactId found in stepInput', 'tag_contact', {
      contactIdField,
      stepInput,
    });
  }

  try {
    await ctx.clients.listBuilder.tagContact(contactId, tag);
    logger.info(`Tagged contact ${contactId} with "${tag}"`);

    return {
      success: true,
      output: { contactId, tag },
    };
  } catch (error) {
    throw new ActionError(
      `Failed to tag contact: ${(error as Error).message}`,
      'tag_contact',
      { config, error }
    );
  }
}

/**
 * Delay action
 * Pauses execution for a specified duration
 */
async function executeDelay(
  config: DelayConfig,
  stepInput: any,
  ctx: ExecutionContext
): Promise<ActionResult> {
  const { delaySeconds } = config;

  if (!delaySeconds || delaySeconds <= 0) {
    throw new ActionError('delaySeconds must be > 0 for delay action', 'delay');
  }

  logger.info(`Delaying execution for ${delaySeconds} seconds`);

  await sleep(delaySeconds * 1000);

  return {
    success: true,
    output: { delaySeconds, completedAt: new Date() },
  };
}

/**
 * Helper: Get field value from object using dot notation
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
 * Helper: Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate action node configuration
 * Returns array of validation errors (empty if valid)
 */
export function validateActionConfig(node: AutomationNode): string[] {
  const errors: string[] = [];
  const config = node.config;
  const subtype = node.subtype as ActionSubtype;

  switch (subtype) {
    case 'send_email_campaign':
      if (!config.subject) errors.push('subject is required');
      if (!config.body) errors.push('body is required');
      if (!config.fromEmail) errors.push('fromEmail is required');
      if (!config.toSegmentId && !config.toContactIds) {
        errors.push('Either toSegmentId or toContactIds is required');
      }
      break;

    case 'schedule_followup':
      if (!config.subject) errors.push('subject is required');
      if (!config.body) errors.push('body is required');
      if (!config.fromEmail) errors.push('fromEmail is required');
      if (!config.delayDays) errors.push('delayDays is required');
      break;

    case 'update_segment':
      if (!config.segmentId) errors.push('segmentId is required');
      if (!config.action) errors.push('action is required');
      if (config.action && !['add', 'remove'].includes(config.action)) {
        errors.push('action must be "add" or "remove"');
      }
      break;

    case 'create_release_task':
      if (!config.title) errors.push('title is required');
      break;

    case 'notify_user':
      if (!config.message) errors.push('message is required');
      break;

    case 'update_cmg_node':
      if (!config.outcome) errors.push('outcome is required');
      break;

    case 'tag_contact':
      if (!config.tag) errors.push('tag is required');
      break;

    case 'delay':
      if (!config.delaySeconds || config.delaySeconds <= 0) {
        errors.push('delaySeconds must be > 0');
      }
      break;
  }

  return errors;
}
