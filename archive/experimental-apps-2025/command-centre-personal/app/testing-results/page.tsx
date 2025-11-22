'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Activity, Clock, TestTube } from 'lucide-react';

interface TestingResult {
  id: string;
  app: string;
  test_suite: string;
  component: string;
  file_path: string;
  test_type: string;
  passed: boolean;
  duration_ms: number;
  issues_found: number;
  issues_fixed: number;
  executed_at: string;
}

interface PassRate {
  app: string;
  total_tests: number;
  tests_passed: number;
  tests_failed: number;
  pass_rate: number;
}

interface Summary {
  app: string;
  test_suite: string;
  test_type: string;
  total_tests: number;
  tests_passed: number;
  tests_failed: number;
  pass_rate: number;
  total_issues_found: number;
  total_issues_fixed: number;
  last_execution: string;
}

export default function TestingPage() {
  const [results, setResults] = useState<TestingResult[]>([]);
  const [passRate, setPassRate] = useState<PassRate[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    fetchTestingData();
  }, [selectedApp]);

  const fetchTestingData = async () => {
    setLoading(true);
    try {
      const url = selectedApp
        ? `/api/ops-console/testing?app=${selectedApp}`
        : '/api/ops-console/testing';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setPassRate(data.passRate);
        setSummary(data.summary);
      } else {
        console.error('Failed to fetch testing data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTestTypeColor = (testType: string) => {
    switch (testType) {
      case 'responsive':
        return 'bg-blue-100 text-blue-800';
      case 'accessibility':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-green-100 text-green-800';
      case 'touch-targets':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPassRateColor = (passRate: number) => {
    if (passRate >= 95) return 'text-green-600';
    if (passRate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">Loading testing data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <TestTube className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-black text-gray-900">Testing Results</h2>
        </div>
        <p className="text-sm text-gray-600">
          Component analysis and test results from @total-audio/testing agents
        </p>
      </div>

      {/* Pass Rate Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passRate.map(rate => (
          <div
            key={rate.app}
            className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-black text-gray-900 uppercase text-sm">{rate.app}</span>
              <span className={`text-3xl font-black ${getPassRateColor(rate.pass_rate)}`}>
                {rate.pass_rate.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-black text-gray-900">{rate.total_tests}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-lg font-black text-green-600">{rate.tests_passed}</div>
                <div className="text-xs text-gray-500">Passed</div>
              </div>
              <div>
                <div className="text-lg font-black text-red-600">{rate.tests_failed}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Type Breakdown */}
      {summary.length > 0 && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Test Type Breakdown (7 Days)</h3>
          <div className="space-y-3">
            {summary.map((sum, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{sum.app}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getTestTypeColor(sum.test_type)}`}
                    >
                      {sum.test_type}
                    </span>
                    <span className="text-xs text-gray-500">({sum.test_suite})</span>
                  </div>
                  <span className={`text-lg font-black ${getPassRateColor(sum.pass_rate)}`}>
                    {sum.pass_rate.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Tests:</span>{' '}
                    <span className="font-bold">{sum.total_tests}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Passed:</span>{' '}
                    <span className="font-bold text-green-600">{sum.tests_passed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Issues:</span>{' '}
                    <span className="font-bold text-orange-600">{sum.total_issues_found}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fixed:</span>{' '}
                    <span className="font-bold text-blue-600">{sum.total_issues_fixed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Test Results */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Recent Test Results</h3>

        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No test results found. Run testing agents to populate data.
          </div>
        ) : (
          <div className="space-y-3">
            {results.map(result => (
              <div
                key={result.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {result.app} / {result.component}
                      </div>
                      <div className="text-xs text-gray-500">{result.file_path}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getTestTypeColor(result.test_type)}`}
                    >
                      {result.test_type}
                    </span>
                    {result.issues_found > 0 && (
                      <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold">
                        {result.issues_found} issues
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Suite:</span>{' '}
                    <span className="font-semibold">{result.test_suite}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>{' '}
                    <span className="font-semibold">{result.duration_ms || '--'}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Issues:</span>{' '}
                    <span className="font-semibold text-orange-600">{result.issues_found}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fixed:</span>{' '}
                    <span className="font-semibold text-blue-600">{result.issues_fixed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {new Date(result.executed_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Source Notice */}
      <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-purple-900 mb-1">Automated Testing</h4>
            <p className="text-sm text-purple-800">
              Data is automatically populated by{' '}
              <code className="font-mono">golden-intelligence.ts</code> from the{' '}
              <code className="font-mono">@total-audio/testing</code> agent suite
              (component-analyzer, test-generator, cross-app-orchestrator).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
