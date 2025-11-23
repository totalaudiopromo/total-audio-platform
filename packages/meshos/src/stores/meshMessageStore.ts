/**
 * MeshOS Message Store
 * Database operations for mesh_messages table
 */

import type { MeshMessage } from '../types';
import { logger } from '../utils/logger';

export class MeshMessageStore {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
    logger.setContext('MeshMessageStore');
  }

  async createMessage(message: Partial<MeshMessage>): Promise<string> {
    const { data, error } = await this.supabaseClient
      .from('mesh_messages')
      .insert([message])
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to create message', error);
      throw error;
    }

    return data.id;
  }

  async getMessages(filters: {
    workspace_id: string;
    source?: string;
    target?: string;
    status?: string;
    limit?: number;
  }): Promise<MeshMessage[]> {
    let query = this.supabaseClient
      .from('mesh_messages')
      .select('*')
      .eq('workspace_id', filters.workspace_id)
      .order('created_at', { ascending: false });

    if (filters.source) query = query.eq('source', filters.source);
    if (filters.target) query = query.eq('target', filters.target);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to get messages', error);
      return [];
    }

    return data || [];
  }

  async updateMessage(id: string, updates: Partial<MeshMessage>): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_messages')
      .update(updates)
      .eq('id', id);

    if (error) {
      logger.error('Failed to update message', error);
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_messages')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete message', error);
      throw error;
    }
  }
}
