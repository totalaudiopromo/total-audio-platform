/**
 * CoachOS Goal Engine
 * Goal creation, management, and auto-generation
 */

import { createClient } from '@total-audio/core-db/server';
import { buildCoachContext } from './contextBuilder';
import type {
  CoachGoal,
  CreateGoalInput,
  UpdateGoalInput,
  AutoGenerateGoalsInput,
  GoalCategory,
} from './types';
import { logger } from './utils/logger';

/**
 * Create a new goal
 */
export async function createGoal(input: CreateGoalInput): Promise<CoachGoal> {
  try {
    const supabase = createClient();

    const goalData = {
      user_id: input.userId,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority || 0,
      target_date: input.target_date,
      progress: 0,
      status: 'active' as const,
      metadata: input.metadata || {},
    };

    const { data, error } = await supabase
      .from('coach_goals')
      .insert(goalData)
      .select()
      .single();

    if (error) throw error;

    logger.info('Created goal', { userId: input.userId, goalId: data.id });
    return data;
  } catch (error) {
    logger.error('Failed to create goal', error);
    throw error;
  }
}

/**
 * Update an existing goal
 */
export async function updateGoal(input: UpdateGoalInput): Promise<CoachGoal> {
  try {
    const supabase = createClient();

    const updates: any = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.category !== undefined) updates.category = input.category;
    if (input.status !== undefined) updates.status = input.status;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.target_date !== undefined) updates.target_date = input.target_date;
    if (input.progress !== undefined) updates.progress = input.progress;
    if (input.metadata !== undefined) updates.metadata = input.metadata;

    const { data, error } = await supabase
      .from('coach_goals')
      .update(updates)
      .eq('id', input.goalId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Updated goal', { goalId: input.goalId });
    return data;
  } catch (error) {
    logger.error('Failed to update goal', error);
    throw error;
  }
}

/**
 * Complete a goal
 */
export async function completeGoal(goalId: string): Promise<CoachGoal> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .update({
        status: 'completed',
        progress: 100,
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Completed goal', { goalId });
    return data;
  } catch (error) {
    logger.error('Failed to complete goal', error);
    throw error;
  }
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('coach_goals').delete().eq('id', goalId);

    if (error) throw error;

    logger.info('Deleted goal', { goalId });
  } catch (error) {
    logger.error('Failed to delete goal', error);
    throw error;
  }
}

/**
 * Get all goals for a user
 */
export async function getUserGoals(userId: string): Promise<CoachGoal[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get user goals', error);
    throw error;
  }
}

/**
 * Get goals by status
 */
export async function getGoalsByStatus(
  userId: string,
  status: 'active' | 'paused' | 'completed'
): Promise<CoachGoal[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('priority', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get goals by status', error);
    throw error;
  }
}

/**
 * Get goals by category
 */
export async function getGoalsByCategory(
  userId: string,
  category: GoalCategory
): Promise<CoachGoal[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('priority', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to get goals by category', error);
    throw error;
  }
}

/**
 * Auto-generate suggested goals based on context
 */
export async function autoGenerateGoals(
  input: AutoGenerateGoalsInput
): Promise<CoachGoal[]> {
  try {
    const { userId, context, existingGoals } = input;

    logger.info('Auto-generating goals', { userId });

    const suggestedGoals: CreateGoalInput[] = [];

    // Generate goals based on role and experience level
    const { coachProfile } = context;

    if (coachProfile.role === 'artist') {
      suggestedGoals.push(...generateArtistGoals(coachProfile, existingGoals));
    } else if (coachProfile.role === 'pr_agency') {
      suggestedGoals.push(...generatePRAgencyGoals(coachProfile, existingGoals));
    } else if (coachProfile.role === 'manager') {
      suggestedGoals.push(...generateManagerGoals(coachProfile, existingGoals));
    }

    // Generate goals based on upcoming releases
    if (context.releasePlanner?.upcoming_releases?.length) {
      suggestedGoals.push(...generateReleaseGoals(userId, context.releasePlanner));
    }

    // Create the goals
    const createdGoals: CoachGoal[] = [];
    for (const goalInput of suggestedGoals) {
      const goal = await createGoal(goalInput);
      createdGoals.push(goal);
    }

    logger.info('Auto-generated goals', {
      userId,
      count: createdGoals.length,
    });

    return createdGoals;
  } catch (error) {
    logger.error('Failed to auto-generate goals', error);
    throw error;
  }
}

// ============================================================================
// GOAL GENERATION HELPERS
// ============================================================================

function generateArtistGoals(profile: any, existing: CoachGoal[]): CreateGoalInput[] {
  const goals: CreateGoalInput[] = [];
  const existingCategories = new Set(existing.map((g) => g.category));

  if (!existingCategories.has('creative') && profile.experience_level === 'beginner') {
    goals.push({
      userId: profile.user_id,
      title: 'Develop consistent visual identity',
      description: 'Create a cohesive visual brand across all platforms and releases',
      category: 'creative',
      priority: 3,
    });
  }

  if (!existingCategories.has('branding')) {
    goals.push({
      userId: profile.user_id,
      title: 'Build professional press kit',
      description: 'Create a comprehensive EPK with bio, photos, and achievements',
      category: 'branding',
      priority: 2,
    });
  }

  if (!existingCategories.has('marketing')) {
    goals.push({
      userId: profile.user_id,
      title: 'Grow engaged audience',
      description: 'Focus on authentic engagement rather than vanity metrics',
      category: 'marketing',
      priority: 2,
    });
  }

  return goals;
}

function generatePRAgencyGoals(profile: any, existing: CoachGoal[]): CreateGoalInput[] {
  const goals: CreateGoalInput[] = [];
  const existingCategories = new Set(existing.map((g) => g.category));

  if (!existingCategories.has('skills')) {
    goals.push({
      userId: profile.user_id,
      title: 'Master contact relationship management',
      description: 'Build systematic approach to nurturing media relationships',
      category: 'skills',
      priority: 3,
    });
  }

  if (!existingCategories.has('growth')) {
    goals.push({
      userId: profile.user_id,
      title: 'Expand service offerings',
      description: 'Identify new PR services that complement existing expertise',
      category: 'growth',
      priority: 2,
    });
  }

  return goals;
}

function generateManagerGoals(profile: any, existing: CoachGoal[]): CreateGoalInput[] {
  const goals: CreateGoalInput[] = [];
  const existingCategories = new Set(existing.map((g) => g.category));

  if (!existingCategories.has('career')) {
    goals.push({
      userId: profile.user_id,
      title: 'Develop artist career roadmap',
      description: 'Create 12-month strategic plan for artist development',
      category: 'career',
      priority: 3,
    });
  }

  if (!existingCategories.has('skills')) {
    goals.push({
      userId: profile.user_id,
      title: 'Build industry network',
      description: 'Systematically connect with labels, venues, and industry professionals',
      category: 'skills',
      priority: 2,
    });
  }

  return goals;
}

function generateReleaseGoals(
  userId: string,
  releasePlanner: any
): CreateGoalInput[] {
  const goals: CreateGoalInput[] = [];

  const nextRelease = releasePlanner.upcoming_releases[0];
  if (nextRelease) {
    const releaseDate = new Date(nextRelease.date);
    const threeMonthsBefore = new Date(releaseDate);
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);

    goals.push({
      userId,
      title: `Prepare ${nextRelease.title} release campaign`,
      description: `Complete all promotional materials and outreach for ${nextRelease.type} release`,
      category: 'release',
      priority: 5,
      target_date: nextRelease.date,
    });
  }

  return goals;
}
