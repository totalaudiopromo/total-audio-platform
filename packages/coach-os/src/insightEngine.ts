/**
 * CoachOS Insight Engine
 * Generate and manage coaching insights
 */

import { createClient } from '@total-audio/core-db/server';
import { buildCoachContext } from './contextBuilder';
import {
  generateCareerInsights,
  generateBrandingInsights,
  generateCreativeInsights,
} from './aiEngine';
import type { CoachInsight, CoachInsightRecord, InsightType } from './types';
import { logger } from './utils/logger';

/**
 * Generate and save all types of insights for a user
 */
export async function generateAllInsights(userId: string): Promise<CoachInsightRecord[]> {
  try {
    logger.info('Generating all insights', { userId });

    const context = await buildCoachContext(userId);
    const goals = await getUserGoals(userId);
    const progressHistory = await getUserProgress(userId);

    // Generate different types of insights in parallel
    const [careerInsights, brandingInsights, creativeInsights] = await Promise.all([
      generateCareerInsights({ context, goals, progressHistory }),
      generateBrandingInsights(context),
      generateCreativeInsights(context),
    ]);

    // Save all insights
    const allInsights = [...careerInsights, ...brandingInsights, ...creativeInsights];
    const savedInsights: CoachInsightRecord[] = [];

    for (const insight of allInsights) {
      const saved = await saveInsight(userId, insight);
      savedInsights.push(saved);
    }

    logger.info('Generated all insights', {
      userId,
      count: savedInsights.length,
    });

    return savedInsights;
  } catch (error) {
    logger.error('Failed to generate all insights', error);
    throw error;
  }
}

/**
 * Generate insights of a specific type
 */
export async function generateInsightsByType(
  userId: string,
  type: InsightType
): Promise<CoachInsightRecord[]> {
  try {
    logger.info('Generating insights by type', { userId, type });

    const context = await buildCoachContext(userId);
    const goals = await getUserGoals(userId);
    const progressHistory = await getUserProgress(userId);

    let insights: CoachInsight[] = [];

    switch (type) {
      case 'career':
        insights = await generateCareerInsights({ context, goals, progressHistory });
        break;
      case 'branding':
        insights = await generateBrandingInsights(context);
        break;
      case 'creative':
        insights = await generateCreativeInsights(context);
        break;
      case 'scene':
        insights = await generateSceneInsights(context);
        break;
      case 'relationship':
        insights = await generateRelationshipInsights(context);
        break;
      case 'promotional':
        insights = await generatePromotionalInsights(context);
        break;
      default:
        logger.warn('Unknown insight type requested', { type });
    }

    // Save insights
    const savedInsights: CoachInsightRecord[] = [];
    for (const insight of insights) {
      const saved = await saveInsight(userId, insight);
      savedInsights.push(saved);
    }

    return savedInsights;
  } catch (error) {
    logger.error('Failed to generate insights by type', error);
    throw error;
  }
}

/**
 * Save an insight to the database
 */
export async function saveInsight(
  userId: string,
  insight: CoachInsight,
  sessionId?: string
): Promise<CoachInsightRecord> {
  try {
    const supabase = createClient();

    const insightData = {
      user_id: userId,
      insight_type: insight.type,
      content: {
        summary: insight.summary,
        detail: insight.detail,
        actionable_steps: insight.actionable_steps || [],
        priority: insight.priority || 'medium',
        related_goals: insight.related_goals || [],
      },
      session_id: sessionId,
      metadata: {},
    };

    const { data, error } = await supabase
      .from('coach_insights')
      .insert(insightData)
      .select()
      .single();

    if (error) throw error;

    logger.debug('Saved insight', { userId, insightId: data.id, type: insight.type });
    return data;
  } catch (error) {
    logger.error('Failed to save insight', error);
    throw error;
  }
}

/**
 * Get all insights for a user
 */
export async function getUserInsights(
  userId: string,
  limit: number = 50
): Promise<CoachInsightRecord[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get user insights', error);
    throw error;
  }
}

/**
 * Get insights by type
 */
export async function getInsightsByType(
  userId: string,
  type: InsightType,
  limit: number = 20
): Promise<CoachInsightRecord[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('insight_type', type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get insights by type', error);
    throw error;
  }
}

/**
 * Delete an insight
 */
export async function deleteInsight(insightId: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('coach_insights')
      .delete()
      .eq('id', insightId);

    if (error) throw error;

    logger.info('Deleted insight', { insightId });
  } catch (error) {
    logger.error('Failed to delete insight', error);
    throw error;
  }
}

// ============================================================================
// INSIGHT GENERATION HELPERS
// ============================================================================

async function generateSceneInsights(context: any): Promise<CoachInsight[]> {
  const insights: CoachInsight[] = [];

  if (context.migContext?.sceneContext) {
    const { primary_scene, scene_health } = context.migContext.sceneContext;

    insights.push({
      type: 'scene',
      summary: `Your ${primary_scene} scene is ${scene_health}`,
      detail: `Understanding your scene's health helps you time releases and outreach strategically.`,
      actionable_steps: [
        'Research other artists in your scene',
        'Identify collaborative opportunities',
        'Monitor scene trends and adapt your strategy',
      ],
      priority: 'medium',
    });
  }

  return insights;
}

async function generateRelationshipInsights(context: any): Promise<CoachInsight[]> {
  const insights: CoachInsight[] = [];

  // Based on campaign metrics and relationship data
  if (context.fusionContext?.campaignMetrics) {
    insights.push({
      type: 'relationship',
      summary: 'Nurture your existing media relationships',
      detail:
        'Strong relationships with media contacts lead to better coverage and support over time.',
      actionable_steps: [
        'Follow up with contacts who supported previous releases',
        'Share updates that align with their interests',
        'Offer value without always asking for coverage',
      ],
      priority: 'high',
    });
  }

  return insights;
}

async function generatePromotionalInsights(context: any): Promise<CoachInsight[]> {
  const insights: CoachInsight[] = [];

  const { coachProfile } = context;

  if (coachProfile.experience_level === 'beginner') {
    insights.push({
      type: 'promotional',
      summary: 'Build promotional foundations first',
      detail:
        'Before running campaigns, ensure you have professional materials (EPK, photos, bio).',
      actionable_steps: [
        'Create professional press kit',
        'Build email list systematically',
        'Develop content calendar',
      ],
      priority: 'high',
    });
  }

  return insights;
}

// ============================================================================
// DATA FETCHING HELPERS
// ============================================================================

async function getUserGoals(userId: string): Promise<any[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.warn('Failed to get user goals for insights', error);
    return [];
  }
}

async function getUserProgress(userId: string): Promise<any[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.warn('Failed to get user progress for insights', error);
    return [];
  }
}
