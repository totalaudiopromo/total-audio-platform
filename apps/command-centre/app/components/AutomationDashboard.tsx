'use client';

import React, { useState, useEffect } from 'react';
import '../intel-design.css';

interface AgentStatus {
  agentName: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  lastUpdate: string;
  progress?: number;
  metrics?: Record<string, any>;
  errors?: Array<{ message: string; timestamp: string }>;
  age?: number;
}

interface CostData {
  today: { total: number; [key: string]: number };
  month: {
    total: number;
    budget: number;
    remaining: number;
    percentUsed: number;
    projectedTotal: number;
  };
  services: Record<string, { requests?: number; contacts?: number; cost: number }>;
}

interface StatusResponse {
  success: boolean;
  health: 'healthy' | 'warning' | 'critical';
  agents: AgentStatus[];
  costs: CostData;
  metrics: {
    agentCount: number;
    statusCounts: {
      running: number;
      completed: number;
      failed: number;
      pending: number;
      stale: number;
    };
    timeSavedToday: number;
    contactsEnrichedToday: number;
    emailsProcessedToday: number;
    health: string;
  };
  timestamp: string;
  warning?: string;
}

export default function AutomationDashboard() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/agents/status');
      if (!response.ok) throw new Error('Failed to fetch agent status');
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="intel-card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6ab00]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="intel-card">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Agent Status</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchStatus}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 border-green-500 text-green-800';
      case 'warning': return 'bg-amber-100 border-amber-500 text-amber-800';
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) return `${diffHours}h ${diffMins}m ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const formatAgentName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="intel-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Automation Dashboard</h2>
            <p className="text-gray-600 text-sm mt-1">
              Real-time agent status and cost tracking
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getHealthColor(data.health)}`}>
            <div className="text-sm font-semibold">
              {data.health.toUpperCase()}
            </div>
          </div>
        </div>

        {data.warning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-amber-800 text-sm">⚠️ {data.warning}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Last updated: {formatTimestamp(data.timestamp)}
          <button
            onClick={fetchStatus}
            className="ml-2 text-[#f6ab00] hover:text-[#e09a00] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="intel-metrics">
        <div className="intel-metric bg-blue-100 border-blue-500">
          <div className="intel-metric-value">{data.metrics.agentCount}</div>
          <div className="intel-metric-label">Total Agents</div>
        </div>
        <div className="intel-metric bg-green-100 border-green-500">
          <div className="intel-metric-value">{data.metrics.statusCounts.completed}</div>
          <div className="intel-metric-label">Completed Today</div>
        </div>
        <div className="intel-metric bg-amber-100 border-amber-500">
          <div className="intel-metric-value">{data.metrics.timeSavedToday}h</div>
          <div className="intel-metric-label">Time Saved</div>
        </div>
        <div className="intel-metric bg-purple-100 border-purple-500">
          <div className="intel-metric-value">£{data.costs.today.total.toFixed(2)}</div>
          <div className="intel-metric-label">Cost Today</div>
        </div>
      </div>

      {/* Cost Overview */}
      <div className="intel-card">
        <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>£{data.costs.month.total.toFixed(2)} / £{data.costs.month.budget}</span>
            <span className={data.costs.month.percentUsed > 90 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {data.costs.month.percentUsed.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                data.costs.month.percentUsed > 90 ? 'bg-red-500' :
                data.costs.month.percentUsed > 75 ? 'bg-amber-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(data.costs.month.percentUsed, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Remaining</div>
            <div className="text-lg font-semibold">£{data.costs.month.remaining.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Projected</div>
            <div className="text-lg font-semibold">£{data.costs.month.projectedTotal.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50 rounded p-3 col-span-2 md:col-span-1">
            <div className="text-xs text-gray-600">Contacts Enriched</div>
            <div className="text-lg font-semibold">{data.metrics.contactsEnrichedToday}</div>
          </div>
        </div>
      </div>

      {/* Service Costs Breakdown */}
      <div className="intel-card">
        <h3 className="text-lg font-semibold mb-4">Service Costs (This Month)</h3>
        <div className="space-y-2">
          {Object.entries(data.costs.services).map(([service, serviceData]) => (
            serviceData.cost > 0 && (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium capitalize">{service}</div>
                  {serviceData.contacts !== undefined && (
                    <div className="text-xs text-gray-600">{serviceData.contacts} contacts</div>
                  )}
                  {serviceData.requests !== undefined && (
                    <div className="text-xs text-gray-600">{serviceData.requests} requests</div>
                  )}
                </div>
                <div className="text-lg font-semibold">£{serviceData.cost.toFixed(2)}</div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="intel-card">
        <h3 className="text-lg font-semibold mb-4">Agent Status</h3>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
            <div className="text-2xl font-bold text-green-700">{data.metrics.statusCounts.completed}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
            <div className="text-2xl font-bold text-blue-700">{data.metrics.statusCounts.running}</div>
            <div className="text-xs text-blue-600">Running</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
            <div className="text-2xl font-bold text-red-700">{data.metrics.statusCounts.failed}</div>
            <div className="text-xs text-red-600">Failed</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
            <div className="text-2xl font-bold text-amber-700">{data.metrics.statusCounts.stale}</div>
            <div className="text-xs text-amber-600">Stale</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
            <div className="text-2xl font-bold text-gray-700">{data.metrics.statusCounts.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>

        {/* Individual Agents */}
        <div className="space-y-3">
          {data.agents.map((agent) => (
            <div
              key={agent.agentName}
              className={`p-4 rounded-lg border-2 ${getStatusColor(agent.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(agent.status)}</span>
                  <div>
                    <h4 className="font-semibold">{formatAgentName(agent.agentName)}</h4>
                    <p className="text-xs opacity-75">
                      {formatTimestamp(agent.lastUpdate)}
                      {agent.age !== undefined && ` (${agent.age.toFixed(1)}h old)`}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </div>
              </div>

              {agent.progress !== undefined && agent.progress < 100 && (
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-right mt-1">{agent.progress}%</div>
                </div>
              )}

              {agent.metrics && Object.keys(agent.metrics).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  {Object.entries(agent.metrics).map(([key, value]) => (
                    <div key={key} className="bg-white bg-opacity-50 rounded p-2">
                      <div className="text-xs opacity-75 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="font-semibold">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {agent.errors && agent.errors.length > 0 && (
                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded">
                  <div className="text-xs font-semibold mb-1">Recent Errors:</div>
                  {agent.errors.slice(-3).map((error, idx) => (
                    <div key={idx} className="text-xs opacity-75 mb-1">
                      • {error.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Savings Breakdown */}
      <div className="intel-card">
        <h3 className="text-lg font-semibold mb-4">Time Savings Today</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <div>
              <div className="font-medium">Contact Enrichment</div>
              <div className="text-xs text-gray-600">
                {data.metrics.contactsEnrichedToday} contacts @ 5 min each
              </div>
            </div>
            <div className="text-lg font-semibold">
              {((data.metrics.contactsEnrichedToday * 5) / 60).toFixed(1)}h
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div>
              <div className="font-medium">Gmail Autopilot</div>
              <div className="text-xs text-gray-600">
                {data.metrics.emailsProcessedToday} emails @ 2 min each
              </div>
            </div>
            <div className="text-lg font-semibold">
              {((data.metrics.emailsProcessedToday * 2) / 60).toFixed(1)}h
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded border-2 border-purple-300">
            <div>
              <div className="font-medium">Total Time Saved</div>
              <div className="text-xs text-gray-600">Across all automation agents</div>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {data.metrics.timeSavedToday.toFixed(1)}h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
