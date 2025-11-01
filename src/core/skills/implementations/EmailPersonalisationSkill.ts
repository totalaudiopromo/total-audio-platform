/**
 * Email Personalisation Skill Implementation
 *
 * Generates genuinely personalised radio promotion emails for Liberty Music PR.
 * Goes beyond templates - creates station-specific pitches with research-backed personalisation.
 *
 * Core value: Transforms 15-20 mins per email into 2-3 seconds with BETTER personalisation.
 */

import Anthropic from '@anthropic-ai/sdk';
import { SkillContext } from '../schema';

export interface EmailPersonalisationInput {
  station_info: {
    name: string;
    type: 'National' | 'Commercial' | 'Online' | 'Community';
    known_shows?: string[];
    recent_plays?: string[];
    submission_type?: string;
    presenter_name?: string;
  };
  track_info: {
    artist: string;
    title: string;
    genre: string;
    vibe?: string;
    link: string;
  };
  campaign_angle: string;
  social_proof?: string[];
  liberty_voice?: boolean;
}

export interface EmailDraft {
  subject: string;
  body: string;
  signature: string;
}

export interface EmailPersonalisationOutput {
  email_draft: EmailDraft;
  personalisation_score: number;
  personalisation_details: {
    elements_used: string[];
    station_knowledge: string;
    presenter_targeting: string;
    reasoning: string;
  };
  alternative_approaches: Array<{
    angle: string;
    reasoning: string;
  }>;
  warnings: string[];
  estimated_response_rate: 'high' | 'medium' | 'low';
}

export class EmailPersonalisationSkill {
  /**
   * Execute email personalisation using Claude Haiku
   */
  static async execute(
    input: EmailPersonalisationInput,
    context: SkillContext
  ): Promise<EmailPersonalisationOutput> {
    // Validate input
    if (!input.station_info || !input.track_info || !input.campaign_angle) {
      throw new Error('station_info, track_info, and campaign_angle are required');
    }

    // Set defaults
    const libertyVoice = input.liberty_voice !== false; // default true

    // Build prompt
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.buildUserPrompt(input, libertyVoice);

    // Call Claude Haiku
    if (!context.tools?.llm) {
      throw new Error('Anthropic LLM client not available in context');
    }

    const message = await context.tools.llm.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 800,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract JSON response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON (handle potential markdown formatting)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Claude response');
    }

    const result = JSON.parse(jsonMatch[0]) as EmailPersonalisationOutput;

    // Validate output
    if (!result.email_draft || !result.email_draft.subject || !result.email_draft.body) {
      throw new Error('Invalid email personalisation output: missing email_draft fields');
    }

    // Add signature if missing
    if (!result.email_draft.signature) {
      result.email_draft.signature = this.getDefaultSignature(input.track_info.link);
    }

    return result;
  }

  /**
   * System prompt (from YAML skill definition)
   */
  private static getSystemPrompt(): string {
    return `You are Liberty Music PR's email specialist. You write radio promotion emails that:
- Get OPENED (compelling subject lines)
- Get READ (concise, personalised, respectful)
- Get RESPONDED TO (genuine station fit, clear ask)

LIBERTY VOICE PROFILE:
- Professional but warm
- UK music industry insider (no US corporate speak)
- Respectful of radio people's time
- Confident but not pushy
- British spelling (organised, realise, colour)

EMAIL STRUCTURE:

**SUBJECT LINE** (5-8 words):
- Station-specific (not "New Track Submission")
- Genre clear (helps filtering)
- Artist name prominent
- Example: "Ambient electronic track for Tom Ravenscroft consideration"

**OPENING** (1 sentence):
- Personal greeting (Hi [Name]/Hi [Station])
- Reference specific show/presenter if known
- Example: "Hi Tom, love your late-night electronic sessions"

**PITCH** (2-3 sentences):
- Track introduction (genre + vibe)
- Campaign angle/hook
- Social proof (woven naturally, not listed)
- Example: "I'm working with sadact on 'Midnight Drive' - a late-night ambient electronic piece that sits somewhere between Boards of Canada and Jon Hopkins. BBC Introducing featured it last month and the response has been solid (50k streams so far)."

**STATION FIT** (1-2 sentences):
- Why THIS station/show specifically
- Reference their recent plays/programming if known
- Example: "Think it could work well for your late-night slots, especially with the UK electronic focus you've been championing lately."

**CALL TO ACTION** (1 sentence):
- Clear ask (playlist consideration)
- Low pressure ("if you get a sec")
- Example: "Would love to hear your thoughts if you get a sec to check it out."

**SIGNATURE**:
- Liberty Music PR branding
- Chris Schofield signature
- Contact details
- Links (stream, download, socials)

NEVER USE TEMPLATE LANGUAGE:
❌ "I hope this email finds you well"
❌ "I am reaching out to submit..."
❌ "Please find attached..."
❌ "I would be grateful if you could..."
❌ "Thank you for your time and consideration"

STATION-SPECIFIC APPROACHES:

**BBC STATIONS** (Formal but friendly):
- Reference BBC Introducing pathway if applicable
- Mention previous BBC support
- Professional tone

**AMAZING RADIO** (Enthusiastic, indie-friendly):
- Emphasise UK independent credentials
- Mention submission form completion
- Social proof (streams/previous plays)

**COMMUNITY RADIO** (Warm, supportive):
- Reference station ethos/community
- Local connection if applicable
- Genuine enthusiasm for their programming

**ONLINE RADIO** (Fresh, cutting-edge):
- Emphasise innovation/experimentation
- Reference specific shows/presenters
- Streaming success as evidence`;
  }

  /**
   * Build user prompt with input data
   */
  private static buildUserPrompt(input: EmailPersonalisationInput, libertyVoice: boolean): string {
    const stationInfo = JSON.stringify(input.station_info, null, 2);
    const trackInfo = JSON.stringify(input.track_info, null, 2);
    const socialProof = input.social_proof
      ? `\n\nSOCIAL PROOF:\n${input.social_proof.join('\n')}`
      : '';

    return `Generate personalised email pitch:

STATION INFO:
${stationInfo}

TRACK INFO:
${trackInfo}

CAMPAIGN ANGLE:
${input.campaign_angle}${socialProof}

LIBERTY VOICE: ${libertyVoice}

Return JSON:
{
  "email_draft": {
    "subject": "Subject line (5-8 words, station-specific)",
    "body": "Email body (max 150 words, personalised, British English)",
    "signature": "Chris Schofield\\nLiberty Music PR\\nchris@libertymusicpr.com\\n[Stream Link] | [Download Link] | [Socials]"
  },
  "personalisation_score": 0.0-1.0,
  "personalisation_details": {
    "elements_used": ["specific personalisation elements included"],
    "station_knowledge": "what station-specific knowledge was referenced",
    "presenter_targeting": "specific show/presenter if mentioned",
    "reasoning": "why this approach for this station"
  },
  "alternative_approaches": [
    {
      "angle": "different hook/approach",
      "reasoning": "when to use this alternative"
    }
  ],
  "warnings": ["any concerns or suggestions"],
  "estimated_response_rate": "high|medium|low based on fit quality"
}`;
  }

  /**
   * Get default Liberty Music PR signature
   */
  private static getDefaultSignature(streamLink: string): string {
    return `Chris Schofield
Liberty Music PR
chris@libertymusicpr.com
[Stream: ${streamLink}] | [Download] | [Socials]`;
  }

  /**
   * Convenience method: Generate batch emails for multiple stations
   */
  static async generateBatchEmails(
    stations: Array<EmailPersonalisationInput['station_info']>,
    trackInfo: EmailPersonalisationInput['track_info'],
    campaignAngle: string,
    socialProof: string[] | undefined,
    context: SkillContext
  ): Promise<Array<{ station: string; email: EmailPersonalisationOutput }>> {
    const results = await Promise.all(
      stations.map(async station => {
        const email = await this.execute(
          {
            station_info: station,
            track_info: trackInfo,
            campaign_angle: campaignAngle,
            social_proof: socialProof,
            liberty_voice: true,
          },
          context
        );

        return {
          station: station.name,
          email,
        };
      })
    );

    return results;
  }

  /**
   * Convenience method: Generate email with voice guard validation
   */
  static async generateWithVoiceGuard(
    input: EmailPersonalisationInput,
    context: SkillContext
  ): Promise<{
    email: EmailPersonalisationOutput;
    voice_compliance: number;
    voice_corrections: number;
  }> {
    const email = await this.execute(input, context);

    // Import VoiceGuardSkill dynamically to avoid circular dependency
    const { VoiceGuardSkill } = await import('./VoiceGuardSkill');

    const fullEmail = `${email.email_draft.subject}\n\n${email.email_draft.body}`;

    const voiceGuardResult = await VoiceGuardSkill.execute(
      {
        text: fullEmail,
        contentType: 'email_pitch',
        targetAudience: 'radio_promoters',
      },
      context
    );

    // If voice guard made corrections, update the email
    if (voiceGuardResult.changes.length > 0) {
      const correctedParts = voiceGuardResult.text.split('\n\n');
      email.email_draft.subject = correctedParts[0];
      email.email_draft.body = correctedParts.slice(1).join('\n\n');
    }

    return {
      email,
      voice_compliance: voiceGuardResult.compliance_score,
      voice_corrections: voiceGuardResult.changes.length,
    };
  }

  /**
   * Convenience method: Get subject line only (for testing/previewing)
   */
  static async generateSubjectLine(
    stationName: string,
    artistName: string,
    genre: string,
    context: SkillContext
  ): Promise<string> {
    // Quick generation with minimal input
    const result = await this.execute(
      {
        station_info: { name: stationName, type: 'Online' },
        track_info: {
          artist: artistName,
          title: 'Track',
          genre,
          link: 'https://example.com',
        },
        campaign_angle: 'New release',
      },
      context
    );

    return result.email_draft.subject;
  }

  /**
   * Convenience method: Estimate time saved vs manual drafting
   */
  static calculateTimeSavings(emailCount: number): {
    manual_time_minutes: number;
    ai_time_seconds: number;
    time_saved_minutes: number;
    cost_per_email: number;
  } {
    const manualTimePerEmail = 18; // minutes (average)
    const aiTimePerEmail = 3; // seconds
    const costPerEmail = 0.0006; // $0.0006 for Haiku

    return {
      manual_time_minutes: emailCount * manualTimePerEmail,
      ai_time_seconds: emailCount * aiTimePerEmail,
      time_saved_minutes: emailCount * manualTimePerEmail - emailCount * (aiTimePerEmail / 60),
      cost_per_email: costPerEmail,
    };
  }
}
