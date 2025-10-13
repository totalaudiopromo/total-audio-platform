'use client';

import { useState, useEffect } from 'react';
import { Users, User, Shield, Activity, BarChart3, MapPin, Calendar, Mail, Filter } from 'lucide-react';

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
            exportsDownloaded: subscriber.engagement.exportsGenerated
          },
          tier: 'free' as const, // All beta users are on free tier
          location: `${subscriber.location?.city || 'Unknown'}, ${subscriber.location?.country || 'UK'}`,
          userType
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
          updates: { status: newStatus }
        })
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
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
          updates: { role: newRole }
        })
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
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
        body: JSON.stringify({ action, userId, ...data })
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

  const filteredUsers = filterStatus === 'all' 
    ? users 
    : users.filter(user => user.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#d1fae5', text: '#047857', border: '#10b981' };
      case 'inactive': return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' };
      case 'suspended': return { bg: '#fed7d7', text: '#c53030', border: '#f56565' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'independent_artist': return { bg: '#dbeafe', text: '#1e40af' };
      case 'pr_agency': return { bg: '#f3e8ff', text: '#7c3aed' };
      case 'record_label': return { bg: '#fed7d7', text: '#c53030' };
      case 'music_venue': return { bg: '#d1fae5', text: '#047857' };
      default: return { bg: '#f3f4f6', text: '#374151' };
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
            <p className="postcraft-subtitle">Manage beta users, permissions, and track usage across Audio Intel</p>
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
            <div className="postcraft-metric-value">{users.filter(u => u.status === 'active').length}</div>
            <div className="postcraft-metric-label">Active</div>
          </div>
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-orange-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">{users.filter(u => u.status === 'inactive').length}</div>
            <div className="postcraft-metric-label">Inactive</div>
          </div>
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="postcraft-metric-value">{users.reduce((sum, user) => sum + user.usage.contactsEnriched, 0).toLocaleString()}</div>
            <div className="postcraft-metric-label">Total Enriched</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="postcraft-section mb-8">
        <h3 className="postcraft-label mb-4">Filter Users</h3>
        <div className="flex gap-3 flex-wrap">
          {['all', 'active', 'inactive', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`postcraft-button ${filterStatus === status ? 'bg-black text-white' : ''}`}
            >
              {status === 'all' ? `All Users (${users.length})` : `${status.charAt(0).toUpperCase() + status.slice(1)} (${users.filter(u => u.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => {
          const statusColors = getStatusColor(user.status);
          const typeColors = getUserTypeColor(user.userType);
          
          return (
            <div key={user.id} className="postcraft-card">
              {/* User Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="postcraft-label mb-1">
                    {user.name}
                  </h3>
                  <p className="postcraft-text text-sm mb-2">
                    {user.email}
                  </p>
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
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Usage Statistics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Contacts Enriched:</span>
                    <span style={{ fontWeight: '600', marginLeft: '0.5rem', color: '#8b5cf6' }}>
                      {user.usage.contactsEnriched.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Emails Validated:</span>
                    <span style={{ fontWeight: '600', marginLeft: '0.5rem', color: '#059669' }}>
                      {user.usage.emailsValidated.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>API Calls:</span>
                    <span style={{ fontWeight: '600', marginLeft: '0.5rem', color: '#3b82f6' }}>
                      {user.usage.apiCalls.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Exports:</span>
                    <span style={{ fontWeight: '600', marginLeft: '0.5rem', color: '#f59e0b' }}>
                      {user.usage.exportsDownloaded}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Signup Date:</span>
                    <div style={{ fontWeight: '500', color: '#374151' }}>
                      {new Date(user.signupDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Last Active:</span>
                    <div style={{ fontWeight: '500', color: '#374151' }}>
                      {new Date(user.lastActive).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Location:</span>
                    <div style={{ fontWeight: '500', color: '#374151' }}>
                      {user.location}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Tier:</span>
                    <div style={{ fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>
                      {user.tier}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedUser(user)}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  View Details
                </button>
                
                {user.status === 'active' ? (
                  <button
                    onClick={() => updateUserStatus(user.id, 'suspended')}
                    style={{
                      background: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #dc2626',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => updateUserStatus(user.id, 'active')}
                    style={{
                      background: 'transparent',
                      color: '#059669',
                      border: '1px solid #059669',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Activate
                  </button>
                )}
                
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <option value="beta-user">Beta User</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>

                <button
                  onClick={() => performUserAction('reset-usage', user.id)}
                  style={{
                    background: 'transparent',
                    color: '#f59e0b',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Reset Usage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            No users found for the selected filter.
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={() => setSelectedUser(null)}
        >
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                {selectedUser.name}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>User Type:</strong> {selectedUser.userType.replace('_', ' ')}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Tier:</strong> {selectedUser.tier}</p>
              <p><strong>Location:</strong> {selectedUser.location}</p>
              <p><strong>Signup Date:</strong> {new Date(selectedUser.signupDate).toLocaleString('en-GB')}</p>
              <p><strong>Last Active:</strong> {new Date(selectedUser.lastActive).toLocaleString('en-GB')}</p>
              
              <div style={{ marginTop: '1.5rem' }}>
                <strong>Usage Details:</strong>
                <ul style={{ marginTop: '0.5rem' }}>
                  <li>Contacts Enriched: {selectedUser.usage.contactsEnriched.toLocaleString()}</li>
                  <li>Emails Validated: {selectedUser.usage.emailsValidated.toLocaleString()}</li>
                  <li>API Calls: {selectedUser.usage.apiCalls.toLocaleString()}</li>
                  <li>Exports Downloaded: {selectedUser.usage.exportsDownloaded}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}