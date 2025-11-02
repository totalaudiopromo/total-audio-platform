'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  agents: {
    total: number;
    active: number;
    failed: number;
  };
  social: {
    twitter: boolean;
    linkedin: boolean;
    bluesky: boolean;
    threads: boolean;
  };
  database: boolean;
  telegram: boolean;
}

export default function OverviewPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - will be replaced with real API calls
    const mockHealth: SystemHealth = {
      status: 'healthy',
      agents: {
        total: 6,
        active: 6,
        failed: 0,
      },
      social: {
        twitter: true,
        linkedin: true,
        bluesky: false,
        threads: false,
      },
      database: true,
      telegram: false, // Will be implemented
    };

    setTimeout(() => {
      setHealth(mockHealth);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">Loading system status...</div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">System Overview</h2>
        </div>
        <p className="text-sm text-gray-600">
          Real-time monitoring of Total Audio Platform operations
        </p>
      </div>

      {/* System Health Status */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">System Health</h3>
            <p className="text-sm text-gray-600">Overall platform status</p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black ${
              health.status === 'healthy'
                ? 'bg-green-100 text-green-800'
                : health.status === 'degraded'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {health.status === 'healthy' && <CheckCircle className="h-5 w-5" />}
            {health.status === 'degraded' && <AlertCircle className="h-5 w-5" />}
            {health.status === 'down' && <XCircle className="h-5 w-5" />}
            <span className="font-bold uppercase">{health.status}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Agents Status */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase">Agents</span>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {health.agents.active}/{health.agents.total}
          </div>
          <div className="text-sm text-gray-600 mt-1">Active agents</div>
        </div>

        {/* Social Integrations */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase">Social</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {Object.values(health.social).filter(Boolean).length}/4
          </div>
          <div className="text-sm text-gray-600 mt-1">Connected platforms</div>
        </div>

        {/* Database */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase">Database</span>
            {health.database ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl font-black text-gray-900">
            {health.database ? 'Connected' : 'Disconnected'}
          </div>
          <div className="text-sm text-gray-600 mt-1">Supabase status</div>
        </div>

        {/* Telegram */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase">Telegram</span>
            {health.telegram ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          <div className="text-2xl font-black text-gray-900">
            {health.telegram ? 'Active' : 'Pending'}
          </div>
          <div className="text-sm text-gray-600 mt-1">Notifications</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', event: 'IntelAgent completed enrichment', status: 'success' },
            { time: '5 minutes ago', event: 'Social post scheduled (LinkedIn)', status: 'success' },
            { time: '12 minutes ago', event: 'PitchAgent generated 3 new pitches', status: 'success' },
            {
              time: '18 minutes ago',
              event: 'BlueSky connector status check',
              status: 'warning',
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200"
            >
              <div className="flex items-center gap-3">
                {activity.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                )}
                {activity.status === 'warning' && (
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-900">{activity.event}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
