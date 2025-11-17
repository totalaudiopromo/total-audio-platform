/**
 * Agent Registry
 * Register, retrieve, and manage mesh agents
 */

import { createClient } from '@total-audio/core-db/server';
import type { AgentProfile, RegisteredAgent } from './types';

// Import agent profiles
import autopilotStrategy from './agentProfiles/autopilot.strategy.json';
import autopilotContact from './agentProfiles/autopilot.contact.json';
import awarenessObserver from './agentProfiles/awareness.observer.json';
import coachosGuide from './agentProfiles/coachos.guide.json';
import cisDesigner from './agentProfiles/cis.designer.json';
import migExplorer from './agentProfiles/mig.explorer.json';
import cmgAnalyst from './agentProfiles/cmg.analyst.json';
import identityStoryteller from './agentProfiles/identity.storyteller.json';
import scenesScout from './agentProfiles/scenes.scout.json';

const BUILT_IN_PROFILES: AgentProfile[] = [
  autopilotStrategy as AgentProfile,
  autopilotContact as AgentProfile,
  awarenessObserver as AgentProfile,
  coachosGuide as AgentProfile,
  cisDesigner as AgentProfile,
  migExplorer as AgentProfile,
  cmgAnalyst as AgentProfile,
  identityStoryteller as AgentProfile,
  scenesScout as AgentProfile,
];

/**
 * Register a new agent in the mesh
 */
export async function registerAgent(name: string, profile: AgentProfile): Promise<RegisteredAgent> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_agents')
    .upsert({
      name,
      type: profile.role,
      profile,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get an agent by name
 */
export async function getAgent(name: string): Promise<RegisteredAgent | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_agents')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * List all registered agents
 */
export async function listAgents(): Promise<RegisteredAgent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_agents')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Initialize built-in agents
 */
export async function initializeBuiltInAgents(): Promise<void> {
  for (const profile of BUILT_IN_PROFILES) {
    await registerAgent(profile.name, profile);
  }
}

/**
 * Get agents by type/role
 */
export async function getAgentsByType(type: string): Promise<RegisteredAgent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_agents')
    .select('*')
    .eq('type', type)
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Get agents that pair well with a given agent
 */
export async function getCompatibleAgents(agentName: string): Promise<RegisteredAgent[]> {
  const agent = await getAgent(agentName);
  if (!agent) return [];

  const pairsWellWith = agent.profile.collaborationPreferences.pairsWellWith;
  const avoids = agent.profile.collaborationPreferences.avoids;

  const allAgents = await listAgents();

  return allAgents.filter((a) => {
    if (a.name === agentName) return false;
    if (avoids.includes(a.name)) return false;
    if (pairsWellWith.includes('all_agents')) return true;
    return pairsWellWith.includes(a.name);
  });
}
