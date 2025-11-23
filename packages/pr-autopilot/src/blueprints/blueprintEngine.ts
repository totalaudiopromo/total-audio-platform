/**
 * Blueprint Engine
 *
 * Loads and applies mission blueprints (campaign templates)
 */

import type { AutopilotMission, AutopilotTask } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Import blueprint JSON files
import singleRelease from './single_release.json';
import hybridPressPlaylist from './hybrid_press_playlist.json';
import reviveCampaign from './revive_campaign.json';
import growthPlan3Month from './growth_plan_3month.json';
import tiktokPushCycle from './tiktok_push_cycle.json';

export interface BlueprintPhase {
  name: string;
  duration: string;
  description: string;
  intensity: number;
}

export interface BlueprintConstraints {
  maxContacts: number;
  followupIntensity: number;
  noWeekendSends: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  maxEmailsPerDay?: number;
  minDaysBetweenFollowups?: number;
  requiresManualApproval?: boolean;
  valueAddRequired?: boolean;
  segmentationRequired?: boolean;
  contentDrivenRequired?: boolean;
  tieredApproach?: boolean;
  rapidResponseRequired?: boolean;
  shortFormOptimised?: boolean;
}

export interface MissionBlueprint {
  name: string;
  description: string;
  estimatedDuration: string;
  tasks: string[];
  constraints: BlueprintConstraints;
  phases: BlueprintPhase[];
  recommendedMode: 'suggest' | 'semi_auto' | 'full_auto';
  tags: string[];
}

const blueprints: Record<string, MissionBlueprint> = {
  'single_release': singleRelease as MissionBlueprint,
  'hybrid_press_playlist': hybridPressPlaylist as MissionBlueprint,
  'revive_campaign': reviveCampaign as MissionBlueprint,
  'growth_plan_3month': growthPlan3Month as MissionBlueprint,
  'tiktok_push_cycle': tiktokPushCycle as MissionBlueprint,
};

/**
 * Get all available blueprints
 */
export function listBlueprints(): MissionBlueprint[] {
  return Object.values(blueprints);
}

/**
 * Load a specific blueprint by name
 */
export function loadBlueprint(name: string): MissionBlueprint | null {
  return blueprints[name] || null;
}

/**
 * Get blueprints filtered by tags
 */
export function getBlueprintsByTag(tag: string): MissionBlueprint[] {
  return Object.values(blueprints).filter((bp) => bp.tags.includes(tag));
}

/**
 * Search blueprints by keyword
 */
export function searchBlueprints(query: string): MissionBlueprint[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(blueprints).filter((bp) => {
    return (
      bp.name.toLowerCase().includes(lowerQuery) ||
      bp.description.toLowerCase().includes(lowerQuery) ||
      bp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Apply a blueprint to a mission
 *
 * Creates the mission with blueprint-defined constraints and generates
 * initial task structure based on blueprint task sequence
 */
export async function applyBlueprintToMission(
  supabase: SupabaseClient,
  missionId: string,
  blueprintName: string
): Promise<{ success: boolean; tasksCreated?: number; error?: string }> {
  const blueprint = loadBlueprint(blueprintName);

  if (!blueprint) {
    return {
      success: false,
      error: `Blueprint "${blueprintName}" not found`,
    };
  }

  try {
    // 1. Update mission config with blueprint constraints and metadata
    const missionConfig = {
      blueprint: blueprintName,
      blueprintVersion: '1.0',
      constraints: blueprint.constraints,
      phases: blueprint.phases,
      estimatedDuration: blueprint.estimatedDuration,
    };

    const { error: updateError } = await supabase
      .from('autopilot_missions')
      .update({
        config: missionConfig,
        mode: blueprint.recommendedMode,
      })
      .eq('id', missionId);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update mission: ${updateError.message}`,
      };
    }

    // 2. Create tasks based on blueprint task sequence
    const tasksToCreate: Partial<AutopilotTask>[] = blueprint.tasks.map((taskDef, index) => {
      const [agentRole, taskType] = taskDef.split(':');

      return {
        mission_id: missionId,
        agent_role: agentRole as AutopilotTask['agent_role'],
        task_type: taskType,
        status: 'pending',
        priority: calculatePriority(index, blueprint.tasks.length),
        sequence_order: index,
        config: {
          blueprintTask: true,
          blueprintIndex: index,
        },
      };
    });

    const { data: createdTasks, error: tasksError } = await supabase
      .from('autopilot_tasks')
      .insert(tasksToCreate)
      .select();

    if (tasksError) {
      return {
        success: false,
        error: `Failed to create tasks: ${tasksError.message}`,
      };
    }

    // 3. Set up task dependencies (each task depends on previous task)
    if (createdTasks && createdTasks.length > 1) {
      for (let i = 1; i < createdTasks.length; i++) {
        await supabase.from('autopilot_tasks').update({
          parent_task_id: createdTasks[i - 1].id,
        }).eq('id', createdTasks[i].id);
      }
    }

    return {
      success: true,
      tasksCreated: createdTasks?.length || 0,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Calculate task priority based on position in sequence
 * Earlier tasks get higher priority
 */
function calculatePriority(index: number, total: number): number {
  // First 20% of tasks are high priority
  if (index < total * 0.2) return 3;
  // Next 60% are medium priority
  if (index < total * 0.8) return 2;
  // Last 20% are low priority
  return 1;
}

/**
 * Validate if a blueprint is compatible with a mission's current state
 */
export function validateBlueprintCompatibility(
  mission: AutopilotMission,
  blueprintName: string
): { compatible: boolean; warnings: string[] } {
  const blueprint = loadBlueprint(blueprintName);
  const warnings: string[] = [];

  if (!blueprint) {
    return {
      compatible: false,
      warnings: ['Blueprint not found'],
    };
  }

  // Check if mission already has tasks
  // (Note: This would require fetching tasks, so we'll skip for now)
  // warnings.push('Mission already has tasks - applying blueprint may create conflicts');

  // Check mode compatibility
  if (mission.mode === 'full_auto' && blueprint.recommendedMode === 'suggest') {
    warnings.push(
      `Blueprint recommends "${blueprint.recommendedMode}" mode but mission is set to "${mission.mode}"`
    );
  }

  // Check if mission config conflicts with blueprint constraints
  const missionConfig = mission.config as Record<string, unknown>;
  if (missionConfig.maxContacts && blueprint.constraints.maxContacts) {
    if ((missionConfig.maxContacts as number) < blueprint.constraints.maxContacts) {
      warnings.push(
        `Mission max contacts (${missionConfig.maxContacts}) is lower than blueprint requirement (${blueprint.constraints.maxContacts})`
      );
    }
  }

  return {
    compatible: warnings.length === 0,
    warnings,
  };
}

/**
 * Get blueprint recommendations based on mission metadata
 */
export function recommendBlueprints(params: {
  campaignType?: string;
  duration?: string;
  intensity?: string;
  existingContacts?: number;
}): MissionBlueprint[] {
  let candidates = Object.values(blueprints);

  // Filter by campaign type
  if (params.campaignType) {
    const type = params.campaignType.toLowerCase();
    candidates = candidates.filter((bp) =>
      bp.tags.some((tag) => tag.toLowerCase().includes(type))
    );
  }

  // Filter by duration
  if (params.duration === 'short') {
    candidates = candidates.filter((bp) =>
      bp.estimatedDuration.includes('2-3') || bp.estimatedDuration.includes('3-4')
    );
  } else if (params.duration === 'long') {
    candidates = candidates.filter((bp) =>
      bp.estimatedDuration.includes('12') || bp.estimatedDuration.includes('6-8')
    );
  }

  // Filter by intensity
  if (params.intensity === 'low') {
    candidates = candidates.filter((bp) => bp.tags.includes('low-intensity') || bp.tags.includes('gentle'));
  } else if (params.intensity === 'high') {
    candidates = candidates.filter((bp) => bp.tags.includes('high-volume') || bp.tags.includes('fast-paced'));
  }

  // Filter by contact volume compatibility
  if (params.existingContacts) {
    candidates = candidates.filter((bp) =>
      bp.constraints.maxContacts >= params.existingContacts
    );
  }

  return candidates;
}

/**
 * Extract blueprint metadata for UI display
 */
export function getBlueprintSummary(blueprintName: string): {
  name: string;
  description: string;
  duration: string;
  taskCount: number;
  mode: string;
  tags: string[];
  maxContacts: number;
} | null {
  const blueprint = loadBlueprint(blueprintName);

  if (!blueprint) {
    return null;
  }

  return {
    name: blueprint.name,
    description: blueprint.description,
    duration: blueprint.estimatedDuration,
    taskCount: blueprint.tasks.length,
    mode: blueprint.recommendedMode,
    tags: blueprint.tags,
    maxContacts: blueprint.constraints.maxContacts,
  };
}
