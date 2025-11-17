/**
 * Recovery Engine - Handles crash recovery and snapshot retrieval
 */

import type { RecoveryOptions, RecoveryResult, AutosaveSnapshot } from './types';

export class RecoveryEngine {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async getLatestSnapshot(projectId: string, userId: string): Promise<AutosaveSnapshot | null> {
    try {
      const { data, error } = await this.supabase
        .from('cis_autosave_snapshots')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No snapshots found
        throw error;
      }

      return {
        projectId: data.project_id,
        sessionId: data.session_id,
        userId: data.user_id,
        snapshot: data.snapshot,
        sizeBytes: data.size_bytes,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error getting latest snapshot:', error);
      return null;
    }
  }

  async checkForRecovery(options: RecoveryOptions): Promise<RecoveryResult> {
    try {
      const snapshot = await this.getLatestSnapshot(options.projectId, options.userId);

      if (!snapshot) {
        return { hasRecovery: false };
      }

      // Check if snapshot is recent (within last hour)
      const snapshotTime = new Date(snapshot.createdAt).getTime();
      const now = Date.now();
      const age = now - snapshotTime;

      // Only offer recovery if snapshot is less than 1 hour old
      if (age > 3600000) {
        return { hasRecovery: false };
      }

      // Check for crashed session
      const { data: session } = await this.supabase
        .from('cis_project_sessions')
        .select('*')
        .eq('project_id', options.projectId)
        .eq('user_id', options.userId)
        .eq('status', 'crashed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        hasRecovery: true,
        snapshot,
        session: session || undefined,
        age,
      };
    } catch (error) {
      console.error('Error checking for recovery:', error);
      return { hasRecovery: false };
    }
  }

  async discardRecovery(projectId: string, userId: string): Promise<boolean> {
    try {
      // Mark latest session as closed (not crashed)
      await this.supabase
        .from('cis_project_sessions')
        .update({ status: 'closed' })
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .eq('status', 'crashed');

      return true;
    } catch (error) {
      console.error('Error discarding recovery:', error);
      return false;
    }
  }
}

export const createRecoveryEngine = (supabaseClient: any): RecoveryEngine => {
  return new RecoveryEngine(supabaseClient);
};
