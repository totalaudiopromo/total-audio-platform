'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Activity, Target, AlertTriangle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/20">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Loading Business Data...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-yellow-100 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Business Data</h2>
              <p className="text-gray-600">Real business metrics are currently unavailable.</p>
            </div>
          </div>
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
      <div className="space-y-8">
        {/* Beautiful Header */}
        <div className="postcraft-section">
          <div className="postcraft-section-header text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Business Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Complete business metrics and performance analytics
            </p>
            <div className="flex items-center justify-center space-x-3 px-4 py-2 bg-green-50/80 backdrop-blur-sm rounded-full border border-green-200/50 max-w-fit mx-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Real-time data</span>
            </div>
          </div>

          {/* Beautiful KPI Cards */}
          <div className="postcraft-section">
            <div className="postcraft-section-header text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Performance Metrics</h2>
              <p className="text-gray-600">Live business performance from Audio Intel platform</p>
            </div>
            
            <div className="postcraft-metrics-grid">
              {/* Revenue Card */}
              <div className="postcraft-metric-card postcraft-metric-revenue">
                <div className="postcraft-metric-header">
                  <div className="postcraft-metric-icon">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="postcraft-metric-content">
                  <div className="postcraft-metric-value">
                    £{totalRevenue.toLocaleString()}
                  </div>
                  <div className="postcraft-metric-label">Monthly Revenue</div>
                  <div className="postcraft-metric-description">
                    {totalRevenue === 0 ? 'Beta Phase - Pre-launch' : 'Growing steadily'}
                  </div>
                </div>
              </div>

              {/* Customers Card */}
              <div className="postcraft-metric-card postcraft-metric-customers">
                <div className="postcraft-metric-header">
                  <div className="postcraft-metric-icon">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="postcraft-metric-content">
                  <div className="postcraft-metric-value">
                    {activeCustomers}
                  </div>
                  <div className="postcraft-metric-label">Beta Users</div>
                  <div className="postcraft-metric-description">
                    Real users from ConvertKit
                  </div>
                </div>
              </div>

              {/* Contacts Card */}
              <div className="postcraft-metric-card postcraft-metric-contacts">
                <div className="postcraft-metric-header">
                  <div className="postcraft-metric-icon">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <div className="postcraft-metric-content">
                  <div className="postcraft-metric-value">
                    {contactsEnriched.toLocaleString()}
                  </div>
                  <div className="postcraft-metric-label">Contacts Enriched</div>
                  <div className="postcraft-metric-description">
                    Growing daily with usage
                  </div>
                </div>
              </div>

              {/* Success Rate Card */}
              <div className="postcraft-metric-card postcraft-metric-agents">
                <div className="postcraft-metric-header">
                  <div className="postcraft-metric-icon">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <div className="postcraft-metric-content">
                  <div className="postcraft-metric-value">
                    {successRate.toFixed(1)}%
                  </div>
                  <div className="postcraft-metric-label">Success Rate</div>
                  <div className="postcraft-metric-description">
                    Excellent performance
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Growth Performance */}
        <div className="postcraft-section">
          <div className="postcraft-section-header text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Growth Performance</h2>
            <p className="text-gray-600">Key growth indicators and operational metrics</p>
          </div>
            
          <div className="postcraft-metrics-grid">
            <div className="postcraft-metric-card postcraft-metric-revenue">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  +{metrics.revenue.growth.toFixed(1)}%
                </div>
                <div className="postcraft-metric-label">Revenue Growth</div>
                <div className="postcraft-metric-description">Month over month</div>
              </div>
            </div>

            <div className="postcraft-metric-card postcraft-metric-customers">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  {emailsValidated.toLocaleString()}
                </div>
                <div className="postcraft-metric-label">Emails Validated</div>
                <div className="postcraft-metric-description">Total processed</div>
              </div>
            </div>

            <div className="postcraft-metric-card postcraft-metric-contacts">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  {activeAgents}
                </div>
                <div className="postcraft-metric-label">Active AI Agents</div>
                <div className="postcraft-metric-description">Orchestrating workflows</div>
              </div>
            </div>
          </div>
          </div>

        {/* Business Status */}
        <div className="postcraft-section">
          <div className="postcraft-section-header text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Business Status</h2>
            <p className="text-gray-600">Total Audio Promo is currently in <strong>beta phase</strong> with real customers testing Audio Intel</p>
          </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-2">{tasksCompleted}</div>
                    <div className="text-indigo-100 font-medium">Tasks Completed</div>
                    <div className="text-indigo-200 text-sm mt-1">System automation</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">{metrics.customers.newSignups}</div>
                    <div className="text-indigo-100 font-medium">New Signups</div>
                    <div className="text-indigo-200 text-sm mt-1">This month</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">Beta</div>
                    <div className="text-indigo-100 font-medium">Current Phase</div>
                    <div className="text-indigo-200 text-sm mt-1">Pre-launch testing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PostcraftLayout>
  );
}