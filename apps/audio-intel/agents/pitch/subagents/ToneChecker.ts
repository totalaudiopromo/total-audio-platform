/**
 * ToneChecker Sub-Agent
 * Validates pitch tone matches Total Audio's "honest maker" brand voice
 * Flags corporate speak, AI buzzwords, and inauthentic language
 */

import type { SubAgentResult } from '../../core/AgentTypes';

export interface ToneCheckPayload {
  text: string;
  strictMode?: boolean;
}

export interface ToneCheckResult {
  isValid: boolean;
  score: number;
  issues: Array<{
    type: 'banned_phrase' | 'corporate_speak' | 'ai_buzzword' | 'inauthentic';
    text: string;
    suggestion: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  recommendations: string[];
}

export class ToneChecker {
  // Banned corporate phrases
  private static BANNED_PHRASES = [
    'cutting-edge',
    'revolutionary',
    'game-changing',
    'industry-leading',
    'world-class',
    'leverage',
    'synergy',
    'paradigm',
    'disruptive',
    'innovative solution',
  ];

  // AI buzzwords to avoid
  private static AI_BUZZWORDS = [
    'AI-powered',
    'AI-driven',
    'machine learning',
    'artificial intelligence',
    'next-generation',
    'state-of-the-art',
  ];

  // Words that signal inauthenticity
  private static INAUTHENTIC_SIGNALS = [
    'excited to announce',
    'thrilled to share',
    'delighted to present',
    'proud to introduce',
  ];

  /**
   * Check pitch tone against brand voice guidelines
   */
  static async check(payload: ToneCheckPayload): Promise<SubAgentResult> {
    try {
      console.log('[ToneChecker] Checking tone...');

      const issues = this.findIssues(payload.text);
      const score = this.calculateToneScore(payload.text, issues);
      const recommendations = this.generateRecommendations(issues);

      const result: ToneCheckResult = {
        isValid: payload.strictMode ? issues.length === 0 : score >= 0.7,
        score,
        issues,
        recommendations,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tone check failed',
      };
    }
  }

  /**
   * Find tone issues in text
   */
  private static findIssues(text: string) {
    const issues: ToneCheckResult['issues'] = [];
    const lowerText = text.toLowerCase();

    // Check for banned phrases
    this.BANNED_PHRASES.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        issues.push({
          type: 'corporate_speak',
          text: phrase,
          suggestion: this.getSuggestion('corporate', phrase),
          severity: 'high',
        });
      }
    });

    // Check for AI buzzwords
    this.AI_BUZZWORDS.forEach(buzzword => {
      if (lowerText.includes(buzzword.toLowerCase())) {
        issues.push({
          type: 'ai_buzzword',
          text: buzzword,
          suggestion: this.getSuggestion('ai', buzzword),
          severity: 'medium',
        });
      }
    });

    // Check for inauthentic signals
    this.INAUTHENTIC_SIGNALS.forEach(signal => {
      if (lowerText.includes(signal.toLowerCase())) {
        issues.push({
          type: 'inauthentic',
          text: signal,
          suggestion: this.getSuggestion('inauthentic', signal),
          severity: 'medium',
        });
      }
    });

    return issues;
  }

  /**
   * Calculate overall tone score (0-1)
   */
  private static calculateToneScore(text: string, issues: ToneCheckResult['issues']): number {
    let score = 1.0;

    // Penalise based on issue severity
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 0.2;
          break;
        case 'medium':
          score -= 0.1;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    });

    // Bonus for positive signals
    const positiveSignals = ['tbh', 'honestly', 'genuinely', 'actually'];
    positiveSignals.forEach(signal => {
      if (text.toLowerCase().includes(signal)) {
        score += 0.05;
      }
    });

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get suggestion for replacing problematic text
   */
  private static getSuggestion(type: string, originalText: string): string {
    const suggestions: Record<string, Record<string, string>> = {
      corporate: {
        'cutting-edge': 'new',
        revolutionary: 'different',
        'game-changing': 'useful',
        'industry-leading': 'reliable',
        'world-class': 'solid',
        leverage: 'use',
        synergy: 'working together',
        paradigm: 'approach',
        disruptive: 'different',
        'innovative solution': 'tool that works',
      },
      ai: {
        'AI-powered': 'automated',
        'AI-driven': 'intelligent',
        'next-generation': 'modern',
        'state-of-the-art': 'up-to-date',
      },
      inauthentic: {
        'excited to announce': "I'm sharing",
        'thrilled to share': 'I wanted to share',
        'delighted to present': "here's",
        'proud to introduce': "I've made",
      },
    };

    return suggestions[type]?.[originalText.toLowerCase()] || 'rephrase more naturally';
  }

  /**
   * Generate tone recommendations
   */
  private static generateRecommendations(issues: ToneCheckResult['issues']): string[] {
    const recommendations: string[] = [];

    if (issues.some(i => i.type === 'corporate_speak')) {
      recommendations.push(
        'Avoid corporate jargon - write like you would talk to a mate in the industry'
      );
    }

    if (issues.some(i => i.type === 'ai_buzzword')) {
      recommendations.push('Skip the AI hype - focus on what the tool actually does for users');
    }

    if (issues.some(i => i.type === 'inauthentic')) {
      recommendations.push('Be more direct and honest - avoid overly enthusiastic marketing speak');
    }

    if (issues.length === 0) {
      recommendations.push('Tone looks good - authentic and professional');
    }

    return recommendations;
  }
}
