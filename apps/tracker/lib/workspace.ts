// Workspace Access System - TypeScript types and utilities
import { createClient } from '@total-audio/core-db/client';

export type WorkspaceRole = 'admin' | 'member' | 'client';

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_tier: 'free' | 'pro' | 'agency';
  custom_branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    agency_name?: string;
  };
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  permissions: Record<string, boolean>;
  invited_by: string | null;
  joined_at: string;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
};

export type WorkspaceInvitation = {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export type WorkspaceActivity = {
  id: string;
  workspace_id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
};

// Workspace management utilities
export class WorkspaceManager {
  private supabase = createClient();

  async createWorkspace(
    name: string,
    slug: string,
    ownerId: string
  ): Promise<Workspace | null> {
    const { data, error } = await this.supabase
      .from('workspaces')
      .insert({
        name,
        slug,
        owner_id: ownerId,
        plan_tier: 'free',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workspace:', error);
      return null;
    }

    // Add owner as admin member
    await this.addMember(data.id, ownerId, 'admin');

    return data;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const { data, error } = await this.supabase
      .from('workspace_members')
      .select('workspace:workspaces(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user workspaces:', error);
      return [];
    }

    return data.map((d: any) => d.workspace).filter(Boolean);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await this.supabase
      .from('workspace_members')
      .select(
        `
        *,
        user:auth.users(email, user_metadata)
      `
      )
      .eq('workspace_id', workspaceId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching workspace members:', error);
      return [];
    }

    return data || [];
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole = 'member',
    invitedBy?: string
  ): Promise<WorkspaceMember | null> {
    const { data, error } = await this.supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: userId,
        role,
        invited_by: invitedBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding workspace member:', error);
      return null;
    }

    // Log activity
    await this.logActivity(
      workspaceId,
      invitedBy || userId,
      'member_added',
      'workspace_member',
      data.id,
      {
        new_member_email: data.user?.email,
        role,
      }
    );

    return data;
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    newRole: WorkspaceRole
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('workspace_members')
      .update({ role: newRole })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating member role:', error);
      return false;
    }

    return true;
  }

  async removeMember(workspaceId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing workspace member:', error);
      return false;
    }

    return true;
  }

  async inviteMember(
    workspaceId: string,
    email: string,
    role: WorkspaceRole,
    invitedBy: string
  ): Promise<WorkspaceInvitation | null> {
    // Generate invitation token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { data, error } = await this.supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email,
        role,
        invited_by: invitedBy,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return null;
    }

    // Log activity
    await this.logActivity(
      workspaceId,
      invitedBy,
      'member_invited',
      'workspace_invitation',
      data.id,
      {
        email,
        role,
      }
    );

    return data;
  }

  async acceptInvitation(token: string, userId: string): Promise<boolean> {
    // Get invitation
    const { data: invitation, error: invError } = await this.supabase
      .from('workspace_invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .single();

    if (invError || !invitation) {
      console.error('Invalid invitation token');
      return false;
    }

    // Check expiry
    if (new Date(invitation.expires_at) < new Date()) {
      console.error('Invitation expired');
      return false;
    }

    // Add user to workspace
    const member = await this.addMember(
      invitation.workspace_id,
      userId,
      invitation.role,
      invitation.invited_by
    );

    if (!member) {
      return false;
    }

    // Mark invitation as accepted
    await this.supabase
      .from('workspace_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);

    return true;
  }

  async hasPermission(
    workspaceId: string,
    userId: string,
    requiredRole: WorkspaceRole = 'member'
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    const roleHierarchy: Record<WorkspaceRole, number> = {
      admin: 3,
      member: 2,
      client: 1,
    };

    return roleHierarchy[data.role] >= roleHierarchy[requiredRole];
  }

  async getWorkspaceActivity(
    workspaceId: string,
    limit: number = 50
  ): Promise<WorkspaceActivity[]> {
    const { data, error } = await this.supabase
      .from('workspace_activity_log')
      .select(
        `
        *,
        user:auth.users(email, user_metadata)
      `
      )
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching workspace activity:', error);
      return [];
    }

    return data || [];
  }

  async logActivity(
    workspaceId: string,
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.supabase.from('workspace_activity_log').insert({
      workspace_id: workspaceId,
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    });
  }

  async updateWorkspaceBranding(
    workspaceId: string,
    branding: {
      logo_url?: string;
      primary_color?: string;
      secondary_color?: string;
      agency_name?: string;
    }
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('workspaces')
      .update({ custom_branding: branding })
      .eq('id', workspaceId);

    if (error) {
      console.error('Error updating workspace branding:', error);
      return false;
    }

    return true;
  }
}

export const workspaceManager = new WorkspaceManager();
