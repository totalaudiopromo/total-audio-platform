/**
 * MeshOS Negotiation Store
 * Database operations for mesh_negotiations table
 */

import type { Negotiation } from '../types';
import { logger } from '../utils/logger';

export class MeshNegotiationStore {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
    logger.setContext('MeshNegotiationStore');
  }

  async createNegotiation(negotiation: Omit<Negotiation, 'id'>): Promise<string> {
    const { data, error } = await this.supabaseClient
      .from('mesh_negotiations')
      .insert([negotiation])
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to create negotiation', error);
      throw error;
    }

    return data.id;
  }

  async getNegotiations(workspaceId: string, limit = 50): Promise<Negotiation[]> {
    const { data, error } = await this.supabaseClient
      .from('mesh_negotiations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Failed to get negotiations', error);
      return [];
    }

    return data || [];
  }

  async updateNegotiation(id: string, updates: Partial<Negotiation>): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_negotiations')
      .update(updates)
      .eq('id', id);

    if (error) {
      logger.error('Failed to update negotiation', error);
      throw error;
    }
  }

  async completeNegotiation(id: string, result: Negotiation['result'], confidence?: number): Promise<void> {
    await this.updateNegotiation(id, {
      result,
      confidence,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  }
}
