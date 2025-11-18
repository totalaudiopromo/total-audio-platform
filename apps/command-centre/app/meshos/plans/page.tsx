/**
 * MeshOS Plans
 * Shows plans referenced in daily summaries
 */

'use client';

import { useEffect, useState } from 'react';
import type { DailySummary, GetSummaryResponse, PlanSummary } from '@total-audio/meshos';

export default function MeshOSPlansPage() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/meshos/summary/today');
        const data: GetSummaryResponse = await response.json();

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

    fetchSummary();
  }, []);

  const getPlansForTab = (): PlanSummary[] => {
    if (!summary) return [];
    return summary.plans[`last${activeTab}`] || [];
  };

  const getStatusColor = (status: PlanSummary['status']): string => {
    const colors = {
      pending: '#f59e0b',
      active: '#10b981',
      completed: '#6b7280',
      blocked: '#dc2626',
    };
    return colors[status];
  };

  const getPriorityColor = (priority?: PlanSummary['priority']): string => {
    if (!priority) return '#6b7280';
    const colors = {
      low: '#6b7280',
      medium: '#f59e0b',
      high: '#dc2626',
    };
    return colors[priority];
  };

  if (loading) {
    return (
      <div className="plans-container">
        <h1>Plans</h1>
        <p className="loading-text">Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plans-container">
        <h1>Plans</h1>
        <div className="error-panel">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  const plans = getPlansForTab();

  return (
    <div className="plans-container">
      <header className="plans-header">
        <h1>Plans</h1>
        <a href="/meshos" className="back-link">← Back to MeshOS</a>
      </header>

      {summary && (
        <div className="plans-content">
          {/* Plan Stats */}
          <section className="plans-stats">
            <div className="stat-card">
              <span className="stat-value">{summary.plans.last7d.length}</span>
              <span className="stat-label">Last 7 Days</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{summary.plans.last30d.length}</span>
              <span className="stat-label">Last 30 Days</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{summary.plans.last90d.length}</span>
              <span className="stat-label">Last 90 Days</span>
            </div>
            <div className="stat-card active-plans">
              <span className="stat-value">
                {summary.plans.last7d.filter((p) => p.status === 'active').length}
              </span>
              <span className="stat-label">Currently Active</span>
            </div>
          </section>

          {/* Time Range Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === '7d' ? 'active' : ''}`}
              onClick={() => setActiveTab('7d')}
            >
              Last 7 Days
            </button>
            <button
              className={`tab ${activeTab === '30d' ? 'active' : ''}`}
              onClick={() => setActiveTab('30d')}
            >
              Last 30 Days
            </button>
            <button
              className={`tab ${activeTab === '90d' ? 'active' : ''}`}
              onClick={() => setActiveTab('90d')}
            >
              Last 90 Days
            </button>
          </div>

          {/* Plans List */}
          <section className="plans-list">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-header">
                    <h3>{plan.title}</h3>
                    <div className="plan-badges">
                      {plan.priority && (
                        <span
                          className="priority-badge"
                          style={{ background: getPriorityColor(plan.priority) }}
                        >
                          {plan.priority}
                        </span>
                      )}
                      <span className="status-badge" style={{ background: getStatusColor(plan.status) }}>
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  <div className="plan-meta">
                    <div className="systems">
                      <span className="meta-label">Systems:</span>
                      <span className="meta-value">{plan.systems.join(', ')}</span>
                    </div>
                    <div className="created">
                      <span className="meta-label">Created:</span>
                      <span className="meta-value">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Reference indicator */}
                  {isReferencedInSummary(plan, summary) && (
                    <div className="reference-indicator">
                      📌 Referenced in today's summary
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No plans found for this time period</p>
              </div>
            )}
          </section>

          {/* Plans by Status */}
          <section className="plans-by-status">
            <h2>Plans by Status</h2>
            <div className="status-grid">
              {(['active', 'pending', 'blocked', 'completed'] as const).map((status) => {
                const statusPlans = plans.filter((p) => p.status === status);
                return (
                  <div key={status} className="status-group">
                    <h3 className="status-title" style={{ color: getStatusColor(status) }}>
                      {status.toUpperCase()}
                    </h3>
                    <div className="status-count">{statusPlans.length}</div>
                    {statusPlans.length > 0 && (
                      <ul className="status-plans-list">
                        {statusPlans.slice(0, 3).map((plan) => (
                          <li key={plan.id}>{plan.title}</li>
                        ))}
                        {statusPlans.length > 3 && (
                          <li className="more">+{statusPlans.length - 3} more</li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        .plans-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .plans-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .plans-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
        }

        .back-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.24s ease-out;
        }

        .back-link:hover {
          color: #764ba2;
        }

        .plans-content {
          display: grid;
          gap: 2rem;
        }

        .plans-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          text-align: center;
        }

        .stat-card.active-plans {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.24s ease-out;
          position: relative;
          bottom: -0.5rem;
        }

        .tab:hover {
          color: #667eea;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .plans-list {
          display: grid;
          gap: 1rem;
        }

        .plan-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          transition: all 0.24s ease-out;
        }

        .plan-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .plan-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1a1a1a;
          flex: 1;
        }

        .plan-badges {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        .priority-badge,
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }

        .plan-meta {
          display: grid;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .systems,
        .created {
          display: flex;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .meta-label {
          font-weight: 600;
          color: #6b7280;
        }

        .meta-value {
          color: #374151;
        }

        .reference-indicator {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #92400e;
          font-weight: 500;
        }

        .plans-by-status {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .plans-by-status h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .status-group {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .status-title {
          margin: 0 0 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .status-count {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .status-plans-list {
          margin: 0;
          padding-left: 1.25rem;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .status-plans-list li {
          margin-bottom: 0.25rem;
        }

        .status-plans-list li.more {
          font-style: italic;
          color: #9ca3af;
        }

        .empty-state {
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          padding: 3rem;
          border-radius: 8px;
          text-align: center;
        }

        .empty-state p {
          margin: 0;
          color: #6b7280;
          font-style: italic;
        }

        .loading-text {
          color: #6b7280;
          text-align: center;
          padding: 3rem;
        }

        .error-panel {
          background: #fef2f2;
          border: 2px solid #dc2626;
          padding: 1.5rem;
          border-radius: 8px;
          color: #991b1b;
        }
      `}</style>
    </div>
  );
}

// Helper function to check if plan is referenced in summary
function isReferencedInSummary(plan: PlanSummary, summary: DailySummary): boolean {
  // Check if plan's systems match any opportunity or conflict systems
  const allReferencedSystems = new Set<string>();

  summary.opportunities.forEach((opp) => {
    opp.systems.forEach((sys) => allReferencedSystems.add(sys));
  });

  summary.conflicts.forEach((conflict) => {
    conflict.systems.forEach((sys) => allReferencedSystems.add(sys));
  });

  // Check if plan has at least one system in common
  return plan.systems.some((sys) => allReferencedSystems.has(sys));
}
