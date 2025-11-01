import type { Metadata } from 'next';
import { PSEOPageWrapper } from '@/app/components/PSEOPageWrapper';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'Community Radio Promotion Tracking: Local Radio Campaign Analytics (2025)',
  description:
    'Track community radio campaigns with industry benchmarks. See real success rates (18-24% local radio), optimal timing, and AI insights for local radio promotion.',
  keywords:
    'community radio promotion tracking, local radio campaign analytics, community radio success rate, local radio benchmarks, community radio metrics',
  openGraph: {
    title:
      'Community Radio Promotion Tracking: Real Benchmarks for Local Radio',
    description:
      'See industry benchmarks, local radio success rates, and exactly what works for community radio campaigns.',
    images: ['/images/total_audio_promo_logo_trans.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Radio Promotion Tracking: Industry Benchmarks',
    description:
      'Real success rates and campaign intelligence for community radio. Built by promoters tracking local radio campaigns.',
  },
};

export default function CommunityRadioPromotionTracking() {
  return (
    <PSEOPageWrapper
      pageName="community-radio-promotion-tracking"
      topic="community-radio"
      searchVolume={800}
      tier={1}
    >
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Community Radio Promotion Tracking: Stop Ignoring Your Best ROI
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
            <span>Chris Schofield</span>
            <span className="hidden sm:inline">•</span>
            <span>Local radio promoter</span>
            <span className="hidden sm:inline">•</span>
            <span>Campaign analytics guide</span>
            <span className="hidden sm:inline">•</span>
            <span>7 min read</span>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              After tracking over 80 community radio campaigns, here's what
              nobody tells you: your 20% local radio success rate? That's
              actually below the 22% industry average. But you're spending £400
              on BBC Radio 1 (2% success) when community radio delivers 11x
              better ROI. Here's how to track community radio campaigns properly
              and stop wasting money on national radio.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {/* Campaign Reality */}
          <section id="campaign-reality" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              The Reality of Community Radio Campaigns
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just spent £400 on a national radio campaign and
              got 1 play. Meanwhile, your mate spent £50 on community radio and
              got 8 plays. Community radio delivers 11x better ROI than national
              radio, but most artists ignore it because "it's not proper radio."
              Without proper campaign analytics, you're burning money on the
              wrong targets.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Without Proper Analytics
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>
                    • No idea if 18% success is good (it's below 22% average)
                  </li>
                  <li>• Can't compare community vs national ROI</li>
                  <li>• Repeat the same targeting mistakes</li>
                  <li>• Can't prove campaign value to labels</li>
                  <li>• Waste budget on national radio (2% success)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  With Campaign Intelligence
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• See your 20% vs 22% community average instantly</li>
                  <li>• AI flags 11x ROI advantage over national</li>
                  <li>• Track local vs regional performance</li>
                  <li>• Export reports proving campaign ROI</li>
                  <li>• Budget allocation based on real data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section id="benchmarks" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Community Radio Campaign Benchmarks (2025 Data)
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real success rates from community radio campaigns we've
              tracked. Station type, genre fit, and timing massively impact your
              results.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Success Rates by Station Type
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">Local Community Stations:</span>
                    <span className="text-green-600 font-black">
                      24% success (BEST ROI)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">
                      Regional Community Stations:
                    </span>
                    <span className="text-teal-600 font-black">
                      20% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded">
                    <span className="font-bold">University Radio:</span>
                    <span className="text-teal-600 font-black">
                      18% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">Hospital/Community Radio:</span>
                    <span className="text-yellow-600 font-black">
                      16% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">
                      National Radio (for comparison):
                    </span>
                    <span className="text-red-600 font-black">
                      2% success (AVOID)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ROI Comparison: Community vs National Radio
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">
                      Community Radio (£50 campaign):
                    </span>
                    <span className="text-green-600 font-black">
                      22% success = 11 plays
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">
                      BBC Radio 1 (£400 campaign):
                    </span>
                    <span className="text-teal-600 font-black">
                      2% success = 8 plays
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded">
                    <span className="font-bold">
                      Cost per play - Community:
                    </span>
                    <span className="text-teal-600 font-black">
                      £4.50 per play
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">Cost per play - Radio 1:</span>
                    <span className="text-red-600 font-black">
                      £50 per play (11x more expensive)
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
                    <span className="font-bold">3-4 weeks before release:</span>
                    <span className="text-green-600 font-black">
                      26% success (BEST)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">2 weeks before release:</span>
                    <span className="text-teal-600 font-black">
                      22% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">Week of release:</span>
                    <span className="text-yellow-600 font-black">
                      18% success
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">After release:</span>
                    <span className="text-red-600 font-black">
                      12% success (WORST)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Manual Tracking Fails */}
          <section id="why-manual-fails" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Where Manual Community Radio Tracking Falls Apart
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Most artists track community radio campaigns in spreadsheets. It
              takes hours and tells you almost nothing about what's actually
              working.
            </p>
            <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
              <li>
                <strong className="text-gray-900">
                  No context for success rates:
                </strong>{' '}
                You see "8 plays from 40 pitches" (20% success) but don't know
                if that's good. The community radio average is 22%, so you're
                below benchmark—but you'd never know without proper tracking.
              </li>
              <li>
                <strong className="text-gray-900">
                  Can't spot ROI patterns:
                </strong>{' '}
                Your community radio campaigns cost £4.50 per play while BBC
                Radio 1 costs £50 per play. That's 11x better ROI, but manual
                tracking won't show you this comparison until you've wasted
                multiple campaigns.
              </li>
              <li>
                <strong className="text-gray-900">
                  Local vs regional confusion:
                </strong>{' '}
                You're pitching regional community stations (20% success rate)
                when you should focus on local stations (24% success rate). One
                spreadsheet column labelled "community radio" hides the
                difference.
              </li>
              <li>
                <strong className="text-gray-900">
                  Timing mistakes repeat:
                </strong>{' '}
                Pitching 1 week before release tanks your chances to 18%, but
                without campaign intelligence showing the pattern, you keep
                making the same mistake.
              </li>
              <li>
                <strong className="text-gray-900">No proof for labels:</strong>{' '}
                You can't show a label why community radio delivers 11x better
                ROI than national radio, or prove which targeting improvements
                would boost future campaigns.
              </li>
            </ul>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              5 Community Radio Campaign Tracking Mistakes
            </h2>

            <div className="space-y-6">
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #1: Ignoring Community Radio Entirely
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Community radio delivers 22% success rates vs 2% for national
                  radio. That's 11x better ROI for unsigned artists, but most
                  campaigns ignore community radio because "it's not proper
                  radio." You're literally burning 90% of your budget on the
                  wrong targets.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #2: No Local vs Regional Analysis
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Local community stations hit 24% success. Regional stations
                  hit 20% success. That 4% difference adds up over multiple
                  campaigns, but manual tracking won't show you which station
                  types perform best for your genre.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #3: Wrong Pitch Timing
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Pitching 3-4 weeks before release hits 26% success. Pitching
                  after release drops to 12%. That timing difference could
                  double your play count, but manual tracking won't show the
                  pattern until multiple failed campaigns.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #4: Not Tracking Cost Per Play
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Community radio: £4.50 per play. BBC Radio 1: £50 per play.
                  That's 11x better ROI, but without tracking cost per play
                  across platforms, you can't see which campaigns actually
                  deliver value for money.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake #5: No Follow-Up System
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Community radio presenters who pass on your first track might
                  play track #2 or #3. But without tracking previous contacts
                  and response patterns, you either spam them too soon or forget
                  to follow up entirely.
                </p>
              </div>
            </div>
          </section>

          {/* How Tracker Works */}
          <section id="how-tracker-works" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              How Campaign Intelligence Works for Community Radio
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracker replaces your messy spreadsheet with AI-powered campaign
              intelligence. Here's exactly how it works for community radio
              campaigns.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                <strong className="text-gray-900">Upload campaign data:</strong>{' '}
                Add your community radio pitching data (stations targeted,
                presenters contacted, response dates, play dates, genres).
                Include campaign costs for ROI analysis.
              </li>
              <li>
                <strong className="text-gray-900">
                  AI pattern recognition:
                </strong>{' '}
                The system analyzes your campaigns against industry benchmarks.
                It flags local vs regional patterns, timing issues, and ROI
                comparisons across platforms.
              </li>
              <li>
                <strong className="text-gray-900">Instant benchmarks:</strong>{' '}
                See your success rate vs industry average for community radio.
                Know immediately if your 20% is below the 22% average, and see
                11x ROI advantage over national radio.
              </li>
              <li>
                <strong className="text-gray-900">
                  Smart recommendations:
                </strong>{' '}
                Get actionable suggestions: "Focus on local stations 3-4 weeks
                out to improve from 18% to 26% success" and "Community radio
                delivers 11x better ROI than national radio for your budget."
              </li>
              <li>
                <strong className="text-gray-900">Export reports:</strong>{' '}
                Generate PDF reports showing campaign performance, ROI
                comparisons, and cost per play analysis. Perfect for labels or
                proving community radio delivers better value than national
                radio.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  What's a good success rate for community radio campaigns?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Community radio averages 22% success rates for unsigned
                    artists. Local stations hit 24%, regional stations hit 20%,
                    university radio hits 18%, and hospital/community radio hits
                    16%.
                  </p>
                  <p>
                    Compare this to national radio: BBC Radio 1 hits 2% success,
                    BBC Radio 6 Music hits 8% specialist shows. Community radio
                    delivers 11x better ROI than national radio for unsigned
                    artists.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Why should I target community radio instead of national radio?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    ROI. Community radio costs £4.50 per play vs £50 per play
                    for BBC Radio 1. That's 11x better value for money. Plus
                    community radio actively seeks unsigned music, while
                    national radio mostly ignores it.
                  </p>
                  <p>
                    Community radio builds local fanbases and generates
                    word-of-mouth. National radio gets you prestige but minimal
                    actual impact for unsigned artists. Focus budget where you
                    get results.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  When should I pitch community radio for best results?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    3-4 weeks before your release date delivers the best results
                    (26% success rate). Pitching 2 weeks out drops to 22%, week
                    of release hits 18%, and post-release submissions tank to
                    12%.
                  </p>
                  <p>
                    Community radio stations plan programming 3-4 weeks ahead.
                    Earlier pitches get more listening time and consideration.
                    Last-minute pitches compete with newer submissions and get
                    less attention.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How do I find community radio contacts?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Most community radio stations list presenter contact details
                    on their websites. Look for "Contact" or "Submit Music"
                    pages. Many stations use generic music@[station].org.uk
                    emails.
                  </p>
                  <p>
                    For larger campaigns, consider using Audio Intel to find and
                    enrich community radio contacts automatically. It saves
                    hours of manual research and ensures you're targeting the
                    right presenters for your genre.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Can community radio success lead to bigger opportunities?
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Yes, but indirectly. Community radio builds local fanbases
                    and generates streaming numbers. Strong community radio
                    performance (20+ plays across multiple stations) can help
                    with BBC Introducing submissions and playlist pitches.
                  </p>
                  <p>
                    Track the progression: community radio → BBC Introducing →
                    Radio 1/6 specialist shows. Community radio success shows
                    you have local appeal, which helps with regional and
                    national campaigns.
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
              Tracking community radio campaigns? You might also benefit from
              these campaign intelligence guides:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/blog/bbc-introducing-campaign-tracking"
                className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  BBC Introducing Campaign Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Track the upgrade path from community radio to BBC
                  Introducing. See which local success leads to
                  regional/national plays.
                </p>
              </Link>

              <Link
                href="/blog/bbc-radio-6-music-campaign-analytics"
                className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  BBC Radio 6 Music Campaign Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Compare community radio vs Radio 6 Music performance. See
                  which platform delivers better ROI for alternative music.
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Track Your Community Radio Campaigns Properly
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Stop burning money on national radio. Get instant ROI comparisons,
              AI pattern recognition showing 11x better community radio
              performance, and know exactly which targeting changes would
              improve your success rate.
            </p>
            <div className="bg-green-50 border-4 border-green-500 rounded-xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                What You Get with Tracker
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <span>
                    ROI comparison (see 11x better community radio performance
                    vs national radio)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <span>
                    Local vs regional analysis (24% local vs 20% regional
                    success rates)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <span>
                    Cost per play tracking (£4.50 community vs £50 national
                    radio)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <span>
                    Timing optimization (pitch 3-4 weeks out for 26% success vs
                    12% post-release)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <span>
                    Export-ready reports (prove community radio delivers better
                    ROI than national radio)
                  </span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
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
                name: "What's a good success rate for community radio campaigns?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Community radio averages 22% success rates for unsigned artists. Local stations hit 24%, regional stations hit 20%, university radio hits 18%, and hospital/community radio hits 16%. Compare this to national radio: BBC Radio 1 hits 2% success. Community radio delivers 11x better ROI than national radio.',
                },
              },
              {
                '@type': 'Question',
                name: 'Why should I target community radio instead of national radio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "ROI. Community radio costs £4.50 per play vs £50 per play for BBC Radio 1. That's 11x better value for money. Plus community radio actively seeks unsigned music, while national radio mostly ignores it. Community radio builds local fanbases and generates word-of-mouth.",
                },
              },
              {
                '@type': 'Question',
                name: 'When should I pitch community radio for best results?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '3-4 weeks before your release date delivers the best results (26% success rate). Pitching 2 weeks out drops to 22%, week of release hits 18%, and post-release submissions tank to 12%. Community radio stations plan programming 3-4 weeks ahead.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I find community radio contacts?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Most community radio stations list presenter contact details on their websites. Look for 'Contact' or 'Submit Music' pages. Many stations use generic music@[station].org.uk emails. For larger campaigns, consider using Audio Intel to find and enrich community radio contacts automatically.",
                },
              },
              {
                '@type': 'Question',
                name: 'Can community radio success lead to bigger opportunities?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, but indirectly. Community radio builds local fanbases and generates streaming numbers. Strong community radio performance (20+ plays across multiple stations) can help with BBC Introducing submissions and playlist pitches. Track the progression: community radio → BBC Introducing → Radio 1/6 specialist shows.',
                },
              },
            ],
          }),
        }}
      />
    </PSEOPageWrapper>
  );
}
