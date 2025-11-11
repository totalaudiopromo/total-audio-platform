'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2 } from 'lucide-react';
import WebSearchEnrichmentIndicator from '../WebSearchEnrichmentIndicator';

type DemoContact = {
  email: string;
  name: string;
  role: string;
  platform: string;
  confidence: string;
  notes: string;
};

const libertyDemoContacts: DemoContact[] = [
  {
    email: 'annie.mac@bbc.co.uk',
    name: 'Annie Mac',
    role: 'Radio Presenter / DJ',
    platform: 'BBC Radio 2 (formerly Radio 1)',
    confidence: 'High',
    notes:
      'Legendary BBC Radio 1 dance music presenter, now hosting on Radio 2. Known for championing underground house and electronic music. Peak listening 7-9pm Fridays. Submit via BBC Music Introducing or management. Highly selective - only quality electronic productions.',
  },
  {
    email: 'danny.howard@bbc.co.uk',
    name: 'Danny Howard',
    role: 'Radio Presenter / DJ',
    platform: 'BBC Radio 1',
    confidence: 'High',
    notes:
      'BBC Radio 1 Dance presenter. Friday night 7-9pm slot focused on house, techno, and electronic music. Strong support for underground and emerging house producers. Submissions via BBC Music Introducing.',
  },
  {
    email: 'mistajam@bbc.co.uk',
    name: 'MistaJam',
    role: 'Radio Presenter',
    platform: 'BBC Radio 1Xtra',
    confidence: 'High',
    notes:
      'Now at Capital Xtra but previously BBC. Covers hip-hop, grime, and bass music. Known for championing new artists early. Prefers SoundCloud links and direct email pitches.',
  },
  {
    email: 'editors@spotify.com',
    name: 'Spotify Editorial Team',
    role: 'Playlist Curators',
    platform: 'Spotify',
    confidence: 'Medium',
    notes:
      'Submit via Spotify for Artists only. Focus on genre-specific playlists: "New Music Friday UK", "Mint", "Hot Hits UK". Requires 4-week lead time before release date.',
  },
  {
    email: 'pete.tong@bbc.co.uk',
    name: 'Pete Tong',
    role: 'Radio Presenter / DJ',
    platform: 'BBC Radio 1',
    confidence: 'High',
    notes:
      'Legendary BBC Radio 1 dance music presenter. Friday nights 8-10pm. Essential Selection feature for breakthrough house and electronic tracks. Very selective - only send your absolute best work.',
  },
];

export function HeroDemo() {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [demoEmail, setDemoEmail] = useState(libertyDemoContacts[0].email);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoContact | null>(null);
  const [enrichmentTime, setEnrichmentTime] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [webSearchUsed, setWebSearchUsed] = useState(false);
  const [confidenceImproved, setConfidenceImproved] = useState<
    { before: 'Low' | 'Medium' | 'High'; after: 'Low' | 'Medium' | 'High' } | undefined
  >();

  const handleDemoEnrich = async () => {
    setDemoLoading(true);
    setDemoResult(null);
    setEnrichmentTime(null);
    setIsSearching(false);
    setWebSearchUsed(false);
    setConfidenceImproved(undefined);

    const startTime = Date.now();

    // Find the demo contact or extract name from email
    const demoContact = libertyDemoContacts.find(c => c.email === demoEmail);

    // Extract name from email if not in demo contacts
    const extractNameFromEmail = (email: string): string => {
      if (!email || !email.includes('@')) return email;
      const localPart = email.split('@')[0];
      return localPart
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const contactName = demoContact?.name || extractNameFromEmail(demoEmail);

    try {
      // Call the real Claude enrichment API
      const response = await fetch('/api/enrich-claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: [
            {
              email: demoEmail,
              name: contactName,
              genre: 'electronic', // Default genre for demo
              region: 'UK',
            },
          ],
        }),
      });

      const data = await response.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log('Enrichment API Response:', data);
      console.log(`Enrichment completed in ${elapsed}s`);

      if (data.success && data.enriched && data.enriched.length > 0) {
        const enrichedContact = data.enriched[0];

        // If enrichment returned empty data, use fallback
        if (
          !enrichedContact.intelligence ||
          enrichedContact.intelligence.trim() === '' ||
          enrichedContact.intelligence.includes('No intelligence found')
        ) {
          console.warn('Empty enrichment data, using fallback');
          if (demoContact) {
            setDemoResult(demoContact);
          } else {
            // Show minimal result if no demo contact available
            setDemoResult({
              email: demoEmail,
              name: contactName,
              role: 'Unknown',
              platform: 'Unknown',
              confidence: 'Low',
              notes: 'No intelligence found for this contact',
            });
          }
          setEnrichmentTime(elapsed);
          return;
        }

        // Check if web search was used
        if (enrichedContact.source === 'claude-with-search') {
          setWebSearchUsed(true);
          // If we have the original confidence, show improvement
          if (data.originalConfidence) {
            setConfidenceImproved({
              before: data.originalConfidence as 'Low' | 'Medium' | 'High',
              after: enrichedContact.confidence as 'Low' | 'Medium' | 'High',
            });
          }
        }

        // Transform API response to display format
        const result: DemoContact = {
          email: demoEmail,
          name: enrichedContact.name || contactName,
          role: extractRole(enrichedContact.intelligence) || enrichedContact.role || 'Unknown',
          platform:
            extractPlatform(enrichedContact.intelligence) || enrichedContact.platform || 'Unknown',
          confidence: enrichedContact.confidence || 'Medium',
          notes: enrichedContact.intelligence || 'No intelligence available',
        };

        setDemoResult(result);
        setEnrichmentTime(elapsed);
      } else {
        // Fallback if API fails silently
        console.warn('API enrichment failed, showing minimal result');
        if (demoContact) {
          setDemoResult(demoContact);
        } else {
          setDemoResult({
            email: demoEmail,
            name: contactName,
            role: 'Unknown',
            platform: 'Unknown',
            confidence: 'Low',
            notes: 'Enrichment failed - please try again',
          });
        }
        setEnrichmentTime(elapsed);
      }
    } catch (error) {
      // Silent fallback on error
      console.error('Enrichment API error:', error);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      if (demoContact) {
        setDemoResult(demoContact);
      } else {
        setDemoResult({
          email: demoEmail,
          name: contactName,
          role: 'Unknown',
          platform: 'Unknown',
          confidence: 'Low',
          notes: 'API error - please try again',
        });
      }
      setEnrichmentTime(elapsed);
    } finally {
      setDemoLoading(false);
    }
  };

  // Helper function to extract role from intelligence text
  const extractRole = (intelligence: string): string | null => {
    if (!intelligence) return null;
    const roleMatch = intelligence.match(/(?:Role|Position|Title):\s*([^\n.]+)/i);
    return roleMatch ? roleMatch[1].trim() : null;
  };

  // Helper function to extract platform from intelligence text
  const extractPlatform = (intelligence: string): string | null => {
    if (!intelligence) return null;
    const platformMatch = intelligence.match(/(?:Platform|Station|Network):\s*([^\n.]+)/i);
    return platformMatch ? platformMatch[1].trim() : null;
  };

  const cycleDemo = () => {
    const nextIndex = (currentDemoIndex + 1) % libertyDemoContacts.length;
    setCurrentDemoIndex(nextIndex);
    setDemoEmail(libertyDemoContacts[nextIndex].email);
    setDemoResult(null);
    setEnrichmentTime(null);
  };

  return (
    <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Turn chaotic spreadsheets into
            <span className="block text-blue-600">organised contact intelligence</span>
          </h1>
          <p className="max-w-xl text-base text-gray-600 sm:text-lg">
            Audio Intel uses AI to enrich your contact lists with detailed music industry profiles.
            Upload emails, get back submission guidelines and pitch-ready intelligence. Export to
            use anywhere.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/pricing?plan=professional&billing=monthly" className="cta-button">
              Get my free trial →
            </Link>
            <Link href="#how-it-works" className="subtle-button">
              Show me how it works
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            For artists, managers, and promoters who need organised contact data
          </p>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div className="glass-panel bg-gradient-to-br from-blue-50 to-white px-8 py-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">
                <Sparkles className="h-3 w-3" />
                Live Demo
              </div>
              <h2 className="mt-4 text-2xl font-bold">See It In Action</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Email:</label>
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={event => setDemoEmail(event.target.value)}
                    className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-medium"
                    placeholder="contact@example.com"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDemoEnrich}
                    disabled={demoLoading}
                    className="cta-button flex-1 disabled:opacity-50"
                  >
                    {demoLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enriching...
                      </span>
                    ) : (
                      'Enrich Contact'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cycleDemo}
                    disabled={demoLoading}
                    className="subtle-button flex-1 sm:flex-initial disabled:opacity-50"
                    title="Try different example"
                  >
                    Try Another →
                  </button>
                </div>

                {/* Web Search Enrichment Indicator */}
                {(isSearching || webSearchUsed) && (
                  <div className="mt-4">
                    <WebSearchEnrichmentIndicator
                      isSearching={isSearching}
                      searchQuota={{
                        used: 0,
                        limit: 100,
                        remaining: 100,
                      }}
                      recentSearches={webSearchUsed ? 1 : 0}
                      confidenceImproved={confidenceImproved}
                    />
                  </div>
                )}

                {demoLoading && (
                  <div className="mt-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <p className="font-medium text-blue-900">Enriching contact...</p>
                    </div>
                  </div>
                )}
                {demoResult && !demoLoading && (
                  <div className="mt-4 rounded-lg border-2 border-green-500 bg-green-50 p-5 text-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold text-green-900">{demoResult.name}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-700">
                          {demoResult.role} · {demoResult.platform}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                          demoResult.confidence === 'High'
                            ? 'bg-green-500'
                            : demoResult.confidence === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {demoResult.confidence}
                      </span>
                    </div>

                    {/* Condensed Key Intelligence */}
                    <div className="mt-3 space-y-2 border-t border-green-200 pt-3">
                      {demoResult.notes &&
                        (() => {
                          const lines = demoResult.notes.split('\n').filter(line => line.trim());
                          const keyFields = [
                            'Platform:',
                            'Role:',
                            'Format:',
                            'Contact Method:',
                            'Best Timing:',
                            'Genres:',
                          ];
                          const keyLines = lines
                            .filter(line => keyFields.some(field => line.startsWith(field)))
                            .slice(0, 6); // Show max 6 key fields

                          return keyLines.length > 0 ? (
                            <div className="grid gap-1.5">
                              {keyLines.map((line, idx) => {
                                const [label, ...valueParts] = line.split(':');
                                const value = valueParts.join(':').trim();
                                return (
                                  <div key={idx} className="flex text-xs">
                                    <span className="font-semibold text-green-800 min-w-[80px] sm:min-w-[100px]">
                                      {label}:
                                    </span>
                                    <span className="text-gray-700 flex-1">{value}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-600">No additional details available</p>
                          );
                        })()}
                    </div>

                    {enrichmentTime && (
                      <p className="mt-3 border-t border-green-200 pt-2 text-xs text-gray-500">
                        ✓ Enriched in {enrichmentTime}s using AI
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-lg border border-blue-600/30 bg-blue-600/10 px-4 py-3">
                <p className="text-sm font-medium text-blue-900">
                  <strong>Try it yourself:</strong> Enter any music industry contact email above
                  (BBC Radio 1 DJs, Spotify curators, independent labels, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
