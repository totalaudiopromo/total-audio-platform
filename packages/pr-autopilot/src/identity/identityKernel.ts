/**
 * Identity Kernel Integration
 *
 * Integrates with Total Audio Identity Kernel for brand voice consistency
 */

export interface BrandVoice {
  tone: string[];
  vocabulary: string[];
  avoidWords: string[];
  messagePatterns: string[];
  authenticity: {
    mustInclude: string[];
    neverSay: string[];
  };
}

export interface IdentityProfile {
  artistName: string;
  genre: string[];
  careerStage: 'emerging' | 'established' | 'mainstream';
  brandVoice: BrandVoice;
  values: string[];
  storyAngles: string[];
}

export interface VoiceGuardResult {
  compliant: boolean;
  violations: string[];
  suggestions: string[];
  authenticityScore: number; // 0-1
}

/**
 * Default brand voice for Total Audio
 */
export const DEFAULT_BRAND_VOICE: BrandVoice = {
  tone: ['authentic', 'professional', 'music-industry-insider', 'British-casual'],
  vocabulary: ['campaign', 'outreach', 'radio promotion', 'PR', 'music industry'],
  avoidWords: ['viral', 'influencer', 'algorithm hack', 'guarantee', 'overnight success'],
  messagePatterns: [
    'Real results, real relationships',
    'Industry expertise meets technology',
    'Built by promoters, for promoters',
  ],
  authenticity: {
    mustInclude: ['honest', 'realistic', 'proven'],
    neverSay: ['guaranteed placement', 'instant fame', 'secret formula'],
  },
};

/**
 * VoiceGuard: Check if message matches brand voice
 */
export function checkBrandVoice(
  message: string,
  brandVoice: BrandVoice = DEFAULT_BRAND_VOICE
): VoiceGuardResult {
  const violations: string[] = [];
  const suggestions: string[] = [];

  const lowerMessage = message.toLowerCase();

  // Check for avoided words
  brandVoice.avoidWords.forEach((word) => {
    if (lowerMessage.includes(word.toLowerCase())) {
      violations.push(`Contains avoided word: "${word}"`);
      suggestions.push(`Remove or replace "${word}" with more authentic language`);
    }
  });

  // Check for forbidden phrases
  brandVoice.authenticity.neverSay.forEach((phrase) => {
    if (lowerMessage.includes(phrase.toLowerCase())) {
      violations.push(`Contains forbidden phrase: "${phrase}"`);
      suggestions.push(`Never make claims like "${phrase}" - be realistic`);
    }
  });

  // Check for required authenticity markers (at least one should be present)
  const hasAuthenticityMarker = brandVoice.authenticity.mustInclude.some((word) =>
    lowerMessage.includes(word.toLowerCase())
  );

  if (!hasAuthenticityMarker) {
    suggestions.push(
      `Consider including authenticity markers: ${brandVoice.authenticity.mustInclude.join(', ')}`
    );
  }

  // Calculate authenticity score
  let authenticityScore = 1.0;

  // Penalize for violations
  authenticityScore -= violations.length * 0.2;

  // Bonus for using preferred vocabulary
  const vocabularyMatches = brandVoice.vocabulary.filter((word) =>
    lowerMessage.includes(word.toLowerCase())
  ).length;
  authenticityScore += Math.min(0.2, vocabularyMatches * 0.05);

  // Bonus for authenticity markers
  if (hasAuthenticityMarker) {
    authenticityScore += 0.1;
  }

  authenticityScore = Math.max(0, Math.min(1, authenticityScore));

  return {
    compliant: violations.length === 0,
    violations,
    suggestions,
    authenticityScore,
  };
}

/**
 * Enforce brand voice on message
 */
export function enforceBrandVoice(
  message: string,
  brandVoice: BrandVoice = DEFAULT_BRAND_VOICE
): { revised: string; changes: string[] } {
  let revised = message;
  const changes: string[] = [];

  // Remove avoided words (simple replacement)
  brandVoice.avoidWords.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(revised)) {
      revised = revised.replace(regex, '[removed]');
      changes.push(`Removed avoided word: "${word}"`);
    }
  });

  // Remove forbidden phrases
  brandVoice.authenticity.neverSay.forEach((phrase) => {
    const regex = new RegExp(phrase, 'gi');
    if (regex.test(revised)) {
      revised = revised.replace(regex, '[removed claim]');
      changes.push(`Removed forbidden phrase: "${phrase}"`);
    }
  });

  return { revised, changes };
}

/**
 * Get identity profile from artist metadata
 */
export function buildIdentityProfile(artistMeta: {
  name: string;
  genre?: string[];
  careerStage?: string;
  values?: string[];
  storyAngles?: string[];
}): IdentityProfile {
  return {
    artistName: artistMeta.name,
    genre: artistMeta.genre || ['indie'],
    careerStage: (artistMeta.careerStage as IdentityProfile['careerStage']) || 'emerging',
    brandVoice: DEFAULT_BRAND_VOICE,
    values: artistMeta.values || ['authenticity', 'quality', 'community'],
    storyAngles: artistMeta.storyAngles || ['independent artist journey', 'creative process'],
  };
}

/**
 * Recommend story angles based on identity profile
 */
export function recommendStoryAngles(profile: IdentityProfile): string[] {
  const recommendations: string[] = [];

  // Career stage-specific angles
  if (profile.careerStage === 'emerging') {
    recommendations.push(
      'Underdog story: Breaking through as an independent artist',
      'DIY approach: How you\'re building a career without major label support',
      'Community connection: Building a grassroots following'
    );
  } else if (profile.careerStage === 'established') {
    recommendations.push(
      'Evolution: How your sound has matured over time',
      'Industry insights: What you\'ve learned navigating the music business',
      'Mentorship: Supporting the next generation of artists'
    );
  }

  // Genre-specific angles
  if (profile.genre.includes('electronic')) {
    recommendations.push('Technology meets creativity: Your production process');
  }

  if (profile.genre.includes('folk') || profile.genre.includes('acoustic')) {
    recommendations.push('Storytelling tradition: Crafting meaningful lyrics');
  }

  // Value-based angles
  if (profile.values.includes('sustainability')) {
    recommendations.push('Eco-conscious touring: Reducing your environmental impact');
  }

  return recommendations;
}

/**
 * Integration with CMG (Collective Memory Graph)
 */
export interface CMGIntegration {
  artistId: string;
  campaignHistory: Array<{
    campaignId: string;
    successMetrics: Record<string, number>;
    learnings: string[];
  }>;
  contactRelationships: Array<{
    contactId: string;
    relationshipStrength: number;
    lastInteraction: string;
    preferredApproach: string;
  }>;
}

/**
 * Fetch identity context from CMG
 */
export async function fetchIdentityContext(artistId: string): Promise<CMGIntegration> {
  // Placeholder - would integrate with actual CMG API
  return {
    artistId,
    campaignHistory: [],
    contactRelationships: [],
  };
}

/**
 * Apply identity-aware personalization to message
 */
export function personalizeWithIdentity(
  template: string,
  identityProfile: IdentityProfile,
  contactContext?: Record<string, unknown>
): string {
  let personalized = template;

  // Replace artist name
  personalized = personalized.replace(/\{artistName\}/g, identityProfile.artistName);

  // Replace genre
  personalized = personalized.replace(/\{genre\}/g, identityProfile.genre.join(', '));

  // Add story angle if template allows
  if (template.includes('{storyAngle}') && identityProfile.storyAngles.length > 0) {
    personalized = personalized.replace(/\{storyAngle\}/g, identityProfile.storyAngles[0]);
  }

  // Apply brand voice enforcement
  const { revised } = enforceBrandVoice(personalized, identityProfile.brandVoice);

  return revised;
}
