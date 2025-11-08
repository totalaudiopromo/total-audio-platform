'use client';

import React, { useState } from 'react';
import { Download, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Sample contacts for testing
const sampleContacts = [
  {
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1 - UK National Broadcaster',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 - UK national broadcaster. Presenter of "Jack Saunders New Music" show. Genres: Alternative, Indie, Rock, Electronic. Key tastemaker for breaking new artists in the UK. Best contact time: Weekday mornings for submissions.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Clara Amfo',
    email: 'clara.amfo@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 mid-morning show presenter. Genres: Pop, R&B, Hip-Hop, UK artists. Champion of diverse new music. Focus on emerging UK talent.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Huw Stephens',
    email: 'huw.stephens@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC Radio 1',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC Radio 1 presenter specialising in new music discovery. Known for supporting emerging artists across all genres. Best contact: Evening shows.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Spotify Editorial Team',
    email: 'editorial@spotify.com',
    platform: 'Spotify',
    role: 'Playlist Curators',
    company: 'Spotify',
    researchConfidence: 'Medium',
    contactIntelligence:
      'Spotify editorial team managing major playlists including New Music Friday UK. Controls major playlists. Submit via Spotify for Artists platform. London office handles UK submissions.',
    lastResearched: new Date().toISOString(),
  },
  {
    name: 'Mary Anne Hobbs',
    email: 'maryanne.hobbs@bbc.co.uk',
    platform: 'BBC 6 Music',
    role: 'Presenter',
    company: 'BBC 6 Music',
    researchConfidence: 'High',
    contactIntelligence:
      'BBC 6 Music presenter specialising in electronic and experimental music. Highly influential tastemaker. Known for breaking new electronic artists.',
    lastResearched: new Date().toISOString(),
  },
];

export default function BrutalistPdfTestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setStatus(null);

    try {
      const response = await fetch('/api/export/brutalist-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: sampleContacts,
          whiteLabel: {
            companyName: 'Total Audio Promo',
            logoUrl: '/total-audio-dog-logo.png',
            primaryColor: '#3B82F6',
          },
          filename: 'audio-intel-brutalist-test.pdf',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = error.error || error.message || 'PDF generation failed';
        const errorDetails = error.details ? `\n\nDetails: ${error.details}` : '';
        throw new Error(`${errorMsg}${errorDetails}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'PDF generation failed');
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus({
        type: 'success',
        message: `PDF generated successfully! ${sampleContacts.length} contacts exported.`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
      const errorDetails = error instanceof Error && 'stack' in error ? error.stack : undefined;
      setStatus({
        type: 'error',
        message: `${errorMessage}${errorDetails ? ' - Check console for details' : ''}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">Brutalist PDF Export Test</h1>
          <p className="text-gray-600 font-bold text-lg">
            Test the new agency-quality brutalist PDF design
          </p>
        </div>

        {/* Info Card */}
        <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 bg-white">
          <h2 className="font-black text-2xl mb-4 text-black">What You'll See</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Bold black borders with rounded corners</strong> (polished brutalism)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Offset shadows</strong> (8px x 8px) on all cards
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Summary metrics</strong> in brutalist cards (Total, High, Medium)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Top platforms table</strong> with electric blue header
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Individual contact cards</strong> with intelligence data
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black text-blue-600">✓</span>
              <span>
                <strong>Total Audio Promo branding</strong> with your logo
              </span>
            </li>
          </ul>
        </div>

        {/* Sample Data Preview */}
        <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 bg-white">
          <h2 className="font-black text-2xl mb-4 text-black">
            Sample Contacts ({sampleContacts.length})
          </h2>
          <div className="space-y-3">
            {sampleContacts.map((contact, idx) => (
              <div key={idx} className="border-2 border-gray-300 p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-bold text-black">{contact.name}</p>
                    <p className="text-sm text-blue-600">{contact.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-black border border-black ${
                      contact.researchConfidence === 'High'
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {contact.researchConfidence}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{contact.platform}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 bg-white">
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Generate Brutalist PDF</span>
              </>
            )}
          </button>

          {/* Status Message */}
          {status && (
            <div
              className={`mt-4 p-4 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}
        </div>

        {/* Design Notes */}
        <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300 rounded">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This PDF uses Playwright for server-side generation. The first
            generation may take a few seconds while the browser initializes. Subsequent generations
            will be faster.
          </p>
        </div>
      </div>
    </div>
  );
}
