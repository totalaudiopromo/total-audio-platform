'use client';

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
    email: "greg.james@bbc.co.uk",
    name: "Greg James",
    role: "Radio Presenter",
    platform: "BBC Radio 1",
    confidence: "High",
    notes:
      'BBC Radio 1 Breakfast Show host. Covers house, pop, and electronic music. Peak listening time 6:30-10am. Accepts submissions via official BBC form with 3-week lead time.',
  },
  {
    email: "danny.howard@bbc.co.uk",
    name: "Danny Howard",
    role: "Radio Presenter / DJ",
    platform: "BBC Radio 1",
    confidence: "High",
    notes:
      "BBC Radio 1 Dance presenter. Friday night 7-9pm slot focused on house, techno, and electronic music. Strong support for underground and emerging house producers. Submissions via BBC Music Introducing.",
  },
  {
    email: "mistajam@bbc.co.uk",
    name: "MistaJam",
    role: "Radio Presenter",
    platform: "BBC Radio 1Xtra",
    confidence: "High",
    notes:
      "Now at Capital Xtra but previously BBC. Covers hip-hop, grime, and bass music. Known for championing new artists early. Prefers SoundCloud links and direct email pitches.",
  },
  {
    email: "editors@spotify.com",
    name: "Spotify Editorial Team",
    role: "Playlist Curators",
    platform: "Spotify",
    confidence: "Medium",
    notes:
      'Submit via Spotify for Artists only. Focus on genre-specific playlists: "New Music Friday UK", "Mint", "Hot Hits UK". Requires 4-week lead time before release date.',
  },
  {
    email: "pete.tong@bbc.co.uk",
    name: "Pete Tong",
    role: "Radio Presenter / DJ",
    platform: "BBC Radio 1",
    confidence: "High",
    notes:
      "Legendary BBC Radio 1 dance music presenter. Friday nights 8-10pm. Essential Selection feature for breakthrough house and electronic tracks. Very selective - only send your absolute best work.",
  },
];

export function HeroDemo() {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [demoEmail, setDemoEmail] = useState(libertyDemoContacts[0].email);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoContact | null>(null);

  const handleDemoEnrich = () => {
    setDemoLoading(true);
    setDemoResult(null);

    const contact =
      libertyDemoContacts.find((c) => c.email === demoEmail) ??
      libertyDemoContacts[0];

    setTimeout(() => {
      setDemoResult(contact);
      setDemoLoading(false);
    }, 2000);
  };

  const cycleDemo = () => {
    const nextIndex = (currentDemoIndex + 1) % libertyDemoContacts.length;
    setCurrentDemoIndex(nextIndex);
    setDemoEmail(libertyDemoContacts[nextIndex].email);
    setDemoResult(null);
  };

  return (
    <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Turn chaotic spreadsheets into
            <span className="block text-blue-600">
              organised contact intelligence
            </span>
          </h1>
          <p className="max-w-xl text-base text-gray-600 sm:text-lg">
            Audio Intel uses AI to enrich your contact lists with detailed music
            industry profiles. Upload emails, get back submission guidelines and
            pitch-ready intelligence. Export to use anywhere.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing?plan=professional&billing=monthly"
              className="cta-button"
            >
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
                  <label className="text-sm font-medium text-gray-700">
                    Contact Email:
                  </label>
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={(event) => setDemoEmail(event.target.value)}
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
                    className="cta-button flex-1"
                  >
                    {demoLoading ? "Enriching..." : "Enrich Contact"}
                  </button>
                  <button
                    type="button"
                    onClick={cycleDemo}
                    disabled={demoLoading}
                    className="subtle-button flex-1 sm:flex-initial"
                    title="Try different example"
                  >
                    Try Another →
                  </button>
                </div>
                {demoResult && (
                  <div className="mt-4 rounded-lg border-2 border-green-500 bg-green-50 p-4 text-sm">
                    <div className="mb-2 flex items-start justify-between">
                      <p className="font-bold text-green-900">
                        {demoResult.name}
                      </p>
                      <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                        {demoResult.confidence} Confidence
                      </span>
                    </div>
                    <p className="font-medium text-gray-700">
                      {demoResult.role} · {demoResult.platform}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-gray-600">
                      {demoResult.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-lg border border-blue-600/30 bg-blue-600/10 px-4 py-3">
                <p className="text-sm font-medium text-blue-900">
                  <strong>Real data from radio campaigns.</strong> Try BBC Radio 1
                  DJs, Spotify curators, or your own contacts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
