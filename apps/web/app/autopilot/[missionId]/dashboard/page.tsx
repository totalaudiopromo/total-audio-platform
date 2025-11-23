/**
 * Mission Dashboard - Phase 2 Enhanced View
 *
 * 6 panels: Telemetry, Momentum, Agents, Confidence, Negotiation, Autonomy Settings
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface DashboardData {
  telemetry: {
    avgLatency: number;
    avgConfidence: number;
    successRate: number;
    totalEvents: number;
  };
  momentum: {
    micro: { velocity: number; trend: string };
    mid: { progress: number; trend: string };
    macro: { completion: number; trend: string };
  };
  agents: Array<{
    role: string;
    tasksCompleted: number;
    avgConfidence: number;
    status: string;
  }>;
  confidence: {
    currentScore: number;
    breakdown: Record<string, number>;
    alerts: string[];
  };
  negotiation: {
    activeConflicts: number;
    resolvedToday: number;
    consensusRate: number;
  };
  autonomy: {
    mode: string;
    riskTolerance: number;
    autoApprovalRate: number;
  };
}

export default function MissionDashboardPage() {
  const params = useParams();
  const missionId = params.id as string;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(`/api/autopilot/missions/${missionId}/dashboard`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [missionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-white">Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Mission Dashboard</h1>

        {/* Grid layout for 6 panels */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Panel 1: Telemetry */}
          <TelemetryPanel data={data.telemetry} />

          {/* Panel 2: Momentum */}
          <MomentumPanel data={data.momentum} />

          {/* Panel 3: Agents */}
          <AgentsPanel data={data.agents} />

          {/* Panel 4: Confidence */}
          <ConfidencePanel data={data.confidence} />

          {/* Panel 5: Negotiation */}
          <NegotiationPanel data={data.negotiation} />

          {/* Panel 6: Autonomy Settings */}
          <AutonomyPanel data={data.autonomy} missionId={missionId} />
        </div>
      </div>
    </div>
  );
}

function TelemetryPanel({ data }: { data: DashboardData['telemetry'] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Telemetry</h2>
      <div className="space-y-3">
        <Metric label="Avg Latency" value={`${data.avgLatency.toFixed(0)}ms`} />
        <Metric label="Avg Confidence" value={`${(data.avgConfidence * 100).toFixed(0)}%`} />
        <Metric label="Success Rate" value={`${(data.successRate * 100).toFixed(0)}%`} />
        <Metric label="Total Events" value={data.totalEvents.toString()} />
      </div>
    </div>
  );
}

function MomentumPanel({ data }: { data: DashboardData['momentum'] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Momentum</h2>
      <div className="space-y-3">
        <MomentumLevel
          level="Micro"
          velocity={data.micro.velocity}
          trend={data.micro.trend}
        />
        <MomentumLevel
          level="Mid"
          velocity={data.mid.progress}
          trend={data.mid.trend}
        />
        <MomentumLevel
          level="Macro"
          velocity={data.macro.completion}
          trend={data.macro.trend}
        />
      </div>
    </div>
  );
}

function AgentsPanel({ data }: { data: DashboardData['agents'] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Agents</h2>
      <div className="space-y-2">
        {data.map((agent) => (
          <div
            key={agent.role}
            className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3"
          >
            <div>
              <div className="font-medium capitalize text-white">{agent.role}</div>
              <div className="text-sm text-slate-400">{agent.tasksCompleted} tasks</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[#3AA9BE]">
                {(agent.avgConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-slate-400">{agent.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidencePanel({ data }: { data: DashboardData['confidence'] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Confidence</h2>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-slate-400">Overall Score</span>
          <span className="text-2xl font-bold text-white">
            {(data.currentScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-[#3AA9BE]"
            style={{ width: `${data.currentScore * 100}%` }}
          />
        </div>
      </div>
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, idx) => (
            <div key={idx} className="rounded-lg bg-amber-900/20 p-2 text-sm text-amber-400">
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NegotiationPanel({ data }: { data: DashboardData['negotiation'] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Negotiation</h2>
      <div className="space-y-3">
        <Metric label="Active Conflicts" value={data.activeConflicts.toString()} />
        <Metric label="Resolved Today" value={data.resolvedToday.toString()} />
        <Metric label="Consensus Rate" value={`${(data.consensusRate * 100).toFixed(0)}%`} />
      </div>
    </div>
  );
}

function AutonomyPanel({
  data,
  missionId,
}: {
  data: DashboardData['autonomy'];
  missionId: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#3AA9BE]">Autonomy Settings</h2>
      <div className="space-y-3">
        <Metric label="Mode" value={data.mode.replace('_', '-')} />
        <Metric label="Risk Tolerance" value={`${(data.riskTolerance * 100).toFixed(0)}%`} />
        <Metric
          label="Auto-Approval Rate"
          value={`${(data.autoApprovalRate * 100).toFixed(0)}%`}
        />
        <button
          className="mt-4 w-full rounded-lg bg-[#3AA9BE] px-4 py-2 text-sm font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90"
          onClick={() => (window.location.href = `/autopilot/${missionId}/settings`)}
        >
          Adjust Settings
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function MomentumLevel({
  level,
  velocity,
  trend,
}: {
  level: string;
  velocity: number;
  trend: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-white">{level}</div>
        <div className="text-xs text-slate-400">{trend}</div>
      </div>
      <div className="text-lg font-bold text-[#3AA9BE]">{velocity.toFixed(1)}</div>
    </div>
  );
}
