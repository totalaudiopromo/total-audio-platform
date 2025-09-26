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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real business metrics
      const [businessResponse, audioIntelResponse] = await Promise.all([
        fetch('/api/business-metrics?timeframe=30d'),
        fetch('/api/audio-intel-metrics')
      ]);

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
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Command Centre...</h2>
          <p className="text-gray-600">Preparing your business intelligence dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Command Centre
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your centralised hub for music industry intelligence and automation
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          All Systems Operational
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.changeType === 'positive' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {metric.changeType === 'negative' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            
            return (
              <Link
                key={card.id}
                href={card.href}
                className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        card.status === 'active' ? 'bg-green-400' :
                        card.status === 'warning' ? 'bg-yellow-400' :
                        card.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">{card.status}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600">Last updated 2 minutes ago</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Audio Intel', 'API Services', 'Database', 'Analytics'].map((service) => (
              <div key={service} className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}