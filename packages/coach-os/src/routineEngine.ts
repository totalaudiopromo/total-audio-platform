/**
 * CoachOS Phase 2: Routine Engine
 * Manages reusable routine templates with multi-step workflows
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type RoutineCategory = 'creative' | 'outreach' | 'wellness' | 'admin' | 'learning';

export interface RoutineStep {
  title: string;
  description?: string;
  duration_minutes?: number;
}

export interface Routine {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  steps: RoutineStep[];
  duration_minutes: number | null;
  category: RoutineCategory | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRoutineInput {
  userId: string;
  workspaceId: string;
  name: string;
  description?: string;
  steps: RoutineStep[];
  category?: RoutineCategory;
}

/**
 * Create a new routine template
 */
export async function createRoutine(input: CreateRoutineInput): Promise<Routine> {
  // Calculate total duration from steps
  const duration_minutes = input.steps.reduce(
    (total, step) => total + (step.duration_minutes || 0),
    0
  );

  const { data, error } = await supabase
    .from('coach_routines')
    .insert({
      user_id: input.userId,
      workspace_id: input.workspaceId,
      name: input.name,
      description: input.description || null,
      steps: input.steps,
      duration_minutes: duration_minutes > 0 ? duration_minutes : null,
      category: input.category || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create routine: ${error.message}`);
  return data as Routine;
}

/**
 * Get a single routine by ID
 */
export async function getRoutine(routineId: string): Promise<Routine | null> {
  const { data, error } = await supabase
    .from('coach_routines')
    .select('*')
    .eq('id', routineId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get routine: ${error.message}`);
  }
  return data as Routine;
}

/**
 * List all routines for a user
 */
export async function listRoutines(
  userId: string,
  workspaceId: string,
  category?: RoutineCategory
): Promise<Routine[]> {
  let query = supabase
    .from('coach_routines')
    .select('*')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to list routines: ${error.message}`);
  return data as Routine[];
}

/**
 * Update a routine
 */
export async function updateRoutine(
  routineId: string,
  updates: Partial<Pick<Routine, 'name' | 'description' | 'steps' | 'category'>>
): Promise<Routine> {
  // Recalculate duration if steps are updated
  let duration_minutes: number | undefined;
  if (updates.steps) {
    duration_minutes = updates.steps.reduce(
      (total, step) => total + (step.duration_minutes || 0),
      0
    );
  }

  const updateData = {
    ...updates,
    ...(duration_minutes !== undefined && { duration_minutes }),
  };

  const { data, error } = await supabase
    .from('coach_routines')
    .update(updateData)
    .eq('id', routineId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update routine: ${error.message}`);
  return data as Routine;
}

/**
 * Delete a routine
 */
export async function deleteRoutine(routineId: string): Promise<void> {
  const { error } = await supabase
    .from('coach_routines')
    .delete()
    .eq('id', routineId);

  if (error) throw new Error(`Failed to delete routine: ${error.message}`);
}

/**
 * Apply a routine to a weekly plan
 * Returns task suggestions based on routine steps
 */
export interface RoutineTaskSuggestion {
  title: string;
  description: string;
  estimated_time_minutes: number | null;
  category: string;
  routine_id: string;
  routine_name: string;
}

export async function applyRoutineToWeeklyPlan(
  routineId: string
): Promise<RoutineTaskSuggestion[]> {
  const routine = await getRoutine(routineId);
  if (!routine) throw new Error('Routine not found');

  // Convert routine steps into task suggestions
  return routine.steps.map((step, index) => ({
    title: `${routine.name}: ${step.title}`,
    description: step.description || `Step ${index + 1} of ${routine.name}`,
    estimated_time_minutes: step.duration_minutes || null,
    category: routine.category || 'admin',
    routine_id: routine.id,
    routine_name: routine.name,
  }));
}

/**
 * Get popular routine templates (preset suggestions)
 */
export function getPresetRoutines(): Array<Omit<CreateRoutineInput, 'userId' | 'workspaceId'>> {
  return [
    {
      name: 'Morning Creative Session',
      description: 'Start the day with focused creative work',
      category: 'creative',
      steps: [
        { title: 'Review yesterday\'s progress', duration_minutes: 5 },
        { title: 'Set today\'s creative intention', duration_minutes: 5 },
        { title: 'Deep work session', duration_minutes: 90 },
        { title: 'Document ideas and progress', duration_minutes: 10 },
      ],
    },
    {
      name: 'Weekly Outreach Batch',
      description: 'Dedicated time for industry outreach',
      category: 'outreach',
      steps: [
        { title: 'Review target contact list', duration_minutes: 10 },
        { title: 'Research contacts and context', duration_minutes: 20 },
        { title: 'Draft personalized messages', duration_minutes: 30 },
        { title: 'Send and log outreach', duration_minutes: 15 },
        { title: 'Schedule follow-ups', duration_minutes: 10 },
      ],
    },
    {
      name: 'Release Week Sprint',
      description: 'Pre-release preparation routine',
      category: 'admin',
      steps: [
        { title: 'Finalize press materials', duration_minutes: 60 },
        { title: 'Confirm radio promotion timeline', duration_minutes: 20 },
        { title: 'Prepare social media content', duration_minutes: 45 },
        { title: 'Update website and streaming platforms', duration_minutes: 30 },
        { title: 'Brief PR contacts', duration_minutes: 20 },
      ],
    },
    {
      name: 'Wellness Check-In',
      description: 'Weekly mental and creative health routine',
      category: 'wellness',
      steps: [
        { title: 'Review energy levels and burnout signals', duration_minutes: 10 },
        { title: 'Assess creative satisfaction', duration_minutes: 10 },
        { title: 'Plan rest and recovery time', duration_minutes: 5 },
        { title: 'Adjust workload if needed', duration_minutes: 10 },
      ],
    },
    {
      name: 'Monthly Career Review',
      description: 'Strategic career planning and reflection',
      category: 'learning',
      steps: [
        { title: 'Review last month\'s achievements', duration_minutes: 15 },
        { title: 'Analyze what worked and what didn\'t', duration_minutes: 20 },
        { title: 'Set next month\'s priorities', duration_minutes: 15 },
        { title: 'Update skills and learning goals', duration_minutes: 10 },
        { title: 'Schedule key milestones', duration_minutes: 10 },
      ],
    },
  ];
}

/**
 * Suggest routines based on user context
 */
export async function suggestRoutines(
  userId: string,
  workspaceId: string,
  context?: { role?: string; experience_level?: string }
): Promise<Array<Omit<CreateRoutineInput, 'userId' | 'workspaceId'>>> {
  // Get preset routines
  const presets = getPresetRoutines();

  // Filter based on context (if provided)
  // For now, return all presets
  // In a full implementation, we'd use AI to personalize based on role and experience
  return presets;
}
