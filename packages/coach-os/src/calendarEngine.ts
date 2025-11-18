/**
 * CoachOS Phase 2: Calendar Engine
 * Manages calendar events from tasks, habits, routines, and manual entries
 */

import { createClient } from '@supabase/supabase-js';
import type { CoachSession, CoachTask } from './types';
import type { Habit } from './habitEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type CalendarEventType = 'task' | 'habit' | 'routine' | 'manual' | 'goal_milestone';
export type CalendarCategory = 'creative' | 'promotional' | 'relationship' | 'career' | 'wellbeing' | 'admin' | 'learning';

export interface CalendarEvent {
  id: string;
  user_id: string;
  workspace_id: string;
  event_type: CalendarEventType;
  source_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  category: CalendarCategory | null;
  metadata: Record<string, any>;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventInput {
  userId: string;
  workspaceId: string;
  eventType: CalendarEventType;
  sourceId?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  category?: CalendarCategory;
  metadata?: Record<string, any>;
}

/**
 * Create a new calendar event
 */
export async function createCalendarEvent(input: CreateCalendarEventInput): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('coach_calendar_events')
    .insert({
      user_id: input.userId,
      workspace_id: input.workspaceId,
      event_type: input.eventType,
      source_id: input.sourceId || null,
      title: input.title,
      description: input.description || null,
      start_time: input.startTime.toISOString(),
      end_time: input.endTime?.toISOString() || null,
      category: input.category || null,
      metadata: input.metadata || {},
      completed: false,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create calendar event: ${error.message}`);
  return data as CalendarEvent;
}

/**
 * List calendar events for a user within a date range
 */
export async function listCalendarEvents(
  userId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  filters?: {
    eventType?: CalendarEventType;
    category?: CalendarCategory;
    completed?: boolean;
  }
): Promise<CalendarEvent[]> {
  let query = supabase
    .from('coach_calendar_events')
    .select('*')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString());

  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.completed !== undefined) {
    query = query.eq('completed', filters.completed);
  }

  const { data, error } = await query.order('start_time', { ascending: true });

  if (error) throw new Error(`Failed to list calendar events: ${error.message}`);
  return data as CalendarEvent[];
}

/**
 * Get a single calendar event by ID
 */
export async function getCalendarEvent(eventId: string): Promise<CalendarEvent | null> {
  const { data, error } = await supabase
    .from('coach_calendar_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get calendar event: ${error.message}`);
  }
  return data as CalendarEvent;
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  updates: Partial<Pick<CalendarEvent, 'title' | 'description' | 'start_time' | 'end_time' | 'category' | 'completed' | 'metadata'>>
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('coach_calendar_events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update calendar event: ${error.message}`);
  return data as CalendarEvent;
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('coach_calendar_events')
    .delete()
    .eq('id', eventId);

  if (error) throw new Error(`Failed to delete calendar event: ${error.message}`);
}

/**
 * Mark a calendar event as completed
 */
export async function completeCalendarEvent(eventId: string): Promise<CalendarEvent> {
  return updateCalendarEvent(eventId, { completed: true });
}

/**
 * Generate calendar events from a weekly plan
 */
export async function generateCalendarFromWeeklyPlan(
  weeklyPlan: CoachSession,
  userId: string,
  workspaceId: string
): Promise<CalendarEvent[]> {
  if (!weeklyPlan.weekly_plan?.tasks) {
    throw new Error('Weekly plan has no tasks');
  }

  const weekStart = new Date(weeklyPlan.week_start_date);
  const events: CalendarEvent[] = [];

  // Distribute tasks across the week
  // Creative tasks: Morning slots
  // Promotional tasks: Afternoon slots
  // Relationship tasks: Spread throughout week
  // Career/Wellbeing: Specific days

  const creativeTasks = weeklyPlan.weekly_plan.tasks.filter(t => t.category === 'creative');
  const promotionalTasks = weeklyPlan.weekly_plan.tasks.filter(t => t.category === 'promotional');
  const relationshipTasks = weeklyPlan.weekly_plan.tasks.filter(t => t.category === 'relationship');
  const careerTasks = weeklyPlan.weekly_plan.tasks.filter(t => t.category === 'career');
  const wellbeingTasks = weeklyPlan.weekly_plan.tasks.filter(t => t.category === 'wellbeing');

  let currentDay = 0;

  // Creative tasks: Mon-Wed-Fri mornings (9 AM - 12 PM)
  for (const task of creativeTasks) {
    const startTime = new Date(weekStart);
    startTime.setDate(startTime.getDate() + currentDay);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(12, 0, 0, 0);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: 'task',
      sourceId: weeklyPlan.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      category: 'creative',
      metadata: { task, week_start: weeklyPlan.week_start_date },
    });

    events.push(event);
    currentDay = (currentDay + 2) % 7; // Skip to next creative day (Mon/Wed/Fri)
  }

  // Promotional tasks: Tue-Thu afternoons (2 PM - 4 PM)
  currentDay = 1; // Start on Tuesday
  for (const task of promotionalTasks) {
    const startTime = new Date(weekStart);
    startTime.setDate(startTime.getDate() + currentDay);
    startTime.setHours(14, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(16, 0, 0, 0);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: 'task',
      sourceId: weeklyPlan.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      category: 'promotional',
      metadata: { task, week_start: weeklyPlan.week_start_date },
    });

    events.push(event);
    currentDay = (currentDay + 2) % 7;
  }

  // Relationship tasks: Spread across week (4 PM - 5 PM)
  currentDay = 0;
  for (const task of relationshipTasks) {
    const startTime = new Date(weekStart);
    startTime.setDate(startTime.getDate() + currentDay);
    startTime.setHours(16, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(17, 0, 0, 0);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: 'task',
      sourceId: weeklyPlan.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      category: 'relationship',
      metadata: { task, week_start: weeklyPlan.week_start_date },
    });

    events.push(event);
    currentDay = (currentDay + 1) % 7;
  }

  // Career tasks: Friday afternoon (1 PM - 3 PM)
  for (const task of careerTasks) {
    const startTime = new Date(weekStart);
    startTime.setDate(startTime.getDate() + 4); // Friday
    startTime.setHours(13, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(15, 0, 0, 0);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: 'task',
      sourceId: weeklyPlan.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      category: 'career',
      metadata: { task, week_start: weeklyPlan.week_start_date },
    });

    events.push(event);
  }

  // Wellbeing tasks: Sunday morning (10 AM - 11 AM)
  for (const task of wellbeingTasks) {
    const startTime = new Date(weekStart);
    startTime.setDate(startTime.getDate() + 6); // Sunday
    startTime.setHours(10, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(11, 0, 0, 0);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: 'task',
      sourceId: weeklyPlan.id,
      title: task.title,
      description: task.description,
      startTime,
      endTime,
      category: 'wellbeing',
      metadata: { task, week_start: weeklyPlan.week_start_date },
    });

    events.push(event);
  }

  return events;
}

/**
 * Sync habit events to calendar for upcoming week
 */
export async function syncHabitEvents(
  habits: Habit[],
  userId: string,
  workspaceId: string,
  weekStart: Date
): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];

  for (const habit of habits) {
    // Generate recurring events based on habit frequency
    const occurrences = getHabitOccurrences(habit, weekStart);

    for (const occurrence of occurrences) {
      const event = await createCalendarEvent({
        userId,
        workspaceId,
        eventType: 'habit',
        sourceId: habit.id,
        title: habit.name,
        description: `${habit.frequency} habit - Streak: ${habit.streak}`,
        startTime: occurrence.start,
        endTime: occurrence.end,
        category: mapHabitCategoryToCalendar(habit.category),
        metadata: { habit, streak: habit.streak },
      });

      events.push(event);
    }
  }

  return events;
}

/**
 * Get habit occurrence times for a week
 */
function getHabitOccurrences(
  habit: Habit,
  weekStart: Date
): Array<{ start: Date; end: Date }> {
  const occurrences: Array<{ start: Date; end: Date }> = [];

  switch (habit.frequency) {
    case 'daily':
      // Every day at 8 AM
      for (let i = 0; i < 7; i++) {
        const start = new Date(weekStart);
        start.setDate(start.getDate() + i);
        start.setHours(8, 0, 0, 0);

        const end = new Date(start);
        end.setHours(8, 30, 0, 0);

        occurrences.push({ start, end });
      }
      break;

    case '3x_week':
      // Mon, Wed, Fri at 8 AM
      [0, 2, 4].forEach((dayOffset) => {
        const start = new Date(weekStart);
        start.setDate(start.getDate() + dayOffset);
        start.setHours(8, 0, 0, 0);

        const end = new Date(start);
        end.setHours(8, 30, 0, 0);

        occurrences.push({ start, end });
      });
      break;

    case 'weekly':
      // Monday at 8 AM
      const start = new Date(weekStart);
      start.setHours(8, 0, 0, 0);

      const end = new Date(start);
      end.setHours(8, 30, 0, 0);

      occurrences.push({ start, end });
      break;

    case 'monthly':
      // First day of week at 8 AM
      const monthlyStart = new Date(weekStart);
      monthlyStart.setHours(8, 0, 0, 0);

      const monthlyEnd = new Date(monthlyStart);
      monthlyEnd.setHours(8, 30, 0, 0);

      occurrences.push({ start: monthlyStart, end: monthlyEnd });
      break;
  }

  return occurrences;
}

/**
 * Map habit category to calendar category
 */
function mapHabitCategoryToCalendar(category: string): CalendarCategory {
  const mapping: Record<string, CalendarCategory> = {
    creative: 'creative',
    outreach: 'promotional',
    wellness: 'wellbeing',
    admin: 'admin',
    learning: 'learning',
  };
  return mapping[category] || 'admin';
}

/**
 * Get calendar summary for a week
 */
export interface CalendarSummary {
  totalEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  eventsByCategory: Record<CalendarCategory, number>;
  eventsByType: Record<CalendarEventType, number>;
}

export async function getCalendarSummary(
  userId: string,
  workspaceId: string,
  weekStart: Date
): Promise<CalendarSummary> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const events = await listCalendarEvents(userId, workspaceId, weekStart, weekEnd);

  const summary: CalendarSummary = {
    totalEvents: events.length,
    completedEvents: events.filter(e => e.completed).length,
    upcomingEvents: events.filter(e => !e.completed && new Date(e.start_time) > new Date()).length,
    eventsByCategory: {} as Record<CalendarCategory, number>,
    eventsByType: {} as Record<CalendarEventType, number>,
  };

  // Count by category
  events.forEach((event) => {
    if (event.category) {
      summary.eventsByCategory[event.category] = (summary.eventsByCategory[event.category] || 0) + 1;
    }
    summary.eventsByType[event.event_type] = (summary.eventsByType[event.event_type] || 0) + 1;
  });

  return summary;
}
