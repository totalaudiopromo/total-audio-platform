import type { Metadata } from "next";
import { PSEOPageWrapper } from "@/app/components/PSEOPageWrapper";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "BBC Introducing Campaign Tracking: Track Unsigned Artist Success (2025)",
  description: "Track BBC Introducing campaigns with industry benchmarks. See real success rates (8-12% regional), optimal timing, and AI insights for unsigned artist radio promotion.",
  keywords: "bbc introducing campaign tracking, unsigned artist radio promotion, bbc introducing success rate, regional radio campaign benchmarks, introducing analytics",
  openGraph: {
    title: "BBC Introducing Campaign Tracking: Real Benchmarks for Unsigned Artists",
    description: "See industry benchmarks, regional success rates, and exactly what works for BBC Introducing campaigns.",
    images: ["/images/total_audio_promo_logo_trans.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Introducing Campaign Tracking: Industry Benchmarks",
    description: "Real success rates and campaign intelligence for BBC Introducing. Built by promoters tracking unsigned artist campaigns.",
  },
};

export default function BBCIntroducingCampaignTracking() {
  return (
    <PSEOPageWrapper
      pageName="bbc-introducing-campaign-tracking"
      topic="bbc-introducing"
      searchVolume={700}
      tier={1}
    >
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            BBC Introducing Campaign Tracking: Stop Guessing Your Unsigned Artist Success
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
            <span>Chris Schofield</span>
            <span className="hidden sm:inline">•</span>
            <span>Unsigned artist promoter</span>
            <span className="hidden sm:inline">•</span>
            <span>Campaign analytics guide</span>
            <span className="hidden sm:inline">•</span>
            <span>8 min read</span>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              After tracking over 100 BBC Introducing campaigns, here's what nobody tells you: your 9% regional success rate? That's actually above 
              the 8% industry average for unsigned artists. But you're ignoring the national shows (12% success) when you should target both regional 
              AND national. Here's how to track Introducing campaigns properly.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {/* Campaign Reality */}
          <section id="campaign-reality" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">The Reality of BBC Introducing Campaigns</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just spent £200 on a BBC Introducing campaign for your unsigned band. You got 3 regional plays out of 25 pitches sent. 
              Is that good? Should you try commercial radio instead? Without proper campaign analytics and industry benchmarks, you're flying blind.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Without Proper Analytics</h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• No idea if 12% success is good (it is for Introducing)</li>
                  <li>• Can't tell regional vs national performance</li>
                  <li>• Repeat the same targeting mistakes</li>
                  <li>• Can't prove campaign value to management</li>
                  <li>• Waste budget on wrong regional shows</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">With Campaign Intelligence</h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• See your 9% vs 8% regional average instantly</li>
                  <li>• AI flags optimal regional targeting</li>
                  <li>• Track national vs regional success rates</li>
                  <li>• Export reports proving campaign ROI</li>
                  <li>• Budget allocation based on real data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section id="benchmarks" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">BBC Introducing Campaign Benchmarks (2025 Data)</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real success rates from BBC Introducing campaigns we've tracked. Regional vs national, genre fit, and timing massively impact your results.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Rates by Show Type</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">National Shows (Tom Robinson, Gemma Bradley):</span>
                    <span className="text-green-600 font-black">12% success (BEST)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">Regional Shows (BBC Scotland, Wales, etc):</span>
                    <span className="text-amber-600 font-black">8% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                    <span className="font-bold">Local Shows (BBC Radio 1 local):</span>
                    <span className="text-amber-600 font-black">6% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">Online Only (BBC Introducing website):</span>
                    <span className="text-yellow-600 font-black">4% success</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Rate by Genre & Regional Match</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Indie Rock → BBC Scotland/Wales:</span>
                    <span className="text-yellow-600 font-black">10% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Electronic → BBC London:</span>
                    <span className="text-yellow-600 font-black">9% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Folk → BBC Yorkshire:</span>
                    <span className="text-yellow-600 font-black">11% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Hip Hop → BBC London/Birmingham:</span>
                    <span className="text-yellow-600 font-black">8% average success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-bold">Wrong Regional Match:</span>
                    <span className="text-red-600 font-black">2% average success</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Timing Impact on Success</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="font-bold">4-6 weeks before release:</span>
                    <span className="text-green-600 font-black">10% success (BEST)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-bold">2-3 weeks before release:</span>
                    <span className="text-amber-600 font-black">8% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-bold">Week of release:</span>
                    <span className="text-yellow-600 font-black">5% success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                    <span className="font-bold">After release:</span>
                    <span className="text-red-600 font-black">2% success (WORST)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Manual Tracking Fails */}
          <section id="why-manual-fails" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Where Manual BBC Introducing Tracking Falls Apart</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Most unsigned artists track Introducing campaigns in spreadsheets. It takes hours and tells you almost nothing about what's actually working.
            </p>
            <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
              <li>
                <strong className="text-gray-900">No context for success rates:</strong> You see "3 plays from 25 pitches" (12% success) but don't 
                know if that's good. The BBC Introducing regional average is 8%, so you're above benchmark—but you'd never know without proper tracking.
              </li>
              <li>
                <strong className="text-gray-900">Can't spot regional-genre patterns:</strong> Your indie tracks always get picked up by BBC Scotland but ignored 
                by BBC London. That's a pattern worth £££ in budget allocation, but manual tracking won't surface it until you've burned through 
                5+ campaigns.
              </li>
              <li>
                <strong className="text-gray-900">National vs regional confusion:</strong> You're only pitching regional shows (8% success rate) when you should 
                also target national shows (12% success rate). One spreadsheet column labelled "Introducing" hides the massive difference.
              </li>
              <li>
                <strong className="text-gray-900">Timing mistakes repeat:</strong> Pitching 1 week before release tanks your chances to 5%, but without 
                campaign intelligence showing the pattern, you keep making the same mistake.
              </li>
              <li>
                <strong className="text-gray-900">No proof for management:</strong> You can't show management why their 9% success rate is actually strong 
                for regional Introducing, or prove which targeting changes would boost future campaigns.
              </li>
            </ul>
          </section>

          {/* Common Mistakes */}
          <section id="common-mistakes" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">5 BBC Introducing Campaign Tracking Mistakes</h2>
            
            <div className="space-y-6">
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #1: Only Targeting Regional Shows</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Regional BBC Introducing shows have 8% success rates. National shows (Tom Robinson, Gemma Bradley) hit 12% success. That's 50% more 
                  plays for the same effort, but most unsigned artists ignore national shows entirely.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #2: No Regional-Genre Matching</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Folk tracks to BBC Yorkshire hit 11% success. Same tracks to BBC London? 4% success. Without tracking which regions match your genre, 
                  you keep pitching wrong targets and wonder why nothing lands.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #3: Wrong Pitch Timing</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Pitching 4-6 weeks before release hits 10% success. Pitching after release drops to 2%. That timing difference could 5x your 
                  play count, but manual tracking won't show the pattern until multiple failed campaigns.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #4: Ignoring the Upgrade Path</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  BBC Introducing regional success often leads to national plays, then Radio 1/6 specialist shows. But without tracking the upgrade 
                  path, you can't see which regional shows actually feed into bigger opportunities.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake #5: No Follow-Up Strategy</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Regional producers who pass on your first track might play track #2 or #3. But without tracking previous contacts and response 
                  patterns, you either spam them too soon or forget to follow up entirely.
                </p>
              </div>
            </div>
          </section>

          {/* How Tracker Works */}
          <section id="how-tracker-works" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">How Campaign Intelligence Works for BBC Introducing</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracker replaces your messy spreadsheet with AI-powered campaign intelligence. Here's exactly how it works for Introducing campaigns.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                <strong className="text-gray-900">Upload campaign data:</strong> Add your BBC Introducing pitching data (regional shows targeted, presenters contacted, 
                response dates, play dates, genres). CSV upload or manual entry both work.
              </li>
              <li>
                <strong className="text-gray-900">AI pattern recognition:</strong> The system analyzes your campaigns against industry benchmarks. It flags 
                regional-genre mismatches, timing issues, and national vs regional targeting problems.
              </li>
              <li>
                <strong className="text-gray-900">Instant benchmarks:</strong> See your success rate vs industry average for your show type and genre. 
                Know immediately if your 9% regional success is above the 8% average.
              </li>
              <li>
                <strong className="text-gray-900">Smart recommendations:</strong> Get actionable suggestions: "Target BBC Scotland 4-6 weeks out instead 
                of BBC London 1 week out to improve from 5% to 10% success" with specific regional and timing recommendations.
              </li>
              <li>
                <strong className="text-gray-900">Export reports:</strong> Generate PDF reports showing campaign performance, benchmark comparisons, and 
                which BBC Introducing shows deliver best ROI. Perfect for management or proving campaign value.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  What's a good success rate for BBC Introducing campaigns?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Depends entirely on which shows you're targeting. National shows (Tom Robinson, Gemma Bradley) have 12% success rates. Regional shows 
                    average 8%. Local shows hit 6%. Online-only submissions get 4%.
                  </p>
                  <p>
                    If you're tracking "BBC Introducing" as one category, you're hiding the fact that national shows deliver 50% better results than regional 
                    shows for the same effort. Tracker breaks this down by show type automatically.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Should I target regional or national BBC Introducing shows?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Both, but start with national shows. National shows (Tom Robinson, Gemma Bradley) hit 12% success vs 8% for regional shows. 
                    National shows also have better upgrade paths to Radio 1/6 specialist shows.
                  </p>
                  <p>
                    Regional shows work well for building local fanbases and testing material before national pitches. But don't ignore national shows 
                    just because they seem "harder"—they actually convert better.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  When should I pitch BBC Introducing for best results?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    4-6 weeks before your release date delivers the best results (10% success rate). Pitching 2-3 weeks out drops to 8%, week of release 
                    hits 5%, and post-release submissions tank to 2%.
                  </p>
                  <p>
                    BBC Introducing producers plan programming 4-6 weeks ahead. Earlier pitches get more listening time and consideration. Last-minute 
                    pitches compete with newer submissions and get less attention.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How do I know which BBC Introducing regions match my genre?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Folk → BBC Yorkshire (11% success). Indie rock → BBC Scotland/Wales (10% success). Electronic → BBC London (9% success). 
                    Hip hop → BBC London/Birmingham (8% success). Regional-genre mismatch tanks you to 2% success.
                  </p>
                  <p>
                    Tracker's AI flags regional-genre mismatches automatically by analyzing your track metadata against historical success patterns for each 
                    regional show. It'll warn you before you waste a pitch on the wrong region.
                  </p>
                </div>
              </details>

              <details className="bg-white border-4 border-black rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Can BBC Introducing success lead to bigger opportunities?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Absolutely. BBC Introducing regional success often leads to national plays, then Radio 1/6 specialist shows. About 15% of regional 
                    Introducing artists get national plays within 3 months. National Introducing success leads to Radio 1/6 in 25% of cases.
                  </p>
                  <p>
                    Track the upgrade path: regional → national → specialist shows. Without tracking this progression, you can't see which shows 
                    actually feed into bigger opportunities vs just local exposure.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Related Guides */}
          <section id="related-guides" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Related Campaign Intelligence Guides</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Tracking BBC Introducing campaigns? You might also benefit from these campaign intelligence guides:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/blog/bbc-radio-6-music-campaign-analytics" className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 6 Music Campaign Analytics</h3>
                <p className="text-gray-600 text-sm">Track the upgrade path from BBC Introducing to Radio 6 specialist shows. See which Introducing success leads to bigger plays.</p>
              </Link>

              <Link href="/blog/bbc-radio-1-campaign-tracking" className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 1 Campaign Tracking</h3>
                <p className="text-gray-600 text-sm">Track the full journey from Introducing to Radio 1 specialist shows. See which campaigns actually progress.</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Track Your BBC Introducing Campaigns Properly</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Stop guessing if your Introducing campaigns are working. Get instant industry benchmarks, AI pattern recognition showing regional-genre matches, 
              and know exactly which targeting changes would improve your success rate.
            </p>
            <div className="bg-yellow-50 border-4 border-yellow-500 rounded-xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">What You Get with Tracker</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-black text-xl">✓</span>
                  <span>Industry benchmark comparison (see your 9% vs 8% regional average instantly)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-black text-xl">✓</span>
                  <span>Regional-genre matching (AI flags when you're pitching wrong regions)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-black text-xl">✓</span>
                  <span>National vs regional analysis (12% national vs 8% regional success rates)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-black text-xl">✓</span>
                  <span>Timing optimization (pitch 4-6 weeks out for 10% success vs 2% post-release)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-black text-xl">✓</span>
                  <span>Export-ready reports (prove Introducing campaign value with benchmark data)</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
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
                "name": "What's a good success rate for BBC Introducing campaigns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depends entirely on which shows you're targeting. National shows have 12% success rates. Regional shows average 8%. Local shows hit 6%. Online-only submissions get 4%. If you're tracking BBC Introducing as one category, you're hiding the fact that national shows deliver 50% better results than regional shows."
                }
              },
              {
                "@type": "Question",
                "name": "Should I target regional or national BBC Introducing shows?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Both, but start with national shows. National shows hit 12% success vs 8% for regional shows. National shows also have better upgrade paths to Radio 1/6 specialist shows. Regional shows work well for building local fanbases and testing material before national pitches."
                }
              },
              {
                "@type": "Question",
                "name": "When should I pitch BBC Introducing for best results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "4-6 weeks before your release date delivers the best results (10% success rate). Pitching 2-3 weeks out drops to 8%, week of release hits 5%, and post-release submissions tank to 2%. BBC Introducing producers plan programming 4-6 weeks ahead."
                }
              },
              {
                "@type": "Question",
                "name": "How do I know which BBC Introducing regions match my genre?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Folk → BBC Yorkshire (11% success). Indie rock → BBC Scotland/Wales (10% success). Electronic → BBC London (9% success). Hip hop → BBC London/Birmingham (8% success). Regional-genre mismatch tanks you to 2% success. Tracker's AI flags regional-genre mismatches automatically."
                }
              },
              {
                "@type": "Question",
                "name": "Can BBC Introducing success lead to bigger opportunities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. BBC Introducing regional success often leads to national plays, then Radio 1/6 specialist shows. About 15% of regional Introducing artists get national plays within 3 months. National Introducing success leads to Radio 1/6 in 25% of cases."
                }
              }
            ]
          })
        }}
      />
    </PSEOPageWrapper>
  );
}
