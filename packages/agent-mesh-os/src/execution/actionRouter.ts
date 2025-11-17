/**
 * Action Router
 * Routes non-binding recommendations to target systems
 */

import type { Action } from '../types';
import { writeShared } from '../memory/meshMemory';

/**
 * Route an action to the appropriate system
 * IMPORTANT: All actions are NON-BINDING recommendations only
 */
export async function routeAction(action: Action, workspaceId: string): Promise<void> {
  // All actions are written to shared memory as recommendations
  // Target systems can read and choose to act on them

  const key = `recommendation:${action.target_system}:${Date.now()}`;

  await writeShared(
    key,
    {
      ...action,
      routed_at: new Date().toISOString(),
    },
    action.source_agent,
    workspaceId
  );

  // Could also write to awareness_signals for high-priority items
  if (action.priority === 'urgent' || action.priority === 'high') {
    // Write to Core Awareness Layer
    // This is just a recommendation, not a binding action
  }
}

/**
 * Get pending recommendations for a system
 */
export async function getPendingRecommendations(
  targetSystem: string,
  workspaceId: string
): Promise<Action[]> {
  // Read from shared memory
  // This would query mesh_memory_shared for recommendations
  // Simplified for now - would integrate with actual systems

  return [];
}

/**
 * Mark recommendation as acknowledged
 */
export async function acknowledgeRecommendation(
  recommendationKey: string,
  workspaceId: string,
  response: 'accepted' | 'rejected' | 'deferred'
): Promise<void> {
  await writeShared(
    `${recommendationKey}:ack`,
    {
      response,
      acknowledged_at: new Date().toISOString(),
    },
    'system',
    workspaceId
  );
}
