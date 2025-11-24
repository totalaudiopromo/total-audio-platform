/**
 * Followup Agent
 *
 * Purpose: Decide follow-up strategy based on contact responses and engagement.
 * Uses tracker data and reply intelligence to optimize follow-ups.
 */

import type { AgentContext, AutopilotTask, FollowupPlanOutput, FollowupTask } from '../types';

export class FollowupAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<FollowupPlanOutput> {
    context.logger.info('FollowupAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'plan_followups') {
      return await this.planFollowups(task, context);
    } else if (task.type === 'execute_followups') {
      return await this.executeFollowups(task, context);
    }

    throw new Error(`Unknown task type for Followup: ${task.type}`);
  }

  private async planFollowups(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<FollowupPlanOutput> {
    const { clients, logger, mission } = context;
    const input = task.input;
    const sent_emails = input.sent_emails as any[];

    logger.info('Planning follow-ups', {
      sent_count: sent_emails.length,
    });

    const followup_tasks: FollowupTask[] = [];

    // Determine follow-up strategy from config
    const strategy =
      mission.config.preferences?.follow_up_strategy || 'balanced';

    // Wait period based on strategy
    const waitDays = strategy === 'conservative' ? 10 : strategy === 'balanced' ? 7 : 5;

    // Analyze each sent email for follow-up potential
    for (const sent of sent_emails) {
      const contactId = sent.contact_id as string;

      // Get contact activity from tracker
      try {
        const activity = await clients.tracker.getContactActivity(contactId);

        // Determine if follow-up is warranted
        const hasOpened = activity.some((a) => a.type === 'email_opened');
        const hasClicked = activity.some((a) => a.type === 'link_clicked');
        const hasReplied = activity.some((a) => a.type === 'replied');

        if (hasReplied) {
          // Already replied, no follow-up needed
          continue;
        }

        let followup_type: 'gentle_reminder' | 'value_add' | 'final_touch';
        if (hasClicked) {
          followup_type = 'value_add'; // Interested but didn't reply
        } else if (hasOpened) {
          followup_type = 'gentle_reminder'; // Opened but no action
        } else {
          followup_type = 'final_touch'; // No engagement
        }

        // Calculate suggested follow-up date
        const sentDate = new Date(sent.sent_at as string);
        const followupDate = new Date(sentDate);
        followupDate.setDate(followupDate.getDate() + waitDays);

        followup_tasks.push({
          contact_id: contactId,
          original_send_id: sent.id as string,
          followup_type,
          suggested_date: followupDate.toISOString(),
          template_id: `followup-${followup_type}`,
        });
      } catch (error) {
        logger.warn('Failed to analyze contact for follow-up', {
          contact_id: contactId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Estimate additional reach from follow-ups
    const estimated_additional_reach = Math.floor(
      followup_tasks.length * (strategy === 'aggressive' ? 0.15 : strategy === 'balanced' ? 0.10 : 0.05)
    );

    logger.info('Follow-up plan complete', {
      total_followups: followup_tasks.length,
      strategy,
      estimated_reach: estimated_additional_reach,
    });

    return {
      followup_tasks,
      strategy,
      estimated_additional_reach,
    };
  }

  private async executeFollowups(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<FollowupPlanOutput> {
    const { clients, logger } = context;
    const input = task.input;
    const followup_tasks = input.followup_tasks as FollowupTask[];

    logger.info('Executing follow-ups', {
      total: followup_tasks.length,
    });

    const results = [];

    for (const followup of followup_tasks) {
      try {
        // Schedule follow-up email
        const scheduled = await clients.emailEngine.scheduleEmail({
          campaign_id: 'followup-campaign', // TODO: Create/link to campaign
          contact_id: followup.contact_id,
          template_id: followup.template_id || 'default-followup',
          send_at: followup.suggested_date,
          variables: {
            followup_type: followup.followup_type,
            original_send_id: followup.original_send_id,
          },
        });

        results.push({
          contact_id: followup.contact_id,
          scheduled_id: scheduled.id,
          followup_type: followup.followup_type,
        });
      } catch (error) {
        logger.error('Failed to execute follow-up', {
          contact_id: followup.contact_id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info('Follow-ups executed', {
      scheduled: results.length,
      failed: followup_tasks.length - results.length,
    });

    return {
      followup_tasks: results as any,
      strategy: 'balanced',
      estimated_additional_reach: results.length,
    };
  }
}
