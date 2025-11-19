'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Zap, Terminal, Eye, Code2 } from 'lucide-react';

export default function TestWidget() {
  const [embedCode, setEmbedCode] = useState('');

  useEffect(() => {
    const code = `<!-- Quick Intel Widget -->
<script src="http://localhost:3005/widget.js"></script>
<div id="audio-intel-widget" data-api-url="http://localhost:3005"></div>`;
    setEmbedCode(code);
  }, []);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-cyan-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 7</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Quick Intel Widget</h1>
          <p className="mt-2 text-gray-600">
            Embeddable widget with 3 free enrichments for lead generation
          </p>
        </div>

        {/* Widget Demo Section */}
        <div className="glass-panel mb-6 border-cyan-500 bg-gradient-to-br from-cyan-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-cyan-600 p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Live Widget Demo</h2>
          </div>

          <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Test Embedded Widget</h3>
            <p className="mb-6 text-sm text-gray-600">
              Try the widget below - you get 3 free enrichments per session.
            </p>

            {/* Widget will be injected here */}
            <div id="audio-intel-widget" data-api-url="http://localhost:3005"></div>
          </div>

          <div className="mt-4 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Widget Features:</strong>
              <br />
              • Email + name input fields
              <br />
              • Real-time enrichment (Claude Haiku - fast + cheap)
              <br />
              • Results preview with confidence badge
              <br />
              • 3 free enrichments per session (localStorage tracking)
              <br />
              • Upgrade prompt after quota reached
              <br />• Analytics tracking (loads, enrichments, conversions)
            </p>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="glass-panel mb-6 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Embed Code</h2>
          </div>

          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border-2 border-black bg-gray-900 p-4 text-sm text-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {embedCode}
            </pre>
            <button
              onClick={copyEmbedCode}
              className="absolute right-2 top-2 rounded border-2 border-black bg-amber-500 px-3 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-amber-600"
            >
              Copy
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            Use this code to embed the widget on any website. Replace localhost:3005 with your
            production domain.
          </p>
        </div>

        {/* API Testing Section */}
        <div className="glass-panel mb-6 border-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Widget Backend APIs</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-2 font-bold text-gray-900">POST /api/enrich-lite</h3>
              <p className="mb-3 text-sm text-gray-600">
                Lightweight enrichment endpoint for widget (uses Claude Haiku)
              </p>
              <pre className="rounded border-2 border-gray-300 bg-gray-50 p-3 text-xs text-gray-700">
                {`{
  "email": "test@example.com",
  "name": "Test Contact",
  "sessionId": "widget-session-123"
}`}
              </pre>
            </div>

            <div className="rounded-xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-2 font-bold text-gray-900">POST /api/widget-track</h3>
              <p className="mb-3 text-sm text-gray-600">
                Widget analytics tracking (loads, enrichments, conversions)
              </p>
              <pre className="rounded border-2 border-gray-300 bg-gray-50 p-3 text-xs text-gray-700">
                {`{
  "sessionId": "widget-session-123",
  "eventType": "enrichment_attempt",
  "metadata": { ... }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Test Checklist */}
        <div className="glass-panel border-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-yellow-600 p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Widget Test Checklist</h2>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Widget loads on page without errors
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Email + name input fields appear and work
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Enrichment works (first attempt)
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Results preview shows with confidence badge
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Quota tracking works (3 free enrichments)
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              4th enrichment shows upgrade prompt
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              localStorage persists quota on refresh
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Analytics tracking fires to /api/widget-track
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Responsive design works on mobile
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-black" />
              Error handling for network failures
            </label>
          </div>
        </div>
      </div>

      {/* Load widget script */}
      <script src="http://localhost:3005/widget.js" async />
    </div>
  );
}
