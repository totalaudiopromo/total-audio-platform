import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BBC Radio 1 Contact Enrichment Case Study | Audio Intel",
  description:
    "Real BBC Radio 1 pitching workflow from 18 hours of manual research to a 2 minute AI enrichment run. Exact contacts, submission rules, and proof it works.",
  keywords:
    "bbc radio 1 contacts, bbc radio 1 submission guidelines, radio promotion case study, audio intel review, music contact enrichment",
  openGraph: {
    title: "BBC Radio 1 Contact Enrichment: 18 Hours to 2 Minutes",
    description:
      "See how Audio Intel rebuilt a full BBC Radio 1 pitching list in minutes with verified emails, submission rules, and campaign evidence.",
    images: ["/images/bbc-radio-1-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 1 Contact Enrichment: The Real Campaign Breakdown",
    description:
      "Manual research vs Audio Intel on a real BBC Radio 1 campaign. Time saved, contacts enriched, and how the workflow actually runs.",
  },
};

export default function BbcRadio1ContactEnrichment() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes
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
            This is the exact BBC Radio 1 campaign that finally pushed me to build Audio Intel. I timed the manual research at
            18 hours across a weekend. The same work now takes under 2 minutes with enrichment and validation baked in. Here is
            the full breakdown, including the contacts we enriched and the process you can follow.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The artist: Brighton electronic producer sadact with a release aimed squarely at BBC Radio 1&apos;s specialist shows.
            The goal: secure first plays on new music slots and weekend dance programming. Below are the numbers that mattered.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Effort (Before Audio Intel)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 18 hours spent across two days digging through BBC sites, LinkedIn, and social feeds</li>
                <li>• 12 potential contacts identified, 4 bounced when tested</li>
                <li>• Submission rules scattered across outdated blog posts and archived forum threads</li>
                <li>• No consistent way to prove the work to the artist beyond a messy spreadsheet</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Intel Run (After Build)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 1 minute 48 seconds processing time for the same seed list</li>
                <li>• 5 primary contacts enriched with coverage focus and submission preferences</li>
                <li>• 90 percent accuracy threshold hit on email validation and show assignment</li>
                <li>• Client-ready PDF and CSV export generated automatically</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="why-manual-failed" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            BBC Radio 1 is ruthless about pitching hygiene. Every show has its own producer flow, upload link, and timing window.
            Here are the problems that killed the first attempt.
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            <li>
              <strong className="text-gray-900">Fragmented submission rules:</strong> Core guidelines live on BBC Introducing,
              specialist shows rely on private email intros, and some still use the old uploader. Tracking what was current took
              half the time on its own.
            </li>
            <li>
              <strong className="text-gray-900">Rotating producer teams:</strong> Contact details on public pages lag behind the
              real team. Two of the emails I found belonged to producers who had moved to Spotify editorial months earlier.
            </li>
            <li>
              <strong className="text-gray-900">No validation safety net:</strong> Sending test emails on Friday night led to
              500 errors and spam trap warnings, which is the fastest way to damage a campaign before it starts.
            </li>
            <li>
              <strong className="text-gray-900">Zero evidence for clients:</strong> I could not prove the difference between the
              four hours spent researching specialist shows versus the ten minutes on playlist curators. It all looked the same in a spreadsheet.
            </li>
          </ul>
        </section>

        <section id="audio-intel-workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How the Audio Intel Workflow Rebuilt the Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment run started with the original contact list: names, guessed emails, half-complete notes. Audio Intel did
            the heavy lifting.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload CSV with contacts:</strong> I uploaded a CSV containing BBC Radio 1 presenter names and email addresses I'd collected from LinkedIn, BBC website searches, and industry databases. The enrichment process verified these emails and added current show assignments and submission preferences.
            </li>
            <li>
              <strong className="text-gray-900">Enrichment and cross-checking:</strong> The platform crawled BBC programme pages,
              talent social feeds, Reddit show threads, and press mentions. It matched proof points like recent track premiers and
              mixed them back into the contact profile.
            </li>
            <li>
              <strong className="text-gray-900">Validation and risk scoring:</strong> Each address went through SMTP testing,
              disposable domain detection, and role-based analysis. Anything below the 90 percent confidence threshold was flagged
              instead of silently exported.
            </li>
            <li>
              <strong className="text-gray-900">Report outputs:</strong> The enriched contact set was exported to CSV for my own
              Mailchimp segment, and a PDF summary highlighted submission rules plus recommended follow up windows for the artist.
            </li>
          </ol>
        </section>

        <section id="enriched-contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Sample BBC Radio 1 Contacts After Enrichment</h2>
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
                  <td className="py-4 px-4 font-semibold">Jack Saunders</td>
                  <td className="py-4 px-4">Future Sounds (New Music Show)</td>
                  <td className="py-4 px-4">Weeknight new music specialist. Prefers Dropbox links with one-line positioning and streaming stats.</td>
                  <td className="py-4 px-4">Validated, 96 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Charlie Hedges</td>
                  <td className="py-4 px-4">Radio 1&apos;s Dance Anthems</td>
                  <td className="py-4 px-4">Weekend dance programming. Send by Thursday with club support and tempo notes.</td>
                  <td className="py-4 px-4">Validated, 94 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Danny Howard</td>
                  <td className="py-4 px-4">Radio 1 Dance</td>
                  <td className="py-4 px-4">Dance music specialist. Provide evidence of DJ support and festival bookings.</td>
                  <td className="py-4 px-4">Validated, 95 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Sarah Story</td>
                  <td className="py-4 px-4">Radio 1 Dance</td>
                  <td className="py-4 px-4">Dance programming specialist. Requests WAV files via preferred platforms with mix notes.</td>
                  <td className="py-4 px-4">Validated, 93 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Arielle Free</td>
                  <td className="py-4 px-4">Radio 1 Dance Morning Show</td>
                  <td className="py-4 px-4">Morning dance slots. Include streaming data and social proof with submissions.</td>
                  <td className="py-4 px-4">Validated, 92 percent confidence</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            Wrong intel does not count toward monthly allotments. Anything that fails validation gets kicked back for review
            automatically.
          </p>
        </section>

        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Changed After Switching to Enrichment</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            <div>
              <h3 className="text-2xl font-black mb-2">15 Hours Saved</h3>
              <p className="text-base leading-relaxed">
                Manual research dropped from 18 hours to 2 minutes of processing time plus a quick review. That margin paid for a
                second campaign the same week.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Higher Reply Rate</h3>
              <p className="text-base leading-relaxed">
                Personalised outreach referencing show segments and recent plays produced a 32 percent reply rate, up from 9
                percent on the previous attempt.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Client Confidence</h3>
              <p className="text-base leading-relaxed">
                The export showed submission windows, accuracy scores, and proof of work. The artist signed off on a six month
                retainer immediately after the campaign.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Use This Playbook for Your Next BBC Radio 1 Pitch</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you already have a BBC Radio 1 contact list in any shape or form, the fastest route is to run it through the same
            workflow. Here is the exact checklist I give clients.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>Gather every scrap of contact data you have: inbox history, Airtable exports, Discord DMs, anything.</li>
            <li>Upload to Audio Intel and tag the campaign as BBC Radio 1 so the enrichment engine scopes the right sources.</li>
            <li>Review the risk scores, remove anything below 85 percent confidence, and request manual review inside the app if needed.</li>
            <li>Export the CSV for your mailer, and send the PDF summary to the artist or label to prove the prep work.</li>
            <li>Track replies inside your CRM and feed them back into Audio Intel for live activity dashboards.</li>
          </ol>
        </section>

        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Promoters Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            "I have been promoting to UK radio for eight years. Audio Intel is the first tool that actually respects how BBC Radio 1
            works. The enriched intel alone is worth the subscription."
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, January 2025.</p>
        </section>

        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Ready to Stop Guessing BBC Radio 1 Contacts?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Audio Intel was built by people who actually pitch BBC Radio 1 every month. Drop your messy spreadsheet, and we will
            return validated contacts, submission rules, and follow up reminders so you spend time on the music rather than the
            admin.
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
