/**
 * MeshOS Plan Store
 * Database operations for mesh_plans table
 */

import type { MeshPlan, PlanTimeframe } from '../types';
import { logger } from '../utils/logger';

export class MeshPlanStore {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
    logger.setContext('MeshPlanStore');
  }

  async createPlan(plan: Omit<MeshPlan, 'id'>): Promise<string> {
    const { data, error } = await this.supabaseClient
      .from('mesh_plans')
      .insert([plan])
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to create plan', error);
      throw error;
    }

    return data.id;
  }

  async getLatestPlan(workspaceId: string, timeframe: PlanTimeframe): Promise<MeshPlan | null> {
    const { data, error } = await this.supabaseClient
      .from('mesh_plans')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('timeframe', timeframe)
      .eq('status', 'active')
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      logger.error('Failed to get latest plan', error);
      throw error;
    }

    return data;
  }

  async updatePlan(id: string, updates: Partial<MeshPlan>): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_plans')
      .update(updates)
      .eq('id', id);

    if (error) {
      logger.error('Failed to update plan', error);
      throw error;
    }
  }

  async archivePlan(id: string): Promise<void> {
    await this.updatePlan(id, { status: 'archived' });
  }
}
