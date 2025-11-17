/**
 * Scheduler Agent
 *
 * Purpose: Decide when emails/pitches should be sent.
 * Uses success profiles, contact intelligence, and policies to optimize timing.
 */

import type { AgentContext, AutopilotTask, ScheduleOutput, SchedulePlan } from '../types';

export class SchedulerAgent {
  async execute(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ScheduleOutput> {
    context.logger.info('SchedulerAgent executing task', {
      taskType: task.type,
    });

    if (task.type === 'propose_send_schedule') {
      return await this.proposeSendSchedule(task, context);
    } else if (task.type === 'execute_send_schedule') {
      return await this.executeSendSchedule(task, context);
    }

    throw new Error(`Unknown task type for Scheduler: ${task.type}`);
  }

  private async proposeSendSchedule(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<ScheduleOutput> {
    const { clients, logger, policyEngine, mission } = context;
    const input = task.input;
    const timeline = input.timeline as any;
    const phases = input.phases as any[];

    logger.info('Proposing send schedule', {
      start_date: timeline.start_date,
      end_date: timeline.end_date,
      phases: phases?.length,
    });

    // Get policy constraints
    const max_daily_sends = (await policyEngine.maxContactsForMission(mission)) / 30; // Rough daily estimate
    const quiet_hours = input.quiet_hours as { start: string; end: string } || {
      start: '22:00',
      end: '08:00',
    };

    // Build schedule plans
    // For now, this is a simplified version
    const scheduled_sends: SchedulePlan[] = [];

    // Example: Schedule sends across campaign phases
    const startDate = new Date(timeline.start_date);
    for (let i = 0; i < Math.min(50, max_daily_sends * 7); i++) {
      const sendDate = new Date(startDate);
      sendDate.setDate(sendDate.getDate() + Math.floor(i / max_daily_sends));
      sendDate.setHours(10 + (i % 8)); // Spread across business hours

      // Check quiet hours
      const isAllowed = await policyEngine.enforceQuietHours(
        mission.user_id,
        mission.workspace_id || undefined,
        sendDate.toISOString()
      );

      if (isAllowed) {
        scheduled_sends.push({
          contact_id: `contact-${i}`,
          send_at: sendDate.toISOString(),
          pitch_variant: 'variant-1',
          priority: i < 20 ? 10 : 5, // Higher priority for first batch
          rationale: `Tier ${i < 20 ? '1' : '2'} contact, optimal send time`,
        });
      }
    }

    const timeline_output = {
      first_send: scheduled_sends[0]?.send_at || startDate.toISOString(),
      last_send:
        scheduled_sends[scheduled_sends.length - 1]?.send_at ||
        timeline.end_date,
      total_days: Math.ceil(
        (new Date(timeline.end_date).getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };

    logger.info('Send schedule proposed', {
      total_sends: scheduled_sends.length,
      timeline: timeline_output,
    });

    return {
      scheduled_sends,
      policy_constraints: {
        max_daily_sends,
        quiet_hours,
        contact_fatigue_check: true,
      },
      timeline: timeline_output,
    };
  }

  private async executeSendSchedule(
    task: AutopilotTask,
    context: AgentContext
  ): Promise<Record<string, unknown>> {
    const { clients, logger, mission } = context;
    const input = task.input;
    const schedule = input.schedule as SchedulePlan[];

    logger.info('Executing send schedule', {
      total_sends: schedule.length,
    });

    // Create email campaign
    const campaign = await clients.emailEngine.createCampaign({
      name: `${mission.title} - Outreach`,
      type: 'pr_campaign',
    });

    // Schedule emails
    const executed_sends = [];
    for (const plan of schedule) {
      try {
        const scheduled = await clients.emailEngine.scheduleEmail({
          campaign_id: campaign.id,
          contact_id: plan.contact_id,
          template_id: 'pitch-template-1', // TODO: Map to actual template
          send_at: plan.send_at,
          variables: {
            pitch_variant: plan.pitch_variant,
          },
        });

        executed_sends.push({
          contact_id: plan.contact_id,
          scheduled_email_id: scheduled.id,
          send_at: plan.send_at,
        });
      } catch (error) {
        logger.error('Failed to schedule email', {
          contact_id: plan.contact_id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info('Send schedule executed', {
      scheduled: executed_sends.length,
      failed: schedule.length - executed_sends.length,
    });

    return {
      campaign_id: campaign.id,
      executed_sends,
      total_scheduled: executed_sends.length,
    };
  }
}
