/**
 * Mesh Memory - Unified memory interface
 * Coordinates working, episodic, long-term, and shared memory
 */

import { createClient } from '@total-audio/core-db/server';
import type { LongTermMemory, EpisodicMemory, SharedMemory, WorkingMemoryItem } from '../types';

// In-memory working memory (per-process)
const workingMemory = new Map<string, Map<string, WorkingMemoryItem>>();

/**
 * Remember something in long-term memory
 */
export async function remember(
  agentName: string,
  key: string,
  value: any,
  workspaceId: string
): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('mesh_memory_longterm')
    .upsert({
      agent_name: agentName,
      key,
      value,
      workspace_id: workspaceId,
    });
}

/**
 * Recall something from long-term memory
 */
export async function recall(
  agentName: string,
  key: string,
  workspaceId: string
): Promise<any | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_memory_longterm')
    .select('value')
    .eq('agent_name', agentName)
    .eq('key', key)
    .eq('workspace_id', workspaceId)
    .single();

  if (error) return null;
  return data?.value;
}

/**
 * Observe an episodic event
 */
export async function observeEpisodic(
  agentName: string,
  eventType: string,
  payload: any,
  workspaceId: string
): Promise<void> {
  const supabase = createClient();

  await supabase.from('mesh_memory_episodic').insert({
    agent_name: agentName,
    event_type: eventType,
    payload,
    workspace_id: workspaceId,
  });
}

/**
 * Get recent episodic events for an agent
 */
export async function getEpisodicEvents(
  agentName: string,
  workspaceId: string,
  limit: number = 50
): Promise<EpisodicMemory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_memory_episodic')
    .select('*')
    .eq('agent_name', agentName)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Write to shared memory
 */
export async function writeShared(
  key: string,
  value: any,
  sourceAgent: string,
  workspaceId: string
): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('mesh_memory_shared')
    .upsert({
      key,
      value,
      source_agent: sourceAgent,
      workspace_id: workspaceId,
    });
}

/**
 * Read from shared memory
 */
export async function readShared(key: string, workspaceId: string): Promise<any | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_memory_shared')
    .select('value')
    .eq('key', key)
    .eq('workspace_id', workspaceId)
    .single();

  if (error) return null;
  return data?.value;
}

/**
 * Get all shared memory for workspace
 */
export async function getAllShared(workspaceId: string): Promise<SharedMemory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_memory_shared')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================================
// WORKING MEMORY (IN-MEMORY)
// ============================================================================

/**
 * Set working memory (process-local, not persisted)
 */
export function setWorking(agentName: string, key: string, value: any): void {
  if (!workingMemory.has(agentName)) {
    workingMemory.set(agentName, new Map());
  }

  workingMemory.get(agentName)!.set(key, {
    key,
    value,
    timestamp: Date.now(),
  });
}

/**
 * Get working memory
 */
export function getWorking(agentName: string, key: string): any | null {
  const agentMemory = workingMemory.get(agentName);
  if (!agentMemory) return null;

  const item = agentMemory.get(key);
  return item?.value ?? null;
}

/**
 * Clear working memory for an agent
 */
export function clearWorking(agentName: string): void {
  workingMemory.delete(agentName);
}
