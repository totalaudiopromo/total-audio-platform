/**
 * MeshOS Negotiations Page
 * Multi-agent conflict resolution visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { NegotiationTimeline } from '../../components/meshos/NegotiationTimeline';
import { ConflictResolutionPanel } from '../../components/meshos/ConflictResolutionPanel';
import type { Negotiation } from '@total-audio/meshos';

export default function NegotiationsPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meshos/negotiations?limit=20');
      const data = await response.json();

      if (data.success) {
        setNegotiations(data.negotiations || []);
      } else {
        setError(data.error || 'Failed to fetch negotiations');
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
          <h2 className="font-semibold mb-2">Error Loading Negotiations</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">Multi-Agent Negotiations</h1>
      <p className="text-muted-foreground mb-8">
        Conflict resolution and priority allocation
      </p>

      {negotiations.length === 0 ? (
        <div className="border bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-2">No Negotiations</h3>
          <p className="text-sm text-muted-foreground">
            No multi-agent negotiations have been initiated yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
            <NegotiationTimeline negotiations={negotiations} />
          </div>

          {/* Recent Negotiations */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Negotiations</h2>
            <div className="space-y-4">
              {negotiations.map((negotiation) => (
                <ConflictResolutionPanel
                  key={negotiation.id}
                  negotiation={negotiation}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={fetchNegotiations}
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Refresh Negotiations
      </button>
    </div>
  );
}
