/**
 * Micro-Team Engine
 * Form and dissolve temporary agent teams for collaboration
 */

import { createClient } from '@total-audio/core-db/server';
import type { MeshTeam } from '../types';

/**
 * Form a new micro-team
 */
export async function formTeam(
  agentNames: string[],
  purpose: string,
  workspaceId: string,
  name?: string
): Promise<MeshTeam> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_teams')
    .insert({
      name,
      purpose,
      agent_names: agentNames,
      workspace_id: workspaceId,
      active: true,
      state: { formed_at: new Date().toISOString() },
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Dissolve a team
 */
export async function dissolveTeam(teamId: string): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('mesh_teams')
    .update({
      active: false,
      dissolved_at: new Date().toISOString(),
    })
    .eq('id', teamId);
}

/**
 * Get team by ID
 */
export async function getTeam(teamId: string): Promise<MeshTeam | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_teams')
    .select('*')
    .eq('id', teamId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get active teams in workspace
 */
export async function getActiveTeams(workspaceId: string): Promise<MeshTeam[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_teams')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Update team state
 */
export async function updateTeamState(teamId: string, state: any): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('mesh_teams')
    .update({ state })
    .eq('id', teamId);
}
