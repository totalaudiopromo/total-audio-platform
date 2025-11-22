'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  User,
  Shield,
  Activity,
  BarChart3,
  MapPin,
  Calendar,
  Mail,
  Filter,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'beta-user' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  signupDate: string;
  lastActive: string;
  usage: {
    contactsEnriched: number;
    emailsValidated: number;
    apiCalls: number;
    exportsDownloaded: number;
  };
  tier: 'free' | 'pro' | 'enterprise';
  location: string;
  userType: 'independent_artist' | 'pr_agency' | 'record_label' | 'music_venue' | 'other';
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch real ConvertKit subscribers
      console.log('📊 Fetching real ConvertKit subscribers...');

      const response = await fetch('/api/convertkit-subscribers');
      const data = await response.json();

      if (data.error) {
        console.error('❌ Failed to fetch ConvertKit subscribers:', data.error);
        throw new Error(data.error);
      }

      // Transform ConvertKit subscribers to User format
      const realUsers: User[] = data.users.map((subscriber: any) => {
        // Determine user type based on email domain and engagement
        let userType: User['userType'] = 'independent_artist';
        if (subscriber.email.includes('pr') || subscriber.email.includes('music')) {
          userType = 'pr_agency';
        } else if (subscriber.email.includes('label') || subscriber.email.includes('records')) {
          userType = 'record_label';
        } else if (subscriber.email.includes('venue') || subscriber.email.includes('club')) {
          userType = 'music_venue';
        } else if (subscriber.email.includes('@totalaudiopromo.com')) {
          userType = 'other'; // Internal accounts
        }

        // Convert status from beta tracker format to user management format
        let userStatus: User['status'];
        if (subscriber.status === 'active') {
          userStatus = 'active';
        } else if (subscriber.status === 'idle') {
          userStatus = 'active'; // Still considered active
        } else {
          userStatus = 'inactive';
        }

        return {
          id: subscriber.id,
          name: subscriber.name || 'Beta User',
          email: subscriber.email,
          role: 'beta-user' as const,
          status: userStatus,
          signupDate: subscriber.firstVisit,
          lastActive: subscriber.lastSeen,
          usage: {
            contactsEnriched: subscriber.engagement.contactsEnriched,
            emailsValidated: subscriber.engagement.emailsValidated,
            apiCalls: Math.floor(subscriber.engagement.contactsEnriched * 2.5), // Estimate API calls
            exportsDownloaded: subscriber.engagement.exportsGenerated,
          },
          tier: 'free' as const, // All beta users are on free tier
          location: `${subscriber.location?.city || 'Unknown'}, ${
            subscriber.location?.country || 'UK'
          }`,
          userType,
        };
      });

      console.log(`✅ Transformed ${realUsers.length} ConvertKit subscribers to user format`);
      setUsers(realUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: User['status']) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          updates: { status: newStatus },
        }),
      });

      if (response.ok) {
        setUsers(prev =>
          prev.map(user => (user.id === userId ? { ...user, status: newStatus } : user))
        );
        alert(`✅ User status updated to ${newStatus}`);
      } else {
        const error = await response.json();
        alert(`❌ Failed to update user: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('❌ Failed to update user status');
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          updates: { role: newRole },
        }),
      });

      if (response.ok) {
        setUsers(prev =>
          prev.map(user => (user.id === userId ? { ...user, role: newRole } : user))
        );
        alert(`✅ User role updated to ${newRole}`);
      } else {
        const error = await response.json();
        alert(`❌ Failed to update user: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('❌ Failed to update user role');
    }
  };

  const performUserAction = async (action: string, userId: string, data?: any) => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...data }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`✅ ${result.message}`);
        if (action === 'suspend') updateUserStatus(userId, 'suspended');
        if (action === 'activate') updateUserStatus(userId, 'active');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to perform user action:', error);
      alert('❌ Action failed');
    }
  };

  const filteredUsers =
    filterStatus === 'all' ? users : users.filter(user => user.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#d1fae5', text: '#047857', border: '#10b981' };
      case 'inactive':
        return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' };
      case 'suspended':
        return { bg: '#fed7d7', text: '#c53030', border: '#f56565' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'independent_artist':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'pr_agency':
        return { bg: '#f3e8ff', text: '#7c3aed' };
      case 'record_label':
        return { bg: '#fed7d7', text: '#c53030' };
      case 'music_venue':
        return { bg: '#d1fae5', text: '#047857' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading User Management...</h2>
          <p className="postcraft-text">Preparing your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">User Management</h1>
            <p className="postcraft-subtitle">
              Manage beta users, permissions, and track usage across Audio Intel
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="postcraft-section mb-8">
        <div className="postcraft-metrics-grid">
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">{users.length}</div>
            <div className="postcraft-metric-label">Total Users</div>
          </div>
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="postcraft-metric-label">Active</div>
          </div>
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-orange-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">
              {users.filter(u => u.status === 'inactive').length}
            </div>
            <div className="postcraft-metric-label">Inactive</div>
          </div>
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">
              {users.reduce((sum, user) => sum + user.usage.contactsEnriched, 0).toLocaleString()}
            </div>
            <div className="postcraft-metric-label">Total Enriched</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="postcraft-section mb-8">
        <h3 className="postcraft-label mb-4">Filter Users</h3>
        <div className="flex gap-3 flex-wrap">
          {['all', 'active', 'inactive', 'suspended'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`postcraft-button ${filterStatus === status ? 'bg-black text-white' : ''}`}
            >
              {status === 'all'
                ? `All Users (${users.length})`
                : `${status.charAt(0).toUpperCase() + status.slice(1)} (${
                    users.filter(u => u.status === status).length
                  })`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map(user => {
          const statusColors = getStatusColor(user.status);
          const typeColors = getUserTypeColor(user.userType);

          return (
            <div key={user.id} className="postcraft-card">
              {/* User Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="postcraft-label mb-1">{user.name}</h3>
                  <p className="postcraft-text text-sm mb-2">{user.email}</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold border-2 border-black capitalize"
                    style={{ background: typeColors.bg, color: typeColors.text }}
                  >
                    {user.userType.replace('_', ' ')}
                  </span>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase border-2 border-black"
                  style={{ background: statusColors.bg, color: statusColors.text }}
                >
                  {user.status}
                </span>
              </div>

              {/* Usage Stats */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-black mb-4">
                <h4 className="postcraft-label mb-3">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="postcraft-text">Contacts Enriched:</span>
                    <div className="font-black text-purple-600">
                      {user.usage.contactsEnriched.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="postcraft-text">Emails Validated:</span>
                    <div className="font-black text-green-600">
                      {user.usage.emailsValidated.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="postcraft-text">API Calls:</span>
                    <div className="font-black text-blue-600">
                      {user.usage.apiCalls.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="postcraft-text">Exports:</span>
                    <div className="font-black text-orange-600">{user.usage.exportsDownloaded}</div>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="postcraft-text">Signup Date:</span>
                    <div className="font-bold text-gray-900">
                      {new Date(user.signupDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div>
                    <span className="postcraft-text">Last Active:</span>
                    <div className="font-bold text-gray-900">
                      {new Date(user.lastActive).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div>
                    <span className="postcraft-text">Location:</span>
                    <div className="font-bold text-gray-900">{user.location}</div>
                  </div>
                  <div>
                    <span className="postcraft-text">Tier:</span>
                    <div className="font-bold text-gray-900 capitalize">{user.tier}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSelectedUser(user)} className="postcraft-button flex-1">
                  View Details
                </button>

                {user.status === 'active' ? (
                  <button
                    onClick={() => updateUserStatus(user.id, 'suspended')}
                    className="postcraft-button bg-red-100 text-red-800 border-red-800"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => updateUserStatus(user.id, 'active')}
                    className="postcraft-button bg-green-100 text-green-800 border-green-800"
                  >
                    Activate
                  </button>
                )}

                <select
                  value={user.role}
                  onChange={e => updateUserRole(user.id, e.target.value as User['role'])}
                  className="px-3 py-2 border-3 border-black rounded-xl font-bold bg-white"
                >
                  <option value="beta-user">Beta User</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>

                <button
                  onClick={() => performUserAction('reset-usage', user.id)}
                  className="postcraft-button bg-yellow-100 text-yellow-800 border-yellow-800"
                >
                  Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="postcraft-card text-center py-16">
          <p className="postcraft-text text-lg">No users found for the selected filter.</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="postcraft-card max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="postcraft-section-title">{selectedUser.name}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-4xl text-gray-500 hover:text-black font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="postcraft-label block mb-1">Email</span>
                  <p className="postcraft-text">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Role</span>
                  <p className="postcraft-text capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">User Type</span>
                  <p className="postcraft-text capitalize">
                    {selectedUser.userType.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Status</span>
                  <p className="postcraft-text capitalize">{selectedUser.status}</p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Tier</span>
                  <p className="postcraft-text capitalize">{selectedUser.tier}</p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Location</span>
                  <p className="postcraft-text">{selectedUser.location}</p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Signup Date</span>
                  <p className="postcraft-text">
                    {new Date(selectedUser.signupDate).toLocaleString('en-GB')}
                  </p>
                </div>
                <div>
                  <span className="postcraft-label block mb-1">Last Active</span>
                  <p className="postcraft-text">
                    {new Date(selectedUser.lastActive).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-3 border-black">
                <h4 className="postcraft-label mb-4">Usage Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="postcraft-text">Contacts Enriched</span>
                    <p className="font-black text-xl text-purple-600">
                      {selectedUser.usage.contactsEnriched.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="postcraft-text">Emails Validated</span>
                    <p className="font-black text-xl text-green-600">
                      {selectedUser.usage.emailsValidated.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="postcraft-text">API Calls</span>
                    <p className="font-black text-xl text-blue-600">
                      {selectedUser.usage.apiCalls.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="postcraft-text">Exports Downloaded</span>
                    <p className="font-black text-xl text-orange-600">
                      {selectedUser.usage.exportsDownloaded}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
