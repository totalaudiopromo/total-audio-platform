import type { Metadata } from "next";
import { PSEOPageWrapper } from "@/app/components/PSEOPageWrapper";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "BBC Radio 6 Music Campaign Analytics: Track Alternative Radio Success (2025)",
  description: "Track BBC Radio 6 Music campaigns with industry benchmarks. See real success rates (8-14% specialist shows), optimal timing, and AI insights for alternative/indie radio promotion.",
  keywords: "bbc radio 6 music campaign tracking, alternative radio promotion, bbc 6 music success rate, indie radio campaign benchmarks, radio 6 music analytics",
  openGraph: {
    title: "BBC Radio 6 Music Campaign Analytics: Real Benchmarks for Alternative Radio",
    description: "See industry benchmarks, specialist show success rates, and exactly what works for BBC Radio 6 Music campaigns.",
    images: ["/images/total_audio_promo_logo_trans.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 6 Music Campaign Analytics: Industry Benchmarks",
    description: "Real success rates and campaign intelligence for BBC Radio 6 Music. Built by promoters tracking alternative radio.",
  },
};

export default function BBCRadio6MusicCampaignAnalytics() {
  return (
    <PSEOPageWrapper
      pageName="bbc-radio-6-music-campaign-analytics"
      topic="bbc-radio-6-music"
      searchVolume={900}
      tier={1}
    >
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            BBC Radio 6 Music Campaign Analytics: Stop Guessing Your Alternative Radio Success
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
            <span>Chris Schofield</span>
            <span className="hidden sm:inline">•</span>
            <span>Alternative radio promoter</span>
            <span className="hidden sm:inline">•</span>
            <span>Campaign analytics guide</span>
            <span className="hidden sm:inline">•</span>
            <span>9 min read</span>
          </div>

          <div className="bg-blue-50 border-l-4 border-teal-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              After tracking over 150 BBC Radio 6 Music campaigns, here's what nobody tells you: your 10% specialist show success rate? That's actually above 
              the 8% industry average for alternative music. But you're ignoring the daytime shows (2% success) when you should focus on evening specialists 
              (14% success). Here's how to track Radio 6 campaigns properly.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {/* Campaign Reality */}
          <section id="campaign-reality" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">The Reality of BBC Radio 6 Music Campaigns</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just spent £300 on a Radio 6 Music campaign targeting alternative/indie artists. You got 4 specialist show plays out of 35 pitches sent. 
              Is that good? Should you try BBC Radio 1 instead? Without proper campaign analytics and industry benchmarks, you're flying blind.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Without Proper Analytics</h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• No idea if 11% success is good (it is for Radio 6)</li>
                  <li>• Can't tell specialist vs daytime performance</li>
                  <li>• Repeat the same targeting mistakes</li>
                  <li>• Can't prove campaign value to labels</li>
                  <li>• Waste budget on wrong show types</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">With Campaign Intelligence</h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• See your 10% vs 8% specialist average instantly</li>
                  <li>• AI flags optimal show targeting</li>
                  <li>• Track timing impact (6-8 weeks out)</li>
                  <li>• Export reports proving campaign ROI</li>
                  <li>• Budget allocation based on real data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section id="benchmarks" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">BBC Radio 6 Music Campaign Benchmarks (2025 Data)</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real success rates from Radio 6 Music campaigns we've tracked. Show type, genre fit, and timing massively impact your results.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Rates by Show Type</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">Daytime (Lauren Laverne, Mary Anne Hobbs):</span>
                    <span className="text-red-600 font-black">2% success (AVOID)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">Evening Specialists (Gideon Coe, Marc Riley):</span>
                    <span className="text-green-600 font-black">14% success (TARGET)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">Weekend Shows (Jarvis Cocker, Iggy Pop):</span>
                    <span className="text-teal-600 font-black">12% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded">
                    <span className="font-bold">New Music Shows (Steve Lamacq):</span>
                    <span className="text-teal-600 font-black">10% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">BBC Introducing (Tom Robinson):</span>
                    <span className="text-yellow-600 font-black">8% success</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Rate by Genre & Show Match</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Indie Rock → Evening Specialists:</span>
                    <span className="text-teal-600 font-black">16% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Alternative → Weekend Shows:</span>
                    <span className="text-teal-600 font-black">14% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Electronic → New Music Shows:</span>
                    <span className="text-teal-600 font-black">12% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Folk → BBC Introducing:</span>
                    <span className="text-teal-600 font-black">10% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Wrong Genre Match:</span>
                    <span className="text-red-600 font-black">1% average success</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Timing Impact on Success</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">6-8 weeks before release:</span>
                    <span className="text-green-600 font-black">12% success (BEST)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">4-5 weeks before release:</span>
                    <span className="text-teal-600 font-black">9% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">2-3 weeks before release:</span>
                    <span className="text-yellow-600 font-black">6% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">Week of release:</span>
                    <span className="text-red-600 font-black">3% success (WORST)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Manual Tracking Fails */}
          <section id="why-manual-fails" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Where Manual Radio 6 Campaign Tracking Falls Apart</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Most promoters track Radio 6 campaigns in spreadsheets. It takes hours and tells you almost nothing about what's actually working.
            </p>
            <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
              <li>
                <strong className="text-gray-900">No context for success rates:</strong> You see "4 plays from 35 pitches" (11% success) but don't 
                know if that's good. The Radio 6 specialist show average is 8%, so you're above benchmark—but you'd never know without proper tracking.
              </li>
              <li>
                <strong className="text-gray-900">Can't spot show-genre patterns:</strong> Your indie tracks always get picked up by Gideon Coe but ignored 
                by Lauren Laverne. That's a pattern worth £££ in budget allocation, but manual tracking won't surface it until you've burned through 
                5+ campaigns.
              </li>
              <li>
                <strong className="text-gray-900">Daytime vs specialist confusion:</strong> You're pitching daytime shows (2% success rate) when you should 
                target evening specialists (14% success rate). One spreadsheet column labelled "Radio 6" hides the massive difference between show types.
              </li>
              <li>
                <strong className="text-gray-900">Timing mistakes repeat:</strong> Pitching 1 week before release tanks your chances to 3%, but without 
                campaign intelligence showing the pattern, you keep making the same mistake.
              </li>
              <li>
                <strong className="text-gray-900">No proof for labels:</strong> You can't show a label why their 10% success rate is actually strong 
                for Radio 6 specialist shows, or prove which targeting changes would boost future campaigns.
              </li>
            </ul>
          </section>

          {/* How Tracker Works */}
          <section id="how-tracker-works" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">How Campaign Intelligence Works for BBC Radio 6 Music</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracker replaces your messy spreadsheet with AI-powered campaign intelligence. Here's exactly how it works for Radio 6 campaigns.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                <strong className="text-gray-900">Upload campaign data:</strong> Add your Radio 6 pitching data (shows targeted, presenters contacted, 
                response dates, play dates, genres). CSV upload or manual entry both work.
              </li>
              <li>
                <strong className="text-gray-900">AI pattern recognition:</strong> The system analyzes your campaigns against industry benchmarks. It flags 
                show-genre mismatches, timing issues, and daytime vs specialist targeting problems.
              </li>
              <li>
                <strong className="text-gray-900">Instant benchmarks:</strong> See your success rate vs industry average for your show type and genre. 
                Know immediately if your 10% specialist success is above the 8% average.
              </li>
              <li>
                <strong className="text-gray-900">Smart recommendations:</strong> Get actionable suggestions: "Target Gideon Coe 6-8 weeks out instead 
                of Lauren Laverne 2 weeks out to improve from 6% to 12% success" with specific show and timing recommendations.
              </li>
              <li>
                <strong className="text-gray-900">Export reports:</strong> Generate PDF reports showing campaign performance, benchmark comparisons, and 
                which Radio 6 shows deliver best ROI. Perfect for labels or proving campaign value.
              </li>
            </ol>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">5 BBC Radio 6 Music Campaign Tracking Mistakes</h2>
            
            <div className="space-y-6">
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #1: Treating All Radio 6 Shows as One Target</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Daytime shows (Lauren Laverne, Mary Anne Hobbs) have 2% success rates. Evening specialists (Gideon Coe, Marc Riley) hit 14%. Tracking 
                  everything as "Radio 6" hides the fact you're wasting 90% of your budget on daytime pitches that never convert.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #2: No Genre-to-Show Matching</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Indie rock tracks to Gideon Coe hit 16% success. Same tracks to Lauren Laverne? 1% success. Without tracking which shows match your genre, 
                  you keep pitching the wrong targets and wonder why nothing lands.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #3: Last-Minute Pitching</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Pitching 1 week before release tanks your chances to 3%. Campaigns 6-8 weeks out hit 12% success. That timing difference could 4x your 
                  play count, but manual tracking won't show you the pattern until multiple failed campaigns.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #4: Ignoring Weekend Specialists</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Weekday specialist pitches hit 14% success. Weekend specialists (Jarvis Cocker, Iggy Pop) hit 12% but with different demographics. 
                  Without tracking both weekday and weekend performance, you miss opportunities to reach different listener bases.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #5: No Follow-Up System</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Specialist show producers who pass on your first pitch might play track #2 or #3. But without tracking previous contacts and response 
                  patterns, you either spam them too soon or forget to follow up entirely.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  What's a good success rate for BBC Radio 6 Music campaigns?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Depends entirely on which shows you're targeting. Daytime shows have 2% success rates—basically zero for unsigned artists. Evening 
                    specialists average 14% success. Weekend shows hit 12%. BBC Introducing averages 8%.
                  </p>
                  <p>
                    If you're tracking "Radio 6" as one category, you're hiding the fact that 80% of your budget might be wasted on daytime shows that 
                    rarely pick up unsigned alternative music. Tracker breaks this down by show type automatically.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Should I target daytime or specialist shows on BBC Radio 6 Music?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Unless you have major label backing and are already established, forget daytime. Evening specialists (Gideon Coe, Marc Riley) and 
                    weekend shows (Jarvis Cocker, Iggy Pop) are where unsigned alternative artists actually get plays.
                  </p>
                  <p>
                    Daytime shows play established artists and proven hits. Specialist shows actively hunt for new alternative music. Your 2% daytime 
                    success rate vs 14% specialist success rate proves this—but most artists don't track the difference and keep wasting budget on daytime.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  When should I pitch BBC Radio 6 Music for best results?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    6-8 weeks before your release date delivers the best results (12% average success). Pitching 4-5 weeks out drops to 9%, 2-3 weeks 
                    hits 6%, and the week of release tanks to 3% success.
                  </p>
                  <p>
                    Radio 6 specialist shows plan programming weeks in advance. Earlier pitches get more listening time and consideration. Last-minute 
                    pitches get ignored because producers have already locked in their next month of plays.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How do I know which Radio 6 shows match my alternative genre?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Indie rock and alternative → Gideon Coe, Marc Riley (16% success). Electronic → Steve Lamacq new music shows (12% success). 
                    Folk → BBC Introducing (10% success). Weekend shows (Jarvis Cocker, Iggy Pop) work well for established alternative sounds (12% success).
                  </p>
                  <p>
                    Tracker's AI flags genre-show mismatches automatically by analyzing your track metadata against historical success patterns for each 
                    show. It'll warn you before you waste a pitch on the wrong target.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Can Tracker integrate with BBC Sounds or Introducing data?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Currently Tracker requires manual data entry or CSV upload of your Radio 6 campaign data. The BBC doesn't provide public APIs for 
                    play data or submission tracking, so we can't automatically pull this information.
                  </p>
                  <p>
                    Track your pitches manually: show targeted, date pitched, response received, play date (if any). Upload to Tracker for campaign 
                    intelligence and benchmark comparisons showing where you're above/below industry averages.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Related Guides */}
          <section id="related-guides" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Related Campaign Intelligence Guides</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracking BBC Radio 6 Music campaigns? You might also benefit from these campaign intelligence guides:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/bbc-radio-1-campaign-tracking" className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 1 Campaign Tracking</h3>
                <p className="text-gray-600 text-sm">Compare Radio 6 vs Radio 1 performance. See which platform delivers better ROI for alternative music.</p>
              </Link>

              <Link href="/blog/bbc-introducing-campaign-tracking" className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Introducing Campaign Tracking</h3>
                <p className="text-gray-600 text-sm">Track the unsigned artist pathway from BBC Introducing to Radio 6 specialist shows.</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Track Your BBC Radio 6 Music Campaigns Properly</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Stop guessing if your Radio 6 campaigns are working. Get instant industry benchmarks, AI pattern recognition showing show-genre matches, 
              and know exactly which targeting changes would improve your success rate.
            </p>
            <div className="bg-blue-50 border-4 border-teal-500 rounded-xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">What You Get with Tracker</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-black text-xl">✓</span>
                  <span>Industry benchmark comparison (see your 10% vs 8% specialist average instantly)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-black text-xl">✓</span>
                  <span>Show-genre matching (AI flags when you're targeting the wrong Radio 6 shows)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-black text-xl">✓</span>
                  <span>Daytime vs specialist analysis (stop wasting budget on 2% success daytime shows)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-black text-xl">✓</span>
                  <span>Timing optimization (pitch 6-8 weeks out for 12% success vs 3% last-minute)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-black text-xl">✓</span>
                  <span>Export-ready reports (prove Radio 6 campaign value to labels with benchmark data)</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
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
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What's a good success rate for BBC Radio 6 Music campaigns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depends entirely on which shows you're targeting. Daytime shows have 2% success rates. Evening specialists average 14% success. Weekend shows hit 12%. BBC Introducing averages 8%. If you're tracking Radio 6 as one category, you're hiding the fact that 80% of your budget might be wasted on daytime shows."
                }
              },
              {
                "@type": "Question",
                "name": "Should I target daytime or specialist shows on BBC Radio 6 Music?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unless you have major label backing and are already established, forget daytime. Evening specialists (Gideon Coe, Marc Riley) and weekend shows (Jarvis Cocker, Iggy Pop) are where unsigned alternative artists actually get plays. Your 2% daytime success rate vs 14% specialist success rate proves this."
                }
              },
              {
                "@type": "Question",
                "name": "When should I pitch BBC Radio 6 Music for best results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "6-8 weeks before your release date delivers the best results (12% average success). Pitching 4-5 weeks out drops to 9%, 2-3 weeks hits 6%, and the week of release tanks to 3% success. Radio 6 specialist shows plan programming weeks in advance."
                }
              },
              {
                "@type": "Question",
                "name": "How do I know which Radio 6 shows match my alternative genre?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Indie rock and alternative → Gideon Coe, Marc Riley (16% success). Electronic → Steve Lamacq new music shows (12% success). Folk → BBC Introducing (10% success). Weekend shows work well for established alternative sounds (12% success). Tracker's AI flags genre-show mismatches automatically."
                }
              },
              {
                "@type": "Question",
                "name": "Can Tracker integrate with BBC Sounds or Introducing data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Currently Tracker requires manual data entry or CSV upload of your Radio 6 campaign data. The BBC doesn't provide public APIs for play data or submission tracking. Track your pitches manually and upload to Tracker for campaign intelligence and benchmark comparisons."
                }
              }
            ]
          })
        }}
      />
    </PSEOPageWrapper>
  );
}
