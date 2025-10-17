/**
 * Contact Matcher Skill - AI-Powered Contact Recommendations
 * Total Audio Platform - Audio Intel Integration
 *
 * Matches tracks with relevant contacts using Claude's analysis capabilities.
 * Provides explainable recommendations for better targeting.
 */

import { SkillContext } from '../SkillEngine';

export interface ContactMatcherInput {
  track: {
    title: string;
    artist: string;
    genre: string;
    subgenres?: string[];
    description?: string;
    mood?: string[];
    influences?: string[];
    key_facts?: string[];
  };
  artistProfile?: {
    bio?: string;
    previous_coverage?: string[];
    target_audience?: string;
    similar_artists?: string[];
  };
  contacts: Array<{
    id: string;
    name: string;
    role?: string;
    outlet?: string;
    genre_focus?: string[];
    recent_activity?: string[];
    submission_preferences?: string;
  }>;
  limit?: number;
  minScore?: number;
}

export interface ContactMatcherOutput {
  matches: Array<{
    contactId: string;
    contactName: string;
    score: number;
    why: string;
    angle: string;
    confidence: 'high' | 'medium' | 'low';
    personalisation_hooks: string[];
  }>;
  unmatchedCount: number;
  analysis: {
    totalContacts: number;
    matchedContacts: number;
    averageScore: number;
    topGenres: string[];
  };
}

export class ContactMatcherSkill {
  /**
   * Execute contact matching analysis
   */
  static async execute(
    input: ContactMatcherInput,
    context: SkillContext
  ): Promise<ContactMatcherOutput> {
    if (!context.tools.llm) {
      throw new Error('LLM client required for contact matching');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(input);

    try {
      const message = await context.tools.llm.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 3000,
        temperature: 0.3, // Lower temperature for more consistent scoring
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

      // Filter by minimum score if specified
      const minScore = input.minScore || 0.6;
      let matches = response.matches.filter((m: any) => m.score >= minScore);

      // Sort by score and limit results
      matches = matches
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, input.limit || 10);

      // Calculate analysis stats
      const totalContacts = input.contacts.length;
      const matchedContacts = matches.length;
      const averageScore =
        matches.reduce((sum: number, m: any) => sum + m.score, 0) / matchedContacts || 0;

      // Extract top genres from matched contacts
      const genreCounts: Record<string, number> = {};
      matches.forEach((match: any) => {
        const contact = input.contacts.find((c) => c.id === match.contactId);
        contact?.genre_focus?.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      return {
        matches,
        unmatchedCount: totalContacts - matchedContacts,
        analysis: {
          totalContacts,
          matchedContacts,
          averageScore: Math.round(averageScore * 100) / 100,
          topGenres,
        },
      };
    } catch (error) {
      throw new Error(`Contact matching failed: ${error.message}`);
    }
  }

  /**
   * Build system prompt for contact matching
   */
  private static buildSystemPrompt(): string {
    return `You are an expert music industry contact matcher with deep knowledge of UK radio, playlist curators, music bloggers, and PR contacts.

YOUR MISSION:
Analyze a track and recommend the most relevant contacts for promotion. Your recommendations directly impact campaign success, so be thoughtful and accurate.

MATCHING CRITERIA:
1. **Genre Alignment** (40%): Does contact cover this genre?
2. **Recent Activity** (30%): Has contact recently featured similar music?
3. **Outlet Reach** (15%): Is this the right level/size for the artist?
4. **Submission Fit** (15%): Does track match their submission preferences?

SCORING GUIDE:
- 0.9-1.0: Perfect match - genre fit, recent similar coverage, clear personalisation angle
- 0.7-0.89: Strong match - good genre fit, likely interested
- 0.6-0.69: Decent match - worth trying, needs good personalisation
- Below 0.6: Weak match - only if desperate or can find unique angle

CRITICAL RULES:
- NEVER recommend contacts outside their genre focus
- NEVER ignore submission preferences (e.g., BBC Introducing link required)
- ALWAYS provide specific personalisation hooks (recent playlists, shows, articles)
- ALWAYS explain your reasoning clearly

For each match, identify:
- Why this contact is a good fit
- What angle to use in the pitch
- Specific personalisation hooks from their recent activity`;
  }

  /**
   * Build user prompt with track and contacts
   */
  private static buildUserPrompt(input: ContactMatcherInput): string {
    let prompt = `Match this track with the best contacts:\n\n`;

    // Track information
    prompt += `TRACK DETAILS:\n`;
    prompt += `- Title: "${input.track.title}"\n`;
    prompt += `- Artist: ${input.track.artist}\n`;
    prompt += `- Genre: ${input.track.genre}\n`;

    if (input.track.subgenres && input.track.subgenres.length > 0) {
      prompt += `- Subgenres: ${input.track.subgenres.join(', ')}\n`;
    }

    if (input.track.description) {
      prompt += `- Description: ${input.track.description}\n`;
    }

    if (input.track.mood && input.track.mood.length > 0) {
      prompt += `- Mood: ${input.track.mood.join(', ')}\n`;
    }

    if (input.track.influences && input.track.influences.length > 0) {
      prompt += `- Influences: ${input.track.influences.join(', ')}\n`;
    }

    if (input.track.key_facts && input.track.key_facts.length > 0) {
      prompt += `- Key Facts: ${input.track.key_facts.join('; ')}\n`;
    }

    // Artist profile
    if (input.artistProfile) {
      prompt += `\nARTIST PROFILE:\n`;
      if (input.artistProfile.bio) {
        prompt += `- Bio: ${input.artistProfile.bio}\n`;
      }
      if (input.artistProfile.previous_coverage && input.artistProfile.previous_coverage.length > 0) {
        prompt += `- Previous Coverage: ${input.artistProfile.previous_coverage.join('; ')}\n`;
      }
      if (input.artistProfile.target_audience) {
        prompt += `- Target Audience: ${input.artistProfile.target_audience}\n`;
      }
      if (input.artistProfile.similar_artists && input.artistProfile.similar_artists.length > 0) {
        prompt += `- Similar Artists: ${input.artistProfile.similar_artists.join(', ')}\n`;
      }
    }

    // Contacts list
    prompt += `\nAVAILABLE CONTACTS (${input.contacts.length}):\n`;
    input.contacts.forEach((contact, index) => {
      prompt += `\n${index + 1}. ${contact.name}`;
      if (contact.role && contact.outlet) {
        prompt += ` - ${contact.role} at ${contact.outlet}`;
      } else if (contact.outlet) {
        prompt += ` - ${contact.outlet}`;
      }
      prompt += ` (ID: ${contact.id})\n`;

      if (contact.genre_focus && contact.genre_focus.length > 0) {
        prompt += `   Genre Focus: ${contact.genre_focus.join(', ')}\n`;
      }

      if (contact.recent_activity && contact.recent_activity.length > 0) {
        prompt += `   Recent: ${contact.recent_activity.slice(0, 2).join('; ')}\n`;
      }

      if (contact.submission_preferences) {
        prompt += `   Submission: ${contact.submission_preferences}\n`;
      }
    });

    // Output format
    prompt += `\n\nAnalyze each contact and return the top ${input.limit || 10} matches as JSON:\n`;
    prompt += `{
  "matches": [
    {
      "contactId": "contact ID from list above",
      "contactName": "contact name",
      "score": 0.0-1.0,
      "why": "Clear explanation of why this is a good match",
      "angle": "Best pitch angle to use (e.g., 'BBC Introducing graduate', 'ambient showcase fit')",
      "confidence": "high|medium|low",
      "personalisation_hooks": [
        "Specific recent playlist/show/article to reference",
        "Another personalisation point"
      ]
    }
  ]
}`;

    return prompt;
  }

  /**
   * Quick match - get top contact only
   */
  static async getTopMatch(
    input: Omit<ContactMatcherInput, 'limit'>,
    context: SkillContext
  ): Promise<ContactMatcherOutput['matches'][0] | null> {
    const result = await this.execute(
      {
        ...input,
        limit: 1,
      },
      context
    );

    return result.matches[0] || null;
  }

  /**
   * Batch match - process multiple tracks
   */
  static async batchMatch(
    tracks: ContactMatcherInput['track'][],
    contacts: ContactMatcherInput['contacts'],
    context: SkillContext
  ): Promise<
    Array<{
      track: ContactMatcherInput['track'];
      matches: ContactMatcherOutput['matches'];
    }>
  > {
    const results = await Promise.all(
      tracks.map(async (track) => {
        const result = await this.execute(
          {
            track,
            contacts,
            limit: 5,
          },
          context
        );

        return {
          track,
          matches: result.matches,
        };
      })
    );

    return results;
  }
}
