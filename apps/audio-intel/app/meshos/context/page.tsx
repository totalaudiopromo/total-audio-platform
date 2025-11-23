/**
 * MeshOS Global Context Page
 * System-wide awareness and state visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { MeshContextPanel } from '../../components/meshos/MeshContextPanel';
import { MultiAgentGraph } from '../../components/meshos/MultiAgentGraph';
import { OpportunityOverview } from '../../components/meshos/OpportunityOverview';
import type { GlobalContext } from '@total-audio/meshos';

export default function ContextPage() {
  const [context, setContext] = useState<GlobalContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContext();
  }, []);

  const fetchContext = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meshos/context');
      const data = await response.json();

      if (data.success) {
        setContext(data.context);
      } else {
        setError(data.error || 'Failed to fetch context');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-destructive bg-destructive/10 p-4 rounded">
          <h2 className="font-semibold mb-2">Error Loading Context</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">Global Context</h1>

      {context && (
        <div className="space-y-8">
          {/* Context Panel */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
            <MeshContextPanel context={context} />
          </div>

          {/* Multi-Agent Graph */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Agent Network</h2>
            <MultiAgentGraph systems={context.systems} />
          </div>

          {/* Opportunity Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Opportunities</h2>
            <OpportunityOverview opportunities={context.opportunities} />
          </div>

          {/* Threats */}
          {context.threats && context.threats.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Threats</h2>
              <div className="border border-destructive bg-destructive/10 p-6 rounded-lg">
                <ul className="space-y-2">
                  {context.threats.map((threat, idx) => (
                    <li key={idx} className="text-sm">
                      • {threat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Contradictions */}
          {context.contradictions && context.contradictions.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contradictions</h2>
              <div className="border border-warning bg-warning/10 p-6 rounded-lg">
                <ul className="space-y-2">
                  {context.contradictions.map((contradiction, idx) => (
                    <li key={idx} className="text-sm">
                      • {contradiction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
