'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  Mail, 
  Eye, 
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Star,
  Activity,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import BetaUserMap from '../components/BetaUserMap';
import Image from 'next/image';

interface BetaSignup {
  name: string;
  email: string;
  role: 'independent-artist' | 'pr-agency' | 'label' | 'other';
  interests: string[];
  referralSource: string;
  currentTools: string;
  goals: string;
}

interface BetaUser {
  id: string;
  email: string;
  name?: string;
  app: string;
  status: 'active' | 'idle' | 'offline';
  lastSeen: string;
  firstVisit?: string;
  location: {
    country: string;
    city: string;
    countryCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  sessionCount?: number;
  features?: string[];
  engagement: {
    contactsEnriched: number;
    emailsValidated: number;
    timeSpent: number;
  };
}

interface BetaTrackingData {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  users: BetaUser[];
  analytics?: {
    topFeatures: Array<{ feature: string; usage: number }>;
    engagementMetrics: {
      avgSessionTime: number;
      avgContactsPerUser: number;
      conversionRate: number;
    };
  };
}

export default function BetaManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'analytics' | 'signup'>('dashboard');
  const [betaData, setBetaData] = useState<BetaTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'offline'>('all');
  const [filterApp, setFilterApp] = useState<'all' | 'audio-intel' | 'playlist-pulse' | 'command-centre' | 'web'>('all');
  const [selectedUser, setSelectedUser] = useState<BetaUser | null>(null);
  const [formData, setFormData] = useState<BetaSignup>({
    name: '',
    email: '',
    role: 'independent-artist',
    interests: [],
    referralSource: '',
    currentTools: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchBetaData = async () => {
    try {
      const response = await fetch(`/api/convertkit-subscribers?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBetaData(data);
      }
    } catch (error) {
      console.error('Error fetching beta data:', error);
      setBetaData({ totalUsers: 4, activeUsers: 2, newToday: 0, users: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBetaData();
    const interval = setInterval(fetchBetaData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Filter and search functions
  const filteredUsers = betaData?.users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesApp = filterApp === 'all' || user.app === filterApp;
    
    return matchesSearch && matchesStatus && matchesApp;
  }) || [];

  const exportUserData = () => {
    if (!betaData?.users.length) return;
    
    const csvData = betaData.users.map(user => ({
      name: user.name || '',
      email: user.email,
      app: user.app,
      status: user.status,
      'first_visit': user.firstVisit,
      'last_seen': user.lastSeen,
      'session_count': user.sessionCount || 0,
      'contacts_enriched': user.engagement.contactsEnriched,
      'emails_validated': user.engagement.emailsValidated,
      'time_spent_minutes': user.engagement.timeSpent,
      country: user.location.country,
      city: user.location.city,
      device_type: (user as any).device?.type || 'unknown',
      browser: (user as any).device?.browser || 'unknown',
      features: (user.features || []).join(', ')
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUserEngagementScore = (user: BetaUser) => {
    const sessionScore = Math.min((user.sessionCount || 0) * 2, 30);
    const contactScore = Math.min(user.engagement.contactsEnriched / 10, 30);
    const timeScore = Math.min(user.engagement.timeSpent / 5, 25);
    const recentActivityScore = user.status === 'active' ? 15 : user.status === 'idle' ? 10 : 0;
    
    return Math.round(sessionScore + contactScore + timeScore + recentActivityScore);
  };

  const contactUser = (user: BetaUser) => {
    const subject = `Audio Intel Beta - How's your experience going?`;
    const body = `Hi ${user.name || user.email.split('@')[0]},

I hope you're enjoying Audio Intel! I noticed you've enriched ${user.engagement.contactsEnriched} contacts so far.

Is there anything I can help you with to get even more value from the platform?

Best regards,
Chris
Total Audio Promo`;
    
    window.open(`mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          role: 'independent-artist',
          interests: [],
          referralSource: '',
          currentTools: '',
          goals: ''
        });

        // Show success message
        alert(`✅ ${result.message}`);
        
        // Refresh beta data
        fetchBetaData();
      } else {
        throw new Error(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Beta signup error:', error);
      alert(`❌ ${error instanceof Error ? error.message : 'Signup failed. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading Beta Management...</h2>
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
            <h1 className="postcraft-title mb-1">Beta Management</h1>
            <p className="postcraft-subtitle">Manage Audio Intel beta users and signups</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3">
            {[
              { key: 'dashboard', label: 'Overview', icon: BarChart3 },
              { key: 'users', label: 'User Management', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'signup', label: 'Add User', icon: UserCheck }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
              className={`postcraft-button flex items-center gap-2 ${activeTab === tab.key ? 'bg-black text-white' : ''}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      {/* Main Content */}
      <div>
        {activeTab === 'users' ? (
          /* Enhanced User Management */
          <div className="postcraft-section mb-8">
            <div className="postcraft-card">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="postcraft-section-title">
                      User Management ({filteredUsers.length} users)
                    </h2>
                  <div className="flex gap-3">
                      <button
                        onClick={exportUserData}
                      className="postcraft-button flex items-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                      <button
                        onClick={fetchBetaData}
                      className="postcraft-button flex items-center gap-2"
                      >
                        <RefreshCw size={16} />
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="idle">Idle</option>
                      <option value="offline">Offline</option>
                    </select>
                    
                    <select
                      value={filterApp}
                      onChange={(e) => setFilterApp(e.target.value as any)}
                    className="px-4 py-2 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    >
                      <option value="all">All Apps</option>
                      <option value="audio-intel">Audio Intel</option>
                      <option value="playlist-pulse">Playlist Pulse</option>
                      <option value="command-centre">Command Centre</option>
                      <option value="web">Web</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Enhanced User List */}
            <div className="grid grid-cols-1 gap-4 mt-6">
                {filteredUsers.map(user => (
                <div key={user.id} className="postcraft-card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="postcraft-label">
                            {user.name || user.email.split('@')[0]}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border-2 border-black">
                            {getUserEngagementScore(user)}% engagement
                          </span>
                        </div>
                        <p className="postcraft-text text-sm mb-2">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-xs font-bold uppercase">
                            {user.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => contactUser(user)}
                          className="postcraft-button p-2"
                          title="Contact user"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="postcraft-button p-2"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>

                    {/* User Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-black text-blue-600">
                          {user.engagement.contactsEnriched}
                        </div>
                        <div className="postcraft-text text-xs">Contacts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-green-600">
                          {user.engagement.emailsValidated}
                        </div>
                        <div className="postcraft-text text-xs">Validated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-purple-600">
                          {user.sessionCount}
                        </div>
                        <div className="postcraft-text text-xs">Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-orange-600">
                          {user.engagement.timeSpent}m
                        </div>
                        <div className="postcraft-text text-xs">Time</div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex justify-between items-center text-xs postcraft-text">
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {user.location.city}, {user.location.countryCode}
                      </span>
                      <span className="flex items-center gap-1">
                        {(user as any).device?.type === 'desktop' ? <Monitor size={12} /> : <Smartphone size={12} />}
                        {(user as any).device?.browser || 'unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(user.lastSeen).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          /* Analytics Tab */
          <div className="postcraft-section">
            <div className="postcraft-card">
              <h2 className="postcraft-section-title mb-6">
                  User Analytics & Insights
                </h2>
                
                {betaData?.analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                    <h3 className="postcraft-label mb-4">Top Features</h3>
                      {betaData.analytics.topFeatures.map(feature => (
                      <div key={feature.feature} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="postcraft-text capitalize">
                              {feature.feature.replace('-', ' ')}
                            </span>
                          <span className="font-bold text-blue-600">
                              {feature.usage} users
                            </span>
                          </div>
                        <div className="h-2 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${(feature.usage / betaData.totalUsers) * 100}%` }}
                          ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                    <h3 className="postcraft-label mb-4">Device Breakdown</h3>
                      {Object.entries(((betaData.analytics as any).deviceBreakdown || {}) as Record<string, number>).map(([device, count]) => (
                      <div key={device} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="postcraft-text capitalize">{device}</span>
                          <span className="font-bold text-green-600">{count} users</span>
                          </div>
                        <div className="h-2 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                          <div 
                            className="h-full bg-green-500"
                            style={{ width: `${(count / betaData.totalUsers) * 100}%` }}
                          ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              <div className="postcraft-metrics-grid">
                <div className="postcraft-metric-card">
                  <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Activity className="w-6 h-6 text-white" />
                      </div>
                  <div className="postcraft-metric-value">{betaData?.analytics?.engagementMetrics.avgSessionTime || 0}min</div>
                  <div className="postcraft-metric-label">Avg Session Time</div>
                  </div>
                  
                <div className="postcraft-metric-card">
                  <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                    <Star className="w-6 h-6 text-white" />
                      </div>
                  <div className="postcraft-metric-value">{betaData?.analytics?.engagementMetrics.avgContactsPerUser || 0}</div>
                  <div className="postcraft-metric-label">Avg Contacts Per User</div>
                  </div>
                  
                <div className="postcraft-metric-card">
                  <div className="postcraft-metric-icon bg-gradient-to-br from-orange-500 to-amber-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                  <div className="postcraft-metric-value">{betaData?.analytics?.engagementMetrics.conversionRate || 0}%</div>
                  <div className="postcraft-metric-label">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'dashboard' ? (
          /* Beta Dashboard */
          <div className="postcraft-section">
            {/* Beta User Tracking */}
            {betaData && (
              <div className="postcraft-card mb-8">
                <h3 className="postcraft-section-title mb-6">
                  Beta User Analytics
                </h3>
                
                {/* Metrics Grid */}
                <div className="postcraft-metrics-grid mb-8">
                  <div className="postcraft-metric-card">
                    <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Users className="w-6 h-6 text-white" />
                      </div>
                    <div className="postcraft-metric-value">{betaData.totalUsers}</div>
                    <div className="postcraft-metric-label">Total Beta Users</div>
                  </div>

                  <div className="postcraft-metric-card">
                    <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                      <Activity className="w-6 h-6 text-white" />
                      </div>
                    <div className="postcraft-metric-value">{betaData.activeUsers}</div>
                    <div className="postcraft-metric-label">Active Now</div>
                  </div>

                  <div className="postcraft-metric-card">
                    <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
                      <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    <div className="postcraft-metric-value">{betaData.newToday}</div>
                    <div className="postcraft-metric-label">New Today</div>
                  </div>
                </div>

                {/* Global User Map */}
                <div className="mb-8">
                <BetaUserMap users={betaData.users} />
                </div>

                {/* Detailed User List */}
                {betaData.users && betaData.users.length > 0 && (
                  <div>
                    <h4 className="postcraft-label mb-4">
                      Active Beta Users
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {betaData.users.map((user: any, index: number) => (
                        <div 
                          key={user.id} 
                          className={`postcraft-card ${
                            user.status === 'active' ? 'bg-green-50' : 
                            user.status === 'idle' ? 'bg-yellow-50' :
                            'bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h5 className="postcraft-label mb-1">
                                {user.name || user.email.split('@')[0]}
                              </h5>
                              <p className="postcraft-text text-xs mb-2">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' :
                                  user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}></div>
                                <span className="text-xs font-bold uppercase">
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                            <div>
                              <span className="postcraft-text">Contacts:</span>
                              <div className="font-black text-purple-600">
                                {user.engagement.contactsEnriched.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="postcraft-text">Validated:</span>
                              <div className="font-black text-green-600">
                                {user.engagement.emailsValidated.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="postcraft-text">Sessions:</span>
                              <div className="font-black text-blue-600">
                                {user.sessionCount}
                              </div>
                            </div>
                            <div>
                              <span className="postcraft-text">Location:</span>
                              <div className="font-bold text-gray-900">
                                {user.location.city}, {user.location.countryCode}
                              </div>
                            </div>
                          </div>

                          <div className="text-xs postcraft-text">
                            Last seen: {new Date(user.lastSeen).toLocaleString('en-GB', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Beta Signup Form */
          <div className="postcraft-section">
            {isSubmitted ? (
              <div className="max-w-2xl mx-auto">
                <div className="postcraft-card text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                  <h2 className="postcraft-title mb-4">
                  Beta User Added Successfully!
                </h2>
                
                  <p className="postcraft-text text-lg mb-8">
                  The new beta user has been added to Audio Intel. They will receive access details shortly.
                </p>

                  <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      role: 'independent-artist',
                      interests: [],
                      referralSource: '',
                      currentTools: '',
                      goals: ''
                    });
                  }}
                      className="postcraft-button bg-blue-100 text-blue-800"
                >
                  Add Another User
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                      className="postcraft-button"
                >
                  View Dashboard
                </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="postcraft-card">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <UserCheck className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="postcraft-title mb-2">
                      Add New Beta User
                    </h2>
                    
                    <p className="postcraft-text text-lg">
                      Manually add a new user to the Audio Intel beta program
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="postcraft-label mb-2 block">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <label className="postcraft-label mb-2 block">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                          placeholder="user@example.com"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="mb-8">
                      <label className="postcraft-label mb-4 block">
                        User Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: 'independent-artist', label: 'Independent Artist' },
                          { value: 'pr-agency', label: 'PR Agency' },
                          { value: 'label', label: 'Record Label' },
                          { value: 'other', label: 'Other' }
                        ].map((role) => (
                          <label key={role.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={formData.role === role.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                              className="hidden"
                            />
                            <div className={`px-4 py-3 rounded-xl border-3 border-black text-center font-bold transition-all ${
                              formData.role === role.value 
                                ? 'bg-blue-100 text-blue-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-white text-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            }`}>
                              {role.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="mb-8">
                      <label className="postcraft-label mb-4 block">
                        Interested Features (select all that apply)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Contact enrichment & data enhancement',
                          'Email validation & verification',
                          'Industry contact database access',
                          'AI-powered contact intelligence',
                          'Multi-client agency dashboard',
                          'CSV export & data management'
                        ].map((interest) => (
                          <label key={interest} className="flex items-center gap-3 px-4 py-3 border-2 border-black rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              className="w-5 h-5 border-2 border-black rounded"
                            />
                            <span className="postcraft-text font-bold">
                              {interest}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Current Tools */}
                    <div className="mb-8">
                      <label className="postcraft-label mb-2 block">
                        Current Tools
                      </label>
                      <textarea
                        value={formData.currentTools}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentTools: e.target.value }))}
                        className="w-full px-4 py-3 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold resize-vertical"
                        rows={4}
                        placeholder="e.g., SubmitHub, Groover, Chartmetric, Apollo, ZoomInfo, etc."
                      />
                    </div>

                    {/* Goals */}
                    <div className="mb-8">
                      <label className="postcraft-label mb-2 block">
                        Goals with Audio Intel
                      </label>
                      <textarea
                        value={formData.goals}
                        onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                        className="w-full px-4 py-3 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold resize-vertical"
                        rows={4}
                        placeholder="e.g., Build verified industry contacts, validate email lists, enrich existing contacts with social data..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-8 py-4 rounded-xl border-3 border-black bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                        isSubmitting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                      }`}
                    >
                      {isSubmitting ? 'Adding User...' : 'Add Beta User'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}