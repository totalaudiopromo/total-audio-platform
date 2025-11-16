'use client';

import { useState } from 'react';
import { ExportTemplateSelector } from '@/components/features/ExportTemplateSelector';
import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, Eye, FileText, Radio, Music, FileBarChart } from 'lucide-react';

export default function TestExports() {
  const [contactIds] = useState(['contact-1', 'contact-2', 'contact-3']);
  const [campaignId] = useState('campaign-123');
  const [template, setTemplate] = useState('press-kit');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/export/${template}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds,
          campaignId,
          format: 'csv',
        }),
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
      <div className="mx-auto max-w-4xl">
        <Link
          href="/test-features"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-pink-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 5</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Export Templates</h1>
          <p className="mt-2 text-gray-600">
            Professional exports - Press Kit, Radio Plan, Playlist Pack, Client Report
          </p>
        </div>

        {/* Template Info */}
        <div className="glass-panel mb-6 border-pink-500 bg-gradient-to-br from-pink-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-pink-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">4 System Templates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-2">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">1. Press Kit</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Artist bio, photos, streaming stats, press coverage
              </p>
              <span className="inline-block text-xs px-3 py-1 bg-blue-100 text-blue-900 border-2 border-blue-500 rounded-full font-semibold">
                CSV
              </span>
            </div>

            <div className="rounded-xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-purple-600 p-2">
                  <Radio className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">2. Radio Plan</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Campaign overview, target stations, contact list, pitch schedule
              </p>
              <span className="inline-block text-xs px-3 py-1 bg-purple-100 text-purple-900 border-2 border-purple-500 rounded-full font-semibold">
                PDF/HTML
              </span>
            </div>

            <div className="rounded-xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-2">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">3. Playlist Pack</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Curator contacts with genre and follower count
              </p>
              <span className="inline-block text-xs px-3 py-1 bg-blue-100 text-blue-900 border-2 border-blue-500 rounded-full font-semibold">
                CSV
              </span>
            </div>

            <div className="rounded-xl border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-purple-600 p-2">
                  <FileBarChart className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">4. Client Report</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Executive summary, metrics, coverage, ROI
              </p>
              <span className="inline-block text-xs px-3 py-1 bg-purple-100 text-purple-900 border-2 border-purple-500 rounded-full font-semibold">
                PDF/HTML
              </span>
            </div>
          </div>
        </div>

        {/* API Testing Section */}
        <div className="glass-panel mb-6 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">API Testing</h2>
          </div>

          <div className="grid gap-4 mb-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Template</label>
              <select
                value={template}
                onChange={e => setTemplate(e.target.value)}
                className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="press-kit">Press Kit</option>
                <option value="radio-plan">Radio Plan</option>
                <option value="playlist-pack">Playlist Pack</option>
                <option value="client-report">Client Report</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Contact IDs (comma-separated)
              </label>
              <input
                type="text"
                value={contactIds.join(', ')}
                readOnly
                className="w-full rounded-lg border-2 border-black px-4 py-3 text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          <button onClick={testAPI} disabled={loading} className="cta-button w-full sm:w-auto">
            {loading ? 'Generating Export...' : `Test POST /api/export/${template}/generate`}
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

          <ExportTemplateSelector contactIds={contactIds} campaignId={campaignId} />

          <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Test Checklist:</strong>
              <br />
              ✓ Template dropdown displays 4 options
              <br />
              ✓ Template preview shows on select
              <br />
              ✓ Format badge displays (CSV/PDF/ZIP)
              <br />
              ✓ One-click download works
              <br />✓ File downloads correctly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
