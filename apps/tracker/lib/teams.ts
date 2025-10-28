// Team Access System - TypeScript types and utilities
import { createClient } from '@/lib/supabase/client';

export type TeamRole = 'admin' | 'member' | 'client';

export type Team = {
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

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
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

export type TeamInvitation = {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export type TeamActivity = {
  id: string;
  team_id: string;
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

// Team management utilities
export class TeamManager {
  private supabase = createClient();

  async createTeam(name: string, slug: string, ownerId: string): Promise<Team | null> {
    const { data, error } = await this.supabase
      .from('teams')
      .insert({
        name,
        slug,
        owner_id: ownerId,
        plan_tier: 'free',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      return null;
    }

    // Add owner as admin member
    await this.addMember(data.id, ownerId, 'admin');

    return data;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('team:teams(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user teams:', error);
      return [];
    }

    return data.map((d: any) => d.team).filter(Boolean);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select(`
        *,
        user:auth.users(email, user_metadata)
      `)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  }

  async addMember(
    teamId: string,
    userId: string,
    role: TeamRole = 'member',
    invitedBy?: string
  ): Promise<TeamMember | null> {
    const { data, error } = await this.supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId,
        role,
        invited_by: invitedBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding team member:', error);
      return null;
    }

    // Log activity
    await this.logActivity(teamId, invitedBy || userId, 'member_added', 'team_member', data.id, {
      new_member_email: data.user?.email,
      role,
    });

    return data;
  }

  async updateMemberRole(teamId: string, userId: string, newRole: TeamRole): Promise<boolean> {
    const { error } = await this.supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating member role:', error);
      return false;
    }

    return true;
  }

  async removeMember(teamId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing team member:', error);
      return false;
    }

    return true;
  }

  async inviteMember(
    teamId: string,
    email: string,
    role: TeamRole,
    invitedBy: string
  ): Promise<TeamInvitation | null> {
    // Generate invitation token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { data, error } = await this.supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
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
    await this.logActivity(teamId, invitedBy, 'member_invited', 'team_invitation', data.id, {
      email,
      role,
    });

    return data;
  }

  async acceptInvitation(token: string, userId: string): Promise<boolean> {
    // Get invitation
    const { data: invitation, error: invError } = await this.supabase
      .from('team_invitations')
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

    // Add user to team
    const member = await this.addMember(
      invitation.team_id,
      userId,
      invitation.role,
      invitation.invited_by
    );

    if (!member) {
      return false;
    }

    // Mark invitation as accepted
    await this.supabase
      .from('team_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);

    return true;
  }

  async hasPermission(teamId: string, userId: string, requiredRole: TeamRole = 'member'): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    const roleHierarchy: Record<TeamRole, number> = {
      admin: 3,
      member: 2,
      client: 1,
    };

    return roleHierarchy[data.role] >= roleHierarchy[requiredRole];
  }

  async getTeamActivity(teamId: string, limit: number = 50): Promise<TeamActivity[]> {
    const { data, error } = await this.supabase
      .from('team_activity_log')
      .select(`
        *,
        user:auth.users(email, user_metadata)
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching team activity:', error);
      return [];
    }

    return data || [];
  }

  async logActivity(
    teamId: string,
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.supabase
      .from('team_activity_log')
      .insert({
        team_id: teamId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata,
      });
  }

  async updateTeamBranding(
    teamId: string,
    branding: {
      logo_url?: string;
      primary_color?: string;
      secondary_color?: string;
      agency_name?: string;
    }
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('teams')
      .update({ custom_branding: branding })
      .eq('id', teamId);

    if (error) {
      console.error('Error updating team branding:', error);
      return false;
    }

    return true;
  }
}

export const teamManager = new TeamManager();
