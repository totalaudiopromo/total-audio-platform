/**
 * ReminderAgent Sub-Agent
 * Tracks submission timing and suggests when to send follow-ups
 */

import type { SubAgentResult } from '../../core/AgentTypes'

export interface ReminderCheckPayload {
  campaignId: string
  checkDate?: string
}

export interface Reminder {
  submissionId: string
  contactName: string
  contactOrganisation?: string
  action: 'followup_1' | 'followup_2' | 'close'
  reason: string
  daysWaited: number
  suggestedDate: string
  priority: 'high' | 'medium' | 'low'
}

export class ReminderAgent {
  // Timing rules
  private static FIRST_FOLLOWUP_DAYS = 7
  private static SECOND_FOLLOWUP_DAYS = 14
  private static CLOSE_CAMPAIGN_DAYS = 21

  /**
   * Check for submissions needing follow-ups
   */
  static async check(payload: ReminderCheckPayload): Promise<SubAgentResult> {
    try {
      console.log('[ReminderAgent] Checking reminders for campaign:', payload.campaignId)

      const reminders = await this.generateReminders(payload)

      return {
        success: true,
        data: {
          reminders,
          count: reminders.length,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Reminder check failed',
      }
    }
  }

  /**
   * Generate reminders for campaign
   */
  private static async generateReminders(
    payload: ReminderCheckPayload
  ): Promise<Reminder[]> {
    // TODO: Query actual submissions from Supabase
    // For now, return mock structure
    const reminders: Reminder[] = []

    // Example: submission from 8 days ago with no reply
    const mockReminder: Reminder = {
      submissionId: 'sub_123',
      contactName: 'John Smith',
      contactOrganisation: 'BBC Radio 6 Music',
      action: 'followup_1',
      reason: 'No reply received after 8 days',
      daysWaited: 8,
      suggestedDate: new Date().toISOString(),
      priority: 'medium',
    }

    return reminders
  }

  /**
   * Determine appropriate action based on submission age
   */
  static determineAction(
    daysSinceSubmission: number,
    followUpsSent: number
  ): Reminder['action'] | null {
    if (daysSinceSubmission >= this.CLOSE_CAMPAIGN_DAYS && followUpsSent >= 2) {
      return 'close'
    }

    if (daysSinceSubmission >= this.SECOND_FOLLOWUP_DAYS && followUpsSent === 1) {
      return 'followup_2'
    }

    if (daysSinceSubmission >= this.FIRST_FOLLOWUP_DAYS && followUpsSent === 0) {
      return 'followup_1'
    }

    return null
  }

  /**
   * Calculate priority for reminder
   */
  static calculatePriority(
    daysWaited: number,
    contactImportance: 'high' | 'medium' | 'low' = 'medium'
  ): Reminder['priority'] {
    if (daysWaited >= this.SECOND_FOLLOWUP_DAYS && contactImportance === 'high') {
      return 'high'
    }

    if (daysWaited >= this.FIRST_FOLLOWUP_DAYS) {
      return 'medium'
    }

    return 'low'
  }
}
