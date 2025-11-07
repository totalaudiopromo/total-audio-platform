/**
 * FollowUpWriter Sub-Agent
 * Crafts polite, non-pushy follow-up emails for unanswered pitches
 */

import type { SubAgentResult } from '../../core/AgentTypes';

export interface FollowUpPayload {
  artist: string;
  release: string;
  contactName?: string;
  originalPitchDate: string;
  daysSinceOriginal: number;
  followUpNumber: number; // 1st, 2nd, 3rd follow-up
}

export interface FollowUpEmail {
  subject: string;
  body: string;
  shouldSend: boolean;
  reasoning: string;
}

export class FollowUpWriter {
  // Maximum number of follow-ups before stopping
  private static MAX_FOLLOW_UPS = 2;

  // Minimum days between follow-ups
  private static MIN_DAYS_BETWEEN = 7;

  /**
   * Generate follow-up email
   */
  static async write(payload: FollowUpPayload): Promise<SubAgentResult> {
    try {
      console.log('[FollowUpWriter] Generating follow-up...', {
        followUpNumber: payload.followUpNumber,
        daysSince: payload.daysSinceOriginal,
      });

      // Check if follow-up should be sent
      const shouldSend = this.shouldSendFollowUp(payload);

      if (!shouldSend.send) {
        return {
          success: true,
          data: {
            shouldSend: false,
            reasoning: shouldSend.reasoning,
          },
        };
      }

      // Generate follow-up content
      const followUp = this.generateFollowUp(payload);

      return {
        success: true,
        data: followUp,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Follow-up generation failed',
      };
    }
  }

  /**
   * Determine if follow-up should be sent
   */
  private static shouldSendFollowUp(payload: FollowUpPayload): {
    send: boolean;
    reasoning: string;
  } {
    // Too many follow-ups
    if (payload.followUpNumber > this.MAX_FOLLOW_UPS) {
      return {
        send: false,
        reasoning: `Maximum ${this.MAX_FOLLOW_UPS} follow-ups reached. Time to move on.`,
      };
    }

    // Too soon after last contact
    if (payload.daysSinceOriginal < this.MIN_DAYS_BETWEEN) {
      return {
        send: false,
        reasoning: `Only ${payload.daysSinceOriginal} days since last contact. Wait at least ${this.MIN_DAYS_BETWEEN} days.`,
      };
    }

    return {
      send: true,
      reasoning: 'Follow-up timing is appropriate',
    };
  }

  /**
   * Generate follow-up email content
   */
  private static generateFollowUp(payload: FollowUpPayload): FollowUpEmail {
    const subject = this.generateSubject(payload);
    const body = this.generateBody(payload);

    return {
      subject,
      body,
      shouldSend: true,
      reasoning: 'Follow-up timing and content are appropriate',
    };
  }

  /**
   * Generate subject line
   */
  private static generateSubject(payload: FollowUpPayload): string {
    if (payload.followUpNumber === 1) {
      return `Re: ${payload.artist} - ${payload.release}`;
    }
    return `Following up: ${payload.artist} - ${payload.release}`;
  }

  /**
   * Generate email body
   */
  private static generateBody(payload: FollowUpPayload): string {
    const greeting = payload.contactName ? `Hi ${payload.contactName},` : `Hi there,`;

    let body = '';

    if (payload.followUpNumber === 1) {
      // First follow-up - casual and brief
      body = `${greeting}

Just wanted to follow up on "${payload.release}" I sent over about ${Math.floor(
        payload.daysSinceOriginal / 7
      )} weeks ago.

No worries if you've been busy or it's not the right fit - just thought I'd check in.

If you'd like any more info or materials, let me know.

Best regards,
${payload.artist}`;
    } else {
      // Second follow-up - even briefer, final check
      body = `${greeting}

Quick final check about "${payload.release}" - completely understand if you're not able to cover it or if timing isn't right.

Either way, thanks for your time.

Best,
${payload.artist}`;
    }

    return body;
  }
}
