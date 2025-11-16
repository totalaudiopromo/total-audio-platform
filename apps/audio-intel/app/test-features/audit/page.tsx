'use client';

import { useState } from 'react';
import { EnrichmentAuditTrail } from '@/components/features/EnrichmentAuditTrail';
import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, Eye } from 'lucide-react';

export default function TestAudit() {
  const [userId] = useState('test-user-123');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    contactId: 'test-contact-audit-1',
    enrichmentSource: 'perplexity',
    responseTime: 2500,
    tokensUsed: 1200,
    costGBP: 0.05,
  });

  const testCreateAudit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/audit/enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });
      const data = await response.json();
      setApiResponse(data);
      console.log('API Response:', data);
    } catch (error) {
      console.error('API Error:', error);
      setApiResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/test-features"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-yellow-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 6</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Enrichment Audit Trail</h1>
          <p className="mt-2 text-gray-600">
            Complete transparency - see every enrichment, cost, and performance metric
          </p>
        </div>

        {/* API Testing Section */}
        <div className="glass-panel mb-6 border-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-yellow-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">API Testing</h2>
          </div>

          <div className="grid gap-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Contact ID</label>
                <input
                  type="text"
                  value={testData.contactId}
                  onChange={e => setTestData({ ...testData, contactId: e.target.value })}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Enrichment Source
                </label>
                <select
                  value={testData.enrichmentSource}
                  onChange={e => setTestData({ ...testData, enrichmentSource: e.target.value })}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="perplexity">Perplexity</option>
                  <option value="claude">Claude</option>
                  <option value="manual">Manual</option>
                  <option value="cache">Cache</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Response Time (ms)
                </label>
                <input
                  type="number"
                  value={testData.responseTime}
                  onChange={e => setTestData({ ...testData, responseTime: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Tokens Used
                </label>
                <input
                  type="number"
                  value={testData.tokensUsed}
                  onChange={e => setTestData({ ...testData, tokensUsed: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Cost (£GBP)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={testData.costGBP}
                  onChange={e => setTestData({ ...testData, costGBP: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={testCreateAudit}
            disabled={loading}
            className="cta-button w-full sm:w-auto"
          >
            {loading ? 'Creating Audit Log...' : 'Test POST /api/audit/enrichment'}
          </button>

          {apiResponse && (
            <div className="mt-4 rounded-lg border-2 border-black bg-gray-900 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="mb-2 text-xs font-semibold text-gray-400">API Response:</p>
              <pre className="overflow-auto text-xs text-green-400">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* UI Component Testing Section */}
        <div className="glass-panel border-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">UI Component Testing</h2>
          </div>

          <EnrichmentAuditTrail userId={userId} />

          <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Test Checklist:</strong>
              <br />
              ✓ Summary dashboard displays (total, success rate, avg time, cost)
              <br />
              ✓ Audit log table renders
              <br />
              ✓ Filterable by status, source, date
              <br />
              ✓ Expandable rows show full details
              <br />
              ✓ Status badges (success, cached, partial, failed, rate-limited)
              <br />
              ✓ Source badges (Perplexity, Claude, manual, cache)
              <br />✓ Cost tracking in £GBP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
