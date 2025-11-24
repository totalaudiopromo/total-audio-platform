/**
 * Autosave Engine - Handles automatic project saving
 */

import type { AutosaveSnapshot, ProjectSession } from './types';

export class AutosaveEngine {
  private supabase: any;
  private sessionId: string | null = null;
  private autosaveInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pendingSnapshot: Record<string, any> | null = null;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async startAutosaveSession(
    projectId: string,
    userId: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      // Create session
      const { data, error } = await this.supabase
        .from('cis_project_sessions')
        .insert({
          project_id: projectId,
          user_id: userId,
          status: 'active',
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      this.sessionId = data.id;

      // Start heartbeat (every 60s)
      this.startHeartbeat();

      // Start autosave (every 30s)
      this.startAutosave(projectId, userId);

      return this.sessionId;
    } catch (error) {
      console.error('Error starting autosave session:', error);
      throw error;
    }
  }

  queueSnapshot(snapshot: Record<string, any>): void {
    this.pendingSnapshot = snapshot;
  }

  async recordSnapshot(
    projectId: string,
    userId: string,
    snapshot: Record<string, any>
  ): Promise<boolean> {
    try {
      const snapshotStr = JSON.stringify(snapshot);
      const sizeBytes = new Blob([snapshotStr]).size;

      const { error } = await this.supabase
        .from('cis_autosave_snapshots')
        .insert({
          project_id: projectId,
          session_id: this.sessionId,
          user_id: userId,
          snapshot,
          size_bytes: sizeBytes,
        });

      if (error) throw error;

      // Cleanup old autosaves (keep last 10)
      await this.supabase.rpc('cleanup_old_autosaves', {
        p_project_id: projectId,
      });

      return true;
    } catch (error) {
      console.error('Error recording snapshot:', error);
      return false;
    }
  }

  async closeSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      // Stop intervals
      if (this.autosaveInterval) clearInterval(this.autosaveInterval);
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

      // Update session status
      await this.supabase
        .from('cis_project_sessions')
        .update({ status: 'closed' })
        .eq('id', this.sessionId);

      this.sessionId = null;
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }

  private startHeartbeat(): void {
    if (!this.sessionId) return;

    this.heartbeatInterval = setInterval(async () => {
      if (!this.sessionId) return;

      try {
        await this.supabase.rpc('update_session_heartbeat', {
          session_id: this.sessionId,
        });
      } catch (error) {
        console.error('Error updating heartbeat:', error);
      }
    }, 60000); // Every 60 seconds
  }

  private startAutosave(projectId: string, userId: string): void {
    this.autosaveInterval = setInterval(async () => {
      if (this.pendingSnapshot) {
        await this.recordSnapshot(projectId, userId, this.pendingSnapshot);
        this.pendingSnapshot = null;
      }
    }, 30000); // Every 30 seconds
  }
}

export const createAutosaveEngine = (supabaseClient: any): AutosaveEngine => {
  return new AutosaveEngine(supabaseClient);
};
