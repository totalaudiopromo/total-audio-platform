/**
 * Voice Guard Skill - Brand Voice Enforcement
 * Total Audio Platform
 *
 * Ensures all content matches Total Audio's authentic UK music industry voice.
 * Catches corporate speak, US spelling, and tone inconsistencies.
 */

import { SkillContext } from '../SkillEngine';

export interface VoiceGuardInput {
  text: string;
  brandVoiceId?: string;
  contentType: 'email_pitch' | 'newsletter' | 'website_copy' | 'social_media' | 'documentation';
  targetAudience:
    | 'radio_promoters'
    | 'independent_artists'
    | 'pr_agencies'
    | 'industry_contacts'
    | 'general';
}

export interface VoiceGuardOutput {
  text: string;
  changes: Array<{
    from: string;
    to: string;
    reason: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  compliance_score: number;
  warnings: string[];
  suggestions: string[];
}

/**
 * Voice Guard rules - UK music industry authenticity
 */
const VOICE_RULES = {
  // UK vs US spelling corrections
  spelling: [
    { us: 'organize', uk: 'organise' },
    { us: 'organized', uk: 'organised' },
    { us: 'organizing', uk: 'organising' },
    { us: 'organization', uk: 'organisation' },
    { us: 'realize', uk: 'realise' },
    { us: 'realized', uk: 'realised' },
    { us: 'color', uk: 'colour' },
    { us: 'favor', uk: 'favour' },
    { us: 'analyze', uk: 'analyse' },
    { us: 'analyzed', uk: 'analysed' },
    { us: 'catalog', uk: 'catalogue' },
  ],

  // Forbidden corporate speak
  forbidden: [
    { word: 'leverage', reason: 'Corporate jargon - use "use" or specific action' },
    { word: 'solution', reason: 'Corporate speak - be specific about what it does' },
    { word: 'ecosystem', reason: 'Buzzword - use "platform" or specific term' },
    { word: 'synergy', reason: 'Corporate jargon - be direct' },
    { word: 'revolutionary', reason: 'Marketing hype - let results speak' },
    { word: 'game-changing', reason: 'Marketing hype - be authentic' },
    { word: 'innovative', reason: "Overused buzzword - show, don't tell" },
    { word: 'cutting-edge', reason: 'Marketing speak - be specific' },
    { word: 'best-in-class', reason: 'Generic claim - prove with specifics' },
    { word: 'world-class', reason: 'Meaningless superlative' },
  ],

  // Authentic UK music industry phrases to encourage
  authentic: [
    'if you get a sec',
    'right, so',
    'tbh',
    'BBC Radio 1',
    '5+ years',
    'radio promotion',
    'contact research',
    'spreadsheet chaos',
  ],
};

export class VoiceGuardSkill {
  /**
   * Execute voice guard analysis and corrections
   */
  static async execute(input: VoiceGuardInput, context: SkillContext): Promise<VoiceGuardOutput> {
    let text = input.text;
    const changes: VoiceGuardOutput['changes'] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 1. Check UK spelling
    for (const { us, uk } of VOICE_RULES.spelling) {
      const regex = new RegExp(`\\b${us}\\b`, 'gi');
      if (regex.test(text)) {
        const matches = text.match(regex);
        if (matches) {
          text = text.replace(regex, uk);
          changes.push({
            from: matches[0],
            to: uk,
            reason: `UK spelling required (not US spelling)`,
            severity: 'critical',
          });
        }
      }
    }

    // 2. Check for forbidden corporate speak
    for (const { word, reason } of VOICE_RULES.forbidden) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(text)) {
        warnings.push(`Found corporate speak: "${word}" - ${reason}`);
      }
    }

    // 3. Check for authentic voice markers
    const authenticityScore = VOICE_RULES.authentic.filter(phrase =>
      text.toLowerCase().includes(phrase.toLowerCase())
    ).length;

    if (authenticityScore === 0 && input.contentType !== 'documentation') {
      suggestions.push(
        'Consider adding authentic industry context (e.g., reference BBC Radio 1 experience, real time savings)'
      );
    }

    // 4. Check capitalisation (avoid forced lowercase)
    const sentenceStartRegex = /^\w|[.!?]\s+\w/g;
    const properNouns = ['audio intel', 'total audio', 'bbc', 'spotify'];

    for (const noun of properNouns) {
      const regex = new RegExp(`\\b${noun}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matches.forEach(match => {
          if (match !== match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
            warnings.push(`Check capitalisation of "${match}" - should be proper case`);
          }
        });
      }
    }

    // 5. Content-specific checks
    if (input.contentType === 'email_pitch') {
      // Email pitch should be concise
      const wordCount = text.split(/\s+/).length;
      if (wordCount > 150) {
        warnings.push(
          `Email pitch is ${wordCount} words - optimal length is under 150 words for better response rates`
        );
      }

      // Should have personalisation
      if (!text.toLowerCase().includes('you') && !text.toLowerCase().includes('your')) {
        suggestions.push("Add personalisation - reference the recipient's work or interests");
      }
    }

    // 6. Audience-specific checks
    if (input.targetAudience === 'radio_promoters') {
      // Should reference industry experience
      const hasCredibility =
        text.toLowerCase().includes('radio') ||
        text.toLowerCase().includes('bbc') ||
        text.toLowerCase().includes('promotion');

      if (!hasCredibility) {
        suggestions.push('Add industry credibility - reference radio promotion experience');
      }
    }

    // Calculate compliance score
    const criticalIssues = changes.filter(c => c.severity === 'critical').length;
    const highIssues = warnings.length;
    const complianceScore = Math.max(0, 1 - criticalIssues * 0.2 - highIssues * 0.1);

    return {
      text,
      changes,
      compliance_score: Math.round(complianceScore * 100) / 100,
      warnings,
      suggestions,
    };
  }

  /**
   * Quick validation - returns true if text passes voice guard
   */
  static async validate(
    text: string,
    contentType: VoiceGuardInput['contentType'] = 'email_pitch'
  ): Promise<boolean> {
    const result = await this.execute(
      {
        text,
        contentType,
        targetAudience: 'general',
      },
      {} as SkillContext
    );

    return result.compliance_score >= 0.8 && result.changes.length === 0;
  }

  /**
   * Apply corrections automatically
   */
  static async correct(
    text: string,
    contentType: VoiceGuardInput['contentType'] = 'email_pitch'
  ): Promise<string> {
    const result = await this.execute(
      {
        text,
        contentType,
        targetAudience: 'general',
      },
      {} as SkillContext
    );

    return result.text;
  }
}
