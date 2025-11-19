/**
 * VoiceGuard™ Type Definitions
 *
 * VoiceGuard is Total Audio's proprietary voice preservation technology
 * that ensures AI-generated pitches maintain authentic human voice patterns.
 */

export interface VoiceGuardProfile {
  voice_background: string;
  voice_style: string;
  voice_achievements: string;
  voice_approach: string;
  voice_differentiator: string;
  voice_typical_opener: string;
  voice_context_notes?: string;
}

export interface VoiceGuardAnalysis extends VoiceGuardProfile {
  metadata: {
    tone_preference: 'casual' | 'professional' | 'enthusiastic';
    formality_score: number; // 1-10 (1=very casual, 10=very formal)
    personality_traits: string[];
    strengths: string[];
    suggestions: string[];
  };
}

export interface VoiceGuardStatus {
  active: boolean;
  profileCompleted: boolean;
  lastAnalyzed?: Date;
}

/**
 * VoiceGuard™ Voice Preservation Metrics
 *
 * Tracks how well AI-generated content preserves the user's authentic voice
 */
export interface VoiceGuardMetrics {
  toneConsistencyScore: number; // 0-100 (how well tone matches profile)
  credibilityMarkerCount: number; // Number of credibility markers preserved
  personalityAlignment: number; // 0-100 (personality trait match)
  authenticityScore: number; // 0-100 (overall authenticity rating)
}

/**
 * VoiceGuard™ Configuration
 *
 * Settings for how VoiceGuard™ should preserve voice in generated content
 */
export interface VoiceGuardConfig {
  strictMode: boolean; // Enforce exact voice matching (vs flexible)
  allowedDeviation: number; // 0-1 (how much variation from profile is acceptable)
  prioritizeCredibility: boolean; // Weight credibility markers heavily
  enforceOpenerStyle: boolean; // Always use user's typical opener pattern
}
