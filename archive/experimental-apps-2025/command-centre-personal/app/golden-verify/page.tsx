'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Zap,
} from 'lucide-react';

interface GoldenHistory {
  id: string;
  app: string;
  deployment_id: string;
  environment: string;
  health_status: 'healthy' | 'degraded' | 'down';
  tests_passed: number;
  tests_failed: number;
  uptime_percent: number;
  lighthouse_performance: number;
  lighthouse_accessibility: number;
  lighthouse_best_practices: number;
  lighthouse_seo: number;
  avg_response_time_ms: number;
  deployed_at: string;
}

interface LatestStatus {
  app: string;
  health_status: string;
  tests_passed: number;
  tests_failed: number;
  lighthouse_performance: number;
  deployed_at: string;
}

interface Summary {
  app: string;
  environment: string;
  total_deployments: number;
  healthy_deployments: number;
  degraded_deployments: number;
  failed_deployments: number;
  avg_performance_score: number;
  avg_accessibility_score: number;
  last_deployment: string;
}

export default function GoldenVerifyPage() {
  const [history, setHistory] = useState<GoldenHistory[]>([]);
  const [latestStatus, setLatestStatus] = useState<LatestStatus[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    fetchGoldenData();
  }, [selectedApp]);

  const fetchGoldenData = async () => {
    setLoading(true);
    try {
      const url = selectedApp
        ? `/api/ops-console/golden?app=${selectedApp}`
        : '/api/ops-console/golden';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
        setLatestStatus(data.latestStatus);
        setSummary(data.summary);
      } else {
        console.error('Failed to fetch Golden Verify data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Golden Verify data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-600';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-600';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-600';
    }
  };

  const getLighthouseColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">
          Loading Golden Verify data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Golden Verify</h2>
        </div>
        <p className="text-sm text-gray-600">
          Deployment health checks and performance metrics from golden-verify.yml workflow
        </p>
      </div>

      {/* Latest Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestStatus.map(status => (
          <div
            key={status.app}
            className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.health_status)}
                <span className="font-black text-gray-900 uppercase text-sm">{status.app}</span>
              </div>
              <div
                className={`px-3 py-1 rounded-lg border-2 border-black text-xs font-bold uppercase ${getStatusColor(status.health_status)}`}
              >
                {status.health_status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Passed</div>
                <div className="text-xl font-black text-green-600">{status.tests_passed}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Failed</div>
                <div className="text-xl font-black text-red-600">{status.tests_failed}</div>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Performance</span>
                <span
                  className={`text-lg font-black ${getLighthouseColor(status.lighthouse_performance)}`}
                >
                  {status.lighthouse_performance || '--'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      {summary.length > 0 && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">30-Day Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map(sum => (
              <div key={`${sum.app}-${sum.environment}`} className="space-y-3">
                <div className="font-bold text-gray-900 uppercase text-sm">{sum.app}</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-black text-green-600">
                      {sum.healthy_deployments}
                    </div>
                    <div className="text-xs text-gray-500">Healthy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-yellow-600">
                      {sum.degraded_deployments}
                    </div>
                    <div className="text-xs text-gray-500">Degraded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-red-600">{sum.failed_deployments}</div>
                    <div className="text-xs text-gray-500">Failed</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
                  Avg Performance: {Math.round(sum.avg_performance_score)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment History Timeline */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Recent Deployments</h3>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No deployment history found. Run golden-intelligence.ts to populate data.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div
                key={item.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.health_status)}
                    <div>
                      <div className="font-bold text-gray-900 uppercase text-sm">{item.app}</div>
                      <div className="text-xs text-gray-500">{item.deployment_id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(item.deployed_at).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Tests</div>
                    <div className="text-lg font-bold">
                      <span className="text-green-600">{item.tests_passed}</span> /{' '}
                      <span className="text-red-600">{item.tests_failed}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Uptime</div>
                    <div className="text-lg font-bold text-gray-900">
                      {item.uptime_percent ? `${item.uptime_percent}%` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Response</div>
                    <div className="text-lg font-bold text-gray-900">
                      {item.avg_response_time_ms ? `${item.avg_response_time_ms}ms` : '--'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Status</div>
                    <div
                      className={`inline-flex px-2 py-1 rounded border-2 border-black text-xs font-bold uppercase ${getStatusColor(item.health_status)}`}
                    >
                      {item.health_status}
                    </div>
                  </div>
                </div>

                {/* Lighthouse Scores */}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Performance
                      </div>
                      <div
                        className={`text-lg font-black ${getLighthouseColor(item.lighthouse_performance)}`}
                      >
                        {item.lighthouse_performance || '--'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Accessibility
                      </div>
                      <div
                        className={`text-lg font-black ${getLighthouseColor(item.lighthouse_accessibility)}`}
                      >
                        {item.lighthouse_accessibility || '--'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Best Practices
                      </div>
                      <div
                        className={`text-lg font-black ${getLighthouseColor(item.lighthouse_best_practices)}`}
                      >
                        {item.lighthouse_best_practices || '--'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">SEO</div>
                      <div
                        className={`text-lg font-black ${getLighthouseColor(item.lighthouse_seo)}`}
                      >
                        {item.lighthouse_seo || '--'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Source Notice */}
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Automated Data Collection</h4>
            <p className="text-sm text-blue-800">
              Data is automatically populated by{' '}
              <code className="font-mono">golden-intelligence.ts</code> after each deployment via
              the <code className="font-mono">golden-verify.yml</code> GitHub Actions workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
