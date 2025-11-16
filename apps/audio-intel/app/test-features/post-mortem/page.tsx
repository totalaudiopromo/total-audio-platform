'use client';

import { useState } from 'react';
import { CampaignPostMortemReport } from '@/components/features/CampaignPostMortemReport';
import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, Eye } from 'lucide-react';

export default function TestPostMortem() {
  const [campaignId] = useState('test-campaign-789');
  const [campaignName, setCampaignName] = useState('Liberty Music Radio Campaign');
  const [campaignData, setCampaignData] = useState({
    totalContactsReached: 150,
    responseRate: 45,
    successRate: 30,
    channels: { radio: 100, playlists: 30, blogs: 20 },
    topPerformers: ['BBC Radio 6 Music', 'Amazing Radio', 'Local station XYZ'],
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/post-mortem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          ...campaignData,
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-orange-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 4</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Campaign Post-Mortem</h1>
          <p className="mt-2 text-gray-600">
            AI-powered campaign analysis with wins, learnings, and recommendations
          </p>
        </div>

        {/* API Testing Section */}
        <div className="glass-panel mb-6 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-orange-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">API Testing</h2>
          </div>

          <div className="grid gap-4 mb-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Total Contacts Reached
                </label>
                <input
                  type="number"
                  value={campaignData.totalContactsReached}
                  onChange={e =>
                    setCampaignData({
                      ...campaignData,
                      totalContactsReached: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Response Rate (%)
                </label>
                <input
                  type="number"
                  value={campaignData.responseRate}
                  onChange={e =>
                    setCampaignData({
                      ...campaignData,
                      responseRate: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Success Rate (%)
                </label>
                <input
                  type="number"
                  value={campaignData.successRate}
                  onChange={e =>
                    setCampaignData({
                      ...campaignData,
                      successRate: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          <button onClick={testAPI} disabled={loading} className="cta-button w-full sm:w-auto">
            {loading ? 'Generating Post-Mortem...' : 'Test POST /api/campaigns/[id]/post-mortem'}
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

          <CampaignPostMortemReport
            campaignId={campaignId}
            campaignName={campaignName}
            campaignData={campaignData}
          />

          <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Test Checklist:</strong>
              <br />
              ✓ Full-page report layout renders
              <br />
              ✓ Metric cards display correctly
              <br />
              ✓ Executive summary shows
              <br />
              ✓ Key wins section (with icons)
              <br />
              ✓ Key learnings section (with icons)
              <br />
              ✓ Recommendations section (with icons)
              <br />✓ Export as text file works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
