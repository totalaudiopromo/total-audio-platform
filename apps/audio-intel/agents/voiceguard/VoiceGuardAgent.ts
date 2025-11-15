/**
 * VoiceGuard™ Agent - Brand Voice Enforcement
 * Ensures all outbound content matches Total Audio's authentic "honest maker" tone
 * Standalone agent that can be used across all content generation
 */

import { BaseAgent } from '../core/BaseAgent';
import type { AgentPayload, AgentResult } from '../core/AgentTypes';

export interface VoiceGuardPayload extends AgentPayload {
  text: string;
  contentType?: 'pitch' | 'followup' | 'newsletter' | 'marketing' | 'general';
  strictMode?: boolean;
  autoFix?: boolean;
}

export interface VoiceGuardResult {
  passed: boolean;
  score: number;
  issues: Array<{
    type: 'banned_phrase' | 'corporate_speak' | 'ai_buzzword' | 'inauthentic' | 'tone';
    text: string;
    position?: { start: number; end: number };
    severity: 'critical' | 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  recommendations: string[];
  fixedText?: string; // If autoFix enabled
}

export class VoiceGuardAgent extends BaseAgent {
  // Critical phrases that should never appear
  private static BANNED_PHRASES = [
    'cutting-edge',
    'revolutionary',
    'game-changing',
    'industry-leading',
    'world-class',
    'synergy',
    'paradigm shift',
    'disruptive',
    'thought leader',
  ];

  // Corporate speak to avoid
  private static CORPORATE_SPEAK = [
    'leverage',
    'circle back',
    'touch base',
    'move the needle',
    'low-hanging fruit',
    'think outside the box',
    'win-win',
    'best practices',
  ];

  // AI buzzwords that signal inauthenticity
  private static AI_BUZZWORDS = [
    'AI-powered',
    'AI-driven',
    'machine learning enhanced',
    'next-generation AI',
    'intelligent automation',
    'cognitive computing',
  ];

  // Inauthentic marketing speak
  private static INAUTHENTIC_PHRASES = [
    'excited to announce',
    'thrilled to share',
    'delighted to present',
    'proud to introduce',
    'pleased to inform',
  ];

  constructor() {
    super('VoiceGuardAgent', '1.0.0');
  }

  async run(payload: VoiceGuardPayload): Promise<AgentResult> {
    this.log('Checking brand voice', {
      contentType: payload.contentType,
      strictMode: payload.strictMode,
    });

    try {
      const issues = this.scanForIssues(payload.text);
      const score = this.calculateVoiceScore(payload.text, issues);
      const recommendations = this.generateRecommendations(issues, payload.contentType);

      let fixedText;
      if (payload.autoFix) {
        fixedText = this.autoFixIssues(payload.text, issues);
      }

      const passed = payload.strictMode ? issues.length === 0 : score >= 0.75;

      const result: VoiceGuardResult = {
        passed,
        score,
        issues,
        recommendations,
        fixedText,
      };

      if (!passed) {
        this.log('Voice check failed', {
          score,
          issuesFound: issues.length,
        });
      } else {
        this.log('Voice check passed', { score });
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.log('Voice check error', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Voice check failed',
      };
    }
  }

  /**
   * Scan text for voice issues
   */
  private scanForIssues(text: string): VoiceGuardResult['issues'] {
    const issues: VoiceGuardResult['issues'] = [];
    const lowerText = text.toLowerCase();

    // Check banned phrases (critical)
    VoiceGuardAgent.BANNED_PHRASES.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        issues.push({
          type: 'banned_phrase',
          text: phrase,
          severity: 'critical',
          suggestion: `Remove "${phrase}" - sounds like corporate marketing`,
        });
      }
    });

    // Check corporate speak (high)
    VoiceGuardAgent.CORPORATE_SPEAK.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        issues.push({
          type: 'corporate_speak',
          text: phrase,
          severity: 'high',
          suggestion: `Replace "${phrase}" with plain English`,
        });
      }
    });

    // Check AI buzzwords (medium-high)
    VoiceGuardAgent.AI_BUZZWORDS.forEach(buzzword => {
      if (lowerText.includes(buzzword.toLowerCase())) {
        issues.push({
          type: 'ai_buzzword',
          text: buzzword,
          severity: 'medium',
          suggestion: `Skip the AI hype - just explain what it does`,
        });
      }
    });

    // Check inauthentic phrases (medium)
    VoiceGuardAgent.INAUTHENTIC_PHRASES.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        issues.push({
          type: 'inauthentic',
          text: phrase,
          severity: 'medium',
          suggestion: `Be more direct - "${phrase}" sounds forced`,
        });
      }
    });

    return issues;
  }

  /**
   * Calculate voice authenticity score (0-1)
   */
  private calculateVoiceScore(text: string, issues: VoiceGuardResult['issues']): number {
    let score = 1.0;

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 0.25;
          break;
        case 'high':
          score -= 0.15;
          break;
        case 'medium':
          score -= 0.1;
          break;
        case 'low':
          score -= 0.05;
          break;
      }
    });

    // Bonus for positive authentic signals
    const authenticSignals = ['honestly', 'tbh', 'genuinely', 'actually', 'right so'];
    authenticSignals.forEach(signal => {
      if (text.toLowerCase().includes(signal)) {
        score += 0.05;
      }
    });

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate recommendations based on issues found
   */
  private generateRecommendations(
    issues: VoiceGuardResult['issues'],
    contentType?: string
  ): string[] {
    const recommendations: string[] = [];

    if (issues.some(i => i.type === 'banned_phrase')) {
      recommendations.push('Remove marketing jargon - write like a real person');
    }

    if (issues.some(i => i.type === 'corporate_speak')) {
      recommendations.push('Use plain English instead of business buzzwords');
    }

    if (issues.some(i => i.type === 'ai_buzzword')) {
      recommendations.push('Focus on what it does, not AI hype');
    }

    if (issues.some(i => i.type === 'inauthentic')) {
      recommendations.push('Be more direct and honest - avoid forced enthusiasm');
    }

    // Content-specific recommendations
    if (contentType === 'pitch') {
      recommendations.push('Keep it personal and genuine - like emailing a mate in the industry');
    } else if (contentType === 'newsletter') {
      recommendations.push('Write conversationally - British casual-professional tone');
    }

    if (issues.length === 0) {
      recommendations.push('Voice sounds authentic and on-brand');
    }

    return recommendations;
  }

  /**
   * Attempt to auto-fix issues
   */
  private autoFixIssues(text: string, issues: VoiceGuardResult['issues']): string {
    let fixedText = text;

    const replacements: Record<string, string> = {
      'cutting-edge': 'new',
      revolutionary: 'different',
      'game-changing': 'useful',
      'industry-leading': 'reliable',
      'world-class': 'solid',
      leverage: 'use',
      'circle back': 'follow up',
      'touch base': 'check in',
      'AI-powered': 'automated',
      'AI-driven': 'intelligent',
      'excited to announce': "I'm sharing",
      'thrilled to share': 'wanted to share',
    };

    issues.forEach(issue => {
      const replacement = replacements[issue.text.toLowerCase()];
      if (replacement) {
        const regex = new RegExp(issue.text, 'gi');
        fixedText = fixedText.replace(regex, replacement);
      }
    });

    return fixedText;
  }
}
