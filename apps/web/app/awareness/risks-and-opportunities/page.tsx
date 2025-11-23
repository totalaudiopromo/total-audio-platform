/**
 * Risks and Opportunities
 * /awareness/risks-and-opportunities
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Risk {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  probability: number;
  mitigationActions: string[];
  data: any;
}

interface Opportunity {
  id: string;
  type: string;
  description: string;
  confidence: number;
  potentialImpact: 'low' | 'medium' | 'high';
  window?: {
    opensAt: Date;
    duration: string;
  };
  suggestedActions: string[];
  data: any;
}

interface Mismatch {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  systems: string[];
  suggestedActions: string[];
  data: any;
}

export default function RisksAndOpportunitiesPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mismatches, setMismatches] = useState<Mismatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'risks' | 'opportunities' | 'mismatches'>('opportunities');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const response = await fetch('/api/awareness/snapshots?latest=true');
      const data = await response.json();

      if (data.success && data.data) {
        setRisks(data.data.data.risks || []);
        setOpportunities(data.data.data.opportunities || []);
        setMismatches(data.data.data.mismatches || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  function getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  }

  function getImpactColor(impact: string): string {
    switch (impact) {
      case 'high':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="text-slate-400">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/awareness"
                className="text-slate-400 hover:text-white transition-colors duration-240"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white">
                Risks & Opportunities
              </h1>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('opportunities')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                view === 'opportunities'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Opportunities ({opportunities.length})
            </button>
            <button
              onClick={() => setView('risks')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                view === 'risks'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Risks ({risks.length})
            </button>
            <button
              onClick={() => setView('mismatches')}
              className={`px-4 py-2 rounded-lg transition-colors duration-240 ${
                view === 'mismatches'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Mismatches ({mismatches.length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Opportunities View */}
          {view === 'opportunities' && (
            <div className="space-y-4">
              {opportunities.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                  <p className="text-slate-400">No opportunities detected</p>
                </div>
              ) : (
                opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(
                              opp.potentialImpact
                            )}`}
                          >
                            {opp.potentialImpact.toUpperCase()} IMPACT
                          </span>
                          <span className="text-xs text-slate-500">
                            Type: {opp.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {opp.description}
                        </h3>

                        {opp.window && (
                          <div className="mb-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                            <div className="text-sm text-slate-400">
                              Window: Opens{' '}
                              {new Date(opp.window.opensAt).toLocaleDateString()}, lasts{' '}
                              {opp.window.duration}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-400 mb-2">
                            Suggested Actions:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {opp.suggestedActions.map((action, idx) => (
                              <li key={idx} className="text-sm text-slate-300">
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 text-xs text-slate-500">
                          Confidence: {(opp.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Risks View */}
          {view === 'risks' && (
            <div className="space-y-4">
              {risks.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                  <p className="text-slate-400">No risks detected</p>
                </div>
              ) : (
                risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                              risk.severity
                            )}`}
                          >
                            {risk.severity.toUpperCase()} SEVERITY
                          </span>
                          <span className="text-xs text-slate-500">
                            Type: {risk.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {risk.description}
                        </h3>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-400 mb-2">
                            Mitigation Actions:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {risk.mitigationActions.map((action, idx) => (
                              <li key={idx} className="text-sm text-slate-300">
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 text-xs text-slate-500">
                          Probability: {(risk.probability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Mismatches View */}
          {view === 'mismatches' && (
            <div className="space-y-4">
              {mismatches.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                  <p className="text-slate-400">No mismatches detected</p>
                </div>
              ) : (
                mismatches.map((mismatch) => (
                  <div
                    key={mismatch.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                              mismatch.severity
                            )}`}
                          >
                            {mismatch.severity.toUpperCase()} SEVERITY
                          </span>
                          <span className="text-xs text-slate-500">
                            Type: {mismatch.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {mismatch.description}
                        </h3>

                        <div className="mb-3">
                          <span className="text-xs text-slate-400">
                            Affected Systems: {mismatch.systems.join(', ')}
                          </span>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-400 mb-2">
                            Suggested Actions:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {mismatch.suggestedActions.map((action, idx) => (
                              <li key={idx} className="text-sm text-slate-300">
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
