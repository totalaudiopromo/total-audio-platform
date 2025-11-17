/**
 * CoachOS Weekly Plan Generator
 * Creates structured weekly coaching plans based on context and goals
 */

import { createClient } from '@total-audio/core-db/server';
import { buildCoachContext } from './contextBuilder';
import { generateWeeklyRecommendations, generateFocusAreaDistribution } from './aiEngine';
import type {
  WeeklyPlan,
  CoachTask,
  CoachInsight,
  CoachSession,
  CoachGoal,
} from './types';
import { logger } from './utils/logger';
import { getCurrentWeekStart, formatDateISO } from './utils/dates';

export interface GenerateWeeklyPlanOptions {
  userId: string;
  weekStart?: string; // ISO date string, defaults to current week
  forceRegenerate?: boolean; // Regenerate even if plan exists
}

/**
 * Generate a new weekly plan for a user
 */
export async function generateWeeklyPlan(
  options: GenerateWeeklyPlanOptions
): Promise<CoachSession> {
  try {
    const { userId, weekStart = getCurrentWeekStart(), forceRegenerate = false } = options;

    logger.info('Generating weekly plan', { userId, weekStart });

    // Check if plan already exists for this week
    if (!forceRegenerate) {
      const existing = await getWeeklySession(userId, weekStart);
      if (existing) {
        logger.info('Weekly plan already exists', { userId, weekStart });
        return existing;
      }
    }

    // 1. Build context
    const context = await buildCoachContext(userId);

    // 2. Get active goals
    const goals = await getActiveGoals(userId);

    // 3. Get last week's session for continuity
    const lastWeekSession = await getLastWeekSession(userId, weekStart);

    // 4. Generate AI recommendations
    const recommendations = await generateWeeklyRecommendations({
      context,
      existingGoals: goals,
      lastWeekProgress: lastWeekSession || undefined,
    });

    // 5. Build weekly plan
    const plan: WeeklyPlan = {
      week_start: weekStart,
      focus_theme: recommendations.focusTheme,
      tasks: recommendations.tasks,
      metricsToTrack: generateMetricsToTrack(context, goals),
      recommendations: generateRecommendations(context),
      estimated_hours: recommendations.estimatedHours,
    };

    // 6. Save session to database
    const session = await saveWeeklySession({
      userId,
      weekStart,
      plan,
      tasks: recommendations.tasks,
      insights: recommendations.insights,
    });

    logger.info('Weekly plan generated successfully', {
      userId,
      weekStart,
      taskCount: recommendations.tasks.length,
    });

    return session;
  } catch (error) {
    logger.error('Failed to generate weekly plan', error);
    throw error;
  }
}

/**
 * Get the current week's session for a user
 */
export async function getCurrentWeekSession(userId: string): Promise<CoachSession | null> {
  const weekStart = getCurrentWeekStart();
  return getWeeklySession(userId, weekStart);
}

/**
 * Get a specific week's session
 */
export async function getWeeklySession(
  userId: string,
  weekStart: string
): Promise<CoachSession | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Failed to get weekly session', error);
    throw error;
  }
}

/**
 * Get all sessions for a user (history)
 */
export async function getUserSessions(
  userId: string,
  limit: number = 10
): Promise<CoachSession[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get user sessions', error);
    throw error;
  }
}

/**
 * Update session reflections
 */
export async function updateSessionReflections(
  sessionId: string,
  reflections: any
): Promise<CoachSession> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_sessions')
      .update({ reflections })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Updated session reflections', { sessionId });
    return data;
  } catch (error) {
    logger.error('Failed to update session reflections', error);
    throw error;
  }
}

/**
 * Mark session as completed
 */
export async function completeSession(sessionId: string): Promise<CoachSession> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_sessions')
      .update({ completed: true })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Marked session as completed', { sessionId });
    return data;
  } catch (error) {
    logger.error('Failed to complete session', error);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getActiveGoals(userId: string): Promise<CoachGoal[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('priority', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get active goals', error);
    return [];
  }
}

async function getLastWeekSession(
  userId: string,
  currentWeekStart: string
): Promise<CoachSession | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_sessions')
      .select('*')
      .eq('user_id', userId)
      .lt('week_start', currentWeekStart)
      .order('week_start', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.warn('No last week session found', error);
    return null;
  }
}

async function saveWeeklySession(input: {
  userId: string;
  weekStart: string;
  plan: WeeklyPlan;
  tasks: CoachTask[];
  insights: CoachInsight[];
}): Promise<CoachSession> {
  try {
    const supabase = createClient();

    const sessionData = {
      user_id: input.userId,
      week_start: input.weekStart,
      plan: input.plan,
      tasks: input.tasks,
      insights: input.insights,
      completed: false,
      metadata: {},
    };

    const { data, error } = await supabase
      .from('coach_sessions')
      .upsert(sessionData, {
        onConflict: 'user_id,week_start',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error('Failed to save weekly session', error);
    throw error;
  }
}

function generateMetricsToTrack(context: any, goals: CoachGoal[]): string[] {
  const metrics: string[] = [];

  // Add goal-specific metrics
  goals.forEach((goal) => {
    if (goal.category === 'creative') {
      metrics.push('creative_output');
    }
    if (goal.category === 'marketing') {
      metrics.push('marketing_activities');
    }
    if (goal.category === 'growth') {
      metrics.push('audience_growth');
    }
  });

  // Add standard metrics
  metrics.push('tasks_completed', 'learning_hours', 'energy_level');

  return [...new Set(metrics)]; // Remove duplicates
}

function generateRecommendations(context: any): string[] {
  const recommendations: string[] = [];

  const { coachProfile } = context;

  if (coachProfile.experience_level === 'beginner') {
    recommendations.push('Focus on building foundational skills this week');
    recommendations.push('Don\'t worry about perfection - progress over perfection');
  }

  if (coachProfile.role === 'artist') {
    recommendations.push('Balance creative work with promotional activities');
  }

  if (coachProfile.role === 'pr_agency') {
    recommendations.push('Document successful strategies for future campaigns');
  }

  return recommendations;
}
