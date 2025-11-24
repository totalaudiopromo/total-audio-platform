/**
 * CoachOS Profile Management
 * Create, read, update coach profiles
 */

import { createClient } from '@total-audio/core-db/server';
import type { CoachProfile, CoachRole, ExperienceLevel, CoachPreferences } from './types';
import { logger } from './utils/logger';

export interface CreateProfileInput {
  userId: string;
  role: CoachRole;
  experienceLevel: ExperienceLevel;
  genre?: string;
  preferences?: CoachPreferences;
}

export interface UpdateProfileInput {
  role?: CoachRole;
  experienceLevel?: ExperienceLevel;
  genre?: string;
  preferences?: CoachPreferences;
}

/**
 * Get a user's coach profile
 */
export async function getCoachProfile(userId: string): Promise<CoachProfile | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }

    logger.info('Retrieved coach profile', { userId });
    return data;
  } catch (error) {
    logger.error('Failed to get coach profile', error);
    throw error;
  }
}

/**
 * Create a new coach profile
 */
export async function createCoachProfile(input: CreateProfileInput): Promise<CoachProfile> {
  try {
    const supabase = createClient();

    const profileData = {
      user_id: input.userId,
      role: input.role,
      experience_level: input.experienceLevel,
      genre: input.genre,
      preferences: input.preferences || {},
      goals: [],
    };

    const { data, error } = await supabase
      .from('coach_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;

    logger.info('Created coach profile', { userId: input.userId, role: input.role });
    return data;
  } catch (error) {
    logger.error('Failed to create coach profile', error);
    throw error;
  }
}

/**
 * Update an existing coach profile
 */
export async function updateCoachProfile(
  userId: string,
  updates: UpdateProfileInput
): Promise<CoachProfile> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('coach_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Updated coach profile', { userId });
    return data;
  } catch (error) {
    logger.error('Failed to update coach profile', error);
    throw error;
  }
}

/**
 * Get or create a coach profile (ensures profile exists)
 */
export async function ensureCoachProfile(
  userId: string,
  defaults?: CreateProfileInput
): Promise<CoachProfile> {
  const existing = await getCoachProfile(userId);

  if (existing) {
    return existing;
  }

  if (!defaults) {
    throw new Error('No coach profile exists and no defaults provided');
  }

  return createCoachProfile(defaults);
}

/**
 * Delete a coach profile
 */
export async function deleteCoachProfile(userId: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('coach_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    logger.info('Deleted coach profile', { userId });
  } catch (error) {
    logger.error('Failed to delete coach profile', error);
    throw error;
  }
}
