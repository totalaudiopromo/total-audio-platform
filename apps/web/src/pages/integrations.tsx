import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GmailIntegration from '../components/integrations/GmailIntegration';
import PerplexityIntegration from '../components/integrations/PerplexityIntegration';
import ClaudeIntegration from '../components/integrations/ClaudeIntegration';
import DataForSEOIntegration from '../components/integrations/DataForSEOIntegration';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncStatus: 'success' | 'error' | 'pending';
  dataPoints: number;
  category: 'database' | 'email' | 'analytics' | 'social';
}

const sampleIntegrations: Integration[] = [
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Sync your contact database and campaign data',
    icon: '📊',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    syncStatus: 'success',
    dataPoints: 1250,
    category: 'database'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Send email campaigns and track engagement',
    icon: '📧',
    status: 'connected',
    lastSync: '2024-01-15T09:15:00Z',
    syncStatus: 'success',
    dataPoints: 3200,
    category: 'email'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send personalized emails and track responses',
    icon: '📮',
    status: 'disconnected',
    lastSync: '2024-01-15T11:45:00Z',
    syncStatus: 'pending',
    dataPoints: 0,
    category: 'email'
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'AI-powered content generation and personalization',
    icon: '🤖',
    status: 'connected',
    lastSync: '2024-01-15T08:20:00Z',
    syncStatus: 'success',
    dataPoints: 450,
    category: 'analytics'
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Automate workflows and data synchronization',
    icon: '⚙️',
    status: 'disconnected',
    lastSync: '2024-01-10T14:30:00Z',
    syncStatus: 'error',
    dataPoints: 0,
    category: 'database'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and team collaboration',
    icon: '💬',
    status: 'disconnected',
    lastSync: null,
    syncStatus: 'pending',
    dataPoints: 0,
    category: 'social'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI-powered research and journalist discovery',
    icon: '🔍',
    status: 'connected',
    lastSync: '2024-01-15T12:00:00Z',
    syncStatus: 'success',
    dataPoints: 150,
    category: 'analytics'
  },
  {
    id: 'openrouter',
    name: 'Open Router',
    description: 'AI model access for content generation',
    icon: '🤖',
    status: 'connected',
    lastSync: '2024-01-15T11:30:00Z',
    syncStatus: 'success',
    dataPoints: 280,
    category: 'analytics'
  },
  {
    id: 'dataforseo',
    name: 'Data for SEO',
    description: 'SEO analysis and keyword research',
    icon: '📈',
    status: 'connected',
    lastSync: '2024-01-15T10:45:00Z',
    syncStatus: 'success',
    dataPoints: 420,
    category: 'analytics'
  },

  {
    id: 'aura',
    name: 'Aura AI',
    description: 'AI-powered pitch and press release generation',
    icon: '✨',
    status: 'connected',
    lastSync: '2024-01-15T08:15:00Z',
    syncStatus: 'success',
    dataPoints: 320,
    category: 'analytics'
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(sampleIntegrations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const filteredIntegrations = integrations.filter(integration => {
    return selectedCategory === 'all' || integration.category === selectedCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return '🗄️';
      case 'email': return '📧';
      case 'analytics': return '📊';
      case 'social': return '💬';
      default: return '🔗';
    }
  };

  const handleConnect = (integrationId: string) => {
    if (integrationId === 'gmail') {
      setSelectedIntegration('gmail');
      return;
    }
    if (integrationId === 'perplexity') {
      setSelectedIntegration('perplexity');
      return;
    }
    if (integrationId === 'claude') {
      setSelectedIntegration('claude');
      return;
    }
    if (integrationId === 'dataforseo') {
      setSelectedIntegration('dataforseo');
      return;
    }
    if (integrationId === 'airtable') {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/integrations/airtable/connect`;
      return;
    }
    // fallback: just update state for other integrations
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected', syncStatus: 'success' }
        : integration
    ));
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected', syncStatus: 'pending' }
        : integration
    ));
  };

  const handleBackToIntegrations = () => {
    setSelectedIntegration(null);
  };

  // Check for success/error parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'gmail') {
      setIntegrations(prev => prev.map(integration => 
        integration.id === 'gmail' 
          ? { ...integration, status: 'connected', syncStatus: 'success' }
          : integration
      ));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (error === 'gmail') {
      setIntegrations(prev => prev.map(integration => 
        integration.id === 'gmail' 
          ? { ...integration, status: 'disconnected', syncStatus: 'error' }
          : integration
      ));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // If a specific integration is selected, show its detailed component
  if (selectedIntegration === 'gmail') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToIntegrations}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Integrations
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    Gmail Integration
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Connect your Gmail account to track email replies and send emails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gmail Integration Component */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <GmailIntegration />
        </div>
      </div>
    );
  }

  if (selectedIntegration === 'perplexity') {
    return <PerplexityIntegration />;
  }

  if (selectedIntegration === 'claude') {
    return <ClaudeIntegration />;
  }

  if (selectedIntegration === 'dataforseo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToIntegrations}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Integrations
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    Data for SEO Integration
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Analyze domains, research keywords, analyze competitors, and get SERP results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data for SEO Integration Component */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DataForSEOIntegration />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image src="/assets/totalaudiopromo-dog-logo.jpg" alt="Total Audio Promo Logo" width={40} height={40} className="rounded-lg shadow-sm" />
                <span className="text-lg font-bold text-gray-700">Total Audio Promo</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Integrations
                </h1>
                <p className="text-gray-600 text-sm">
                  Connect your favorite tools and automate your workflow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link href="/contacts" className="text-gray-600 hover:text-gray-900 font-medium">Contacts</Link>
                <Link href="/campaigns" className="text-gray-600 hover:text-gray-900 font-medium">Campaigns</Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium">Analytics</Link>
                <Link href="/integrations" className="text-gray-600 hover:text-gray-900 font-medium">Integrations</Link>
              </nav>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <div className="text-3xl">🔗</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Data Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.reduce((acc, i) => acc + i.dataPoints, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sync Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.syncStatus === 'success').length}/{integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="database">Database</option>
                <option value="email">Email</option>
                <option value="analytics">Analytics</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Integration
              </button>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(integration.status)}`}>
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(integration.category)}</span>
                    <span className="font-medium text-gray-700">
                      {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-semibold text-gray-900">{integration.dataPoints.toLocaleString()}</span>
                </div>

                {integration.lastSync && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className={`font-medium ${getSyncStatusColor(integration.syncStatus)}`}>
                      {new Date(integration.lastSync).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sync Status:</span>
                  <span className={`font-medium ${getSyncStatusColor(integration.syncStatus)}`}>
                    {integration.syncStatus.charAt(0).toUpperCase() + integration.syncStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <>
                    <button 
                      onClick={() => integration.id === 'gmail' ? setSelectedIntegration('gmail') : undefined}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Configure
                    </button>
                    <button 
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(integration.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-500">Connect your first integration to get started.</p>
          </div>
        )}

        {/* Available Integrations */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Spotify', icon: '🎵', category: 'music' },
              { name: 'YouTube', icon: '📺', category: 'video' },
              { name: 'Instagram', icon: '📷', category: 'social' },
              { name: 'Twitter', icon: '🐦', category: 'social' },
              { name: 'LinkedIn', icon: '💼', category: 'social' },
              { name: 'Discord', icon: '🎮', category: 'social' },
              { name: 'TikTok', icon: '📱', category: 'social' },
              { name: 'SoundCloud', icon: '🎧', category: 'music' }
            ].map((service) => (
              <div key={service.name} className="bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 text-center hover:bg-white/80 transition-colors">
                <div className="text-2xl mb-2">{service.icon}</div>
                <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 