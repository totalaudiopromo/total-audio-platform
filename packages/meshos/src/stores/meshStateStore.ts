/**
 * MeshOS State Store
 * Database operations for mesh_state table
 */

import { logger } from '../utils/logger';

export class MeshStateStore {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
    logger.setContext('MeshStateStore');
  }

  async setState(workspaceId: string, key: string, value: any): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_state')
      .upsert({
        workspace_id: workspaceId,
        key,
        value,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      logger.error('Failed to set state', error);
      throw error;
    }
  }

  async getState(workspaceId: string, key: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('mesh_state')
      .select('value')
      .eq('workspace_id', workspaceId)
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      logger.error('Failed to get state', error);
      throw error;
    }

    return data?.value;
  }

  async getAllState(workspaceId: string): Promise<Record<string, any>> {
    const { data, error } = await this.supabaseClient
      .from('mesh_state')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      logger.error('Failed to get all state', error);
      return {};
    }

    return (data || []).reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  async deleteState(workspaceId: string, key: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('mesh_state')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('key', key);

    if (error) {
      logger.error('Failed to delete state', error);
      throw error;
    }
  }
}
