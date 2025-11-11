/**
 * Contact Enrichment Prompts for Claude Sonnet 4.5
 *
 * Engineered prompts for high-quality music industry contact intelligence
 */

export interface EnrichmentContext {
  genre?: string;
  region?: string;
  campaignType?: 'radio' | 'press' | 'playlist' | 'all';
  webSearchResults?: string; // Google search results for unknown contacts
}

export function buildContactEnrichmentPrompt(
  name: string,
  email: string,
  context?: EnrichmentContext
): string {
  const genreContext = context?.genre ? `\nGenre Context: ${context.genre}` : '';
  const regionContext = context?.region ? `\nRegion: ${context.region}` : '';
  const campaignContext = context?.campaignType ? `\nCampaign Type: ${context.campaignType}` : '';
  const webSearchContext = context?.webSearchResults
    ? `\n\nWeb Search Results:\n${context.webSearchResults}\n\nUse the above search results to extract accurate information about this contact.`
    : '';

  return `You are an expert music industry contact intelligence analyst with deep knowledge of radio promotion, press, and playlist curation. Analyse this contact and provide detailed, actionable intelligence for music promotion campaigns.

Contact Information:
- Name: ${name}
- Email: ${email}${genreContext}${regionContext}${campaignContext}${webSearchContext}

Your task:
1. Identify the station/platform/publication from the email domain
2. Determine their format, focus, and accepted genres
3. Assess coverage area (local/regional/national/global)
4. Recommend best contact method and timing
5. Extract submission preferences and guidelines
6. Provide specific pitch tips based on their known preferences
7. Assign confidence score based on data availability and certainty

Return ONLY a valid JSON object with this exact structure (no markdown, no additional text):
{
  "platform": "Station/Platform/Publication name",
  "role": "Contact's role or title",
  "format": "Music format, focus, or editorial style",
  "coverage": "Geographic coverage area",
  "genres": ["primary", "accepted", "genres"],
  "contactMethod": "Preferred contact method (email/form/social/phone)",
  "bestTiming": "Optimal contact days/times or lead time",
  "submissionGuidelines": "How they prefer to receive submissions",
  "pitchTips": ["specific", "actionable", "tips", "based on their preferences"],
  "confidence": "High|Medium|Low",
  "reasoning": "Brief explanation of confidence level"
}

Guidelines:
- Be specific and practical, not generic
- Focus on actionable intelligence for music promotion
- If information is uncertain, reflect that in confidence score
- For BBC contacts, include show name and transmission times
- For Spotify contacts, include playlist names and submission lead times
- For press contacts, include publication focus and editorial calendar
- Pitch tips should be tailored to this specific contact, not generic advice
- If the contact is not in music industry, still provide structured data but with Low confidence

Confidence scoring:
- High: Verified platform, clear role, known preferences, actionable guidelines
- Medium: Recognised platform, inferred role or preferences, general guidelines
- Low: Unknown platform or limited verifiable information

Return only the JSON object.`;
}

export function buildBatchEnrichmentPrompt(
  contacts: Array<{ name: string; email: string }>,
  context?: EnrichmentContext
): string {
  const contactsList = contacts.map((c, i) => `${i + 1}. ${c.name} (${c.email})`).join('\n');

  const genreContext = context?.genre ? `\nGenre Context: ${context.genre}` : '';
  const regionContext = context?.region ? `\nRegion: ${context.region}` : '';

  return `You are an expert music industry contact intelligence analyst. Analyse these ${contacts.length} contacts and provide detailed intelligence for each.
${genreContext}${regionContext}

Contacts:
${contactsList}

For each contact, provide structured JSON with platform, role, format, coverage, genres, contactMethod, bestTiming, submissionGuidelines, pitchTips array, confidence, and reasoning.

Return ONLY a valid JSON array (no markdown, no additional text):
[
  {
    "email": "contact1@example.com",
    "platform": "...",
    "role": "...",
    "format": "...",
    "coverage": "...",
    "genres": ["..."],
    "contactMethod": "...",
    "bestTiming": "...",
    "submissionGuidelines": "...",
    "pitchTips": ["..."],
    "confidence": "High|Medium|Low",
    "reasoning": "..."
  }
]

Guidelines:
- Be specific and actionable for music promotion
- Tailor insights to each contact individually
- Include BBC show names/times, Spotify playlist details, press publication focus
- Confidence: High = verified data, Medium = inferred data, Low = limited data`;
}

/**
 * Fallback enrichment data for when API is unavailable
 */
export function generateFallbackEnrichment(email: string, name: string): any {
  const domain = email.split('@')[1]?.toLowerCase() || '';

  // BBC contacts
  if (domain.includes('bbc.co.uk')) {
    return {
      platform: 'BBC',
      role: 'Radio Producer',
      format: 'National radio broadcasting',
      coverage: 'UK National',
      genres: ['Various'],
      contactMethod: 'Email via BBC Music Introducing',
      bestTiming: 'Weekdays 10am-4pm',
      submissionGuidelines: 'Submit via official BBC Music Introducing platform',
      pitchTips: [
        'Reference specific BBC shows in your pitch',
        'Include streaming numbers if available',
        'Mention any existing BBC airplay',
      ],
      confidence: 'Medium',
      reasoning: 'BBC domain identified, generic BBC contact intelligence applied',
    };
  }

  // Spotify contacts
  if (domain.includes('spotify.com')) {
    return {
      platform: 'Spotify',
      role: 'Playlist Curator',
      format: 'Streaming playlist curation',
      coverage: 'Global',
      genres: ['Electronic', 'House', 'Dance'],
      contactMethod: 'Email or Spotify for Artists',
      bestTiming: '4-6 weeks before release',
      submissionGuidelines: 'Use Spotify for Artists submission tool preferred',
      pitchTips: [
        'Submit at least 1 week before release date',
        'Include artist story and track context',
        'Mention similar artists on their playlists',
      ],
      confidence: 'Medium',
      reasoning: 'Spotify domain identified, generic curator intelligence applied',
    };
  }

  // Generic music industry contact
  return {
    platform: domain || 'Unknown',
    role: 'Industry Contact',
    format: 'Music industry professional',
    coverage: 'Unknown',
    genres: ['Various'],
    contactMethod: 'Email',
    bestTiming: 'Weekdays during business hours',
    submissionGuidelines: 'Professional email with links to music',
    pitchTips: [
      'Personalise your pitch to their specific role',
      'Keep initial outreach concise',
      'Include relevant streaming/social proof',
    ],
    confidence: 'Low',
    reasoning: 'Limited information available, generic music industry guidance provided',
  };
}
