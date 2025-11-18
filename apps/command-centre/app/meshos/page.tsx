/**
 * MeshOS Dashboard
 * Main coordination view with Today's Summary panel
 */

'use client';

import { useEffect, useState } from 'react';
import type { DailySummary, GetSummaryResponse } from '@total-audio/meshos';

export default function MeshOSPage() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="meshos-container">
        <h1>MeshOS</h1>
        <p className="loading-text">Loading coordination data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meshos-container">
        <h1>MeshOS</h1>
        <div className="error-panel">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meshos-container">
      <header className="meshos-header">
        <h1>MeshOS</h1>
        <p className="subtitle">READ-ONLY Meta-Coordination Layer</p>
      </header>

      {summary && (
        <div className="meshos-grid">
          {/* Today's Summary Panel */}
          <section className="summary-panel">
            <h2>Today's Summary</h2>
            <p className="date">{summary.date}</p>

            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-value">{summary.metrics.totalOpportunities}</span>
                <span className="metric-label">Opportunities</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{summary.metrics.totalConflicts}</span>
                <span className="metric-label">Conflicts</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{summary.metrics.totalPlans}</span>
                <span className="metric-label">Plans</span>
              </div>
              <div className="metric-card critical">
                <span className="metric-value">{summary.metrics.criticalIssues}</span>
                <span className="metric-label">Critical Issues</span>
              </div>
            </div>

            {summary.metrics.criticalIssues > 0 && (
              <div className="alert critical">
                ⚠️ {summary.metrics.criticalIssues} critical issue(s) require attention
              </div>
            )}
          </section>

          {/* Top Opportunities */}
          <section className="opportunities-panel">
            <h3>Top Opportunities</h3>
            {summary.opportunities.length > 0 ? (
              <div className="opportunity-list">
                {summary.opportunities.map((opp) => (
                  <div key={opp.id} className={`opportunity-card impact-${opp.impact}`}>
                    <div className="opportunity-header">
                      <span className="systems">{opp.systems.join(' + ')}</span>
                      <span className={`badge impact-${opp.impact}`}>{opp.impact}</span>
                    </div>
                    <p className="description">{opp.description}</p>
                    {opp.recommendedActions && opp.recommendedActions.length > 0 && (
                      <ul className="actions">
                        {opp.recommendedActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No opportunities detected</p>
            )}
          </section>

          {/* Top Conflicts */}
          <section className="conflicts-panel">
            <h3>Top Conflicts</h3>
            {summary.conflicts.length > 0 ? (
              <div className="conflict-list">
                {summary.conflicts.map((conflict) => (
                  <div key={conflict.id} className={`conflict-card severity-${conflict.severity}`}>
                    <div className="conflict-header">
                      <span className="systems">{conflict.systems.join(' ↔ ')}</span>
                      <span className={`badge severity-${conflict.severity}`}>{conflict.severity}</span>
                    </div>
                    <p className="description">{conflict.description}</p>
                    {conflict.resolutionSuggestions && conflict.resolutionSuggestions.length > 0 && (
                      <ul className="suggestions">
                        {conflict.resolutionSuggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No conflicts detected</p>
            )}
          </section>

          {/* Navigation */}
          <nav className="meshos-nav">
            <a href="/meshos/drift" className="nav-card">
              <h3>Drift & Contradictions</h3>
              <p>View contradiction graph</p>
            </a>
            <a href="/meshos/plans" className="nav-card">
              <h3>Plans</h3>
              <p>Active and recent plans</p>
            </a>
            <a href="/meshos/negotiations" className="nav-card">
              <h3>Negotiations</h3>
              <p>Cross-system negotiations</p>
            </a>
          </nav>
        </div>
      )}

      <style jsx>{`
        .meshos-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .meshos-header {
          margin-bottom: 2rem;
        }

        .meshos-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
          margin: 0.5rem 0 0;
        }

        .meshos-grid {
          display: grid;
          gap: 2rem;
        }

        .summary-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 12px;
          color: white;
        }

        .summary-panel h2 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
        }

        .date {
          opacity: 0.9;
          margin: 0 0 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.15);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .metric-card.critical {
          background: rgba(239, 68, 68, 0.25);
        }

        .metric-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          display: block;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .alert {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid rgba(239, 68, 68, 0.5);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        }

        .opportunities-panel,
        .conflicts-panel {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .opportunities-panel h3,
        .conflicts-panel h3 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .opportunity-list,
        .conflict-list {
          display: grid;
          gap: 1rem;
        }

        .opportunity-card,
        .conflict-card {
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid;
        }

        .opportunity-card.impact-high {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .opportunity-card.impact-medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .opportunity-card.impact-low {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .conflict-card.severity-critical {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .conflict-card.severity-high {
          border-color: #f97316;
          background: #fff7ed;
        }

        .conflict-card.severity-medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .conflict-card.severity-low {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .opportunity-header,
        .conflict-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .systems {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge.impact-high {
          background: #10b981;
          color: white;
        }

        .badge.impact-medium {
          background: #f59e0b;
          color: white;
        }

        .badge.impact-low {
          background: #6b7280;
          color: white;
        }

        .badge.severity-critical {
          background: #dc2626;
          color: white;
        }

        .badge.severity-high {
          background: #f97316;
          color: white;
        }

        .badge.severity-medium {
          background: #f59e0b;
          color: white;
        }

        .badge.severity-low {
          background: #6b7280;
          color: white;
        }

        .description {
          color: #374151;
          margin: 0 0 1rem;
          line-height: 1.6;
        }

        .actions,
        .suggestions {
          margin: 0;
          padding-left: 1.5rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .actions li,
        .suggestions li {
          margin-bottom: 0.25rem;
        }

        .empty-state {
          color: #9ca3af;
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }

        .meshos-nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .nav-card {
          display: block;
          padding: 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.24s ease-out;
        }

        .nav-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        .nav-card h3 {
          margin: 0 0 0.5rem;
          color: #1a1a1a;
          font-size: 1.1rem;
        }

        .nav-card p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
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
