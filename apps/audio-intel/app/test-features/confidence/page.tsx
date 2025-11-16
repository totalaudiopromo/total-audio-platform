'use client';

import { useState } from 'react';
import { ContactConfidenceBadge } from '@/components/features/ContactConfidenceBadge';
import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, Eye } from 'lucide-react';

export default function TestConfidence() {
  const [contactId, setContactId] = useState('');
  const [contactEmail, setContactEmail] = useState('test@bbc.co.uk');
  const [enrichmentData, setEnrichmentData] = useState({
    email_validity: 90,
    data_freshness: 80,
    source_quality: 85,
    enrichment_depth: 75,
    verification_status: 95,
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    if (!contactId.trim()) {
      alert('Please enter a valid UUID Contact ID');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/contacts/confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          contactEmail,
          enrichmentData,
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-green-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 1</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Contact Confidence Engine</h1>
          <p className="mt-2 text-gray-600">Traffic light scoring system for contact reliability</p>
        </div>

        {/* API Testing Section */}
        <div className="glass-panel mb-6 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">API Testing</h2>
          </div>

          <div className="mb-4 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Contact ID</strong> is a UUID from your database (e.g.,{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
                550e8400-e29b-41d4-a716-446655440000
              </code>
              ). You'll need a real contact from your intel_contacts table to test fully.
            </p>
          </div>

          <div className="grid gap-4 mb-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Contact ID (UUID)
              </label>
              <input
                type="text"
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                placeholder="550e8400-e29b-41d4-a716-446655440000"
                className="w-full rounded-lg border-2 border-black px-4 py-3 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(enrichmentData).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={e =>
                      setEnrichmentData({
                        ...enrichmentData,
                        [key]: Number(e.target.value),
                      })
                    }
                    className="w-full rounded border-2 border-black px-2 py-1.5 text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              ))}
            </div>
          </div>

          <button onClick={testAPI} disabled={loading} className="cta-button w-full sm:w-auto">
            {loading ? 'Testing API...' : 'Test POST /api/contacts/confidence'}
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

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Basic badge (collapsed):</p>
              <ContactConfidenceBadge
                contactId={contactId || '550e8400-e29b-41d4-a716-446655440000'}
                contactEmail={contactEmail}
                showDetails={false}
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Badge with details (expanded):
              </p>
              <ContactConfidenceBadge
                contactId={contactId || '550e8400-e29b-41d4-a716-446655440000'}
                contactEmail={contactEmail}
                showDetails={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
