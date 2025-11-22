'use client';

import React, { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'in_progress' | 'completed' | 'requires_approval' | 'approved' | 'failed';
  progress: number;
  message: string;
  timestamp: string;
  data?: any;
  requiresManualApproval: boolean;
}

interface RadioCampaign {
  id: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  budget: number;
  releaseDate: string;
  priority: 'high' | 'medium' | 'low';
  status:
    | 'transcript_processing'
    | 'campaign_creation'
    | 'press_release'
    | 'radio_outreach'
    | 'tracking'
    | 'completed';
  steps: WorkflowStep[];
  createdAt: string;
}

interface AgentStatus {
  name: string;
  status: 'online' | 'processing' | 'error' | 'offline';
  currentTask: string;
  lastHeartbeat: string;
  errorCount: number;
}

export default function RadioPromoVerificationDashboard() {
  const [campaigns, setCampaigns] = useState<RadioCampaign[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [approvalQueue, setApprovalQueue] = useState<WorkflowStep[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Fetch status data from API
  const fetchStatusData = async () => {
    try {
      const response = await fetch('/api/radio-promo/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCampaigns(data.campaigns || []);
      setAgentStatuses(data.agentStatuses || []);
      setApprovalQueue(data.approvalQueue || []);
      setIsConnected(data.isConnected || false);
      setLastUpdate(data.lastUpdate || new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch status data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and polling setup
  useEffect(() => {
    fetchStatusData();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchStatusData, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'requires_approval':
        return 'text-amber-600 bg-amber-100';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'pending':
      case 'offline':
        return 'text-gray-600 bg-gray-100';
      case 'online':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'requires_approval':
        return '⚠️';
      case 'failed':
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      case 'online':
        return '🟢';
      case 'offline':
        return '🔴';
      default:
        return '❓';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleApproval = async (stepId: string, approved: boolean) => {
    try {
      // Find the campaign containing this step
      const campaign = campaigns.find(c => c.steps.some(s => s.id === stepId));

      if (!campaign) {
        console.error('Campaign not found for step:', stepId);
        return;
      }

      const response = await fetch('/api/radio-promo/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve_step',
          stepId,
          approved,
          campaignId: campaign.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state immediately for better UX
        setCampaigns(prev =>
          prev.map(c => ({
            ...c,
            steps: c.steps.map(step =>
              step.id === stepId
                ? {
                    ...step,
                    status: approved ? 'approved' : 'failed',
                    progress: approved ? 100 : 0,
                    message: approved
                      ? `Approved by user at ${new Date().toISOString()}`
                      : `Rejected by user at ${new Date().toISOString()}`,
                  }
                : step
            ),
          }))
        );

        setApprovalQueue(prev => prev.filter(step => step.id !== stepId));

        // Refresh data from server to ensure consistency
        setTimeout(fetchStatusData, 1000);
      } else {
        throw new Error(result.message || 'Approval failed');
      }
    } catch (err) {
      console.error('Failed to process approval:', err);
      setError(err instanceof Error ? err.message : 'Failed to process approval');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(budget);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Radio Promo Status...
            </h2>
            <p className="text-gray-600">Connecting to orchestrator system</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Radio Promo Verification Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor and approve Liberty Music PR campaign workflows
          </p>
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {formatTimestamp(lastUpdate)}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchStatusData}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">❌</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <div className="text-sm text-red-700 mt-1">{error}</div>
            </div>
            <button
              onClick={fetchStatusData}
              className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Approval Queue */}
      {approvalQueue.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-amber-800 mb-3">
            Pending Approvals ({approvalQueue.length})
          </h2>
          <div className="space-y-3">
            {approvalQueue.map(step => (
              <div key={step.id} className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{step.name}</div>
                    <div className="text-sm text-gray-600">
                      {step.agent} • {step.message}
                    </div>
                    {step.data && (
                      <div className="text-xs text-gray-500 mt-1">
                        {JSON.stringify(step.data, null, 2)}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval(step.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(step.id, false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {agentStatuses.map(agent => (
          <div
            key={agent.name}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-900 truncate">{agent.name}</div>
              <div className="text-lg">{getStatusIcon(agent.status)}</div>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium mb-2 ${getStatusColor(
                agent.status
              )}`}
            >
              {agent.status.toUpperCase()}
            </div>
            <div className="text-xs text-gray-600">{agent.currentTask}</div>
            <div className="text-xs text-gray-500 mt-1">
              Last seen: {formatTimestamp(agent.lastHeartbeat)}
            </div>
            {agent.errorCount > 0 && (
              <div className="text-xs text-red-600 mt-1">
                {agent.errorCount} error{agent.errorCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Campaign Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {campaign.artistName} - {campaign.trackTitle}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        campaign.priority
                      )}`}
                    >
                      {campaign.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Genre: {campaign.genre}</span>
                    <span>Budget: {formatBudget(campaign.budget)}</span>
                    <span>
                      Release: {new Date(campaign.releaseDate).toLocaleDateString('en-GB')}
                    </span>
                    <span>Created: {formatTimestamp(campaign.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)
                  }
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {selectedCampaign === campaign.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(
                    campaign.steps.reduce((acc, step) => acc + step.progress, 0) /
                      campaign.steps.length
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      campaign.steps.reduce((acc, step) => acc + step.progress, 0) /
                      campaign.steps.length
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Workflow Steps */}
            {selectedCampaign === campaign.id && (
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps</h4>
                <div className="space-y-4">
                  {campaign.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{step.name}</div>
                            <div className="text-sm text-gray-600">{step.agent}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                step.status
                              )}`}
                            >
                              {getStatusIcon(step.status)}{' '}
                              {step.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <div className="text-sm font-medium text-gray-700 w-16 text-right">
                              {step.progress}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                step.status === 'completed' || step.status === 'approved'
                                  ? 'bg-green-500'
                                  : step.status === 'in_progress'
                                    ? 'bg-blue-500'
                                    : step.status === 'requires_approval'
                                      ? 'bg-amber-500'
                                      : step.status === 'failed'
                                        ? 'bg-red-500'
                                        : 'bg-gray-400'
                              }`}
                              style={{ width: `${step.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">{step.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last updated: {formatTimestamp(step.timestamp)}
                        </div>
                        {step.data && step.requiresManualApproval && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs font-medium text-gray-700 mb-1">Step Data:</div>
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                              {JSON.stringify(step.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {agentStatuses.filter(a => a.status === 'online').length}
          </div>
          <div className="text-sm text-gray-600">Agents Online</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{approvalQueue.length}</div>
          <div className="text-sm text-gray-600">Pending Approvals</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {campaigns.reduce(
              (acc, c) =>
                acc +
                c.steps.filter(s => s.status === 'completed' || s.status === 'approved').length,
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Completed Steps</div>
        </div>
      </div>
    </div>
  );
}
