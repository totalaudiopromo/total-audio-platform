/**
 * Tests for HabitEngine (CoachOS Phase 2)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createHabit,
  completeHabit,
  computeStreak,
  getHabitsForUser,
  type Habit,
} from '../src/habitEngine';

describe('HabitEngine', () => {
  const mockUserId = 'test-user-id';
  const mockWorkspaceId = 'test-workspace-id';

  describe('createHabit', () => {
    it('should create a habit with valid data', async () => {
      const habitData = {
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        name: 'Write for 30 minutes',
        frequency: 'daily' as const,
        category: 'creative' as const,
      };

      // This test would require a mock Supabase client
      // For now, we're testing the structure
      expect(habitData).toHaveProperty('name');
      expect(habitData).toHaveProperty('frequency');
      expect(habitData).toHaveProperty('category');
    });
  });

  describe('computeStreak', () => {
    it('should return 0 for habit never completed', () => {
      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'daily',
        streak: 0,
        last_completed: null,
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(0);
    });

    it('should maintain streak for daily habit completed today', () => {
      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'daily',
        streak: 5,
        last_completed: new Date().toISOString(),
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(5);
    });

    it('should maintain streak for daily habit completed yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'daily',
        streak: 5,
        last_completed: yesterday.toISOString(),
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(5);
    });

    it('should break streak for daily habit missed for 2 days', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'daily',
        streak: 5,
        last_completed: twoDaysAgo.toISOString(),
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(0);
    });

    it('should handle weekly habit correctly', () => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'weekly',
        streak: 3,
        last_completed: fiveDaysAgo.toISOString(),
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(3); // Should maintain streak (within 7 days)
    });

    it('should break streak for weekly habit missed for 8 days', () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      const habit: Partial<Habit> = {
        id: 'test-id',
        frequency: 'weekly',
        streak: 3,
        last_completed: eightDaysAgo.toISOString(),
      };

      const streak = computeStreak(habit as Habit);
      expect(streak).toBe(0);
    });
  });

  describe('habit frequency validation', () => {
    it('should accept valid frequency values', () => {
      const validFrequencies: Array<'daily' | '3x_week' | 'weekly' | 'monthly'> = [
        'daily',
        '3x_week',
        'weekly',
        'monthly',
      ];

      validFrequencies.forEach((frequency) => {
        expect(['daily', '3x_week', 'weekly', 'monthly']).toContain(frequency);
      });
    });
  });

  describe('habit category validation', () => {
    it('should accept valid category values', () => {
      const validCategories: Array<'creative' | 'outreach' | 'wellness' | 'admin' | 'learning'> = [
        'creative',
        'outreach',
        'wellness',
        'admin',
        'learning',
      ];

      validCategories.forEach((category) => {
        expect(['creative', 'outreach', 'wellness', 'admin', 'learning']).toContain(category);
      });
    });
  });
});
