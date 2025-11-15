import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// ========================================
// WorkspaceQueries Class
// ========================================
// Provides workspace-scoped database queries for cross-app data access
// Usage:
//   const queries = createWorkspaceQueries(supabase, workspaceId);
//   const contacts = await queries.getIntelContacts();
// ========================================

export class WorkspaceQueries {
  private supabase: SupabaseClient<Database>;
  private workspaceId: string;

  constructor(supabase: SupabaseClient<Database>, workspaceId: string) {
    this.supabase = supabase;
    this.workspaceId = workspaceId;
  }

  // ========================================
  // Generic Query Builder
  // ========================================

  /**
   * Generic workspace-scoped query builder
   * Automatically filters by workspace_id
   *
   * @example
   * const campaigns = await queries.from('campaigns').select('*');
   */
  from<T extends keyof Database['public']['Tables']>(table: T) {
    return this.supabase.from(table).eq('workspace_id', this.workspaceId);
  }

  // ========================================
  // Audio Intel Queries
  // ========================================

  /**
   * Fetch Audio Intel contacts for current workspace
   */
  async getIntelContacts() {
    try {
      const { data, error } = await this.supabase
        .from('intel_contacts')
        .select('*')
        .eq('workspace_id', this.workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching Intel contacts:', error);
      return { data: null, error };
    }
  }

  /**
   * Get contact counts by status
   */
  async getIntelContactStats() {
    try {
      const { data, error } = await this.supabase
        .from('intel_contacts')
        .select('status')
        .eq('workspace_id', this.workspaceId);

      if (error) throw error;

      // Count by status
      const stats = (data || []).reduce(
        (acc, contact) => {
          const status = contact.status || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching Intel contact stats:', error);
      return { data: null, error };
    }
  }

  // ========================================
  // Pitch Generator Queries
  // ========================================

  /**
   * Fetch Pitch Generator contacts for current workspace
   */
  async getPitchContacts() {
    try {
      const { data, error } = await this.supabase
        .from('pitch_contacts')
        .select('*')
        .eq('workspace_id', this.workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching Pitch contacts:', error);
      return { data: null, error };
    }
  }

  /**
   * Get pitch templates for current workspace
   */
  async getPitchTemplates() {
    try {
      const { data, error } = await this.supabase
        .from('pitch_templates')
        .select('*')
        .eq('workspace_id', this.workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching Pitch templates:', error);
      return { data: null, error };
    }
  }

  // ========================================
  // Campaign Tracker Queries
  // ========================================

  /**
   * Fetch campaigns for current workspace
   */
  async getCampaigns() {
    try {
      const { data, error } = await this.supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', this.workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return { data: null, error };
    }
  }

  /**
   * Get campaign stats (total, active, completed)
   */
  async getCampaignStats() {
    try {
      const { data, error } = await this.supabase
        .from('campaigns')
        .select('status')
        .eq('workspace_id', this.workspaceId);

      if (error) throw error;

      const total = data?.length || 0;
      const active =
        data?.filter(c => c.status === 'active' || c.status === 'in_progress').length || 0;
      const completed = data?.filter(c => c.status === 'completed').length || 0;

      return {
        data: { total, active, completed },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      return { data: null, error };
    }
  }

  // ========================================
  // Cross-App Unified Queries
  // ========================================

  /**
   * Get unified contact view across all apps
   * Uses workspace_contacts_registry for cross-app contact linking
   */
  async getUnifiedContacts() {
    try {
      const { data, error } = await this.supabase
        .from('workspace_contacts_registry')
        .select(
          `
          *,
          intel_contact:intel_contacts(*),
          pitch_contact:pitch_contacts(*)
        `
        )
        .eq('workspace_id', this.workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching unified contacts:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all-app activity summary
   */
  async getWorkspaceSummary() {
    try {
      const [intelStats, campaignStats, pitchContacts] = await Promise.all([
        this.getIntelContactStats(),
        this.getCampaignStats(),
        this.getPitchContacts(),
      ]);

      return {
        data: {
          intel: intelStats.data,
          campaigns: campaignStats.data,
          pitchContactCount: pitchContacts.data?.length || 0,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching workspace summary:', error);
      return { data: null, error };
    }
  }

  // ========================================
  // Permission Queries
  // ========================================

  /**
   * Check if user can access current workspace
   */
  async canUserAccessWorkspace(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', this.workspaceId)
        .eq('user_id', userId)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking workspace access:', error);
      return false;
    }
  }

  /**
   * Get user's role in current workspace
   */
  async getUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', this.workspaceId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  /**
   * Get all workspace members
   */
  async getWorkspaceMembers() {
    try {
      const { data, error } = await this.supabase
        .from('workspace_members')
        .select(
          `
          *,
          user:users(*)
        `
        )
        .eq('workspace_id', this.workspaceId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching workspace members:', error);
      return { data: null, error };
    }
  }
}

// ========================================
// Factory Function
// ========================================

/**
 * Create a WorkspaceQueries instance
 *
 * @example
 * const queries = createWorkspaceQueries(supabase, currentWorkspace.id);
 * const contacts = await queries.getIntelContacts();
 */
export function createWorkspaceQueries(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): WorkspaceQueries {
  return new WorkspaceQueries(supabase, workspaceId);
}
