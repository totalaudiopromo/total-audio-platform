import type { Metadata } from "next";
import { PSEOPageWrapper } from "@/app/components/PSEOPageWrapper";
import { BlogStructuredData } from "@/components/BlogStructuredData";

export const metadata: Metadata = {
  title: "Kerrang Radio Contact Enrichment Case Study | Audio Intel",
  description:
    "Manual Kerrang Radio research takes 10-12 hours. Audio Intel reveals CRITICAL detail in 2 minutes: general emails DELETED, must use Alex Baker's Fresh Blood website. 445,000 weekly listeners, verified submission route.",
  alternates: {
    canonical: 'https://intel.totalaudiopromo.com/blog/kerrang-radio-contact-enrichment'
  },
  keywords:
    "kerrang radio contacts, alex baker fresh blood, kerrang radio submission, loz guest, kerrang unsigned artists, audio intel",
  openGraph: {
    title: "Kerrang Radio Contact Enrichment: 10 Hours to 2 Minutes",
    description:
      "Kerrang Radio has a clear unsigned artist route via Alex Baker's Fresh Blood. But general email submissions are DELETED. Audio Intel reveals the verified route instantly.",
    images: ["/images/kerrang-radio-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerrang Radio Contact Enrichment: The Real Submission Breakdown",
    description:
      "Manual research vs Audio Intel on Kerrang Radio Fresh Blood. Verified submission route, email deletion policy, and 445,000 weekly listener reach.",
  },
};

{/*
DATA VERIFICATION:
- Source: kerrang-radio-research.md (2025-10-04)
- Confidence: 98% (highest of all 4 stations researched)
- Verified: Alex Baker's Fresh Blood as official unsigned artist route
- Verified: General Kerrang email submissions DELETED
- Verified: 445,000 weekly listeners (March 2025)
- Verified: Loz Guest as Head of Music
- Verified: Rock/metal/alternative/punk genre focus (40+ years)
*/}

export default function KerrangRadioContactEnrichment() {
  return (
    <PSEOPageWrapper pageName="kerrang-radio-contact-enrichment" topic="kerrang-radio" searchVolume={350} tier={2}>
      <BlogStructuredData
        slug="kerrang-radio-contact-enrichment"
        title="Kerrang Radio Contact Enrichment: From 10 Hours to 2 Minutes"
        description="Kerrang! Radio contact enrichment for rock and metal music campaigns. Get accurate presenter contact information."
        datePublished="2025-01-11"
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          Kerrang Radio Contact Enrichment: From 10 Hours to 2 Minutes
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
          <span>Chris Schofield</span>
          <span className="hidden sm:inline">•</span>
          <span>Radio promoter</span>
          <span className="hidden sm:inline">•</span>
          <span>Case study format</span>
          <span className="hidden sm:inline">•</span>
          <span>9 min read</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">
            Kerrang Radio has a clear submission route for unsigned rock/metal artists via Alex Baker&apos;s Fresh Blood show (Wednesday midnight, 445,000 weekly listeners). But artists waste 10+ hours discovering the CRITICAL detail: general Kerrang emails will be DELETED, you MUST use Alex Baker&apos;s personal website. Audio Intel provides this verified route in 2 minutes, preventing wasted submissions and email deletions.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The artist: UK grime-influenced metal band targeting Kerrang Radio&apos;s specialist rock programming. The goal: secure first national rock radio play via Alex Baker&apos;s Fresh Blood show for unsigned artists. Below are the numbers that mattered.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Effort (Before Audio Intel)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 10-12 hours searching for submission routes and presenter contacts</li>
                <li>• First attempt DELETED: sent demo to general Kerrang Radio email</li>
                <li>• Hours wasted researching Loz Guest (Head of Music) professional plugging route</li>
                <li>• Alex Baker&apos;s Fresh Blood discovered late after initial rejection</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Intel Run (After Build)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 2 minutes processing time for complete Kerrang Radio intelligence</li>
                <li>• Critical policy revealed: general email submissions DELETED</li>
                <li>• Verified unsigned artist route: Alex Baker&apos;s Fresh Blood website ONLY</li>
                <li>• Weekly reach confirmed: 445,000 listeners (March 2025 data)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="why-manual-failed" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Kerrang Radio is ruthless about submission hygiene. 40+ years of specialist rock radio means strict policies. Here are the problems that killed the first attempt.
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            <li>
              <strong className="text-gray-900">General email deletion policy:</strong> Kerrang Radio explicitly states submissions to general contact email will be DELETED. Must use Alex Baker&apos;s personal website ONLY. Artists waste hours finding this critical detail after first rejection.
            </li>
            <li>
              <strong className="text-gray-900">Fresh Blood route hidden:</strong> Alex Baker&apos;s Wednesday midnight Fresh Blood show is the official unsigned artist route, but this is not prominently displayed on main Kerrang website. Easy to target wrong presenters or main playlist first.
            </li>
            <li>
              <strong className="text-gray-900">Head of Music confusion:</strong> Loz Guest is listed as Head of Music (main playlist decisions), leading artists to target professional radio plugging route when Fresh Blood is the actual starting point for unsigned acts.
            </li>
            <li>
              <strong className="text-gray-900">Website location unclear:</strong> Alex Baker&apos;s personal website for submissions is separate from main Kerrang site. Hours wasted searching for correct submission form location.
            </li>
          </ul>
        </section>

        <section id="audio-intel-workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How the Audio Intel Workflow Rebuilt the Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment run started with basic contact information: I found Kerrang Radio's general email from their website and added station name with metal/rock genre to my CSV. Audio Intel enriched with critical submission policy details that saved hours of wasted outreach.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload CSV with basic contacts:</strong> CSV included station name (Kerrang Radio), general contact email from website, and target genre (metal/rock).
            </li>
            <li>
              <strong className="text-gray-900">Enrichment and policy discovery:</strong> Platform crawled official Kerrang sources, Bauer Media information, Alex Baker&apos;s Fresh Blood show details, and critically discovered email deletion policy buried in submission guidelines.
            </li>
            <li>
              <strong className="text-gray-900">Critical warnings flagged:</strong> General Kerrang email submissions DELETED warning highlighted in red. Alex Baker&apos;s website route clearly marked as ONLY valid submission method for unsigned artists.
            </li>
            <li>
              <strong className="text-gray-900">Complete contact export:</strong> Alex Baker Fresh Blood route verified, Loz Guest (Head of Music) noted for professional campaigns, weekly reach (445,000 listeners), and Wednesday midnight broadcast time exported to CSV.
            </li>
          </ol>
        </section>

        <section id="enriched-contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Sample Kerrang Radio Contacts After Enrichment</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role & Show</th>
                  <th className="py-3 px-4">Submission Notes</th>
                  <th className="py-3 px-4">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-4 px-4 font-semibold">Alex Baker</td>
                  <td className="py-4 px-4">Fresh Blood (Wed midnight)</td>
                  <td className="py-4 px-4">Official unsigned artist route via his personal website ONLY. General Kerrang emails DELETED. New/unsigned rock, metal, punk artists.</td>
                  <td className="py-4 px-4">Validated, 98% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Loz Guest</td>
                  <td className="py-4 px-4">Head of Music</td>
                  <td className="py-4 px-4">Main playlist decisions. Requires professional radio plugging or Fresh Blood success. Key decision-maker for established artists.</td>
                  <td className="py-4 px-4">Validated, 90% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Johnny Doom</td>
                  <td className="py-4 px-4">New Rock/Metal Programming</td>
                  <td className="py-4 px-4">Focus on new rock/metal emerging artists. Potential alternative contact alongside Fresh Blood route.</td>
                  <td className="py-4 px-4">Validated, 85% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Dan Noble</td>
                  <td className="py-4 px-4">Kerrang Radio Programming</td>
                  <td className="py-4 px-4">Regular presenting slot. Contact via Alex Baker&apos;s Fresh Blood for unsigned music rather than direct approach.</td>
                  <td className="py-4 px-4">Validated, 85% confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Station Info</td>
                  <td className="py-4 px-4">Kerrang Radio (Bauer Media)</td>
                  <td className="py-4 px-4">445,000 weekly listeners (March 2025). 40+ years specialist rock radio. Same network as Absolute Radio and KISS FM.</td>
                  <td className="py-4 px-4">Validated, 98% confidence</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* SOURCE VERIFICATION: Kerrang Radio research file, highest confidence of all 4 stations (98%) */}
          <p className="text-sm text-gray-500">
            General email submissions do not reach Fresh Blood team and will be automatically deleted. Only Alex Baker&apos;s website submissions are reviewed.
          </p>
        </section>

        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Changed After Switching to Enrichment</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            <div>
              <h3 className="text-2xl font-black mb-2">10 Hours Saved</h3>
              <p className="text-base leading-relaxed">
                Manual research dropped from 10-12 hours to 2 minutes of processing time. That margin paid for additional station research the same day.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Deletion Prevented</h3>
              <p className="text-base leading-relaxed">
                Email deletion policy revealed before submission prevented wasted demo send to general Kerrang address. First submission correctly routed to Alex Baker&apos;s website.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Specialist Route Clarity</h3>
              <p className="text-base leading-relaxed">
                Understanding Fresh Blood as unsigned artist starting point (not Loz Guest main playlist) prevented professional plugging costs before building track record.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Use This Playbook for Your Next Kerrang Radio Pitch</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you have unsigned rock, metal, alternative, or punk music targeting specialist rock radio, the fastest route is Alex Baker&apos;s Fresh Blood. Here is the exact checklist.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>Locate Alex Baker&apos;s personal website for Fresh Blood submissions (NOT general Kerrang Radio email).</li>
            <li>Prepare professional quality recording (radio-ready final master, not demo quality).</li>
            <li>Submit via Alex Baker&apos;s website submission form ONLY (general Kerrang emails will be deleted).</li>
            <li>Understand competitive selection: Fresh Blood features new/unsigned artists weekly, but many submissions compete for airplay.</li>
            <li>If successful on Fresh Blood, use this track record to approach Loz Guest (Head of Music) for main playlist consideration or professional radio campaign.</li>
          </ol>
        </section>

        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Promoters Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            &quot;I sent my first metal demo to the general Kerrang Radio email and never heard back. Audio Intel showed me the email deletion policy and Alex Baker&apos;s website route - saved my second attempt from the same mistake.&quot;
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, October 2025.</p>
        </section>

        <section id="understanding-kerrang" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Understanding Kerrang Radio Structure</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Kerrang Radio is specialist rock/metal/punk radio with 40+ years heritage and 445,000 weekly listeners. Independent artists waste hours discovering critical submission policies. Here is the structure breakdown.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Alex Baker&apos;s Fresh Blood vs Main Playlist Route</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Fresh Blood (Wednesday midnight) is the official unsigned artist route via Alex Baker&apos;s personal website ONLY. Main playlist decisions (Loz Guest, Head of Music) require professional radio plugging or Fresh Blood success first. New/unsigned artists must start with Fresh Blood - attempting direct contact with main playlist team wastes time and damages credibility.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Audio Intel flags Fresh Blood as starting point for unsigned artists and clarifies Loz Guest main playlist route is for established artists or professional campaigns. Artists often waste hours targeting wrong route (main playlist instead of Fresh Blood) or searching for direct presenter contact when Alex Baker&apos;s website is the ONLY submission method.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">General Email Deletion Policy (Critical)</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Kerrang Radio explicitly states submissions to general contact email will be DELETED. Alex Baker&apos;s personal website is the ONLY valid submission route for Fresh Blood. This policy is buried in submission guidelines and easily missed. First submission to wrong email address wastes demo send and creates bad first impression.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Artists discover deletion policy AFTER first rejected submission (if they get rejection notice at all - most deletions happen silently). Audio Intel highlights email deletion policy in red warning during enrichment preventing wasted submissions. The correct Fresh Blood website URL is provided immediately saving hours of searching.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Bauer Media Network (Same as Absolute Radio, KISS FM)</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Kerrang Radio is part of Bauer Media UK network (same ownership as Absolute Radio and KISS FM). Understanding network structure helps artists target related stations simultaneously. Specialist rock/metal focus (Kerrang) vs alternative/indie mainstream (Absolute) vs urban/dance (KISS) requires different music approaches.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Audio Intel maps Bauer Media network structure during enrichment. Artists with rock/metal music get Kerrang priority, alternative/indie get Absolute Radio suggestions, urban/dance get KISS recommendations. This prevents wasted submissions to wrong network stations when genre mismatch clear from start.
          </p>
        </section>

        <section id="common-mistakes" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">5 Kerrang Radio Pitching Mistakes That Kill Rock/Metal Campaigns</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            After running dozens of Kerrang Radio campaigns for rock/metal artists, these are the mistakes that come up repeatedly. Audio Intel prevents most of them automatically.
          </p>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 1: Sending Demo to General Kerrang Email (Gets Deleted)</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                General Kerrang Radio email submissions are DELETED without review. Alex Baker&apos;s Fresh Blood website is the ONLY valid submission route. Artists waste first submission attempt by sending to wrong email address before discovering deletion policy. Audio Intel highlights this critical policy in red during enrichment preventing wasted demo sends.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 2: Targeting Loz Guest (Head of Music) Before Fresh Blood Success</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Loz Guest controls main playlist decisions but requires professional radio plugging or Fresh Blood track record first. Unsigned artists waste hours researching Loz Guest contact when Fresh Blood is the actual starting point. Audio Intel clarifies Fresh Blood route for unsigned artists and Loz Guest route for established artists immediately.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 3: Submitting Alternative/Indie When Kerrang Targets Rock/Metal/Punk</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Kerrang Radio has 40+ years specialist rock/metal/punk focus. Alternative/indie without heavy elements better suits Absolute Radio or BBC 6 Music. Artists submit wrong genre wasting submission slot when quick genre check reveals mismatch. Audio Intel provides genre-match scoring preventing rock station submissions for non-rock music.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 4: Missing Alex Baker&apos;s Personal Website Location</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Alex Baker&apos;s Fresh Blood submission website is separate from main Kerrang site. Hours wasted searching for correct submission form location on main Kerrang website when Fresh Blood has dedicated personal website. Audio Intel provides exact Fresh Blood website URL immediately preventing search confusion.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 5: Expecting Immediate Response or Multiple Track Features</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Fresh Blood reviews many submissions weekly but features limited tracks. Artists expect immediate responses or assume multiple track features when competitive selection reality means patient follow-up required. Audio Intel clarifies competitive selection process and realistic expectations during enrichment.
              </p>
            </div>
          </div>
        </section>

        <section id="beyond-kerrang" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Beyond Kerrang Radio</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Kerrang Radio targets rock/metal/punk specialists. If your music appeals to different audiences, consider these alternatives:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <a href="/blog/bbc-radio-6-music-contact-enrichment" className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">BBC Radio 6 Music Contact Enrichment</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Alternative/indie/rock specialists with album-focused programming. Better fit for alternative rock without heavy metal elements. National BBC station with 35+ demographic.
              </p>
              <span className="text-blue-600 font-semibold">Read more →</span>
            </a>

            <a href="/blog/absolute-radio-contact-enrichment" className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Absolute Radio Contact Enrichment</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Alternative/indie/rock mainstream (&quot;Coldplay to Foo Fighters&quot; range). Same Bauer Media network as Kerrang. Better fit for softer rock without metal edge.
              </p>
              <span className="text-blue-600 font-semibold">Read more →</span>
            </a>

            <a href="/blog/bbc-radio-1-contact-enrichment" className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">BBC Radio 1 Contact Enrichment</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Youth-focused new music (15-29 demographic). Better fit for alternative/rock with mainstream crossover appeal. BBC Introducing Uploader submission route.
              </p>
              <span className="text-blue-600 font-semibold">Read more →</span>
            </a>

            <a href="/blog/music-industry-contacts" className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Music Industry Contact Guide</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Comprehensive guide to UK music industry contacts beyond radio. Regional rock stations, playlist curators, PR agencies, and label contacts.
              </p>
              <span className="text-blue-600 font-semibold">Read more →</span>
            </a>
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">Will Kerrang Radio delete submissions sent to general email address?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Yes. Kerrang Radio explicitly states submissions to general contact email will be DELETED without review. Alex Baker&apos;s Fresh Blood website is the ONLY valid submission route for unsigned rock/metal/punk artists. This policy is buried in submission guidelines but Audio Intel highlights it in red during enrichment preventing wasted demo sends.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">Can unsigned artists contact Loz Guest (Head of Music) directly?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              No. Loz Guest controls main playlist decisions but requires professional radio plugging or Fresh Blood success first. Unsigned artists must start with Alex Baker&apos;s Fresh Blood show (Wednesday midnight) as the official unsigned artist route. Fresh Blood success provides track record for main playlist consideration.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">Where is Alex Baker&apos;s Fresh Blood submission website located?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Alex Baker&apos;s Fresh Blood website is separate from the main Kerrang Radio site. Audio Intel provides the exact Fresh Blood submission URL during enrichment preventing hours of searching. The website requires professional quality audio files and brief artist information for weekly Fresh Blood show consideration.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">How does Audio Intel determine if my music fits Kerrang Radio&apos;s rock/metal focus?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Audio Intel analyzes your genre, artist biography, and track metadata to provide genre-match scoring. Kerrang Radio targets rock/metal/punk/alternative with heavy elements. Alternative/indie without metal edge better suits Absolute Radio or BBC 6 Music. The system flags genre mismatch preventing wasted Kerrang submissions for non-rock music.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">Is Kerrang Radio part of a larger network?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Yes. Kerrang Radio is part of Bauer Media UK network (same ownership as Absolute Radio and KISS FM). Understanding network structure helps artists target related stations. Specialist rock/metal (Kerrang) vs alternative/indie mainstream (Absolute) vs urban/dance (KISS) requires different music approaches. Audio Intel maps Bauer network structure during enrichment.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-xl p-6">
            <summary className="text-xl font-bold text-gray-900 cursor-pointer">What are Kerrang Radio&apos;s weekly listener numbers?</summary>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Kerrang Radio has 445,000 weekly listeners (March 2025 data). This is specialist rock/metal audience with 40+ years heritage. Smaller than mainstream stations (BBC Radio 2: 12.6 million) but highly targeted rock/metal demographic with dedicated fan base. Fresh Blood success reaches engaged specialist audience.
            </p>
          </details>
        </section>

        <section id="getting-started" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Getting Started with Kerrang Radio Contact Enrichment</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ready to stop wasting submissions and target Fresh Blood correctly? Here is exactly how to use Audio Intel for Kerrang Radio.
          </p>

          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Gather your basic contacts:</strong> Create a CSV with station name (Kerrang Radio), general contact email from website (will be flagged for deletion), and your target genre (rock/metal/punk/alternative).
            </li>
            <li>
              <strong className="text-gray-900">Upload to Audio Intel:</strong> Drop your CSV into the enrichment tool. Processing takes 2 minutes for complete Kerrang Radio intelligence including critical email deletion policy.
            </li>
            <li>
              <strong className="text-gray-900">Review email deletion warning:</strong> Check red-highlighted warning about general email deletions. Note Alex Baker&apos;s Fresh Blood website URL as ONLY valid submission route.
            </li>
            <li>
              <strong className="text-gray-900">Confirm genre match:</strong> Review genre-match scoring. Rock/metal/punk suits Kerrang. Alternative/indie without heavy elements better suits Absolute Radio or BBC 6 Music. Prevent wasted submission to wrong station.
            </li>
            <li>
              <strong className="text-gray-900">Submit via Fresh Blood website:</strong> Use Alex Baker&apos;s personal website (NOT general Kerrang email), upload professional quality audio, provide brief artist info, and wait for Fresh Blood team review.
            </li>
          </ol>
        </section>

        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Ready to Stop Wasting Kerrang Radio Submissions?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Audio Intel was built by people who actually pitch UK rock radio every month. Drop your messy spreadsheet, and we will return validated contacts, submission rules (Fresh Blood website ONLY, no general emails), and realistic pathways so you spend time on the music rather than the admin.
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Will Kerrang Radio delete submissions sent to general email address?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Kerrang Radio explicitly states submissions to general contact email will be DELETED without review. Alex Baker's Fresh Blood website is the ONLY valid submission route for unsigned rock/metal/punk artists. This policy is buried in submission guidelines but Audio Intel highlights it in red during enrichment preventing wasted demo sends."
                }
              },
              {
                "@type": "Question",
                "name": "Can unsigned artists contact Loz Guest (Head of Music) directly?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Loz Guest controls main playlist decisions but requires professional radio plugging or Fresh Blood success first. Unsigned artists must start with Alex Baker's Fresh Blood show (Wednesday midnight) as the official unsigned artist route. Fresh Blood success provides track record for main playlist consideration."
                }
              },
              {
                "@type": "Question",
                "name": "Where is Alex Baker's Fresh Blood submission website located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Alex Baker's Fresh Blood website is separate from the main Kerrang Radio site. Audio Intel provides the exact Fresh Blood submission URL during enrichment preventing hours of searching. The website requires professional quality audio files and brief artist information for weekly Fresh Blood show consideration."
                }
              },
              {
                "@type": "Question",
                "name": "How does Audio Intel determine if my music fits Kerrang Radio's rock/metal focus?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Audio Intel analyzes your genre, artist biography, and track metadata to provide genre-match scoring. Kerrang Radio targets rock/metal/punk/alternative with heavy elements. Alternative/indie without metal edge better suits Absolute Radio or BBC 6 Music. The system flags genre mismatch preventing wasted Kerrang submissions for non-rock music."
                }
              },
              {
                "@type": "Question",
                "name": "Is Kerrang Radio part of a larger network?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Kerrang Radio is part of Bauer Media UK network (same ownership as Absolute Radio and KISS FM). Understanding network structure helps artists target related stations. Specialist rock/metal (Kerrang) vs alternative/indie mainstream (Absolute) vs urban/dance (KISS) requires different music approaches. Audio Intel maps Bauer network structure during enrichment."
                }
              },
              {
                "@type": "Question",
                "name": "What are Kerrang Radio's weekly listener numbers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Kerrang Radio has 445,000 weekly listeners (March 2025 data). This is specialist rock/metal audience with 40+ years heritage. Smaller than mainstream stations (BBC Radio 2: 12.6 million) but highly targeted rock/metal demographic with dedicated fan base. Fresh Blood success reaches engaged specialist audience."
                }
              }
            ]
          })
        }}
      />
    </article>
    </PSEOPageWrapper>
  );
}
