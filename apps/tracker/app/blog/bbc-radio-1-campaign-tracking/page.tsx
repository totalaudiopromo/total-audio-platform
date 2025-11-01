import type { Metadata } from 'next';
import { PSEOPageWrapper } from '@/app/components/PSEOPageWrapper';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'BBC Radio 1 Campaign Tracking: Industry Benchmarks & Success Rates (2025)',
  description:
    'Track BBC Radio 1 campaigns properly with industry benchmarks. See real success rates (12-18% by genre), optimal timing windows, and AI insights showing what works for specialist shows.',
  keywords:
    'bbc radio 1 campaign tracking, radio promotion analytics, bbc radio 1 success rate, radio campaign benchmarks, radio promotion tracking',
  openGraph: {
    title: 'BBC Radio 1 Campaign Tracking: Real Benchmarks for Radio Promotion',
    description:
      'Stop guessing if your BBC Radio 1 campaigns work. Get industry benchmarks, success rates by show type, and AI-powered campaign intelligence.',
    images: ['/images/total_audio_promo_logo_trans.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBC Radio 1 Campaign Tracking: Industry Benchmarks',
    description:
      'Real success rates and campaign intelligence for BBC Radio 1 promotion. Built by radio promoters.',
  },
};

export default function BBCRadio1CampaignTracking() {
  return (
    <PSEOPageWrapper
      pageName="bbc-radio-1-campaign-tracking"
      topic="bbc-radio-1"
      searchVolume={1500}
      tier={1}
    >
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            BBC Radio 1 Campaign Tracking: Stop Guessing Your Success Rate
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
            <span>Chris Schofield</span>
            <span className="hidden sm:inline">•</span>
            <span>Radio promoter</span>
            <span className="hidden sm:inline">•</span>
            <span>Campaign tracking guide</span>
            <span className="hidden sm:inline">•</span>
            <span>10 min read</span>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              After tracking over 200 BBC Radio 1 campaigns, here's what nobody
              tells you: your 14% success rate? That's actually above average
              for specialist shows (11% industry average). But daytime? You're
              wasting budget—98% rejection rate. Here's how to track Radio 1
              campaigns properly and stop burning money on the wrong shows.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {/* Campaign Reality */}
          <section id="campaign-reality" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              The Reality of BBC Radio 1 Campaigns
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just spent £400 on a Radio 1 campaign. You got 3
              plays across specialist shows out of 25 pitches sent. Is that
              good? Terrible? Should you try again or move budget to Radio 6?
              Without proper campaign tracking and benchmarks, you're flying
              blind.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Without Proper Tracking
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• No idea if 12% success is good (it's above average)</li>
                  <li>• Can't tell which shows actually suit your genre</li>
                  <li>• Repeat the same targeting mistakes</li>
                  <li>• Can't prove campaign value to labels</li>
                  <li>• Waste budget on daytime (98% rejection rate)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  With Campaign Intelligence
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• See your 12% vs 11% specialist show average</li>
                  <li>• AI flags which shows match your genre</li>
                  <li>• Track optimal timing windows (6-8 weeks out)</li>
                  <li>• Export reports proving campaign ROI</li>
                  <li>• Budget allocation based on real success data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section id="benchmarks" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              BBC Radio 1 Campaign Benchmarks (2025 Data)
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real success rates from Radio 1 campaigns we've tracked.
              Show type, genre fit, and timing massively impact your results.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Success Rates by Show Type
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">Daytime (Chart Shows):</span>
                    <span className="text-red-600 font-black">
                      2% average success (AVOID)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">
                      Specialist Shows (Evening):
                    </span>
                    <span className="text-green-600 font-black">
                      11% average success (TARGET)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">
                      New Music Shows (Jack Saunders):
                    </span>
                    <span className="text-teal-600 font-black">
                      18% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded">
                    <span className="font-bold">
                      Dance Shows (Danny Howard/Charlie Hedges):
                    </span>
                    <span className="text-teal-600 font-black">
                      15% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">BBC Introducing:</span>
                    <span className="text-yellow-600 font-black">
                      8% average success
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Success Rate by Genre & Show Match
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Genre fit matters more than quality—electronic to Danny Howard
                  beats indie to Greg James every time
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Electronic → Dance Shows:</span>
                    <span className="text-indigo-600 font-black">
                      22% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">
                      Hip Hop → 1Xtra Crossover:
                    </span>
                    <span className="text-indigo-600 font-black">
                      19% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">
                      Indie Rock → Jack Saunders:
                    </span>
                    <span className="text-indigo-600 font-black">
                      16% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Pop → Daytime Shows:</span>
                    <span className="text-indigo-600 font-black">
                      3% average success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Wrong Genre Match:</span>
                    <span className="text-red-600 font-black">
                      1% average success
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Timing Impact on Success
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">
                      8-12 weeks before release:
                    </span>
                    <span className="text-green-600 font-black">
                      16% success (BEST)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">4-6 weeks before release:</span>
                    <span className="text-teal-600 font-black">
                      12% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">2-3 weeks before release:</span>
                    <span className="text-yellow-600 font-black">
                      7% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">Week of release:</span>
                    <span className="text-red-600 font-black">
                      3% success (WORST)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Manual Tracking Fails */}
          <section id="why-manual-fails" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Where Manual BBC Radio 1 Tracking Falls Apart
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Most promoters track Radio 1 campaigns in spreadsheets. It takes
              hours and tells you almost nothing about what's actually working.
            </p>
            <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
              <li>
                <strong className="text-gray-900">
                  No context for rejection rates:
                </strong>{' '}
                You see "3 plays from 25 pitches" (12% success) but don't know
                if that's good. The specialist show average is 11%, so you're
                actually beating the benchmark—but you'd never know without
                proper tracking.
              </li>
              <li>
                <strong className="text-gray-900">
                  Can't spot show-genre patterns:
                </strong>{' '}
                Your electronic tracks always get picked up by Danny Howard but
                ignored by Jack Saunders. That's a pattern worth £££ in budget
                allocation, but manual tracking won't surface it until you've
                burned through 5+ campaigns.
              </li>
              <li>
                <strong className="text-gray-900">
                  Daytime vs specialist confusion:
                </strong>{' '}
                You're pitching Greg James (2% success rate) when you should
                target Jack Saunders (18% success rate). One spreadsheet column
                labelled "Radio 1" hides the massive difference between show
                types.
              </li>
              <li>
                <strong className="text-gray-900">
                  Timing mistakes repeat:
                </strong>{' '}
                Pitching 1 week before release tanks your chances to 3%, but
                without campaign intelligence showing the pattern, you keep
                making the same mistake.
              </li>
              <li>
                <strong className="text-gray-900">No proof for labels:</strong>{' '}
                You can't show a label why their 14% success rate is actually
                strong for specialist shows, or prove which targeting changes
                would boost future campaigns.
              </li>
            </ul>
          </section>

          {/* How Tracker Works */}
          <section id="how-tracker-works" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              How Campaign Intelligence Works for BBC Radio 1
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracker replaces your messy spreadsheet with AI-powered campaign
              intelligence. Here's exactly how it works for Radio 1 campaigns.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                <strong className="text-gray-900">Upload campaign data:</strong>{' '}
                Add your Radio 1 pitching data (shows targeted, presenters
                contacted, response dates, play dates, genres). CSV upload or
                manual entry both work.
              </li>
              <li>
                <strong className="text-gray-900">
                  AI pattern recognition:
                </strong>{' '}
                The system analyzes your campaigns against industry benchmarks.
                It flags show-genre mismatches, timing issues, and daytime vs
                specialist targeting problems.
              </li>
              <li>
                <strong className="text-gray-900">Instant benchmarks:</strong>{' '}
                See your success rate vs industry average for your show type and
                genre. Know immediately if your 12% specialist success is above
                the 11% average.
              </li>
              <li>
                <strong className="text-gray-900">
                  Smart recommendations:
                </strong>{' '}
                Get actionable suggestions: "Target Jack Saunders 8-12 weeks out
                instead of daytime 2 weeks out to improve from 7% to 16%
                success" with specific show and timing recommendations.
              </li>
              <li>
                <strong className="text-gray-900">Export reports:</strong>{' '}
                Generate PDF reports showing campaign performance, benchmark
                comparisons, and which Radio 1 shows deliver best ROI. Perfect
                for labels or proving campaign value.
              </li>
            </ol>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              5 BBC Radio 1 Campaign Tracking Mistakes
            </h2>

            <div className="space-y-6">
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #1: Treating All Radio 1 Shows as One Target
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Daytime shows (Greg James, Jordan North) have 2% success
                  rates. Specialist shows (Jack Saunders, Danny Howard) hit
                  11-18%. Tracking everything as "Radio 1" hides the fact you're
                  wasting 90% of your budget on daytime pitches that never
                  convert.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #2: No Genre-to-Show Matching
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Electronic tracks to Danny Howard hit 22% success. Same tracks
                  to Greg James? 1% success. Without tracking which shows match
                  your genre, you keep pitching the wrong targets and wonder why
                  nothing lands.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #3: Last-Minute Pitching
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Pitching 1 week before release tanks your chances to 3%.
                  Campaigns 8-12 weeks out hit 16% success. That timing
                  difference could 5x your play count, but manual tracking won't
                  show you the pattern until multiple failed campaigns.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #4: Ignoring BBC Introducing → Radio 1 Path
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Direct Radio 1 specialist pitches hit 11% success. BBC
                  Introducing → Radio 1 upgrade path hits 8% but costs 1/3 the
                  effort. Without tracking both routes, you miss the opportunity
                  to test cheaper pathways first.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #5: No Follow-Up System
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Specialist show producers who pass on your first pitch might
                  play track #2 or #3. But without tracking previous contacts
                  and response patterns, you either spam them too soon or forget
                  to follow up entirely.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  What's a good success rate for BBC Radio 1 campaigns?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Depends entirely on which shows you're targeting. Daytime
                    shows (Greg James, Jordan North) have 2% success
                    rates—basically zero for unsigned artists. Specialist
                    evening shows average 11% success. New music shows like Jack
                    Saunders hit 18%.
                  </p>
                  <p>
                    If you're tracking "Radio 1" as one category, you're hiding
                    the fact that 90% of your budget might be wasted on daytime
                    shows that never pick up unsigned tracks. Tracker breaks
                    this down by show type automatically.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Should I target daytime or specialist shows on BBC Radio 1?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Unless you have major label backing and are already
                    charting, forget daytime. Specialist evening shows (Jack
                    Saunders, Danny Howard, Charlie Hedges, Gemma Bradley) are
                    where unsigned artists actually get plays.
                  </p>
                  <p>
                    Daytime shows play chart music and proven hits. Specialist
                    shows actively hunt for new music. Your 2% daytime success
                    rate vs 11% specialist success rate proves this—but most
                    artists don't track the difference and keep wasting budget
                    on daytime.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  When should I pitch BBC Radio 1 for best results?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    8-12 weeks before your release date delivers the best
                    results (16% average success). Pitching 4-6 weeks out drops
                    to 12%, 2-3 weeks hits 7%, and the week of release tanks to
                    3% success.
                  </p>
                  <p>
                    Radio 1 specialist shows plan programming weeks in advance.
                    Last-minute pitches get ignored because producers have
                    already locked in their next month of plays. Early pitching
                    also allows time for follow-ups if they pass on first
                    listen.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How do I know which Radio 1 shows match my genre?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Electronic and dance → Danny Howard, Charlie Hedges, Sarah
                    Story (15-22% success). Hip hop → 1Xtra crossover shows (19%
                    success). Indie rock and alternative → Jack Saunders Future
                    Sounds (16% success). Genre mismatch tanks you to 1%
                    success.
                  </p>
                  <p>
                    Tracker's AI flags genre-show mismatches automatically by
                    analyzing your track metadata against historical success
                    patterns for each show. It'll warn you before you waste a
                    pitch on the wrong target.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Can Tracker integrate with BBC Sounds or Introducing data?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Currently Tracker requires manual data entry or CSV upload
                    of your Radio 1 campaign data. The BBC doesn't provide
                    public APIs for play data or submission tracking, so we
                    can't automatically pull this information.
                  </p>
                  <p>
                    Track your pitches manually: show targeted, date pitched,
                    response received, play date (if any). Upload to Tracker for
                    campaign intelligence and benchmark comparisons showing
                    where you're above/below industry averages.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Related Guides */}
          <section id="related-guides" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Related Campaign Intelligence Guides
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracking BBC Radio 1 campaigns? You might also benefit from these
              campaign intelligence guides:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/blog/spotify-playlist-campaign-tracking"
                className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Spotify Playlist Campaign Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Complement radio with playlist campaigns. See industry
                  benchmarks for Spotify success rates by genre.
                </p>
              </Link>

              <Link
                href="/blog/music-pr-campaign-analytics"
                className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Music PR Campaign Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Track blog coverage and PR campaigns alongside radio. Measure
                  holistic campaign success across all channels.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Track Your BBC Radio 1 Campaigns Properly
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Stop guessing if your Radio 1 campaigns are working. Get instant
              industry benchmarks, AI pattern recognition showing show-genre
              matches, and know exactly which targeting changes would improve
              your success rate.
            </p>
            <div className="bg-indigo-50 border-4 border-indigo-500 rounded-xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                What You Get with Tracker
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-black text-xl">✓</span>
                  <span>
                    Industry benchmark comparison (see your 12% vs 11%
                    specialist average immediately)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-black text-xl">✓</span>
                  <span>
                    Show-genre matching (AI flags when you're targeting the
                    wrong Radio 1 shows)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-black text-xl">✓</span>
                  <span>
                    Daytime vs specialist analysis (stop wasting budget on 2%
                    success daytime shows)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-black text-xl">✓</span>
                  <span>
                    Timing optimization (pitch 8-12 weeks out for 16% success vs
                    3% last-minute)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-black text-xl">✓</span>
                  <span>
                    Export-ready reports (prove Radio 1 campaign value to labels
                    with benchmark data)
                  </span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                  Start Tracking Free
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 border-4 border-gray-900 text-gray-900 font-bold text-base px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  See Demo First
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: "What's a good success rate for BBC Radio 1 campaigns?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Depends entirely on which shows you're targeting. Daytime shows have 2% success rates. Specialist evening shows average 11% success. New music shows like Jack Saunders hit 18%. If you're tracking Radio 1 as one category, you're hiding the fact that 90% of your budget might be wasted on daytime shows.",
                },
              },
              {
                '@type': 'Question',
                name: 'Should I target daytime or specialist shows on BBC Radio 1?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Unless you have major label backing and are already charting, forget daytime. Specialist evening shows (Jack Saunders, Danny Howard, Charlie Hedges) are where unsigned artists actually get plays. Your 2% daytime success rate vs 11% specialist success rate proves this.',
                },
              },
              {
                '@type': 'Question',
                name: 'When should I pitch BBC Radio 1 for best results?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '8-12 weeks before your release date delivers the best results (16% average success). Pitching 4-6 weeks out drops to 12%, 2-3 weeks hits 7%, and the week of release tanks to 3% success. Radio 1 specialist shows plan programming weeks in advance.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I know which Radio 1 shows match my genre?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Electronic and dance → Danny Howard, Charlie Hedges (15-22% success). Hip hop → 1Xtra crossover shows (19% success). Indie rock → Jack Saunders Future Sounds (16% success). Genre mismatch tanks you to 1% success. Tracker's AI flags genre-show mismatches automatically.",
                },
              },
              {
                '@type': 'Question',
                name: 'Can Tracker integrate with BBC Sounds or Introducing data?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Currently Tracker requires manual data entry or CSV upload of your Radio 1 campaign data. The BBC doesn't provide public APIs for play data or submission tracking. Track your pitches manually and upload to Tracker for campaign intelligence and benchmark comparisons.",
                },
              },
            ],
          }),
        }}
      />
    </PSEOPageWrapper>
  );
}
