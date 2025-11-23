/**
 * MeshOS Drift & Contradictions
 * Contradiction graph visualization
 */

'use client';

import { useEffect, useState } from 'react';
import type { MeshContradictionGraph, GetContradictionGraphResponse } from '@total-audio/meshos';

export default function MeshOSDriftPage() {
  const [graph, setGraph] = useState<MeshContradictionGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const response = await fetch('/api/meshos/drift/graph');
        const data: GetContradictionGraphResponse = await response.json();

        if (data.success && data.graph) {
          setGraph(data.graph);
        } else {
          setError(data.error || 'Failed to fetch graph');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchGraph();
  }, []);

  if (loading) {
    return (
      <div className="drift-container">
        <h1>Drift & Contradictions</h1>
        <p className="loading-text">Loading contradiction graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drift-container">
        <h1>Drift & Contradictions</h1>
        <div className="error-panel">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drift-container">
      <header className="drift-header">
        <h1>Drift & Contradictions</h1>
        <a href="/meshos" className="back-link">← Back to MeshOS</a>
      </header>

      {graph && (
        <div className="drift-content">
          {/* Graph Summary */}
          <section className="graph-summary">
            <h2>Graph Overview</h2>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{graph.nodes.length}</span>
                <span className="stat-label">Systems</span>
              </div>
              <div className="stat">
                <span className="stat-value">{graph.totalContradictions}</span>
                <span className="stat-label">Contradictions</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {graph.edges.filter((e) => e.severity === 'critical' || e.severity === 'high').length}
                </span>
                <span className="stat-label">High Severity</span>
              </div>
            </div>
            <p className="generated-at">Generated: {new Date(graph.generatedAt).toLocaleString()}</p>
          </section>

          {/* Contradiction Graph Visualization */}
          <section className="graph-visualization">
            <h2>Contradiction Graph</h2>
            <div className="graph-container">
              {/* Simple visual representation */}
              <div className="graph-grid">
                {graph.nodes.map((node) => (
                  <div key={node.system} className={`node severity-${node.severity}`}>
                    <div className="node-name">{node.system}</div>
                    <div className="node-count">{node.contradictionCount}</div>
                  </div>
                ))}
              </div>

              {/* Connections legend */}
              <div className="connections-info">
                <h3>Active Contradictions</h3>
                <div className="edges-list">
                  {graph.edges.map((edge, idx) => (
                    <div key={idx} className={`edge-item severity-${edge.severity}`}>
                      <div className="edge-header">
                        <span className="edge-systems">
                          {edge.from} ↔ {edge.to}
                        </span>
                        <span className={`badge severity-${edge.severity}`}>{edge.severity}</span>
                      </div>
                      <p className="edge-summary">{edge.humanSummary}</p>
                      {edge.examples && edge.examples.length > 0 && (
                        <ul className="edge-examples">
                          {edge.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Top Conflict Systems */}
          <section className="top-systems">
            <h2>Systems with Most Contradictions</h2>
            <div className="systems-list">
              {[...graph.nodes]
                .sort((a, b) => b.contradictionCount - a.contradictionCount)
                .slice(0, 5)
                .map((node) => (
                  <div key={node.system} className={`system-card severity-${node.severity}`}>
                    <div className="system-name">{node.system}</div>
                    <div className="system-stats">
                      <span className="count">{node.contradictionCount} contradictions</span>
                      <span className={`severity-badge severity-${node.severity}`}>
                        Max severity: {node.severity}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        .drift-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .drift-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .drift-header h1 {
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

        .drift-content {
          display: grid;
          gap: 2rem;
        }

        .graph-summary {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 2rem;
          border-radius: 12px;
          color: white;
        }

        .graph-summary h2 {
          margin: 0 0 1.5rem;
          font-size: 1.5rem;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat {
          background: rgba(255, 255, 255, 0.15);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .generated-at {
          opacity: 0.9;
          margin: 1rem 0 0;
          font-size: 0.9rem;
        }

        .graph-visualization {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .graph-visualization h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .graph-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .node {
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          border: 2px solid;
          transition: all 0.24s ease-out;
        }

        .node:hover {
          transform: scale(1.05);
        }

        .node.severity-critical {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .node.severity-high {
          border-color: #f97316;
          background: #fff7ed;
        }

        .node.severity-medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .node.severity-low {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .node-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .node-count {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .connections-info {
          border-top: 2px solid #e5e7eb;
          padding-top: 2rem;
        }

        .connections-info h3 {
          margin: 0 0 1rem;
          font-size: 1.1rem;
          color: #1a1a1a;
        }

        .edges-list {
          display: grid;
          gap: 1rem;
        }

        .edge-item {
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid;
        }

        .edge-item.severity-critical {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .edge-item.severity-high {
          border-color: #f97316;
          background: #fff7ed;
        }

        .edge-item.severity-medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .edge-item.severity-low {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .edge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .edge-systems {
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

        .edge-summary {
          color: #374151;
          margin: 0 0 0.75rem;
          line-height: 1.6;
        }

        .edge-examples {
          margin: 0;
          padding-left: 1.5rem;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .edge-examples li {
          margin-bottom: 0.25rem;
        }

        .top-systems {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .top-systems h2 {
          margin: 0 0 1.5rem;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .systems-list {
          display: grid;
          gap: 1rem;
        }

        .system-card {
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .system-card.severity-critical {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .system-card.severity-high {
          border-color: #f97316;
          background: #fff7ed;
        }

        .system-card.severity-medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .system-card.severity-low {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .system-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1a1a1a;
        }

        .system-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .count {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .severity-badge.severity-critical {
          background: #dc2626;
        }

        .severity-badge.severity-high {
          background: #f97316;
        }

        .severity-badge.severity-medium {
          background: #f59e0b;
        }

        .severity-badge.severity-low {
          background: #6b7280;
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
