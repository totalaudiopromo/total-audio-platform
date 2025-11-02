'use client';

import { useEffect, useState } from 'react';
import { Bot, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface AgentStats {
  agent_id: string;
  app: string;
  total_events: number;
  successful_events: number;
  failed_events: number;
  avg_latency_ms: number;
  success_rate: number;
  last_run: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced with Phase 9B database queries
    const mockAgents: AgentStats[] = [
      {
        agent_id: 'IntelAgent',
        app: 'audio-intel',
        total_events: 1247,
        successful_events: 1247,
        failed_events: 0,
        avg_latency_ms: 1823,
        success_rate: 100,
        last_run: '2 minutes ago',
      },
      {
        agent_id: 'PitchAgent',
        app: 'pitch-generator',
        total_events: 892,
        successful_events: 889,
        failed_events: 3,
        avg_latency_ms: 2145,
        success_rate: 99.7,
        last_run: '5 minutes ago',
      },
      {
        agent_id: 'TrackerAgent',
        app: 'tracker',
        total_events: 543,
        successful_events: 541,
        failed_events: 2,
        avg_latency_ms: 1456,
        success_rate: 99.6,
        last_run: '8 minutes ago',
      },
      {
        agent_id: 'InsightAgent',
        app: 'audio-intel',
        total_events: 234,
        successful_events: 231,
        failed_events: 3,
        avg_latency_ms: 3421,
        success_rate: 98.7,
        last_run: '12 minutes ago',
      },
      {
        agent_id: 'VoiceGuardAgent',
        app: 'pitch-generator',
        total_events: 156,
        successful_events: 156,
        failed_events: 0,
        avg_latency_ms: 987,
        success_rate: 100,
        last_run: '15 minutes ago',
      },
      {
        agent_id: 'SocialMediaSchedulerAgent',
        app: 'command-centre',
        total_events: 89,
        successful_events: 85,
        failed_events: 4,
        avg_latency_ms: 1234,
        success_rate: 95.5,
        last_run: '18 minutes ago',
      },
    ];

    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">Loading agent metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Agent Monitoring</h2>
        </div>
        <p className="text-sm text-gray-600">
          Real-time performance metrics from Phase 9B observability layer
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Total Agents</div>
          <div className="text-3xl font-black text-gray-900">{agents.length}</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Total Executions</div>
          <div className="text-3xl font-black text-gray-900">
            {agents.reduce((sum, a) => sum + a.total_events, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Avg Success Rate</div>
          <div className="text-3xl font-black text-green-600">
            {(
              agents.reduce((sum, a) => sum + a.success_rate, 0) / agents.length
            ).toFixed(1)}
            %
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Avg Latency</div>
          <div className="text-3xl font-black text-blue-600">
            {Math.round(
              agents.reduce((sum, a) => sum + a.avg_latency_ms, 0) / agents.length
            ).toLocaleString()}
            <span className="text-base">ms</span>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map(agent => (
          <div
            key={agent.agent_id}
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg border-2 border-black">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{agent.agent_id}</h3>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {agent.app}
                  </span>
                </div>
              </div>
              {agent.success_rate >= 99 ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : agent.success_rate >= 95 ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Success Rate</div>
                <div className="text-2xl font-black text-gray-900">{agent.success_rate}%</div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Avg Latency</div>
                <div className="text-2xl font-black text-gray-900">
                  {agent.avg_latency_ms.toLocaleString()}ms
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-gray-200">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Total</div>
                <div className="text-lg font-bold text-gray-900">
                  {agent.total_events.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Success</div>
                <div className="text-lg font-bold text-green-600">
                  {agent.successful_events.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Failed</div>
                <div className="text-lg font-bold text-red-600">
                  {agent.failed_events.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last run: {agent.last_run}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Database Connection Notice */}
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Phase 9B Integration Active</h4>
            <p className="text-sm text-blue-800">
              Agent metrics are logged to <code className="font-mono">agent_events</code> table in
              Supabase. Real-time data will replace mock data once API endpoints are wired.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
