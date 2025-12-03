'use client';

import { useState, useEffect, useCallback } from 'react';

export type MilestoneType =
  | 'contacts_enriched'
  | 'pitches_generated'
  | 'campaigns_created'
  | 'time_saved';

const STORAGE_KEY = 'tap_milestones';

/**
 * Milestone thresholds for each type
 */
const MILESTONES: Record<MilestoneType, number[]> = {
  contacts_enriched: [10, 50, 100, 500],
  pitches_generated: [1, 10, 50, 100],
  campaigns_created: [1, 5, 10],
  time_saved: [], // Special case - triggered manually with custom values
};

/**
 * Get milestone key for storage
 */
function getMilestoneKey(type: MilestoneType, count: number): string {
  return `${type}:${count}`;
}

/**
 * Load seen milestones from localStorage (SSR-safe)
 */
function loadSeenMilestones(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    }
  } catch (error) {
    console.error('Failed to load milestones from localStorage:', error);
  }

  return new Set();
}

/**
 * Save seen milestones to localStorage (SSR-safe)
 */
function saveSeenMilestones(milestones: Set<string>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(milestones)));
  } catch (error) {
    console.error('Failed to save milestones to localStorage:', error);
  }
}

/**
 * useMilestones Hook
 *
 * Manages milestone tracking and detection across Total Audio apps.
 * Uses localStorage to remember which milestones have been shown.
 *
 * Features:
 * - SSR-safe (checks window before localStorage access)
 * - Threshold-based detection (only shows milestones at specific counts)
 * - Persistent tracking (won't show the same milestone twice)
 * - Manual reset capability
 *
 * Milestone Thresholds:
 * - contacts_enriched: 10, 50, 100, 500
 * - pitches_generated: 1, 10, 50, 100
 * - campaigns_created: 1, 5, 10
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { checkMilestone, resetMilestones } = useMilestones();
 *
 *   // After enriching a contact
 *   const handleEnrich = async () => {
 *     await enrichContact();
 *     const newTotal = totalEnriched + 1;
 *
 *     // Returns true if this count is a new milestone
 *     if (checkMilestone('contacts_enriched', newTotal)) {
 *       showMilestoneToast('contacts_enriched', newTotal);
 *     }
 *   };
 *
 *   return <button onClick={handleEnrich}>Enrich Contact</button>;
 * }
 * ```
 */
export function useMilestones() {
  const [seenMilestones, setSeenMilestones] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  // Load milestones from localStorage on mount (client-side only)
  useEffect(() => {
    setSeenMilestones(loadSeenMilestones());
    setIsHydrated(true);
  }, []);

  /**
   * Check if a count represents a new milestone
   * Returns true if this is a milestone that hasn't been seen yet
   */
  const checkMilestone = useCallback(
    (type: MilestoneType, count: number): boolean => {
      // Wait for hydration to avoid SSR mismatches
      if (!isHydrated) {
        return false;
      }

      // Check if this count is a milestone threshold
      const thresholds = MILESTONES[type];
      if (!thresholds.includes(count)) {
        return false;
      }

      // Check if we've already shown this milestone
      const key = getMilestoneKey(type, count);
      if (seenMilestones.has(key)) {
        return false;
      }

      // Mark as seen and save to localStorage
      const updatedMilestones = new Set(seenMilestones);
      updatedMilestones.add(key);
      setSeenMilestones(updatedMilestones);
      saveSeenMilestones(updatedMilestones);

      return true;
    },
    [seenMilestones, isHydrated]
  );

  /**
   * Reset all milestones (useful for testing or user preference)
   */
  const resetMilestones = useCallback(() => {
    setSeenMilestones(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /**
   * Check if a specific milestone has been seen
   */
  const hasSeen = useCallback(
    (type: MilestoneType, count: number): boolean => {
      const key = getMilestoneKey(type, count);
      return seenMilestones.has(key);
    },
    [seenMilestones]
  );

  /**
   * Get all seen milestones for a specific type
   */
  const getSeenMilestones = useCallback(
    (type: MilestoneType): number[] => {
      const prefix = `${type}:`;
      return Array.from(seenMilestones)
        .filter(key => key.startsWith(prefix))
        .map(key => parseInt(key.split(':')[1], 10))
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);
    },
    [seenMilestones]
  );

  return {
    checkMilestone,
    resetMilestones,
    hasSeen,
    getSeenMilestones,
    isHydrated,
  };
}
