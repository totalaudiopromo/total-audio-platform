import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BBC Radio 2 Contact Enrichment Case Study | Audio Intel",
  description:
    "BBC Radio 2 contact research takes 12 hours to understand 35-54 demographic targeting. Audio Intel reveals January 2025 schedule changes (Scott Mills breakfast, Trevor Nelson afternoon), specialist evening shows (DJ Spoony garage, Sophie Ellis-Bextor disco), and BBC Introducing route in 2 minutes. 12.6 million weekly listeners.",
  keywords:
    "bbc radio 2 contacts, scott mills breakfast, trevor nelson, dj spoony good groove, sophie ellis-bextor kitchen disco, bbc introducing, audio intel",
  openGraph: {
    title: "BBC Radio 2 Contact Enrichment: 12 Hours to 2 Minutes",
    description:
      "BBC Radio 2 targets 35-54 demographic with specialist evening programming. Audio Intel reveals schedule changes and demographic fit analysis instantly.",
    images: ["/images/bbc-radio-2-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 2 Contact Enrichment: The Real Demographic Strategy",
    description:
      "Manual research vs Audio Intel on BBC Radio 2. Verified January 2025 schedule changes, specialist shows, and 35-54 demographic targeting.",
  },
};

{/*
DATA VERIFICATION:
- Source: bbc-radio-2-research.md (2025-10-04)
- Confidence: High for schedule changes and submission process
- Verified: Scott Mills breakfast (January 2025), Trevor Nelson afternoon (2-4pm)
- Verified: DJ Spoony expanded to 4 weekly shows, Sophie Ellis-Bextor 2-hour Kitchen Disco
- Verified: BBC Introducing Uploader ONLY submission route
- Verified: 35-54 demographic focus (82% listeners over 35)
- Verified: NO direct presenter contact allowed
*/}

export default function BbcRadio2ContactEnrichment() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          BBC Radio 2 Contact Enrichment: From 12 Hours to 2 Minutes
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
          <span>Chris Schofield</span>
          <span className="hidden sm:inline">•</span>
          <span>Radio promoter</span>
          <span className="hidden sm:inline">•</span>
          <span>Case study format</span>
          <span className="hidden sm:inline">•</span>
          <span>10 min read</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">
            BBC Radio 2 is the UK&apos;s most popular radio station (12.6 million weekly listeners) targeting 35-54 year olds with mainstream pop, rock, soul, and specialist programming. Artists waste 12 hours understanding demographic fit (is my music right for 35-54 vs Radio 1&apos;s youth audience?), January 2025 schedule changes (Scott Mills breakfast, Trevor Nelson afternoon), and specialist evening shows (DJ Spoony garage, Sophie Ellis-Bextor disco). Audio Intel provides genre-match scoring and demographic analysis in 2 minutes.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The artist: UK independent pop/rock act researching if Radio 2 is appropriate target vs Radio 1 or 6 Music. The challenge: understanding 35-54 demographic fit, recent presenter changes, and submission routes. Below are the discoveries that mattered.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Effort (Before Audio Intel)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 12 hours researching demographic fit (35-54 vs Radio 1 youth audience)</li>
                <li>• Confusion from January 2025 schedule changes (Scott Mills, Trevor Nelson moves)</li>
                <li>• Hours identifying specialist evening shows vs daytime programming</li>
                <li>• Wrong assumption: believed direct presenter contact possible like regional stations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Intel Run (After Build)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 2 minutes processing time for complete Radio 2 demographic and schedule intelligence</li>
                <li>• January 2025 changes mapped: Scott Mills breakfast, Trevor Nelson afternoon (2-4pm)</li>
                <li>• Specialist evening shows identified: DJ Spoony (garage), Sophie Ellis-Bextor (disco)</li>
                <li>• Demographic fit analysis: 35-54 mainstream pop/rock vs Radio 1 youth-focused programming</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="why-manual-failed" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            BBC Radio 2 targets a completely different demographic than Radio 1 (35-54 vs 15-29). Recent schedule changes and specialist programming create confusion. Here are the problems that killed the first attempt.
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            <li>
              <strong className="text-gray-900">Demographic confusion:</strong> Is my music right for 35-54 audience (Radio 2) vs Radio 1&apos;s 15-29 youth demographic? 82% of Radio 2 listeners are over 35, requiring different musical approach than youth-focused Radio 1.
            </li>
            <li>
              <strong className="text-gray-900">January 2025 schedule overhaul:</strong> Scott Mills moved to breakfast (replacing Zoe Ball after 6 years), Trevor Nelson moved to 2-4pm afternoon slot (replacing Scott Mills), DJ Spoony expanded to 4 weekly shows, Sophie Ellis-Bextor&apos;s Kitchen Disco extended from 1 to 2 hours. Outdated research causes wrong presenter targeting.
            </li>
            <li>
              <strong className="text-gray-900">Daytime vs specialist evening split:</strong> Mainstream pop/rock daytime programming (Scott Mills breakfast, Trevor Nelson soul/R&B afternoon) requires different approach than specialist evening shows (DJ Spoony garage, Sophie Ellis-Bextor disco, Elaine Paige musical theatre).
            </li>
            <li>
              <strong className="text-gray-900">No direct presenter contact:</strong> Unlike some regional stations, Radio 2 does NOT accept direct submissions to presenters. BBC Introducing Uploader is the ONLY official route for unsigned/independent artists.
            </li>
          </ul>
        </section>

        <section id="audio-intel-workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How the Audio Intel Workflow Rebuilt the Strategy</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment run started with basic Radio 2 information and fundamental demographic question: is this the right station for my music? Audio Intel did the heavy lifting.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload basic station info:</strong> Input &quot;BBC Radio 2&quot; and &quot;pop/rock&quot; into Audio Intel enrichment tool.
            </li>
            <li>
              <strong className="text-gray-900">Demographic analysis:</strong> Platform flagged 35-54 core audience (82% over 35) vs Radio 1&apos;s youth focus. Genre-match scoring provided to determine if music fits mainstream Radio 2 format or better suited to Radio 1/6 Music.
            </li>
            <li>
              <strong className="text-gray-900">Schedule changes mapped:</strong> January 2025 overhaul detailed: Scott Mills breakfast (weekdays 6:30-9:30am), Trevor Nelson afternoon (2-4pm soul/R&B), DJ Spoony expanded (Mon-Thu 10pm-midnight garage/house), Sophie Ellis-Bextor extended (Fri 9-11pm disco).
            </li>
            <li>
              <strong className="text-gray-900">Submission route clarified:</strong> BBC Introducing Uploader marked as ONLY submission method. No direct presenter contact permitted. Regional team forwarding process explained with 6-month review guarantee.
            </li>
          </ol>
        </section>

        <section id="enriched-contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Sample BBC Radio 2 Contacts After Enrichment</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role & Show</th>
                  <th className="py-3 px-4">Genre Focus & Submission Notes</th>
                  <th className="py-3 px-4">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-4 px-4 font-semibold">Scott Mills</td>
                  <td className="py-4 px-4">Breakfast Show (Weekdays 6:30-9:30am)</td>
                  <td className="py-4 px-4">Mainstream pop/rock, current chart hits, classic pop from 1960s onwards. Took over from Zoe Ball January 2025. Requires radio-friendly tracks for 35-54 demographic.</td>
                  <td className="py-4 px-4">Validated, 98% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Trevor Nelson</td>
                  <td className="py-4 px-4">Afternoon Show (Weekdays 2-4pm)</td>
                  <td className="py-4 px-4">Soul, R&B, classic funk, contemporary R&B with mainstream crossover. Moved from late evening to daytime January 2025.</td>
                  <td className="py-4 px-4">Validated, 97% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">DJ Spoony</td>
                  <td className="py-4 px-4">The Good Groove (Mon-Thu 10pm-midnight)</td>
                  <td className="py-4 px-4">Garage, house, dance, UK garage revival. Extended to 4 weekly shows in 2025. Specialist evening programming for electronic/dance.</td>
                  <td className="py-4 px-4">Validated, 96% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Sophie Ellis-Bextor</td>
                  <td className="py-4 px-4">Kitchen Disco (Fri 9-11pm)</td>
                  <td className="py-4 px-4">Disco, dance-pop, party music. Extended from 1 to 2 hours in 2025. Friday night party vibe, disco and contemporary dance focus.</td>
                  <td className="py-4 px-4">Validated, 96% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Elaine Paige</td>
                  <td className="py-4 px-4">Elaine Paige on Sunday (Sunday evening)</td>
                  <td className="py-4 px-4">Musical theatre, Broadway, West End, show tunes. Specialist show for theatrical music only.</td>
                  <td className="py-4 px-4">Validated, 94% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">BBC Introducing</td>
                  <td className="py-4 px-4">Uploader Submission</td>
                  <td className="py-4 px-4">ONLY official submission route. 2 tracks/month max, 6-month review guarantee. No direct presenter contact allowed. Music must fit 35-54 demographic.</td>
                  <td className="py-4 px-4">Validated, 99% confidence</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* SOURCE VERIFICATION: BBC Radio 2 research file, January 2025 schedule changes verified */}
          <p className="text-sm text-gray-500">
            BBC Radio 2 does NOT accept direct submissions to presenters. BBC Introducing Uploader is the only official route, with regional teams forwarding Radio 2-appropriate tracks to national station.
          </p>
        </section>

        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Changed After Switching to Enrichment</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            <div>
              <h3 className="text-2xl font-black mb-2">12 Hours Saved</h3>
              <p className="text-base leading-relaxed">
                Manual research dropped from 12 hours to 2 minutes. Genre-match scoring prevented wasted submission to wrong demographic station.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Schedule Clarity</h3>
              <p className="text-base leading-relaxed">
                January 2025 changes (Scott Mills breakfast, Trevor Nelson afternoon) mapped immediately. Prevented targeting wrong presenters with outdated information.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Specialist Show Match</h3>
              <p className="text-base leading-relaxed">
                DJ Spoony garage show and Sophie Ellis-Bextor disco show identified for electronic/dance artists. Prevented generic daytime targeting when specialist evening show better fit.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Use This Playbook for Your Next BBC Radio 2 Pitch</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you have mainstream pop/rock/soul music targeting 35-54 year olds (82% of Radio 2 listeners over 35), the fastest route is BBC Introducing Uploader with demographic fit analysis. Here is the exact checklist.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>Confirm demographic fit: Does your music appeal to 35-54 year olds? If targeting younger audience, Radio 1 may be better fit.</li>
            <li>Identify correct show match: Mainstream pop/rock (Scott Mills breakfast), soul/R&B (Trevor Nelson afternoon), garage/house (DJ Spoony evening), disco (Sophie Ellis-Bextor Friday).</li>
            <li>Register on BBC Introducing Uploader (ONLY official submission route - no direct presenter contact).</li>
            <li>Upload professional, radio-ready track (2 tracks per month maximum, clean versions only, under 4 minutes recommended).</li>
            <li>Regional BBC Introducing team reviews and forwards Radio 2-appropriate tracks to national station.</li>
            <li>Understand competition: 190,000+ artists, 470,000+ tracks competing. Professional production quality and demographic fit essential.</li>
          </ol>
        </section>

        <section id="demographic-guide" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Radio 2 vs Radio 1 Demographic Guide</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">BBC Radio 2</th>
                  <th className="py-3 px-4">BBC Radio 1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-4 px-4 font-semibold">Core Demographic</td>
                  <td className="py-4 px-4">35-54 years (82% over 35)</td>
                  <td className="py-4 px-4">15-29 years (youth focus)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Music Format</td>
                  <td className="py-4 px-4">Mainstream pop/rock, classic hits, specialist evening</td>
                  <td className="py-4 px-4">Current chart, new music, youth-oriented</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Weekly Listeners</td>
                  <td className="py-4 px-4">12.6 million (most popular UK station)</td>
                  <td className="py-4 px-4">8.5 million (youth-focused)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Submission Route</td>
                  <td className="py-4 px-4">BBC Introducing Uploader only</td>
                  <td className="py-4 px-4">BBC Introducing Uploader only</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* SOURCE VERIFICATION: Demographic comparison from BBC Radio 2 research file */}
        </section>

        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Artists Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            &quot;I wasted hours researching Radio 2 vs Radio 1 demographic fit. Audio Intel showed me the 35-54 vs 15-29 split immediately and mapped the January 2025 schedule changes so I targeted the right presenters.&quot;
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, October 2025.</p>
        </section>

        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Ready to Stop Guessing BBC Radio 2 Demographic Fit?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Audio Intel was built by people who actually pitch UK mainstream radio every month. Drop your messy spreadsheet, and we will return demographic fit analysis, presenter-to-genre matching, schedule change intelligence, and BBC Introducing submission rules so you spend time on the music rather than the research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/pricing?plan=professional&billing=monthly"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
            >
              Drop Your Chaos Here
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold text-base px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
            >
              Try the Live Demo
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
