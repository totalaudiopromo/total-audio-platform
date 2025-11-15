'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Eye,
  Trash2,
  Mail,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { createClient } from '@total-audio/core-db/client';

// ========================================
// Types
// ========================================

type WorkspaceRole = 'admin' | 'member' | 'client';

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

interface WorkspaceDetails {
  id: string;
  name: string;
  workspace_type: 'personal' | 'team' | 'agency';
  plan_tier: string;
  apps_enabled: string[];
  app_permissions?: {
    intel?: { enabled: boolean; features: string[] };
    pitch?: { enabled: boolean; features: string[] };
    tracker?: { enabled: boolean; features: string[] };
  };
}

interface WorkspaceManagementProps {
  workspaceId: string;
  onInviteSent?: () => void;
  accentColor?: string; // Tool-specific accent color
}

// ========================================
// Component
// ========================================

export function WorkspaceManagement({
  workspaceId,
  onInviteSent,
  accentColor = '#14B8A6', // Default Tracker teal
}: WorkspaceManagementProps) {
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('member');
  const [appPermissions, setAppPermissions] = useState({
    intel: false,
    pitch: false,
    tracker: true,
  });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [stats, setStats] = useState({
    contactsCount: 0,
    campaignsCount: 0,
    pitchesCount: 0,
  });

  const supabase = createClient();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [workspaceId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      // Load workspace details
      await loadWorkspace();

      // Load members
      await loadMembers();

      // Load stats
      await loadStats();
    } catch (error) {
      console.error('Error loading workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkspace = async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();

    if (!error && data) {
      setWorkspace(data as WorkspaceDetails);
    }
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq('workspace_id', workspaceId)
      .order('joined_at', { ascending: false });

    if (!error && data) {
      setMembers(data as WorkspaceMember[]);
    }
  };

  const loadStats = async () => {
    // Get contact counts (Intel)
    const { data: intelContacts } = await supabase
      .from('intel_contacts')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    // Get campaign counts (Tracker)
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    // Get pitch counts (Pitch Generator)
    const { data: pitches } = await supabase
      .from('pitch_contacts')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    setStats({
      contactsCount: (intelContacts as any)?.count || 0,
      campaignsCount: (campaigns as any)?.count || 0,
      pitchesCount: (pitches as any)?.count || 0,
    });
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;

    try {
      // Create invitation record
      const { data, error } = await supabase.from('workspace_invitations').insert({
        workspace_id: workspaceId,
        email: inviteEmail,
        role: inviteRole,
        invited_by: currentUserId,
        status: 'pending',
        app_permissions: {
          intel: { enabled: appPermissions.intel, features: [] },
          pitch: { enabled: appPermissions.pitch, features: [] },
          tracker: { enabled: appPermissions.tracker, features: [] },
        },
      });

      if (error) throw error;

      // Success - reset form
      alert(`Invitation sent to ${inviteEmail}! They'll receive an email with a join link.`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      setAppPermissions({ intel: false, pitch: false, tracker: true });

      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!confirm('Are you sure you want to remove this workspace member?')) {
      return;
    }

    try {
      const { error } = await supabase.from('workspace_members').delete().eq('id', memberId);

      if (error) throw error;

      // Reload members
      await loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: WorkspaceRole) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      // Reload members
      await loadMembers();
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Failed to change role. Please try again.');
    }
  };

  const getRoleBadge = (role: WorkspaceRole) => {
    const badges = {
      admin: {
        icon: Crown,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Admin',
      },
      member: {
        icon: Shield,
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'Member',
      },
      client: {
        icon: Eye,
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Client',
      },
    };

    const badge = badges[role];
    const Icon = badge.icon;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border-2 ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: accentColor }}
        />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black text-gray-900 mb-2">Workspace Not Found</h3>
        <p className="text-gray-600">Unable to load workspace details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{workspace.name}</h2>
            <p className="text-sm font-bold text-gray-700 mb-3">
              {members.length} team {members.length === 1 ? 'member' : 'members'}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="px-3 py-1 text-white rounded-lg font-black text-sm border-2 border-black"
                style={{ backgroundColor: accentColor }}
              >
                {workspace.plan_tier.toUpperCase()}
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm border-2 border-gray-300">
                {workspace.workspace_type.charAt(0).toUpperCase() +
                  workspace.workspace_type.slice(1)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{stats.contactsCount}</div>
              <div className="text-xs font-bold text-gray-600">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{stats.campaignsCount}</div>
              <div className="text-xs font-bold text-gray-600">Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{stats.pitchesCount}</div>
              <div className="text-xs font-bold text-gray-600">Pitches</div>
            </div>
          </div>
        </div>
      </div>

      {/* App Access */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6" style={{ color: accentColor }} />
          <h3 className="text-xl font-black text-gray-900">App Access</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['intel', 'pitch', 'tracker'].map(app => {
            const appKey = app as 'intel' | 'pitch' | 'tracker';
            const enabled =
              workspace.apps_enabled?.includes(app) || workspace.app_permissions?.[appKey]?.enabled;

            return (
              <div
                key={app}
                className={`border-2 rounded-lg p-4 ${enabled ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {enabled ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <h4 className="font-black text-gray-900 capitalize">{app}</h4>
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {enabled ? 'Active' : 'Not enabled'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" style={{ color: accentColor }} />
            <h3 className="text-xl font-black text-gray-900">Workspace Members</h3>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 text-white rounded-xl font-black text-sm border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="space-y-3">
          {members.map(member => (
            <div
              key={member.id}
              className="border-2 border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                    }}
                  >
                    <span className="text-white font-black text-lg">
                      {member.user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                        member.user?.email?.[0]?.toUpperCase() ||
                        '?'}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-gray-900">
                        {member.user?.user_metadata?.full_name || 'Workspace Member'}
                      </h4>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm font-bold text-gray-700">{member.user?.email}</p>
                    <p className="text-xs font-medium text-gray-500">
                      Joined {new Date(member.joined_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Role Selector (admin only, can't edit self) */}
                  {member.user_id !== currentUserId && (
                    <select
                      value={member.role}
                      onChange={e => handleChangeRole(member.id, e.target.value as WorkspaceRole)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg font-bold text-sm focus:outline-none"
                      style={{
                        focusBorderColor: accentColor,
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="client">Client</option>
                    </select>
                  )}

                  {/* Remove Button (admin only, can't remove self) */}
                  {member.user_id !== currentUserId && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions Guide */}
      <div
        className="border-4 shadow-brutal rounded-none p-6"
        style={{
          background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)`,
          borderColor: accentColor,
        }}
      >
        <h3 className="text-lg font-black text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h4 className="font-black text-yellow-900">Admin</h4>
            </div>
            <ul className="text-xs font-medium text-gray-700 space-y-1">
              <li>• Full access to all features</li>
              <li>• Manage workspace members</li>
              <li>• Edit workspace settings</li>
              <li>• Access all apps</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h4 className="font-black text-blue-900">Member</h4>
            </div>
            <ul className="text-xs font-medium text-gray-700 space-y-1">
              <li>• Create & edit content</li>
              <li>• View workspace data</li>
              <li>• Export data</li>
              <li>• Access assigned apps</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <h4 className="font-black text-gray-900">Client</h4>
            </div>
            <ul className="text-xs font-medium text-gray-700 space-y-1">
              <li>• View content only</li>
              <li>• See results & reports</li>
              <li>• Download exports</li>
              <li>• Read-only access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-brutal rounded-none max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 border-2 border-black rounded-lg flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Invite Member</h3>
                <p className="text-sm font-bold text-gray-700">Send an invitation email</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@agency.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:outline-none"
                  style={{
                    focusBorderColor: accentColor,
                  }}
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as WorkspaceRole)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:outline-none"
                  style={{
                    focusBorderColor: accentColor,
                  }}
                >
                  <option value="member">Member - Full access</option>
                  <option value="admin">Admin - Workspace management</option>
                  <option value="client">Client - View only</option>
                </select>
              </div>

              {/* App Permissions */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  App Access
                </label>
                <div className="space-y-2">
                  {['intel', 'pitch', 'tracker'].map(app => (
                    <label key={app} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appPermissions[app as keyof typeof appPermissions]}
                        onChange={e =>
                          setAppPermissions(prev => ({
                            ...prev,
                            [app]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-gray-900 capitalize">{app}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-black border-2 border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim()}
                className="flex-1 px-4 py-3 text-white rounded-xl font-black border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: accentColor }}
              >
                <UserPlus className="w-4 h-4" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
