/**
 * MeshOS Insight Route Store
 * Database operations for mesh_insight_routes table
 */

import type { InsightRoute } from '../types';
import { logger } from '../utils/logger';

export class MeshInsightRouteStore {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
    logger.setContext('MeshInsightRouteStore');
  }

  async createRoute(route: Omit<InsightRoute, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await this.supabaseClient
      .from('mesh_insight_routes')
      .insert([{
        ...route,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to create route', error);
      throw error;
    }

    return data.id;
  }

  async getRoutes(workspaceId: string): Promise<InsightRoute[]> {
    const { data, error } = await this.supabaseClient
      .from('mesh_insight_routes')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('priority', { ascending: false });

    if (error) {
      logger.error('Failed to get routes', error);
      return [];
    }

    return data || [];
  }

  async updateRoute(id: string, updates: Partial<InsightRoute>): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_insight_routes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      logger.error('Failed to update route', error);
      throw error;
    }
  }

  async toggleRoute(id: string, enabled: boolean): Promise<void> {
    await this.updateRoute(id, { enabled });
  }

  async deleteRoute(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_insight_routes')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete route', error);
      throw error;
    }
  }
}
