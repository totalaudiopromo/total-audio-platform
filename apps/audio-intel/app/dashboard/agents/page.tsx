/**
 * Agent Performance Dashboard
 * Simple metrics view for monitoring agent health and performance
 */

'use client';

import { useEffect, useState } from 'react';

interface AgentStats {
  name: string;
  version: string;
  runs: number;
  success: number;
  failures: number;
  successRate: number;
  avgLatency: number;
  lastRun?: string;
}

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch agent list and stats
        const [agentsRes, healthRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/agents/health'),
        ]);

        const agentsData = await agentsRes.json();
        const healthData = await healthRes.json();

        setAgents(agentsData.agents || []);
        setHealth(healthData);
      } catch (error) {
        console.error('Failed to load agent data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Agent Performance Dashboard</h1>
        <p className="text-gray-600">Loading agent metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Agent Performance Dashboard</h1>
        <p className="text-gray-600">Monitor agent health, performance, and usage metrics</p>
      </div>

      {/* Health Status */}
      <div className="mb-8">
        <div
          className={`p-4 rounded-lg ${
            health?.healthy
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${health?.healthy ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="font-semibold">
              System {health?.healthy ? 'Healthy' : 'Issues Detected'}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

      {/* Query Examples */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Supabase Performance Queries</h2>
        <div className="space-y-4">
          <QueryExample
            title="Recent Performance"
            query={`SELECT agent_name,
       count(*) as runs,
       avg(latency_ms) as avg_latency,
       sum(case when success then 1 else 0 end)::float / count(*) * 100 as success_rate
FROM agent_logs
WHERE created_at > now() - interval '7 days'
GROUP BY agent_name;`}
          />
          <QueryExample
            title="Failed Executions"
            query={`SELECT *
FROM agent_logs
WHERE success = false
ORDER BY created_at DESC
LIMIT 20;`}
          />
          <QueryExample
            title="Slow Operations"
            query={`SELECT agent_name, latency_ms, created_at
FROM agent_logs
WHERE latency_ms > 5000
ORDER BY latency_ms DESC
LIMIT 50;`}
          />
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  const stats = agent.stats as AgentStats;
  const manifest = agent.manifest;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{manifest?.name || agent.name}</h3>
          <p className="text-sm text-gray-500">v{manifest?.version || '1.0.0'}</p>
        </div>
        <div
          className={`px-2 py-1 text-xs rounded-full ${
            stats?.successRate >= 90
              ? 'bg-green-100 text-green-800'
              : stats?.successRate >= 70
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {stats?.successRate || 0}% success
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{manifest?.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricBox label="Runs" value={stats?.runs || 0} />
        <MetricBox label="Success" value={stats?.success || 0} />
        <MetricBox label="Failures" value={stats?.failures || 0} />
        <MetricBox label="Avg Latency" value={`${stats?.avgLatency || 0}ms`} />
      </div>

      {stats?.lastRun && (
        <p className="text-xs text-gray-500">
          Last run: {new Date(stats.lastRun).toLocaleString()}
        </p>
      )}

      {manifest?.capabilities && (
        <div className="mt-4 flex flex-wrap gap-2">
          {manifest.capabilities.slice(0, 3).map((cap: string) => (
            <span key={cap} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {cap}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function QueryExample({ title, query }: { title: string; query: string }) {
  const [copied, setCopied] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <button
          onClick={copyQuery}
          className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">{query}</pre>
    </div>
  );
}
