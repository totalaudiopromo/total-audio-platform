/**
 * TrackerAgent - Campaign Tracking & Analytics
 * Orchestrates submission logging, analytics, and follow-up reminders
 */

import { BaseAgent } from '../core/BaseAgent';
import type { AgentPayload, AgentResult } from '../core/AgentTypes';
import { SubmissionLogger } from './subagents/SubmissionLogger';
import { AnalyticsSummariser } from './subagents/AnalyticsSummariser';
import { ReminderAgent } from './subagents/ReminderAgent';

export interface TrackerAgentPayload extends AgentPayload {
  mode: 'log' | 'analytics' | 'reminders' | 'update_status';
  campaignId: string;
  // For 'log' mode
  submission?: {
    contactId: string;
    contactName: string;
    contactOrganisation?: string;
    submissionDate: string;
    pitchType: 'initial' | 'followup_1' | 'followup_2';
    status?: string;
  };
  // For 'update_status' mode
  submissionId?: string;
  status?: string;
  // For 'analytics' mode
  startDate?: string;
  endDate?: string;
}

export class TrackerAgent extends BaseAgent {
  constructor() {
    super('TrackerAgent', '1.0.0');
  }

  async run(payload: TrackerAgentPayload): Promise<AgentResult> {
    this.log('Starting tracker operation', {
      mode: payload.mode,
      campaign: payload.campaignId,
    });

    try {
      switch (payload.mode) {
        case 'log':
          return await this.handleLogMode(payload);
        case 'analytics':
          return await this.handleAnalyticsMode(payload);
        case 'reminders':
          return await this.handleRemindersMode(payload);
        case 'update_status':
          return await this.handleUpdateStatusMode(payload);
        default:
          return {
            success: false,
            error: `Unknown mode: ${payload.mode}`,
          };
      }
    } catch (error) {
      this.log('Tracker operation error', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tracker operation failed',
      };
    }
  }

  /**
   * Log a new submission
   */
  private async handleLogMode(payload: TrackerAgentPayload): Promise<AgentResult> {
    if (!payload.submission) {
      return {
        success: false,
        error: 'submission data required for log mode',
      };
    }

    const logResult = await SubmissionLogger.log({
      campaignId: payload.campaignId,
      ...payload.submission,
      status: payload.submission.status as
        | 'sent'
        | 'delivered'
        | 'opened'
        | 'replied'
        | 'rejected'
        | undefined,
    });

    if (!logResult.success) {
      return {
        success: false,
        error: `Submission logging failed: ${logResult.error}`,
      };
    }

    return {
      success: true,
      data: {
        submission: logResult.data,
        message: 'Submission logged successfully',
      },
    };
  }

  /**
   * Generate campaign analytics
   */
  private async handleAnalyticsMode(payload: TrackerAgentPayload): Promise<AgentResult> {
    const analyticsResult = await AnalyticsSummariser.summarise({
      campaignId: payload.campaignId,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    if (!analyticsResult.success) {
      return {
        success: false,
        error: `Analytics generation failed: ${analyticsResult.error}`,
      };
    }

    return {
      success: true,
      data: analyticsResult.data,
    };
  }

  /**
   * Check for follow-up reminders
   */
  private async handleRemindersMode(payload: TrackerAgentPayload): Promise<AgentResult> {
    const remindersResult = await ReminderAgent.check({
      campaignId: payload.campaignId,
    });

    if (!remindersResult.success) {
      return {
        success: false,
        error: `Reminder check failed: ${remindersResult.error}`,
      };
    }

    return {
      success: true,
      data: remindersResult.data,
    };
  }

  /**
   * Update submission status
   */
  private async handleUpdateStatusMode(payload: TrackerAgentPayload): Promise<AgentResult> {
    if (!payload.submissionId || !payload.status) {
      return {
        success: false,
        error: 'submissionId and status required for update_status mode',
      };
    }

    const updateResult = await SubmissionLogger.updateStatus(payload.submissionId, payload.status);

    if (!updateResult.success) {
      return {
        success: false,
        error: `Status update failed: ${updateResult.error}`,
      };
    }

    return {
      success: true,
      data: {
        updated: updateResult.data,
        message: 'Status updated successfully',
      },
    };
  }
}
