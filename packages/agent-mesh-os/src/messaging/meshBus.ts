/**
 * Mesh Bus - Message passing system for agent communication
 */

import { createClient } from '@total-audio/core-db/server';
import type { MeshMessage, MessageType } from '../types';

type MessageCallback = (message: MeshMessage) => void | Promise<void>;

// In-memory subscriptions
const subscriptions = new Map<string, Map<MessageType, MessageCallback[]>>();

/**
 * Publish a message to another agent or broadcast
 */
export async function publishMessage(
  from: string,
  to: string | null,
  messageType: MessageType,
  payload: any,
  workspaceId: string
): Promise<MeshMessage> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_messages')
    .insert({
      agent_from: from,
      agent_to: to,
      message_type: messageType,
      payload,
      workspace_id: workspaceId,
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger in-memory callbacks
  await triggerCallbacks(data);

  return data;
}

/**
 * Broadcast a message to all agents
 */
export async function broadcast(
  from: string,
  messageType: MessageType,
  payload: any,
  workspaceId: string
): Promise<MeshMessage> {
  return publishMessage(from, null, messageType, payload, workspaceId);
}

/**
 * Subscribe to messages (in-memory callback)
 */
export function subscribe(
  agentName: string,
  messageTypes: MessageType[],
  callback: MessageCallback
): () => void {
  if (!subscriptions.has(agentName)) {
    subscriptions.set(agentName, new Map());
  }

  const agentSubs = subscriptions.get(agentName)!;

  for (const type of messageTypes) {
    if (!agentSubs.has(type)) {
      agentSubs.set(type, []);
    }
    agentSubs.get(type)!.push(callback);
  }

  // Return unsubscribe function
  return () => {
    const agentSubs = subscriptions.get(agentName);
    if (!agentSubs) return;

    for (const type of messageTypes) {
      const callbacks = agentSubs.get(type);
      if (!callbacks) continue;

      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  };
}

/**
 * Trigger in-memory callbacks for a message
 */
async function triggerCallbacks(message: MeshMessage): Promise<void> {
  // Trigger callbacks for specific recipient
  if (message.agent_to) {
    const agentSubs = subscriptions.get(message.agent_to);
    if (agentSubs) {
      const callbacks = agentSubs.get(message.message_type) || [];
      for (const callback of callbacks) {
        await callback(message);
      }
    }
  }

  // Trigger callbacks for all agents (broadcast)
  if (!message.agent_to) {
    for (const [agentName, agentSubs] of subscriptions.entries()) {
      const callbacks = agentSubs.get(message.message_type) || [];
      for (const callback of callbacks) {
        await callback(message);
      }
    }
  }
}

/**
 * Get recent messages for an agent
 */
export async function getMessages(
  agentName: string,
  workspaceId: string,
  limit: number = 50
): Promise<MeshMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_messages')
    .select('*')
    .eq('workspace_id', workspaceId)
    .or(`agent_to.eq.${agentName},agent_to.is.null`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Get all recent messages in workspace
 */
export async function getAllMessages(
  workspaceId: string,
  limit: number = 100
): Promise<MeshMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_messages')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
