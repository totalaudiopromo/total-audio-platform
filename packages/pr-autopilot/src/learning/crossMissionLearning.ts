/**
 * Cross-Mission Learning
 *
 * Learns from multiple missions to improve future campaign performance
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentRole } from '../types';

export interface LearningInsight {
  id: string;
  category: 'timing' | 'targeting' | 'messaging' | 'frequency' | 'channel';
  insight: string;
  confidence: number;
  evidenceCount: number;
  impactScore: number; // 0-1, how much this improved outcomes
  createdAt: string;
}

export interface PatternMatch {
  pattern: string;
  frequency: number;
  avgSuccessRate: number;
  examples: string[]; // Mission IDs
}

export interface CrossMissionReport {
  totalMissions: number;
  avgSuccessRate: number;
  topPatterns: PatternMatch[];
  insights: LearningInsight[];
  recommendations: string[];
}

/**
 * Extract patterns from completed missions
 */
export async function extractPatterns(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    minMissions?: number;
    minConfidence?: number;
  }
): Promise<PatternMatch[]> {
  const minMissions = options?.minMissions || 3;

  // Get all completed missions for user
  const { data: missions } = await supabase
    .from('autopilot_missions')
    .select('id, config, status')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (!missions || missions.length < minMissions) {
    return [];
  }

  const patterns = new Map<string, PatternMatch>();

  // Analyze mission configurations for patterns
  for (const mission of missions) {
    const config = mission.config as Record<string, unknown>;

    // Extract timing patterns
    if (config.quietHoursStart && config.quietHoursEnd) {
      const pattern = `quiet_hours_${config.quietHoursStart}_${config.quietHoursEnd}`;
      incrementPattern(patterns, pattern, mission.id);
    }

    // Extract contact volume patterns
    if (config.maxContacts) {
      const tier = categorizeContactVolume(config.maxContacts as number);
      incrementPattern(patterns, `contact_volume_${tier}`, mission.id);
    }

    // Extract followup intensity patterns
    if (config.followupIntensity) {
      const intensity = categorizeIntensity(config.followupIntensity as number);
      incrementPattern(patterns, `followup_${intensity}`, mission.id);
    }
  }

  // Convert to array and calculate success rates
  const patternArray: PatternMatch[] = [];
  for (const [pattern, match] of patterns.entries()) {
    if (match.frequency >= minMissions) {
      patternArray.push(match);
    }
  }

  return patternArray.sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Helper: Increment pattern count
 */
function incrementPattern(
  patterns: Map<string, PatternMatch>,
  patternKey: string,
  missionId: string
): void {
  const existing = patterns.get(patternKey);
  if (existing) {
    existing.frequency++;
    existing.examples.push(missionId);
  } else {
    patterns.set(patternKey, {
      pattern: patternKey,
      frequency: 1,
      avgSuccessRate: 0.8, // Would calculate from telemetry
      examples: [missionId],
    });
  }
}

/**
 * Helper: Categorize contact volume
 */
function categorizeContactVolume(count: number): string {
  if (count < 50) return 'small';
  if (count < 150) return 'medium';
  if (count < 300) return 'large';
  return 'xlarge';
}

/**
 * Helper: Categorize intensity
 */
function categorizeIntensity(intensity: number): string {
  if (intensity < 0.5) return 'low';
  if (intensity < 1.0) return 'medium';
  if (intensity < 1.5) return 'high';
  return 'aggressive';
}

/**
 * Generate insights from patterns
 */
export function generateInsights(patterns: PatternMatch[]): LearningInsight[] {
  const insights: LearningInsight[] = [];

  patterns.forEach((pattern) => {
    if (pattern.avgSuccessRate > 0.8 && pattern.frequency >= 5) {
      insights.push({
        id: `insight_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        category: categorizePattern(pattern.pattern),
        insight: generateInsightText(pattern),
        confidence: pattern.avgSuccessRate,
        evidenceCount: pattern.frequency,
        impactScore: calculateImpactScore(pattern),
        createdAt: new Date().toISOString(),
      });
    }
  });

  return insights.sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Helper: Categorize pattern type
 */
function categorizePattern(pattern: string): LearningInsight['category'] {
  if (pattern.includes('quiet_hours')) return 'timing';
  if (pattern.includes('contact_volume')) return 'targeting';
  if (pattern.includes('followup')) return 'frequency';
  if (pattern.includes('channel')) return 'channel';
  return 'messaging';
}

/**
 * Helper: Generate human-readable insight
 */
function generateInsightText(pattern: PatternMatch): string {
  const { pattern: key, avgSuccessRate, frequency } = pattern;

  if (key.startsWith('quiet_hours')) {
    return `Respecting quiet hours improves success rate to ${(avgSuccessRate * 100).toFixed(0)}% (${frequency} campaigns)`;
  }

  if (key.includes('contact_volume_medium')) {
    return `Medium contact volumes (50-150) show ${(avgSuccessRate * 100).toFixed(0)}% success rate (${frequency} campaigns)`;
  }

  if (key.includes('followup_low')) {
    return `Low followup intensity performs well with ${(avgSuccessRate * 100).toFixed(0)}% success (${frequency} campaigns)`;
  }

  return `Pattern "${key}" shows ${(avgSuccessRate * 100).toFixed(0)}% success rate across ${frequency} campaigns`;
}

/**
 * Helper: Calculate impact score
 */
function calculateImpactScore(pattern: PatternMatch): number {
  // Impact = success rate × frequency (normalized)
  return (pattern.avgSuccessRate * pattern.frequency) / 10;
}

/**
 * Generate recommendations from insights
 */
export function generateRecommendations(insights: LearningInsight[]): string[] {
  const recommendations: string[] = [];

  insights.slice(0, 5).forEach((insight) => {
    if (insight.confidence > 0.8) {
      recommendations.push(
        `✓ ${insight.insight} - Apply this to your next campaign for better results`
      );
    }
  });

  return recommendations;
}

/**
 * Generate cross-mission report
 */
export async function generateCrossMissionReport(
  supabase: SupabaseClient,
  userId: string
): Promise<CrossMissionReport> {
  // Get mission count and avg success rate
  const { data: missions } = await supabase
    .from('autopilot_missions')
    .select('id, status')
    .eq('user_id', userId);

  const totalMissions = missions?.length || 0;
  const completedMissions = missions?.filter((m) => m.status === 'completed').length || 0;
  const avgSuccessRate = totalMissions > 0 ? completedMissions / totalMissions : 0;

  // Extract patterns
  const topPatterns = await extractPatterns(supabase, userId);

  // Generate insights
  const insights = generateInsights(topPatterns);

  // Generate recommendations
  const recommendations = generateRecommendations(insights);

  return {
    totalMissions,
    avgSuccessRate,
    topPatterns: topPatterns.slice(0, 10),
    insights: insights.slice(0, 10),
    recommendations,
  };
}
