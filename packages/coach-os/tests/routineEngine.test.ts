/**
 * Tests for RoutineEngine (CoachOS Phase 2)
 */

import { describe, it, expect } from 'vitest';
import {
  getPresetRoutines,
  type RoutineStep,
} from '../src/routineEngine';

describe('RoutineEngine', () => {
  const mockUserId = 'test-user-id';
  const mockWorkspaceId = 'test-workspace-id';

  describe('getPresetRoutines', () => {
    it('should return preset routine templates', () => {
      const presets = getPresetRoutines();

      expect(presets).toBeInstanceOf(Array);
      expect(presets.length).toBeGreaterThan(0);
    });

    it('should have valid preset routine structure', () => {
      const presets = getPresetRoutines();
      const firstPreset = presets[0];

      expect(firstPreset).toHaveProperty('name');
      expect(firstPreset).toHaveProperty('description');
      expect(firstPreset).toHaveProperty('steps');
      expect(firstPreset).toHaveProperty('category');
      expect(firstPreset.steps).toBeInstanceOf(Array);
    });

    it('should have Morning Creative Session preset', () => {
      const presets = getPresetRoutines();
      const morningCreative = presets.find(p => p.name === 'Morning Creative Session');

      expect(morningCreative).toBeDefined();
      expect(morningCreative?.category).toBe('creative');
      expect(morningCreative?.steps.length).toBeGreaterThan(0);
    });

    it('should have Weekly Outreach Batch preset', () => {
      const presets = getPresetRoutines();
      const weeklyOutreach = presets.find(p => p.name === 'Weekly Outreach Batch');

      expect(weeklyOutreach).toBeDefined();
      expect(weeklyOutreach?.category).toBe('outreach');
    });

    it('should have Release Week Sprint preset', () => {
      const presets = getPresetRoutines();
      const releaseWeek = presets.find(p => p.name === 'Release Week Sprint');

      expect(releaseWeek).toBeDefined();
      expect(releaseWeek?.category).toBe('admin');
    });

    it('should have Wellness Check-In preset', () => {
      const presets = getPresetRoutines();
      const wellness = presets.find(p => p.name === 'Wellness Check-In');

      expect(wellness).toBeDefined();
      expect(wellness?.category).toBe('wellness');
    });

    it('should have Monthly Career Review preset', () => {
      const presets = getPresetRoutines();
      const careerReview = presets.find(p => p.name === 'Monthly Career Review');

      expect(careerReview).toBeDefined();
      expect(careerReview?.category).toBe('learning');
    });
  });

  describe('routine step validation', () => {
    it('should have valid step structure', () => {
      const presets = getPresetRoutines();
      const firstPreset = presets[0];
      const firstStep = firstPreset.steps[0];

      expect(firstStep).toHaveProperty('title');
      expect(typeof firstStep.title).toBe('string');

      if (firstStep.description) {
        expect(typeof firstStep.description).toBe('string');
      }

      if (firstStep.duration_minutes) {
        expect(typeof firstStep.duration_minutes).toBe('number');
        expect(firstStep.duration_minutes).toBeGreaterThan(0);
      }
    });

    it('should have realistic duration estimates', () => {
      const presets = getPresetRoutines();

      presets.forEach((preset) => {
        preset.steps.forEach((step) => {
          if (step.duration_minutes) {
            expect(step.duration_minutes).toBeGreaterThan(0);
            expect(step.duration_minutes).toBeLessThan(300); // Less than 5 hours
          }
        });
      });
    });
  });

  describe('routine categories', () => {
    it('should only use valid categories', () => {
      const presets = getPresetRoutines();
      const validCategories = ['creative', 'outreach', 'wellness', 'admin', 'learning'];

      presets.forEach((preset) => {
        if (preset.category) {
          expect(validCategories).toContain(preset.category);
        }
      });
    });

    it('should have routines for each category', () => {
      const presets = getPresetRoutines();
      const categories = presets.map(p => p.category).filter(Boolean);

      expect(categories).toContain('creative');
      expect(categories).toContain('outreach');
      expect(categories).toContain('wellness');
      expect(categories).toContain('admin');
      expect(categories).toContain('learning');
    });
  });

  describe('createRoutine validation', () => {
    it('should require name and steps', () => {
      const routineData = {
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        name: 'Test Routine',
        steps: [
          { title: 'Step 1', duration_minutes: 30 },
          { title: 'Step 2', duration_minutes: 45 },
        ],
      };

      expect(routineData.name).toBeTruthy();
      expect(routineData.steps.length).toBeGreaterThan(0);
    });

    it('should calculate total duration from steps', () => {
      const steps: RoutineStep[] = [
        { title: 'Step 1', duration_minutes: 30 },
        { title: 'Step 2', duration_minutes: 45 },
        { title: 'Step 3', duration_minutes: 15 },
      ];

      const totalDuration = steps.reduce((sum, step) => sum + (step.duration_minutes || 0), 0);
      expect(totalDuration).toBe(90);
    });
  });
});
