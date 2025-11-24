/**
 * Run Determinism
 *
 * Ensures runs are deterministic and reproducible
 */

import type { AutopilotTask } from '../types';

export interface DeterministicConfig {
  seed?: number;
  sortStrategy: 'priority' | 'created' | 'sequence';
  enableRandomness: boolean;
}

export const DEFAULT_DETERMINISTIC_CONFIG: DeterministicConfig = {
  sortStrategy: 'sequence',
  enableRandomness: false,
};

/**
 * Generate deterministic seed from mission ID
 */
export function generateSeed(missionId: string): number {
  let hash = 0;
  for (let i = 0; i < missionId.length; i++) {
    const char = missionId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator for deterministic randomness
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

/**
 * Sort tasks deterministically
 */
export function sortTasksDeterministic(
  tasks: AutopilotTask[],
  config: DeterministicConfig = DEFAULT_DETERMINISTIC_CONFIG
): AutopilotTask[] {
  const sorted = [...tasks];

  switch (config.sortStrategy) {
    case 'priority':
      sorted.sort((a, b) => {
        // Higher priority first
        if (b.priority !== a.priority) return b.priority - a.priority;
        // Then by sequence order
        return a.sequence_order - b.sequence_order;
      });
      break;

    case 'created':
      sorted.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeA - timeB;
      });
      break;

    case 'sequence':
    default:
      sorted.sort((a, b) => a.sequence_order - b.sequence_order);
      break;
  }

  return sorted;
}

/**
 * Get next task deterministically
 */
export function getNextTaskDeterministic(
  tasks: AutopilotTask[],
  config: DeterministicConfig = DEFAULT_DETERMINISTIC_CONFIG
): AutopilotTask | null {
  const pendingTasks = tasks.filter((t) => t.status === 'pending');

  if (pendingTasks.length === 0) return null;

  const sorted = sortTasksDeterministic(pendingTasks, config);
  return sorted[0];
}

/**
 * Generate execution plan (ordered list of task IDs)
 */
export function generateExecutionPlan(
  tasks: AutopilotTask[],
  config: DeterministicConfig = DEFAULT_DETERMINISTIC_CONFIG
): string[] {
  const sorted = sortTasksDeterministic(tasks, config);
  return sorted.map((t) => t.id);
}

/**
 * Validate execution plan matches expected order
 */
export function validateExecutionOrder(
  executedTaskIds: string[],
  expectedPlan: string[]
): { valid: boolean; deviations: string[] } {
  const deviations: string[] = [];

  for (let i = 0; i < executedTaskIds.length; i++) {
    if (executedTaskIds[i] !== expectedPlan[i]) {
      deviations.push(
        `Position ${i}: expected ${expectedPlan[i]}, got ${executedTaskIds[i]}`
      );
    }
  }

  return {
    valid: deviations.length === 0,
    deviations,
  };
}

/**
 * Create deterministic execution context
 */
export function createDeterministicContext(missionId: string) {
  const seed = generateSeed(missionId);
  const rng = new SeededRandom(seed);

  return {
    seed,
    rng,
    timestamp: new Date().toISOString(),
    missionId,
  };
}
