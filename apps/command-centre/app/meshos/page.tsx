/**
 * MeshOS Dashboard
 * Today's Intelligence Summary with Flow State design
 */

'use client';

import { useState, useEffect } from 'react';
import { MeshSection } from '../../components/meshos/MeshSection';
import { MeshCyanButton } from '../../components/meshos/MeshCyanButton';
import { TimeAgo } from '../../components/meshos/TimeAgo';
import { SummarySection } from './components/SummarySection';
import { InsightList } from './components/InsightList';
import { OpportunityCard } from './components/OpportunityCard';
import { RiskCard } from './components/RiskCard';
import { SystemStatusRow } from './components/SystemStatusRow';

interface DailySummary {
  date: string;
  generatedAt: string;
  opportunities: Array<{
    id: string;
    systems: string[];
    opportunityType: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
    recommendedActions?: string[];
  }>;
  conflicts: Array<{
    id: string;
    systems: string[];
    conflictType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    resolutionSuggestions?: string[];
  }>;
  plans: any;
  drifts: any[];
  metrics: {
    totalOpportunities: number;
    totalConflicts: number;
    totalPlans: number;
    totalDrifts: number;
    criticalIssues: number;
  };
}

const mockSystemStatuses = [
  { system: 'Autopilot', status: 'warning' as const, trend: 0 as const, lastUpdate: new Date().toISOString() },
  { system: 'MAL', status: 'healthy' as const, trend: 1 as const, lastUpdate: new Date().toISOString() },
  { system: 'CoachOS', status: 'warning' as const, trend: -1 as const, lastUpdate: new Date().toISOString() },
  { system: 'CIS', status: 'healthy' as const, trend: 0 as const, lastUpdate: new Date().toISOString() },
  { system: 'MIG', status: 'healthy' as const, trend: 1 as const, lastUpdate: new Date().toISOString() },
  { system: 'Scenes', status: 'healthy' as const, trend: 0 as const, lastUpdate: new Date().toISOString() },
  { system: 'RCF', status: 'healthy' as const, trend: 1 as const, lastUpdate: new Date().toISOString() },
];

export default function MeshOSPage() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningCycle, setRunningCycle] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      const response = await fetch('/api/meshos/summary');
      const data = await response.json();

      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to fetch summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function runReasoningCycle() {
    setRunningCycle(true);
    try {
      const response = await fetch('/api/meshos/reasoning/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'daily' }),
      });

      if (response.ok) {
        // Refresh summary after cycle completes
        await fetchSummary();
      }
    } catch (err) {
      console.error('Failed to run reasoning cycle:', err);
    } finally {
      setRunningCycle(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#0A0D12', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', color: '#F9FAFB', marginBottom: '1rem' }}>
            MeshOS
          </h1>
          <p style={{ color: '#6B7280' }}>Loading intelligence summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#0A0D12', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', color: '#F9FAFB', marginBottom: '1rem' }}>
            MeshOS
          </h1>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#14171C',
              border: '1px solid rgba(217, 106, 106, 0.3)',
              borderRadius: '8px',
              color: '#D96A6A',
            }}
          >
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0A0D12', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h1
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#F9FAFB',
                  margin: 0,
                }}
              >
                MeshOS
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: '#3AA9BE',
                  margin: '0.5rem 0 0',
                }}
              >
                Daily Intelligence Digest
              </p>
            </div>
            <MeshCyanButton onClick={runReasoningCycle} loading={runningCycle} disabled={runningCycle}>
              {runningCycle ? 'Running Cycle...' : 'Run Reasoning Cycle'}
            </MeshCyanButton>
          </div>
          {summary && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.85rem',
                  color: '#6B7280',
                }}
              >
                {summary.date}
              </span>
              <span style={{ color: '#374151' }}>•</span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  color: '#6B7280',
                }}
              >
                Generated <TimeAgo timestamp={summary.generatedAt} />
              </span>
            </div>
          )}
        </header>

        {summary && (
          <>
            {/* Metrics Summary */}
            <div style={{ marginBottom: '2rem' }}>
              <SummarySection metrics={summary.metrics} lastCycle={summary.generatedAt} />
            </div>

            {/* System Status */}
            <MeshSection
              title="System Status"
              subtitle="Real-time health of MeshOS subsystems"
            >
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {mockSystemStatuses.map((status) => (
                  <SystemStatusRow key={status.system} {...status} />
                ))}
              </div>
            </MeshSection>

            {/* Opportunities */}
            <MeshSection
              title="Cross-System Opportunities"
              subtitle={`${summary.opportunities.length} opportunities identified`}
              action={
                <a
                  href="/meshos/plans"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#3AA9BE',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  View Plans →
                </a>
              }
            >
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {summary.opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} {...opp} />
                ))}
              </div>
            </MeshSection>

            {/* Conflicts & Risks */}
            <MeshSection
              title="Detected Conflicts & Risks"
              subtitle={`${summary.conflicts.length} conflicts requiring attention`}
              action={
                <a
                  href="/meshos/contradictions"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#D96A6A',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  View Graph →
                </a>
              }
            >
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {summary.conflicts.map((conflict) => (
                  <RiskCard key={conflict.id} {...conflict} />
                ))}
              </div>
            </MeshSection>

            {/* Key Insights */}
            {summary.metrics.criticalIssues > 0 && (
              <MeshSection
                title="Critical Insights"
                subtitle="Immediate attention required"
              >
                <InsightList
                  insights={[
                    `${summary.metrics.criticalIssues} critical issues detected across ${summary.conflicts.filter((c) => c.severity === 'critical').length} systems`,
                    'Autopilot workload conflicts with CoachOS burnout warnings',
                    'MAL growth phase pressures conflicting with Identity authenticity',
                  ]}
                />
              </MeshSection>
            )}

            {/* Navigation */}
            <div
              style={{
                marginTop: '3rem',
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              <NavCard
                title="Contradiction Graph"
                description="Explore system conflicts and drift patterns"
                href="/meshos/contradictions"
                color="#D96A6A"
              />
              <NavCard
                title="Strategic Plans"
                description="7d / 30d / 90d coordination plans"
                href="/meshos/plans"
                color="#8B5CF6"
              />
              <NavCard
                title="Negotiations"
                description="Inter-system negotiation history"
                href="/meshos/negotiations"
                color="#3AA9BE"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  color: string;
}

function NavCard({ title, description, href, color }: NavCardProps) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '1.5rem',
        backgroundColor: '#14171C',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 220ms ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h3
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.1rem',
          fontWeight: 600,
          color,
          margin: '0 0 0.5rem 0',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          color: '#9CA3AF',
          margin: 0,
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>
    </a>
  );
}
