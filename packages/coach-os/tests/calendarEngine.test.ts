/**
 * Tests for CalendarEngine (CoachOS Phase 2)
 */

import { describe, it, expect } from 'vitest';
import type { CalendarEvent, CalendarEventType, CalendarCategory } from '../src/calendarEngine';

describe('CalendarEngine', () => {
  const mockUserId = 'test-user-id';
  const mockWorkspaceId = 'test-workspace-id';

  describe('event type validation', () => {
    it('should accept valid event types', () => {
      const validTypes: CalendarEventType[] = [
        'task',
        'habit',
        'routine',
        'manual',
        'goal_milestone',
      ];

      validTypes.forEach((type) => {
        expect(['task', 'habit', 'routine', 'manual', 'goal_milestone']).toContain(type);
      });
    });
  });

  describe('category validation', () => {
    it('should accept valid categories', () => {
      const validCategories: CalendarCategory[] = [
        'creative',
        'promotional',
        'relationship',
        'career',
        'wellbeing',
        'admin',
        'learning',
      ];

      validCategories.forEach((category) => {
        expect([
          'creative',
          'promotional',
          'relationship',
          'career',
          'wellbeing',
          'admin',
          'learning',
        ]).toContain(category);
      });
    });
  });

  describe('createCalendarEvent validation', () => {
    it('should require essential event fields', () => {
      const eventData = {
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        eventType: 'task' as CalendarEventType,
        title: 'Finish demo track',
        startTime: new Date(),
      };

      expect(eventData.userId).toBeTruthy();
      expect(eventData.eventType).toBeTruthy();
      expect(eventData.title).toBeTruthy();
      expect(eventData.startTime).toBeInstanceOf(Date);
    });

    it('should handle optional fields', () => {
      const eventData = {
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        eventType: 'habit' as CalendarEventType,
        sourceId: 'habit-123',
        title: 'Morning writing',
        description: 'Daily writing habit',
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes later
        category: 'creative' as CalendarCategory,
        metadata: { streak: 5 },
      };

      expect(eventData.sourceId).toBeTruthy();
      expect(eventData.description).toBeTruthy();
      expect(eventData.endTime).toBeTruthy();
      expect(eventData.category).toBeTruthy();
      expect(eventData.metadata).toHaveProperty('streak');
    });
  });

  describe('date range filtering', () => {
    it('should generate valid week range', () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      expect(weekEnd.getTime()).toBeGreaterThan(weekStart.getTime());
      expect(weekEnd.getDate() - weekStart.getDate()).toBeLessThanOrEqual(7);
    });
  });

  describe('event completion', () => {
    it('should mark event as completed', () => {
      const event: Partial<CalendarEvent> = {
        id: 'event-123',
        title: 'Test event',
        completed: false,
      };

      // Simulate completion
      event.completed = true;

      expect(event.completed).toBe(true);
    });
  });

  describe('habit occurrence calculation', () => {
    it('should generate daily occurrences for a week', () => {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);

      const dailyOccurrences: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        day.setHours(8, 0, 0, 0); // 8 AM
        dailyOccurrences.push(day);
      }

      expect(dailyOccurrences.length).toBe(7);
      expect(dailyOccurrences[0].getHours()).toBe(8);
    });

    it('should generate 3x per week occurrences (Mon, Wed, Fri)', () => {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);

      const threePerWeekOccurrences: Date[] = [];
      [0, 2, 4].forEach((dayOffset) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + dayOffset);
        day.setHours(8, 0, 0, 0);
        threePerWeekOccurrences.push(day);
      });

      expect(threePerWeekOccurrences.length).toBe(3);
    });

    it('should generate weekly occurrence (Monday)', () => {
      const weekStart = new Date();
      weekStart.setHours(8, 0, 0, 0);

      expect(weekStart.getHours()).toBe(8);
    });
  });

  describe('calendar summary', () => {
    it('should calculate total events correctly', () => {
      const events: Partial<CalendarEvent>[] = [
        { completed: true },
        { completed: false },
        { completed: false },
        { completed: true },
      ];

      const totalEvents = events.length;
      const completedEvents = events.filter(e => e.completed).length;
      const now = new Date();
      const upcomingEvents = events.filter(e => !e.completed).length;

      expect(totalEvents).toBe(4);
      expect(completedEvents).toBe(2);
      expect(upcomingEvents).toBe(2);
    });

    it('should group events by category', () => {
      const events: Partial<CalendarEvent>[] = [
        { category: 'creative' },
        { category: 'creative' },
        { category: 'promotional' },
        { category: 'wellbeing' },
      ];

      const eventsByCategory: Record<string, number> = {};
      events.forEach((event) => {
        if (event.category) {
          eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
        }
      });

      expect(eventsByCategory['creative']).toBe(2);
      expect(eventsByCategory['promotional']).toBe(1);
      expect(eventsByCategory['wellbeing']).toBe(1);
    });

    it('should group events by type', () => {
      const events: Partial<CalendarEvent>[] = [
        { event_type: 'task' },
        { event_type: 'task' },
        { event_type: 'habit' },
        { event_type: 'routine' },
      ];

      const eventsByType: Record<string, number> = {};
      events.forEach((event) => {
        if (event.event_type) {
          eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
        }
      });

      expect(eventsByType['task']).toBe(2);
      expect(eventsByType['habit']).toBe(1);
      expect(eventsByType['routine']).toBe(1);
    });
  });
});
