/**
 * MeshOS Insight Routes Page
 * Insight routing rules and configuration
 */

'use client';

import { useState, useEffect } from 'react';
import { InsightRouteTable } from '../../components/meshos/InsightRouteTable';
import type { InsightRoute } from '@total-audio/meshos';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<InsightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meshos/routes');
      const data = await response.json();

      if (data.success) {
        setRoutes(data.routes || []);
      } else {
        setError(data.error || 'Failed to fetch routes');
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
          <h2 className="font-semibold mb-2">Error Loading Routes</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">Insight Routes</h1>
      <p className="text-muted-foreground mb-8">
        Configure how insights are distributed across systems
      </p>

      {routes.length === 0 ? (
        <div className="border bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-2">No Routes Configured</h3>
          <p className="text-sm text-muted-foreground">
            No insight routing rules have been set up yet.
          </p>
        </div>
      ) : (
        <InsightRouteTable routes={routes} onRefresh={fetchRoutes} />
      )}
    </div>
  );
}
