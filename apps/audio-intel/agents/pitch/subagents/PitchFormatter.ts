/**
 * PitchFormatter Sub-Agent
 * Formats pitch content with proper structure, personalisation, and professional standards
 */

import type { SubAgentResult } from '../../core/AgentTypes';

export interface PitchFormatterPayload {
  artist: string;
  release: string;
  contactName?: string;
  contactOrganisation?: string;
  genre?: string;
  releaseDate?: string;
  streamingLinks?: Record<string, string>;
  pressQuotes?: string[];
}

export interface FormattedPitch {
  subject: string;
  greeting: string;
  introduction: string;
  releaseDetails: string;
  callToAction: string;
  signature: string;
  fullText: string;
}

export class PitchFormatter {
  /**
   * Format a professional pitch email
   */
  static async format(payload: PitchFormatterPayload): Promise<SubAgentResult> {
    try {
      console.log('[PitchFormatter] Formatting pitch for:', payload.artist);

      const pitch = this.buildPitch(payload);

      return {
        success: true,
        data: pitch,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pitch formatting failed',
      };
    }
  }

  /**
   * Build structured pitch content
   */
  private static buildPitch(payload: PitchFormatterPayload): FormattedPitch {
    // Subject line
    const subject = this.buildSubject(payload);

    // Greeting
    const greeting = payload.contactName ? `Hi ${payload.contactName},` : `Hi there,`;

    // Introduction
    const introduction = this.buildIntroduction(payload);

    // Release details
    const releaseDetails = this.buildReleaseDetails(payload);

    // Call to action
    const callToAction = this.buildCallToAction(payload);

    // Signature
    const signature = `Best regards,\n${payload.artist}`;

    // Full text
    const fullText = [
      greeting,
      '',
      introduction,
      '',
      releaseDetails,
      '',
      callToAction,
      '',
      signature,
    ].join('\n');

    return {
      subject,
      greeting,
      introduction,
      releaseDetails,
      callToAction,
      signature,
      fullText,
    };
  }

  private static buildSubject(payload: PitchFormatterPayload): string {
    if (payload.contactOrganisation) {
      return `${payload.artist} - ${payload.release} for ${payload.contactOrganisation}`;
    }
    return `${payload.artist} - ${payload.release}`;
  }

  private static buildIntroduction(payload: PitchFormatterPayload): string {
    const parts = [`I'm ${payload.artist}`];

    if (payload.genre) {
      parts.push(`a ${payload.genre} artist`);
    }

    parts.push(
      `and I wanted to share my ${payload.releaseDate ? 'upcoming' : 'new'} release "${payload.release}" with you.`
    );

    return parts.join(', ');
  }

  private static buildReleaseDetails(payload: PitchFormatterPayload): string {
    const parts = [];

    if (payload.releaseDate) {
      parts.push(`"${payload.release}" is releasing on ${payload.releaseDate}.`);
    }

    if (payload.pressQuotes && payload.pressQuotes.length > 0) {
      parts.push('\nPress feedback:');
      payload.pressQuotes.forEach(quote => {
        parts.push(`• "${quote}"`);
      });
    }

    if (payload.streamingLinks) {
      parts.push('\nListen:');
      Object.entries(payload.streamingLinks).forEach(([platform, url]) => {
        parts.push(`• ${platform}: ${url}`);
      });
    }

    return parts.join('\n');
  }

  private static buildCallToAction(payload: PitchFormatterPayload): string {
    return `I'd really appreciate if you could give "${payload.release}" a listen. Let me know if you'd like any additional info or materials.`;
  }
}
