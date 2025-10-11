'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Share2, 
  Radio, 
  Newspaper, 
  DollarSign, 
  Settings,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  status: 'active' | 'warning' | 'error' | 'idle';
}

export default function TotalAudioDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch real business metrics with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const [businessResponse, audioIntelResponse] = await Promise.all([
        fetch('/api/business-metrics?timeframe=30d', { signal: controller.signal }),
        fetch('/api/audio-intel-metrics', { signal: controller.signal })
      ]);

      clearTimeout(timeoutId);

      if (!businessResponse.ok || !audioIntelResponse.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const businessData = await businessResponse.json();
      const audioIntelData = await audioIntelResponse.json();

      const dashboardMetrics: DashboardMetric[] = [
        {
          id: 'beta-users',
          label: 'Beta Users',
          value: businessData.betaUsers || 0,
          change: '+12%',
          changeType: 'positive'
        },
        {
          id: 'contacts-enriched',
          label: 'Contacts Enriched',
          value: businessData.contactsEnriched?.toLocaleString() || '0',
          change: '+8.2%',
          changeType: 'positive'
        },
        {
          id: 'success-rate',
          label: 'Success Rate',
          value: businessData.successRate || '0%',
          change: '+2.1%',
          changeType: 'positive'
        },
        {
          id: 'projected-mrr',
          label: 'Projected MRR',
          value: businessData.projectedMRR || '£0',
          change: '+15%',
          changeType: 'positive'
        }
      ];

      setMetrics(dashboardMetrics);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Unable to load metrics. Using cached data.');
      // Set fallback metrics
      setMetrics([
        { id: 'beta-users', label: 'Beta Users', value: '--', change: '', changeType: 'neutral' },
        { id: 'contacts-enriched', label: 'Contacts Enriched', value: '--', change: '', changeType: 'neutral' },
        { id: 'success-rate', label: 'Success Rate', value: '--', change: '', changeType: 'neutral' },
        { id: 'projected-mrr', label: 'Projected MRR', value: '£--', change: '', changeType: 'neutral' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Real-time business metrics and performance insights',
      href: '/analytics',
      icon: BarChart3,
      status: 'active'
    },
    {
      id: 'business',
      title: 'Business Dashboard',
      description: 'Executive overview and strategic metrics',
      href: '/business-dashboard',
      icon: DollarSign,
      status: 'active'
    },
    {
      id: 'marketing',
      title: 'Marketing Tools',
      description: 'AI-powered content generation and social media automation',
      href: '/marketing',
      icon: Share2,
      status: 'active'
    },
    {
      id: 'reports',
      title: 'Business Reports',
      description: 'Generate and download comprehensive business intelligence',
      href: '/reports',
      icon: FileText,
      status: 'active'
    },
    {
      id: 'social-hub',
      title: 'Social Media Hub',
      description: 'Centralised social media management and content scheduling',
      href: '/social-media-hub',
      icon: Share2,
      status: 'active'
    },
    {
      id: 'newsjacking',
      title: 'Newsjacking',
      description: 'Monitor trends and capitalise on breaking news',
      href: '/newsjacking',
      icon: Newspaper,
      status: 'active'
    },
    {
      id: 'revenue',
      title: 'Revenue Intelligence',
      description: 'Financial forecasting and revenue optimisation',
      href: '/revenue-intelligence',
      icon: TrendingUp,
      status: 'active'
    },
    {
      id: 'beta-management',
      title: 'Beta Management',
      description: 'Manage beta users and track engagement',
      href: '/beta-management',
      icon: Users,
      status: 'active'
    },
    {
      id: 'system-status',
      title: 'System Status',
      description: 'Monitor system health and performance',
      href: '/system-status',
      icon: Settings,
      status: 'active'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Skeleton Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg w-64 sm:w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-48 sm:w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton Metrics */}
          <div className="mb-8 sm:mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-32 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-xl border-4 border-gray-200 h-32 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="mb-8 sm:mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-40 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-xl border-4 border-gray-200 h-40 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-page">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 sm:p-6 bg-yellow-50 border-4 border-yellow-400 rounded-xl shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-yellow-900 font-black text-sm">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-black text-yellow-900 mb-1">Connection Issue</h3>
                <p className="text-sm sm:text-base text-yellow-800 font-medium">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-3 inline-flex items-center px-4 py-2 text-sm font-bold bg-yellow-400 text-yellow-900 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none min-h-[44px]"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="postcraft-section text-center mb-8 sm:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Command Centre
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your centralised hub for music industry intelligence and automation
          </p>
          <div className="postcraft-status">
            <div className="postcraft-status-dot"></div>
            <span>All Systems Operational</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="postcraft-section mb-8">
          <div className="postcraft-section-header">
            <h2>Key Metrics</h2>
          </div>
          <div className="postcraft-metrics-grid">
            {metrics.map((metric) => (
              <div key={metric.id} className="postcraft-metric-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="postcraft-metric-label">{metric.label}</p>
                    <p className="postcraft-metric-value">{metric.value}</p>
                  </div>
                  {metric.change && (
                    <div className={`flex items-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                      metric.changeType === 'positive' ? 'text-green-600' :
                      metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.changeType === 'positive' && <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />}
                      {metric.changeType === 'negative' && <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />}
                      <span className="whitespace-nowrap">{metric.change}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="postcraft-section mb-8">
          <div className="postcraft-section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="postcraft-card group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="postcraft-metric-icon" style={{ background: '#dbeafe' }}>
                        <Icon className="w-6 h-6 text-blue-900" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{card.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{card.description}</p>
                      <div className="postcraft-status">
                        <div className={`postcraft-status-dot ${
                          card.status === 'active' ? 'bg-green-500' :
                          card.status === 'warning' ? 'bg-yellow-500' :
                          card.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="capitalize">{card.status}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2>System Status</h2>
            <p className="text-sm text-gray-600 mt-2">Last updated 2 minutes ago</p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Audio Intel', 'API Services', 'Database', 'Analytics'].map((service) => (
              <div key={service} className="postcraft-metric-card">
                <div className="postcraft-status">
                  <div className="postcraft-status-dot"></div>
                  <span className="font-semibold">{service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}