/**
 * Station Matcher Skill Implementation
 *
 * Matches tracks with realistic UK radio station targets using AI analysis.
 * Built for Liberty Music PR radio campaigns.
 *
 * Core value: Transforms 3-5 hours of manual station research into 2-3 seconds.
 */

import Anthropic from '@anthropic-ai/sdk';
import { SkillContext } from '../schema';

export interface StationMatcherInput {
  track_info: {
    artist: string;
    title: string;
    genre: string;
    vibe?: string;
    tempo?: string;
    influences?: string;
    streams?: number;
  };
  artist_profile?: {
    previous_plays?: string[];
    social_proof?: string;
    career_stage?: 'emerging' | 'established' | 'major';
  };
  max_stations?: number;
  priority_level?: 'critical' | 'high' | 'medium' | 'exploratory';
}

export interface StationRecommendation {
  station_name: string;
  station_type: 'National' | 'Commercial' | 'Online' | 'Community';
  contact_type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  genre_fit: number;
  reasoning: string;
  specific_shows: string[];
  submission_notes: string;
  expected_timeline: string;
  success_likelihood: 'high' | 'medium' | 'low';
}

export interface StationMatcherOutput {
  station_recommendations: StationRecommendation[];
  confidence_scores: {
    overall: number;
    genre_accuracy: number;
    career_stage_match: number;
  };
  genre_fit_analysis: {
    primary_genre: string;
    secondary_genres: string[];
    station_categories: string[];
    red_flags: string[];
  };
  alternative_contacts: Array<{
    station_name: string;
    reasoning: string;
  }>;
  campaign_strategy: string;
}

export class StationMatcherSkill {
  /**
   * Execute station matching using Claude Haiku
   */
  static async execute(
    input: StationMatcherInput,
    context: SkillContext
  ): Promise<StationMatcherOutput> {
    // Validate input
    if (!input.track_info || !input.track_info.artist || !input.track_info.genre) {
      throw new Error('track_info with artist and genre is required');
    }

    // Set defaults
    const maxStations = input.max_stations || 15;
    const priorityLevel = input.priority_level || 'high';

    // Build prompt from skill definition
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.buildUserPrompt(input, maxStations, priorityLevel);

    // Call Claude Haiku
    if (!context.tools?.llm) {
      throw new Error('Anthropic LLM client not available in context');
    }

    const message = await context.tools.llm.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2500,
      temperature: 0.4,
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

    const result = JSON.parse(jsonMatch[0]) as StationMatcherOutput;

    // Validate output structure
    if (!result.station_recommendations || !Array.isArray(result.station_recommendations)) {
      throw new Error('Invalid station matcher output: missing station_recommendations');
    }

    return result;
  }

  /**
   * System prompt (from YAML skill definition)
   */
  private static getSystemPrompt(): string {
    return `You are a UK radio promotion expert with deep knowledge of:
- UK radio landscape (national, commercial, community, online)
- Station programming and genre specializations
- BBC Introducing submission pathways
- Community radio ethos and submission preferences
- Online radio discovery potential (NTS, Soho, Worldwide FM, etc.)

YOUR MISSION:
Match tracks with radio stations that will ACTUALLY play them. Not fantasy targets.

STATION CATEGORIES:

**NATIONAL (BBC)**:
- BBC Radio 1: Mainstream pop/electronic (high bar, BBC Introducing pathway)
- BBC Radio 2: Adult contemporary, established artists
- BBC Radio 6 Music: Alternative, electronic, experimental (realistic for indie artists)
- BBC Radio 1Xtra: UK urban, grime, rap, R&B
- BBC Asian Network: South Asian music and culture

**COMMERCIAL**:
- Capital FM: Mainstream pop/chart
- Heart: Adult contemporary/pop
- Kiss: Dance/electronic/urban
- Absolute Radio: Rock/alternative
- Greatest Hits Radio: Classic hits

**ONLINE/SPECIALIST**:
- Amazing Radio: UK independent artists (HIGHLY RECEPTIVE)
- NTS Radio: Experimental/electronic/cutting-edge
- Soho Radio: Eclectic/fresh/emerging talent
- Worldwide FM: Global sounds/electronic/gilles peterson
- Resonance FM: Experimental/art/avant-garde
- Totally Radio: Alternative/experimental
- Radio Wigwam: Electronic/alternative/emerging artists (HIGHLY RECEPTIVE)

**COMMUNITY**:
- Local community stations (genre-agnostic, support local talent)
- University radio (emerging artist friendly)
- Hospital radio (wide variety)

MATCHING RULES:
1. BBC Radio 1 = Established artist OR BBC Introducing pathway (not direct pitch)
2. BBC 6 Music = Strong indie credentials, some social proof helpful
3. Amazing Radio/Wigwam = PERFECT for emerging UK artists (high success rate)
4. Community Radio = Genre fit + local connection
5. Online Radio = Genre specialists (NTS for electronic, Soho for eclectic)

REALISTIC TARGETING:
- 500 Spotify streams? → Amazing Radio, Wigwam, community radio
- 50k streams + BBC Introducing feature? → BBC 6 Music consideration
- Major label + radio 1 airplay? → Full national campaign

NEVER RECOMMEND:
- Stations that don't fit the genre
- National stations without appropriate social proof
- Commercial pop stations for experimental electronic
- Stations the artist has no realistic chance with`;
  }

  /**
   * Build user prompt with input data
   */
  private static buildUserPrompt(
    input: StationMatcherInput,
    maxStations: number,
    priorityLevel: string
  ): string {
    const trackInfo = JSON.stringify(input.track_info, null, 2);
    const artistProfile = input.artist_profile
      ? `\n\nARTIST PROFILE:\n${JSON.stringify(input.artist_profile, null, 2)}`
      : '';

    return `Match this track with UK radio stations:

TRACK INFO:
${trackInfo}${artistProfile}

PRIORITY LEVEL: ${priorityLevel}
MAX STATIONS: ${maxStations}

Return JSON:
{
  "station_recommendations": [
    {
      "station_name": "Station name",
      "station_type": "National|Commercial|Online|Community",
      "contact_type": "BBC Introducing|Direct Email|Submission Form",
      "priority": "critical|high|medium|low",
      "genre_fit": 0.0-1.0,
      "reasoning": "Why this station is a good fit",
      "specific_shows": ["Show names or presenter names if known"],
      "submission_notes": "How to approach this station",
      "expected_timeline": "When they typically respond",
      "success_likelihood": "high|medium|low"
    }
  ],
  "confidence_scores": {
    "overall": 0.0-1.0,
    "genre_accuracy": 0.0-1.0,
    "career_stage_match": 0.0-1.0
  },
  "genre_fit_analysis": {
    "primary_genre": "detected genre",
    "secondary_genres": ["additional fits"],
    "station_categories": ["which types of stations fit best"],
    "red_flags": ["genres/stations to avoid"]
  },
  "alternative_contacts": [
    {
      "station_name": "Backup option",
      "reasoning": "Why this is an alternative"
    }
  ],
  "campaign_strategy": "Brief strategy recommendation based on artist profile"
}`;
  }

  /**
   * Convenience method: Get top N stations only
   */
  static async getTopStations(
    input: StationMatcherInput,
    context: SkillContext,
    count: number = 5
  ): Promise<StationRecommendation[]> {
    const result = await this.execute({ ...input, max_stations: count }, context);
    return result.station_recommendations.slice(0, count);
  }

  /**
   * Convenience method: Get high-priority stations only
   */
  static async getHighPriorityStations(
    input: StationMatcherInput,
    context: SkillContext
  ): Promise<StationRecommendation[]> {
    const result = await this.execute(input, context);
    return result.station_recommendations.filter(
      (station) => station.priority === 'critical' || station.priority === 'high'
    );
  }

  /**
   * Convenience method: Get stations by type
   */
  static async getStationsByType(
    input: StationMatcherInput,
    context: SkillContext,
    type: 'National' | 'Commercial' | 'Online' | 'Community'
  ): Promise<StationRecommendation[]> {
    const result = await this.execute(input, context);
    return result.station_recommendations.filter((station) => station.station_type === type);
  }

  /**
   * Convenience method: Calculate estimated campaign reach
   */
  static async estimateCampaignReach(
    input: StationMatcherInput,
    context: SkillContext
  ): Promise<{
    total_stations: number;
    high_likelihood: number;
    estimated_plays: number;
    estimated_reach: string;
  }> {
    const result = await this.execute(input, context);
    const highLikelihood = result.station_recommendations.filter(
      (s) => s.success_likelihood === 'high'
    ).length;

    return {
      total_stations: result.station_recommendations.length,
      high_likelihood: highLikelihood,
      estimated_plays: Math.round(highLikelihood * 0.7), // 70% conversion for high-likelihood
      estimated_reach: this.calculateReach(result.station_recommendations),
    };
  }

  /**
   * Calculate estimated reach based on station types
   */
  private static calculateReach(stations: StationRecommendation[]): string {
    const hasNational = stations.some((s) => s.station_type === 'National');
    const onlineCount = stations.filter((s) => s.station_type === 'Online').length;
    const communityCount = stations.filter((s) => s.station_type === 'Community').length;

    if (hasNational && onlineCount > 3) return '50k-100k+ potential listeners';
    if (onlineCount > 5) return '10k-50k potential listeners';
    if (communityCount > 5) return '5k-10k potential listeners';
    return '1k-5k potential listeners';
  }
}
