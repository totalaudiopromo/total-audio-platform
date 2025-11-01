import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title:
    'Complete Music Promotion Workflow: Intel → Pitch → Track | Total Audio Guide',
  description:
    'The complete workflow for running professional music promotion campaigns. Enrich contacts with Audio Intel, generate pitches with Pitch Generator, track results with Tracker.',
  keywords:
    'music promotion workflow, campaign management, radio promotion process, playlist pitching guide, music PR workflow',
  alternates: {
    canonical:
      'https://tracker.totalaudiopromo.com/blog/complete-music-promotion-workflow',
    languages: {
      'en-GB':
        'https://tracker.totalaudiopromo.com/blog/complete-music-promotion-workflow',
    },
  },
  openGraph: {
    title: 'Complete Music Promotion Workflow: Intel → Pitch → Track',
    description:
      'The complete workflow for running professional music promotion campaigns from contact research to tracking results.',
    url: 'https://tracker.totalaudiopromo.com/blog/complete-music-promotion-workflow',
  },
};

export default function CompleteWorkflowGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-brutal">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline mb-4"
          >
            ← Back to Blog
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl border-4 border-black shadow-brutal-lg p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
                Workflow Guide
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                Featured
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              The Complete Music Promotion Workflow: Intel → Pitch → Track
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stop wasting weeks researching contacts, writing pitches, and
              tracking campaigns manually. Here's the professional workflow that
              saves 20+ hours per campaign.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-6">
              <span className="font-semibold">Chris Schofield</span>
              <span>•</span>
              <span>12 min read</span>
              <span>•</span>
              <span>Updated October 2025</span>
            </div>
          </div>

          {/* The Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              The Problem with Traditional Promotion
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Running a music promotion campaign traditionally means:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span className="text-gray-700">
                  <strong>15+ hours</strong> researching contacts, finding
                  emails, checking submission guidelines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span className="text-gray-700">
                  <strong>10+ hours</strong> writing personalized pitches for
                  radio, playlists, blogs, and press
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span className="text-gray-700">
                  <strong>20+ hours</strong> updating spreadsheets, tracking
                  responses, chasing follow-ups
                </span>
              </li>
            </ul>
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <p className="text-lg font-bold text-red-900 mb-2">
                That's 45+ hours of admin per campaign.
              </p>
              <p className="text-gray-700">
                Time you could spend creating music, performing, or actually
                promoting.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              The Professional Workflow
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Total Audio Promo breaks music promotion into three focused steps,
              each with a specialised tool:
            </p>

            {/* Step 1: Audio Intel */}
            <div className="mb-10 bg-gradient-to-br from-teal-50 to-indigo-50 rounded-2xl border-4 border-black shadow-brutal p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-black flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Enrich Your Contacts with Audio Intel
                  </h3>
                  <p className="text-teal-600 font-bold">
                    15 hours → 15 minutes
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Upload your messy spreadsheet of radio stations, playlist
                curators, blogs, or press contacts. Audio Intel automatically
                enriches each contact with:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Verified email addresses and submission forms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Genre preferences and submission guidelines
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Social media profiles and recent activity
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Best time to contact and response rates
                  </span>
                </li>
              </ul>

              <div className="bg-white rounded-lg border-2 border-teal-600 p-4 mb-4">
                <p className="font-bold text-gray-900 mb-2">Real Example:</p>
                <p className="text-sm text-gray-700">
                  "I uploaded 50 BBC Radio contacts. Audio Intel found verified
                  emails for 48 of them, submission guidelines for 42, and
                  flagged 6 that had changed shows. Saved me 2 full days of
                  research."
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  — Radio promoter, Brighton
                </p>
              </div>

              <Link
                href="https://intel.totalaudiopromo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Try Audio Intel Free →
              </Link>
            </div>

            {/* Step 2: Pitch Generator */}
            <div className="mb-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-4 border-black shadow-brutal p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-black flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Generate Pitches with Pitch Generator
                  </h3>
                  <p className="text-green-600 font-bold">
                    10 hours → 10 minutes
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Now you have enriched contacts. Time to pitch them. Pitch
                Generator creates personalized, professional pitches for every
                contact type:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Radio show pitches (BBC, commercial, community)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Playlist curator pitches (Spotify, Apple Music, Deezer)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Music blog and press pitches
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Follow-up messages and thank-yous
                  </span>
                </li>
              </ul>

              <div className="bg-white rounded-lg border-2 border-green-600 p-4 mb-4">
                <p className="font-bold text-gray-900 mb-2">Real Example:</p>
                <p className="text-sm text-gray-700">
                  "I needed 40 personalized pitches for BBC Radio 6 Music shows.
                  Pitch Generator created all of them in 8 minutes, each one
                  tailored to the show's genre and recent playlists. Got 6
                  plays."
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  — Electronic artist, London
                </p>
              </div>

              <Link
                href="https://pitch.totalaudiopromo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Try Pitch Generator Free →
              </Link>
            </div>

            {/* Step 3: Tracker */}
            <div className="mb-10 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl border-4 border-black shadow-brutal p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-black flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Track Results with Tracker
                  </h3>
                  <p className="text-indigo-600 font-bold">
                    20 hours → 5 minutes per week
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Pitches sent. Now track what's working. Tracker gives you
                AI-powered campaign intelligence:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Track responses across radio, playlists, blogs, press
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Industry benchmarks - is 12% response rate good? (Yes, it
                    is)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    AI Campaign Intelligence - what to do next, with draft
                    emails
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    Pattern recognition - spot what's working across campaigns
                  </span>
                </li>
              </ul>

              <div className="bg-white rounded-lg border-2 border-indigo-600 p-4 mb-4">
                <p className="font-bold text-gray-900 mb-2">Real Example:</p>
                <p className="text-sm text-gray-700">
                  "Tracker showed me my BBC Introducing response rate was 14% -
                  way above the 8-12% benchmark. AI suggested doubling down on
                  regional shows. Next campaign: 22% response rate."
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  — Unsigned artist, Manchester
                </p>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Try Tracker Free →
              </Link>
            </div>
          </section>

          {/* The Complete Workflow */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Complete Campaign Timeline
            </h2>
            <div className="bg-gray-50 rounded-xl border-2 border-gray-300 p-6">
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-gray-900 mb-2">
                    Week 1: Research & Enrichment (15 minutes)
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Upload contact spreadsheet to Audio Intel</li>
                    <li>• Review enriched contacts, remove invalid ones</li>
                    <li>• Export organized database</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-gray-900 mb-2">
                    Week 1-2: Pitching (10 minutes)
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>
                      • Generate personalized pitches with Pitch Generator
                    </li>
                    <li>• Review and customize top-priority pitches</li>
                    <li>• Send campaigns via email or submission forms</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-gray-900 mb-2">
                    Week 2-6: Tracking & Follow-ups (5 mins/week)
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Log responses in Tracker as they come in</li>
                    <li>• Check Campaign Intelligence AI for next moves</li>
                    <li>
                      • Send AI-generated follow-ups to interested contacts
                    </li>
                    <li>• Compare performance to industry benchmarks</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <p className="font-bold text-gray-900 text-lg">
                    Total time: ~1.5 hours
                  </p>
                  <p className="text-gray-600 text-sm">
                    (vs 45+ hours traditionally)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Real Results */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Real Campaign Results
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Radio Campaign
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>50 BBC Radio contacts</strong> enriched in 15 mins
                  </li>
                  <li>
                    • <strong>48 personalized pitches</strong> generated in 10
                    mins
                  </li>
                  <li>
                    • <strong>18% response rate</strong> (vs 11-18% benchmark)
                  </li>
                  <li>
                    • <strong>8 confirmed plays</strong> tracked with AI
                    insights
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Playlist Campaign
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    • <strong>75 Spotify curators</strong> enriched in 20 mins
                  </li>
                  <li>
                    • <strong>75 personalized pitches</strong> generated in 12
                    mins
                  </li>
                  <li>
                    • <strong>24% response rate</strong> (vs 18-28% benchmark)
                  </li>
                  <li>
                    • <strong>12 playlist adds</strong> tracked with performance
                    data
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Get Started */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Start Your First Campaign
            </h2>
            <div className="bg-gradient-to-r from-teal-600 to-indigo-600 rounded-2xl border-4 border-black shadow-brutal-lg p-8 text-white">
              <p className="text-xl font-bold mb-4">
                All three tools are free to start:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">→</span>
                  <span>
                    <strong>Audio Intel:</strong> 10 free contact enrichments
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">→</span>
                  <span>
                    <strong>Pitch Generator:</strong> 5 free pitches
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">→</span>
                  <span>
                    <strong>Tracker:</strong> 3 free campaigns
                  </span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://intel.totalaudiopromo.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-teal-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Start with Audio Intel →
                </a>
                <Link
                  href="/blog"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  Read More Guides
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 Total Audio Promo • Brighton, UK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
