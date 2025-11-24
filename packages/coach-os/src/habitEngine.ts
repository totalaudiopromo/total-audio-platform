/**
 * CoachOS Phase 2: Habit Engine
 * Manages habit tracking, streak calculation, and completion
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type HabitFrequency = 'daily' | '3x_week' | 'weekly' | 'monthly';
export type HabitCategory = 'creative' | 'outreach' | 'wellness' | 'admin' | 'learning';

export interface Habit {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  streak: number;
  last_completed: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitInput {
  userId: string;
  workspaceId: string;
  name: string;
  frequency: HabitFrequency;
  category: HabitCategory;
}

/**
 * Create a new habit for a user
 */
export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('coach_habits')
    .insert({
      user_id: input.userId,
      workspace_id: input.workspaceId,
      name: input.name,
      frequency: input.frequency,
      category: input.category,
      streak: 0,
      last_completed: null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create habit: ${error.message}`);
  return data as Habit;
}

/**
 * Get all habits for a user
 */
export async function getHabitsForUser(
  userId: string,
  workspaceId: string
): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('coach_habits')
    .select('*')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to get habits: ${error.message}`);
  return data as Habit[];
}

/**
 * Get a single habit by ID
 */
export async function getHabit(habitId: string): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('coach_habits')
    .select('*')
    .eq('id', habitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get habit: ${error.message}`);
  }
  return data as Habit;
}

/**
 * Compute streak based on frequency and completion history
 */
export function computeStreak(habit: Habit): number {
  if (!habit.last_completed) return 0;

  const now = new Date();
  const lastCompleted = new Date(habit.last_completed);
  const daysSinceCompletion = Math.floor(
    (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if streak is still valid based on frequency
  switch (habit.frequency) {
    case 'daily':
      // Streak breaks after missing 1 day (allow same day or yesterday)
      if (daysSinceCompletion > 1) return 0;
      return habit.streak;

    case '3x_week':
      // Streak breaks after missing 3 days
      if (daysSinceCompletion > 3) return 0;
      return habit.streak;

    case 'weekly':
      // Streak breaks after missing 7 days (1 week)
      if (daysSinceCompletion > 7) return 0;
      return habit.streak;

    case 'monthly':
      // Streak breaks after missing 31 days
      if (daysSinceCompletion > 31) return 0;
      return habit.streak;

    default:
      return habit.streak;
  }
}

/**
 * Mark a habit as completed
 * Updates streak if completion maintains the streak window
 */
export async function completeHabit(habitId: string): Promise<Habit> {
  // Get current habit
  const habit = await getHabit(habitId);
  if (!habit) throw new Error('Habit not found');

  const now = new Date();
  const currentStreak = computeStreak(habit);

  // Determine if we should increment the streak
  let newStreak = currentStreak;

  if (!habit.last_completed) {
    // First completion
    newStreak = 1;
  } else {
    const lastCompleted = new Date(habit.last_completed);
    const hoursSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);

    // Only increment if not completed within the last 4 hours (prevent double-counting)
    if (hoursSinceCompletion > 4) {
      newStreak = currentStreak + 1;
    }
  }

  // Update habit
  const { data, error } = await supabase
    .from('coach_habits')
    .update({
      streak: newStreak,
      last_completed: now.toISOString(),
    })
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete habit: ${error.message}`);
  return data as Habit;
}

/**
 * Update a habit (name, frequency, category)
 */
export async function updateHabit(
  habitId: string,
  updates: Partial<Pick<Habit, 'name' | 'frequency' | 'category'>>
): Promise<Habit> {
  const { data, error } = await supabase
    .from('coach_habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update habit: ${error.message}`);
  return data as Habit;
}

/**
 * Delete a habit
 */
export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from('coach_habits')
    .delete()
    .eq('id', habitId);

  if (error) throw new Error(`Failed to delete habit: ${error.message}`);
}

/**
 * Get habits due today based on frequency
 */
export async function getHabitsDueToday(
  userId: string,
  workspaceId: string
): Promise<Habit[]> {
  const habits = await getHabitsForUser(userId, workspaceId);
  const now = new Date();

  return habits.filter((habit) => {
    if (!habit.last_completed) return true; // Never completed = due today

    const lastCompleted = new Date(habit.last_completed);
    const daysSinceCompletion = Math.floor(
      (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (habit.frequency) {
      case 'daily':
        return daysSinceCompletion >= 1;
      case '3x_week':
        return daysSinceCompletion >= 2; // ~3x per week
      case 'weekly':
        return daysSinceCompletion >= 7;
      case 'monthly':
        return daysSinceCompletion >= 30;
      default:
        return false;
    }
  });
}

/**
 * Get completion rate for a habit over the last N days
 */
export async function getHabitCompletionRate(
  habitId: string,
  days: number = 30
): Promise<number> {
  const habit = await getHabit(habitId);
  if (!habit) return 0;

  // For now, use streak as a proxy for completion rate
  // In a full implementation, we'd track individual completions
  const expectedCompletions = getExpectedCompletions(habit.frequency, days);
  const actualCompletions = Math.min(habit.streak, expectedCompletions);

  return expectedCompletions > 0 ? actualCompletions / expectedCompletions : 0;
}

function getExpectedCompletions(frequency: HabitFrequency, days: number): number {
  switch (frequency) {
    case 'daily':
      return days;
    case '3x_week':
      return Math.floor((days / 7) * 3);
    case 'weekly':
      return Math.floor(days / 7);
    case 'monthly':
      return Math.floor(days / 30);
    default:
      return 0;
  }
}
