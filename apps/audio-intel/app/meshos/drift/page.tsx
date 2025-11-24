/**
 * MeshOS Drift Detection Page
 * Visualize system contradictions and drift
 */

'use client';

import { useState, useEffect } from 'react';
import { DriftMeter } from '../../components/meshos/DriftMeter';
import type { DriftReport } from '@total-audio/meshos';

export default function DriftPage() {
  const [driftReports, setDriftReports] = useState<DriftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrift();
  }, []);

  const fetchDrift = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meshos/drift');
      const data = await response.json();

      if (data.success) {
        setDriftReports(data.drift_reports || []);
      } else {
        setError(data.error || 'Failed to fetch drift reports');
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
          <h2 className="font-semibold mb-2">Error Loading Drift Reports</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">Drift Detection</h1>
      <p className="text-muted-foreground mb-8">
        Identify contradictions and drift between systems
      </p>

      {driftReports.length === 0 ? (
        <div className="border bg-success/10 border-success p-6 rounded-lg">
          <h3 className="font-semibold mb-2">✓ No Drift Detected</h3>
          <p className="text-sm text-muted-foreground">
            All systems are aligned with no contradictions found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {driftReports.map((report, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg capitalize">
                    {report.drift_type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
                <DriftMeter severity={report.severity} score={report.drift_score} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Expected Value</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm">{JSON.stringify(report.expected_value, null, 2)}</code>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Actual Value</h4>
                  <div className="bg-muted p-3 rounded">
                    <code className="text-sm">{JSON.stringify(report.actual_value, null, 2)}</code>
                  </div>
                </div>
              </div>

              {report.recommendation && (
                <div className="bg-primary/10 border border-primary p-4 rounded">
                  <h4 className="text-sm font-medium mb-1">Recommendation</h4>
                  <p className="text-sm">{report.recommendation}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-2">
                Detected: {new Date(report.detected_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchDrift}
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Refresh Drift Analysis
      </button>
    </div>
  );
}
