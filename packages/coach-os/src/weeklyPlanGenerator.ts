/**
 * CoachOS Weekly Plan Generator (Phase 2 Enhanced)
 * Creates structured weekly coaching plans based on context and goals
 * Now includes habit integration, routine suggestions, and time estimation
 */

import { createClient } from '@total-audio/core-db/server';
import { buildCoachContext } from './contextBuilder';
import { generateWeeklyRecommendations, generateFocusAreaDistribution } from './aiEngine';
import { getHabitsForUser, type Habit } from './habitEngine';
import { suggestRoutines, type Routine } from './routineEngine';
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
  workspaceId: string;
  weekStart?: string; // ISO date string, defaults to current week
  forceRegenerate?: boolean; // Regenerate even if plan exists
  focusTheme?: string; // Optional focus theme override
  includeHabits?: boolean; // Include habits as recurring tasks (default: true)
  includeRoutineSuggestions?: boolean; // Suggest relevant routines (default: true)
}

/**
 * Generate a new weekly plan for a user (Phase 2 Enhanced)
 */
export async function generateWeeklyPlan(
  options: GenerateWeeklyPlanOptions
): Promise<CoachSession> {
  try {
    const {
      userId,
      workspaceId,
      weekStart = getCurrentWeekStart(),
      forceRegenerate = false,
      focusTheme,
      includeHabits = true,
      includeRoutineSuggestions = true,
    } = options;

    logger.info('Generating weekly plan (Phase 2)', { userId, weekStart, includeHabits, includeRoutineSuggestions });

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

    // 4. PHASE 2: Get habits for integration
    let habits: Habit[] = [];
    if (includeHabits) {
      try {
        habits = await getHabitsForUser(userId, workspaceId);
        logger.info('Loaded habits for weekly plan', { habitCount: habits.length });
      } catch (error) {
        logger.warn('Failed to load habits, continuing without them', error);
      }
    }

    // 5. PHASE 2: Get routine suggestions
    let routineSuggestions: any[] = [];
    if (includeRoutineSuggestions) {
      try {
        routineSuggestions = await suggestRoutines(userId, workspaceId, {
          role: context.coachProfile?.role,
          experience_level: context.coachProfile?.experience_level,
        });
        logger.info('Generated routine suggestions', { suggestionCount: routineSuggestions.length });
      } catch (error) {
        logger.warn('Failed to generate routine suggestions', error);
      }
    }

    // 6. Generate AI recommendations
    const recommendations = await generateWeeklyRecommendations({
      context,
      existingGoals: goals,
      lastWeekProgress: lastWeekSession || undefined,
    });

    // 7. PHASE 2: Integrate habits into tasks
    const habitTasks = generateHabitTasks(habits);
    const allTasks = [...recommendations.tasks, ...habitTasks];

    // 8. PHASE 2: Add time estimation to tasks
    const tasksWithTime = addTimeEstimation(allTasks);

    // 9. PHASE 2: Build enhanced weekly plan
    const plan: WeeklyPlan = {
      week_start: weekStart,
      focus_theme: focusTheme || recommendations.focusTheme,
      tasks: tasksWithTime,
      metricsToTrack: generateMetricsToTrack(context, goals),
      recommendations: generateRecommendations(context),
      estimated_hours: calculateTotalHours(tasksWithTime),
      rationale: generatePlanRationale(context, goals, habits, focusTheme || recommendations.focusTheme),
    };

    // 10. Save session to database with enhanced metadata
    const session = await saveWeeklySession({
      userId,
      weekStart,
      plan,
      tasks: tasksWithTime,
      insights: recommendations.insights,
      metadata: {
        habitCount: habits.length,
        routineSuggestionsCount: routineSuggestions.length,
        totalEstimatedHours: calculateTotalHours(tasksWithTime),
        focusThemeOverride: !!focusTheme,
      },
    });

    logger.info('Weekly plan generated successfully (Phase 2)', {
      userId,
      weekStart,
      taskCount: tasksWithTime.length,
      habitTaskCount: habitTasks.length,
      routineSuggestions: routineSuggestions.length,
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
// PHASE 2: HELPER FUNCTIONS (Habit + Routine Integration)
// ============================================================================

/**
 * Generate recurring tasks from user habits
 */
function generateHabitTasks(habits: Habit[]): CoachTask[] {
  const habitTasks: CoachTask[] = [];

  habits.forEach((habit) => {
    // Map habit frequency to recurring task
    let recurrencePattern: string;
    switch (habit.frequency) {
      case 'daily':
        recurrencePattern = 'Every day';
        break;
      case '3x_week':
        recurrencePattern = 'Mon, Wed, Fri';
        break;
      case 'weekly':
        recurrencePattern = 'Once per week';
        break;
      case 'monthly':
        recurrencePattern = 'Once per month';
        break;
      default:
        recurrencePattern = habit.frequency;
    }

    habitTasks.push({
      title: habit.name,
      description: `🔁 Recurring habit (${recurrencePattern}) - Streak: ${habit.streak}`,
      category: mapHabitCategory(habit.category),
      priority: 'medium',
      estimated_time_minutes: 30, // Default for habits
      tags: ['habit', habit.frequency],
      source: 'habit',
      source_id: habit.id,
    });
  });

  return habitTasks;
}

/**
 * Map habit category to coach task category
 */
function mapHabitCategory(category: string): 'creative' | 'promotional' | 'relationship' | 'career' | 'wellbeing' {
  const mapping: Record<string, any> = {
    creative: 'creative',
    outreach: 'promotional',
    wellness: 'wellbeing',
    admin: 'career',
    learning: 'career',
  };
  return mapping[category] || 'wellbeing';
}

/**
 * Add time estimation to tasks that don't have it
 */
function addTimeEstimation(tasks: CoachTask[]): CoachTask[] {
  return tasks.map((task) => {
    if (task.estimated_time_minutes) return task;

    // Estimate based on category and priority
    let estimatedMinutes = 60; // Default 1 hour

    switch (task.category) {
      case 'creative':
        estimatedMinutes = task.priority === 'high' ? 120 : 90;
        break;
      case 'promotional':
        estimatedMinutes = task.priority === 'high' ? 90 : 60;
        break;
      case 'relationship':
        estimatedMinutes = 45;
        break;
      case 'career':
        estimatedMinutes = 60;
        break;
      case 'wellbeing':
        estimatedMinutes = 30;
        break;
    }

    return {
      ...task,
      estimated_time_minutes: estimatedMinutes,
    };
  });
}

/**
 * Calculate total estimated hours for a week's tasks
 */
function calculateTotalHours(tasks: CoachTask[]): number {
  const totalMinutes = tasks.reduce((sum, task) => sum + (task.estimated_time_minutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
}

/**
 * Generate plan rationale explaining the week's focus
 */
function generatePlanRationale(
  context: any,
  goals: CoachGoal[],
  habits: Habit[],
  focusTheme: string
): string {
  const parts: string[] = [];

  // Focus theme explanation
  parts.push(`This week's focus is **${focusTheme}**.`);

  // Goals alignment
  if (goals.length > 0) {
    const goalCategories = [...new Set(goals.map(g => g.category))];
    parts.push(`Your tasks align with your active goals in ${goalCategories.join(', ')}.`);
  }

  // Habits integration
  if (habits.length > 0) {
    parts.push(`${habits.length} recurring ${habits.length === 1 ? 'habit' : 'habits'} integrated into your weekly schedule.`);
  }

  // Experience-based encouragement
  if (context.coachProfile) {
    if (context.coachProfile.experience_level === 'beginner') {
      parts.push('Remember: progress over perfection. Focus on building consistency.');
    } else if (context.coachProfile.experience_level === 'advanced') {
      parts.push('Challenge yourself to refine your processes and share your knowledge.');
    }
  }

  return parts.join(' ');
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
  metadata?: Record<string, any>;
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
      metadata: input.metadata || {},
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
