import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kerrang Radio Contact Enrichment Case Study | Audio Intel",
  description:
    "Manual Kerrang Radio research takes 10-12 hours. Audio Intel reveals CRITICAL detail in 2 minutes: general emails DELETED, must use Alex Baker's Fresh Blood website. 445,000 weekly listeners, verified submission route.",
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
    </article>
  );
}
