/**
 * API Route: /api/coach/calendar
 * GET - List calendar events for a date range
 * POST - Create a new calendar event or generate from weekly plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createCalendarEvent,
  listCalendarEvents,
  getCalendarSummary,
  generateCalendarFromWeeklyPlan,
  syncHabitEvents,
  type CalendarEventType,
  type CalendarCategory,
} from '@total-audio/coach-os/calendar';
import { getHabitsForUser } from '@total-audio/coach-os/habits';

const createCalendarEventSchema = z.object({
  eventType: z.enum(['task', 'habit', 'routine', 'manual', 'goal_milestone']),
  sourceId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().datetime(), // ISO 8601 datetime
  endTime: z.string().datetime().optional(),
  category: z.enum(['creative', 'promotional', 'relationship', 'career', 'wellbeing', 'admin', 'learning']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * GET /api/coach/calendar
 * List calendar events for a date range
 * Query params:
 *   - startDate: Start of date range (ISO 8601)
 *   - endDate: End of date range (ISO 8601)
 *   - eventType: Filter by event type (optional)
 *   - category: Filter by category (optional)
 *   - summary: Return summary instead of events (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse date range
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    // TODO: Get userId and workspaceId from authenticated session
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    // Check if requesting summary
    const wantsSummary = searchParams.get('summary') === 'true';
    if (wantsSummary) {
      const summary = await getCalendarSummary(userId, workspaceId, startDate);
      return NextResponse.json({ summary });
    }

    // Get filters
    const eventType = searchParams.get('eventType') as CalendarEventType | null;
    const category = searchParams.get('category') as CalendarCategory | null;
    const completed = searchParams.get('completed');

    const filters = {
      eventType: eventType || undefined,
      category: category || undefined,
      completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
    };

    const events = await listCalendarEvents(userId, workspaceId, startDate, endDate, filters);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to get calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to get calendar events' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coach/calendar
 * Create a new calendar event or generate from weekly plan/habits
 * Body options:
 *   1. Single event creation: { eventType, title, startTime, ... }
 *   2. Generate from weekly plan: { action: 'generate_from_weekly_plan', weeklyPlanId: '...' }
 *   3. Sync habits: { action: 'sync_habits', weekStart: '...' }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Get userId and workspaceId from authenticated session
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    // Check if this is a batch action
    if (body.action === 'generate_from_weekly_plan') {
      // Generate calendar from weekly plan
      const { weeklyPlanId } = body;
      if (!weeklyPlanId) {
        return NextResponse.json(
          { error: 'weeklyPlanId is required' },
          { status: 400 }
        );
      }

      // Fetch weekly plan (would need to import session getter)
      // For now, return error as placeholder
      return NextResponse.json(
        { error: 'Weekly plan calendar generation not yet implemented' },
        { status: 501 }
      );
    }

    if (body.action === 'sync_habits') {
      // Sync habits to calendar
      const { weekStart } = body;
      if (!weekStart) {
        return NextResponse.json(
          { error: 'weekStart is required' },
          { status: 400 }
        );
      }

      const habits = await getHabitsForUser(userId, workspaceId);
      const events = await syncHabitEvents(habits, userId, workspaceId, new Date(weekStart));

      return NextResponse.json({ events, count: events.length }, { status: 201 });
    }

    // Single event creation
    const validated = createCalendarEventSchema.parse(body);

    const event = await createCalendarEvent({
      userId,
      workspaceId,
      eventType: validated.eventType as CalendarEventType,
      sourceId: validated.sourceId,
      title: validated.title,
      description: validated.description,
      startTime: new Date(validated.startTime),
      endTime: validated.endTime ? new Date(validated.endTime) : undefined,
      category: validated.category as CalendarCategory | undefined,
      metadata: validated.metadata,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}
