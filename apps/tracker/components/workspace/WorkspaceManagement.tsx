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
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  workspaceManager,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from '@/lib/workspace';
import { createClient } from '@total-audio/core-db/client';

export default function WorkspaceManagement() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('member');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        loadWorkspaces(user.id);
      }
    };
    loadUser();
  }, []);

  const loadWorkspaces = async (userId: string) => {
    setLoading(true);
    const userWorkspaces = await workspaceManager.getUserWorkspaces(userId);
    setWorkspaces(userWorkspaces);
    if (userWorkspaces.length > 0) {
      setSelectedWorkspace(userWorkspaces[0]);
      loadMembers(userWorkspaces[0].id);
    }
    setLoading(false);
  };

  const loadMembers = async (workspaceId: string) => {
    const workspaceMembers =
      await workspaceManager.getWorkspaceMembers(workspaceId);
    setMembers(workspaceMembers);
  };

  const handleInviteMember = async () => {
    if (!selectedWorkspace || !inviteEmail.trim()) return;

    const invitation = await workspaceManager.inviteMember(
      selectedWorkspace.id,
      inviteEmail,
      inviteRole,
      currentUserId
    );

    if (invitation) {
      // Show success message
      alert(
        `Invitation sent to ${inviteEmail}! They'll receive an email with a join link.`
      );
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
    } else {
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!selectedWorkspace) return;

    if (confirm('Are you sure you want to remove this workspace member?')) {
      const success = await workspaceManager.removeMember(
        selectedWorkspace.id,
        userId
      );
      if (success) {
        loadMembers(selectedWorkspace.id);
      }
    }
  };

  const handleChangeRole = async (
    memberId: string,
    userId: string,
    newRole: WorkspaceRole
  ) => {
    if (!selectedWorkspace) return;

    const success = await workspaceManager.updateMemberRole(
      selectedWorkspace.id,
      userId,
      newRole
    );
    if (success) {
      loadMembers(selectedWorkspace.id);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black text-gray-900 mb-2">
          No Workspaces Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create a workspace to collaborate with others
        </p>
        <button className="px-6 py-3 bg-[#14B8A6] text-white rounded-xl font-black border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all">
          Create Your First Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Selector */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              {selectedWorkspace?.name}
            </h2>
            <p className="text-sm font-bold text-gray-700">
              {members.length} workspace{' '}
              {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          <div className="px-4 py-2 bg-[#14B8A6] text-white rounded-lg font-black text-sm border-2 border-black">
            {selectedWorkspace?.plan_tier.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#14B8A6]" />
            <h3 className="text-xl font-black text-gray-900">
              Workspace Members
            </h3>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-[#14B8A6] text-white rounded-xl font-black text-sm border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="space-y-3">
          {members.map(member => (
            <div
              key={member.id}
              className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#14B8A6] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#14B8A6] to-[#0F9488] rounded-full border-2 border-black flex items-center justify-center">
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
                        {member.user?.user_metadata?.full_name ||
                          'Workspace Member'}
                      </h4>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {member.user?.email}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      Joined{' '}
                      {new Date(member.joined_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Role Selector (admin only) */}
                  {member.user_id !== currentUserId && (
                    <select
                      value={member.role}
                      onChange={e =>
                        handleChangeRole(
                          member.id,
                          member.user_id,
                          e.target.value as WorkspaceRole
                        )
                      }
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg font-bold text-sm focus:border-[#14B8A6] focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="client">Client</option>
                    </select>
                  )}

                  {/* Remove Button (admin only, can't remove self) */}
                  {member.user_id !== currentUserId && (
                    <button
                      onClick={() =>
                        handleRemoveMember(member.id, member.user_id)
                      }
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
      <div className="bg-gradient-to-br from-[#14B8A6]/5 to-blue-50 border-4 border-[#14B8A6] shadow-brutal rounded-none p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">
          Role Permissions
        </h3>
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
              <li>• White-label PDF exports</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h4 className="font-black text-blue-900">Member</h4>
            </div>
            <ul className="text-xs font-medium text-gray-700 space-y-1">
              <li>• Create & edit campaigns</li>
              <li>• View workspace campaigns</li>
              <li>• Export data</li>
              <li>• Log campaign results</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <h4 className="font-black text-gray-900">Client</h4>
            </div>
            <ul className="text-xs font-medium text-gray-700 space-y-1">
              <li>• View campaigns only</li>
              <li>• See campaign results</li>
              <li>• Download reports</li>
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
              <div className="w-12 h-12 bg-[#14B8A6] border-2 border-black rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Invite Workspace Member
                </h3>
                <p className="text-sm font-bold text-gray-700">
                  Send an invitation email
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@agency.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:border-[#14B8A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as WorkspaceRole)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:border-[#14B8A6] focus:outline-none"
                >
                  <option value="member">Member - Full access</option>
                  <option value="admin">Admin - Workspace management</option>
                  <option value="client">Client - View only</option>
                </select>
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
                className="flex-1 px-4 py-3 bg-[#14B8A6] text-white rounded-xl font-black border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
