'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  AlertTriangle,
} from 'lucide-react';
import PostcraftLayout from '../components/PostcraftLayout';

interface BusinessMetrics {
  revenue: {
    mrr: number;
    growth: number;
  };
  customers: {
    total: number;
    newSignups: number;
  };
  product: {
    contactsEnriched: number;
    emailsValidated: number;
    successRate: number;
  };
  agents: {
    activeAgents: number;
    tasksCompleted: number;
  };
}

export default function BusinessDashboardPage() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch('/api/business-metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch real business data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading Business Data...</h2>
          <p className="postcraft-text">Fetching real-time metrics</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="postcraft-card text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="postcraft-section-title mb-2">Unable to Load Business Data</h2>
          <p className="postcraft-text">Real business metrics are currently unavailable.</p>
        </div>
      </div>
    );
  }

  // Calculate real derived metrics
  const totalRevenue = metrics.revenue.mrr; // Current MRR
  const activeCustomers = metrics.customers.total;
  const contactsEnriched = metrics.product.contactsEnriched;
  const emailsValidated = metrics.product.emailsValidated;
  const successRate = metrics.product.successRate;
  const activeAgents = metrics.agents.activeAgents;
  const tasksCompleted = metrics.agents.tasksCompleted;

  return (
    <PostcraftLayout>
      <div className="postcraft-page">
        {/* Header */}
        <div className="postcraft-header mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="postcraft-title mb-1">Business Dashboard</h1>
              <p className="postcraft-subtitle">
                Complete business metrics and performance analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 rounded-xl border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-fit">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="font-bold text-gray-900">Real-time data</span>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="postcraft-section mb-8">
          <h2 className="postcraft-section-title mb-6">Key Performance Metrics</h2>

          <div className="postcraft-metrics-grid">
            {/* Revenue Card */}
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">£{totalRevenue.toLocaleString()}</div>
              <div className="postcraft-metric-label">Monthly Revenue</div>
              <div className="postcraft-text text-sm mt-2">
                {totalRevenue === 0 ? 'Beta Phase - Pre-launch' : 'Growing steadily'}
              </div>
            </div>

            {/* Customers Card */}
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{activeCustomers}</div>
              <div className="postcraft-metric-label">Beta Users</div>
              <div className="postcraft-text text-sm mt-2">Real users from ConvertKit</div>
            </div>

            {/* Contacts Card */}
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{contactsEnriched.toLocaleString()}</div>
              <div className="postcraft-metric-label">Contacts Enriched</div>
              <div className="postcraft-text text-sm mt-2">Growing daily with usage</div>
            </div>

            {/* Success Rate Card */}
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{successRate.toFixed(1)}%</div>
              <div className="postcraft-metric-label">Success Rate</div>
              <div className="postcraft-text text-sm mt-2">Excellent performance</div>
            </div>
          </div>
        </div>

        {/* Growth Performance */}
        <div className="postcraft-section mb-8">
          <h2 className="postcraft-section-title mb-6">Growth Performance</h2>

          <div className="postcraft-metrics-grid">
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">+{metrics.revenue.growth.toFixed(1)}%</div>
              <div className="postcraft-metric-label">Revenue Growth</div>
              <div className="postcraft-text text-sm mt-2">Month over month</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{emailsValidated.toLocaleString()}</div>
              <div className="postcraft-metric-label">Emails Validated</div>
              <div className="postcraft-text text-sm mt-2">Total processed</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-purple-500 to-pink-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">{activeAgents}</div>
              <div className="postcraft-metric-label">Active AI Agents</div>
              <div className="postcraft-text text-sm mt-2">Orchestrating workflows</div>
            </div>
          </div>
        </div>

        {/* Business Status */}
        <div className="postcraft-section">
          <h2 className="postcraft-section-title mb-6">Current Business Status</h2>

          <div className="postcraft-card bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-black mb-2">{tasksCompleted}</div>
                <div className="text-white font-bold">Tasks Completed</div>
                <div className="text-white/90 text-sm mt-1">System automation</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">{metrics.customers.newSignups}</div>
                <div className="text-white font-bold">New Signups</div>
                <div className="text-white/90 text-sm mt-1">This month</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">Beta</div>
                <div className="text-white font-bold">Current Phase</div>
                <div className="text-white/90 text-sm mt-1">Pre-launch testing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PostcraftLayout>
  );
}
