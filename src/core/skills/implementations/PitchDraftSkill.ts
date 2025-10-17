/**
 * Pitch Draft Skill - AI-Powered Pitch Generation
 * Total Audio Platform
 *
 * Generates high-quality music PR pitches using track data, contact profiles,
 * and brand voice guidelines. Automatically applies voice guard validation.
 */

import { SkillContext } from '../SkillEngine';
import { VoiceGuardSkill } from './VoiceGuardSkill';
import Anthropic from '@anthropic-ai/sdk';

export interface PitchDraftInput {
  contact: {
    name: string;
    role?: string;
    outlet?: string;
    recent_activity?: string[];
    genre_focus?: string[];
    submission_preferences?: string;
  };
  track: {
    title: string;
    artist: string;
    genre: string;
    key_facts?: string[];
    streaming_links?: {
      spotify?: string;
      apple_music?: string;
      soundcloud?: string;
    };
  };
  brandVoiceId?: string;
  constraints?: {
    max_length?: number;
    tone?: 'casual' | 'professional' | 'enthusiastic';
    include_links?: boolean;
    mode?: 'full' | 'subject_only';
  };
  context?: string;
}

export interface PitchDraftOutput {
  drafts: Array<{
    subject: string;
    body: string;
    rationale: string;
    angle: 'story' | 'data' | 'emotion' | 'industry';
    voice_compliance: number;
  }>;
  confidence: number;
  warnings?: string[];
}

export class PitchDraftSkill {
  /**
   * Execute pitch draft generation
   */
  static async execute(
    input: PitchDraftInput,
    context: SkillContext
  ): Promise<PitchDraftOutput> {
    if (!context.tools.llm) {
      throw new Error('LLM client required for pitch draft generation');
    }

    const systemPrompt = this.buildSystemPrompt(input);
    const userPrompt = this.buildUserPrompt(input);

    try {
      // Generate drafts using Claude
      const message = await context.tools.llm.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const contentBlock = message.content[0];
      if (contentBlock.type !== 'text') {
        throw new Error('Unexpected response format from LLM');
      }

      // Parse JSON response
      const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON output found in LLM response');
      }

      const response = JSON.parse(jsonMatch[0]);

      // Apply voice guard to each draft
      const validatedDrafts = await Promise.all(
        response.drafts.map(async (draft: any) => {
          const voiceGuardResult = await VoiceGuardSkill.execute(
            {
              text: `${draft.subject}\n\n${draft.body}`,
              contentType: 'email_pitch',
              targetAudience: this.getAudienceType(input.contact),
            },
            context
          );

          // Extract corrected subject and body
          const correctedText = voiceGuardResult.text;
          const [correctedSubject, ...bodyParts] = correctedText.split('\n\n');
          const correctedBody = bodyParts.join('\n\n');

          return {
            subject: correctedSubject,
            body: correctedBody,
            rationale: draft.rationale,
            angle: draft.angle,
            voice_compliance: voiceGuardResult.compliance_score,
            voice_corrections: voiceGuardResult.changes,
          };
        })
      );

      // Calculate overall confidence
      const avgCompliance =
        validatedDrafts.reduce((sum, d) => sum + d.voice_compliance, 0) /
        validatedDrafts.length;

      return {
        drafts: validatedDrafts,
        confidence: avgCompliance,
        warnings: response.warnings || [],
      };
    } catch (error) {
      throw new Error(`Pitch draft generation failed: ${error.message}`);
    }
  }

  /**
   * Build system prompt for pitch generation
   */
  private static buildSystemPrompt(input: PitchDraftInput): string {
    const maxLength = input.constraints?.max_length || 150;

    return `You are an expert music PR pitch writer with 5+ years of UK radio promotion experience.

CRITICAL RULES:
- NEVER invent or exaggerate achievements
- NEVER use US spelling (it's "organised" not "organized")
- NEVER write generic template copy
- ALWAYS include genuine personalisation to the contact
- ALWAYS stay under ${maxLength} words for optimal response rates

YOUR MISSION:
Generate ${input.constraints?.mode === 'subject_only' ? 'subject lines' : '3 different pitch drafts'} that get opened and responded to because they're:
- Concise (under ${maxLength} words)
- Authentic (no bullshit or hype)
- Personalised (reference the contact's actual work)
- Professional but warm (UK music industry tone)

PITCH ANGLES TO USE:
1. STORY angle: Human interest, artist journey, unique context
2. DATA angle: Numbers, achievements, concrete proof points
3. EMOTION angle: Feeling, atmosphere, why it matters
4. INDUSTRY angle: Trends, timing, why now

Each draft should take a different angle but feel authentic and relevant to this specific contact.

TONE GUIDELINES:
- Casual-professional (like talking to an industry peer)
- British spelling and phrasing
- Reference real achievements only (BBC Introducing, Spotify streams, etc.)
- Avoid marketing hype words like "revolutionary", "game-changing"
- Be direct and helpful, not pushy`;
  }

  /**
   * Build user prompt with track and contact details
   */
  private static buildUserPrompt(input: PitchDraftInput): string {
    let prompt = `Generate pitch ${input.constraints?.mode === 'subject_only' ? 'subject lines' : 'emails'} for this track and contact:\n\n`;

    // Track information
    prompt += `TRACK INFO:\n`;
    prompt += `- Title: "${input.track.title}"\n`;
    prompt += `- Artist: ${input.track.artist}\n`;
    prompt += `- Genre: ${input.track.genre}\n`;

    if (input.track.key_facts && input.track.key_facts.length > 0) {
      prompt += `- Key Facts: ${input.track.key_facts.join(', ')}\n`;
    }

    // Contact information
    prompt += `\nCONTACT:\n`;
    prompt += `- Name: ${input.contact.name}\n`;
    if (input.contact.role) prompt += `- Role: ${input.contact.role}\n`;
    if (input.contact.outlet) prompt += `- Outlet: ${input.contact.outlet}\n`;

    if (input.contact.recent_activity && input.contact.recent_activity.length > 0) {
      prompt += `- Recent Activity: ${input.contact.recent_activity.join('; ')}\n`;
    }

    if (input.contact.genre_focus && input.contact.genre_focus.length > 0) {
      prompt += `- Genre Focus: ${input.contact.genre_focus.join(', ')}\n`;
    }

    if (input.contact.submission_preferences) {
      prompt += `- Submission Preferences: ${input.contact.submission_preferences}\n`;
    }

    // Additional context
    if (input.context) {
      prompt += `\nADDITIONAL CONTEXT:\n${input.context}\n`;
    }

    // Output format
    if (input.constraints?.mode === 'subject_only') {
      prompt += `\nGenerate 3 subject line options. Return JSON:\n`;
      prompt += `{
  "drafts": [
    {
      "subject": "5-8 word subject line",
      "rationale": "why this angle works",
      "angle": "story|data|emotion|industry"
    }
  ],
  "warnings": ["any concerns"]
}`;
    } else {
      prompt += `\nGenerate 3 complete pitch emails with different angles. Return JSON:\n`;
      prompt += `{
  "drafts": [
    {
      "subject": "Email subject (5-8 words, specific not generic)",
      "body": "Email body (max ${input.constraints?.max_length || 150} words, personalised, authentic)",
      "rationale": "Why this angle works for this contact",
      "angle": "story|data|emotion|industry"
    }
  ],
  "warnings": ["any concerns or suggestions"]
}`;
    }

    return prompt;
  }

  /**
   * Determine audience type from contact info
   */
  private static getAudienceType(contact: PitchDraftInput['contact']): any {
    if (contact.outlet?.toLowerCase().includes('radio')) {
      return 'radio_promoters';
    }
    if (contact.role?.toLowerCase().includes('pr')) {
      return 'pr_agencies';
    }
    if (contact.outlet?.toLowerCase().includes('blog')) {
      return 'industry_contacts';
    }
    return 'general';
  }

  /**
   * Generate single pitch (convenience method)
   */
  static async generateSingle(
    input: PitchDraftInput,
    context: SkillContext
  ): Promise<{ subject: string; body: string; confidence: number }> {
    const result = await this.execute(input, context);

    // Return the highest confidence draft
    const bestDraft = result.drafts.reduce((best, current) =>
      current.voice_compliance > best.voice_compliance ? current : best
    );

    return {
      subject: bestDraft.subject,
      body: bestDraft.body,
      confidence: bestDraft.voice_compliance,
    };
  }

  /**
   * Generate subject lines only (for quick testing)
   */
  static async generateSubjects(
    input: Omit<PitchDraftInput, 'constraints'>,
    context: SkillContext
  ): Promise<string[]> {
    const result = await this.execute(
      {
        ...input,
        constraints: { mode: 'subject_only' },
      },
      context
    );

    return result.drafts.map((d) => d.subject);
  }
}
