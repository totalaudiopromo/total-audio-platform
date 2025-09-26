'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, Zap, Mail } from 'lucide-react';

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

export default function CleanDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/business-metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="clean-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Command Centre</h1>
            <p>Audio Intel Business Intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
            <span className="text-sm text-gray-500">
              Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago
            </span>
            <button 
              onClick={fetchMetrics}
              className="clean-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="clean-grid mb-8">
          <div className="clean-card">
            <div className="clean-metric">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
              <div className="clean-metric-value text-green-600">
                £{metrics.revenue.mrr.toLocaleString()}
              </div>
              <div className="clean-metric-label">
                Monthly Recurring Revenue
              </div>
              <div className="clean-metric-description">
                +{metrics.revenue.growth.toFixed(1)}% vs last month
              </div>
            </div>
          </div>

          <div className="clean-card">
            <div className="clean-metric">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <div className="clean-metric-value text-blue-600">
                {metrics.customers.total}
              </div>
              <div className="clean-metric-label">
                Total Customers
              </div>
              <div className="clean-metric-description">
                +{metrics.customers.newSignups} this month
              </div>
            </div>
          </div>

          <div className="clean-card">
            <div className="clean-metric">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-purple-600" />
              </div>
              <div className="clean-metric-value text-purple-600">
                {metrics.product.contactsEnriched.toLocaleString()}
              </div>
              <div className="clean-metric-label">
                Contacts Enriched
              </div>
              <div className="clean-metric-description">
                {metrics.product.successRate.toFixed(1)}% success rate
              </div>
            </div>
          </div>

          <div className="clean-card">
            <div className="clean-metric">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-orange-600" />
              </div>
              <div className="clean-metric-value text-orange-600">
                {metrics.agents.activeAgents}
              </div>
              <div className="clean-metric-label">
                Active AI Agents
              </div>
              <div className="clean-metric-description">
                {metrics.agents.tasksCompleted} tasks completed today
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="clean-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="clean-status clean-status-active mb-2">Operational</div>
              <p className="text-sm text-gray-600">Contact Enrichment</p>
            </div>
            <div className="text-center">
              <div className="clean-status clean-status-active mb-2">Operational</div>
              <p className="text-sm text-gray-600">AI Processing</p>
            </div>
            <div className="text-center">
              <div className="clean-status clean-status-active mb-2">Operational</div>
              <p className="text-sm text-gray-600">Data Pipeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}