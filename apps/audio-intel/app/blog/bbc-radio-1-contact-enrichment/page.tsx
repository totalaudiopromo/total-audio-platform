import type { Metadata } from "next";
import { PSEOPageWrapper } from "@/app/components/PSEOPageWrapper";
import { BlogStructuredData } from "@/components/BlogStructuredData";

export const metadata: Metadata = {
  title: "BBC Radio 1 Contact Enrichment Case Study | Audio Intel",
  description:
    "Real BBC Radio 1 pitching workflow from 18 hours of manual research to a 2 minute AI enrichment run. Exact contacts, submission rules, and proof it works.",
  keywords:
    "bbc radio 1 contacts, bbc radio 1 submission guidelines, radio promotion case study, audio intel review, music contact enrichment",
  alternates: {
    canonical: 'https://intel.totalaudiopromo.com/blog/bbc-radio-1-contact-enrichment'
  },
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
    <PSEOPageWrapper
      pageName="bbc-radio-1-contact-enrichment"
      topic="bbc-radio-1"
      searchVolume={1200}
      tier={1}
    >
    <BlogStructuredData
      slug="bbc-radio-1-contact-enrichment"
      title="BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes"
      description="Real BBC Radio 1 pitching workflow from 18 hours of manual research to a 2 minute AI enrichment run. Exact contacts, submission rules, and proof it works."
      datePublished="2025-01-10"
    />
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

        <section id="understanding-bbc-radio-1" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Understanding BBC Radio 1&apos;s Contact Structure</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            BBC Radio 1 operates differently from most UK radio stations. Understanding the internal structure makes the difference
            between emails that get read and pitches that disappear into spam folders.
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-8">Specialist Shows vs Daytime Programming</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Daytime shows (breakfast, drive time) focus on chart music and proven hits. As an independent artist, you are pitching
            specialist shows: Jack Saunders&apos; Future Sounds for new music, Danny Howard for dance, Gemma Bradley for underground
            electronic. Each show has its own producer team, submission preferences, and decision timeline.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            The enrichment process identifies which shows match your genre and maps the current producer contacts. This saves the
            common mistake of pitching daytime presenters who have zero control over playlisting decisions.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Producer Teams Change Frequently</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            BBC Radio 1 rotates producers between shows every 12 to 18 months. Contact details on public pages lag weeks or months
            behind actual moves. Audio Intel cross-references LinkedIn updates, BBC press releases, and show credits to catch these
            changes before you send to an inactive inbox.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            During the enrichment run in this case study, two contacts from the original list had moved to Spotify editorial roles.
            The system flagged these automatically and suggested current replacements based on recent programme credits.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Multiple Submission Pathways</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            BBC Radio 1 maintains several official submission routes: BBC Introducing for unsigned artists, direct email to specialist
            show producers for established acts, and the legacy BBC Uploader for some programmes. The enrichment process includes
            which pathway applies to each contact, based on show format and recent submission guidelines.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            For this campaign, three contacts preferred direct Dropbox links, one required BBC Uploader submissions, and one worked
            exclusively through BBC Introducing referrals. Manual research would have missed these nuances entirely.
          </p>
        </section>

        <section id="common-mistakes" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">5 BBC Radio 1 Pitching Mistakes That Kill Campaigns</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            After running dozens of BBC Radio 1 campaigns, these are the mistakes that come up repeatedly. Audio Intel prevents most
            of them automatically.
          </p>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 1: Pitching Presenters Instead of Producers</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Clara Amfo and Greg James do not listen to unsolicited music. Their producers manage playlisting decisions. Pitching
                presenter email addresses wastes time and damages credibility. Audio Intel identifies the correct producer contact for
                each show automatically.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 2: Using Outdated Contact Lists from Forums</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Reddit threads and Facebook groups share BBC Radio 1 contact lists that are months or years out of date. Bounced emails
                trigger spam filters and block future pitches. The enrichment process validates every email address with SMTP checks
                before you send anything.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 3: Ignoring Show-Specific Submission Rules</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Each specialist show has different submission preferences: file format, delivery method, pitch timing, and supporting
                evidence requirements. Audio Intel surfaces these rules during enrichment so every pitch follows the correct format.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 4: Mass Pitching Every BBC Radio 1 Show</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Sending identical emails to fifteen different shows signals spam. BBC producers talk to each other. The enrichment
                process includes genre fit scoring so you pitch only the shows that actually play your style of music.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 5: No Follow-Up Strategy</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                BBC Radio 1 producers receive hundreds of pitches weekly. A single email rarely works. Audio Intel tracks initial sends
                and suggests follow-up timing based on show schedules and previous reply patterns.
              </p>
            </div>
          </div>
        </section>

        <section id="beyond-bbc-radio-1" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Beyond BBC Radio 1: Scaling the Same Workflow</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment process works identically for other UK radio stations and music platforms. Once you prove the workflow on
            BBC Radio 1, you can scale to BBC 6 Music, regional BBC stations, commercial radio, and streaming editorial teams.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BBC 6 Music Contacts</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Similar specialist structure to Radio 1, but targeting album tracks and alternative genres. The enrichment process
                identifies which 6 Music presenters cover your sound and surfaces their producer contacts with submission preferences.
              </p>
              <a href="/blog/bbc-radio-6-music-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                Read the BBC 6 Music case study →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spotify Editorial Teams</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Spotify editorial contacts operate differently from radio producers, but the enrichment workflow is identical. Upload
                curator emails, get verified contacts with playlist focus areas and submission guidelines.
              </p>
              <a href="/blog/spotify-editorial-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                See how it works for Spotify playlists →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 1Xtra</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Urban, grime, and UK rap focused programming. Different submission culture from mainstream Radio 1, with emphasis on
                mixtape features and live sessions. Enrichment includes 1Xtra-specific context and contact preferences.
              </p>
              <a href="/blog/bbc-radio-1xtra-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                Read the 1Xtra enrichment guide →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commercial Radio Networks</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Absolute Radio, Kerrang, and other commercial stations have centralised playlisting teams. The enrichment process maps
                these structures and identifies regional vs national decision makers.
              </p>
              <a href="/blog/kerrang-radio-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                See the Kerrang Radio workflow →
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Do I need email addresses to use Audio Intel for BBC Radio 1 contacts?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Yes. Audio Intel is a contact enrichment tool, not a contact discovery tool. You need basic email addresses to start
                  the enrichment process. These can come from BBC website searches, LinkedIn profiles, industry databases, or previous
                  campaign records.
                </p>
                <p>
                  The enrichment process then verifies those emails are current, adds submission preferences, identifies show changes,
                  and flags invalid addresses before you send anything. This prevents the common problem of pitching outdated or
                  incorrect contacts.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                How accurate are the BBC Radio 1 contact validations?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  The enrichment process uses SMTP validation, disposable domain detection, and role-based analysis to score each
                  contact. Anything below 85 percent confidence gets flagged for manual review. In this case study, all five primary
                  contacts scored above 92 percent confidence.
                </p>
                <p>
                  Validation checks are live at enrichment time, so you get current accuracy based on today&apos;s BBC infrastructure
                  rather than cached data from months ago.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Can Audio Intel find BBC Introducing contacts for unsigned artists?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  If you already have BBC Introducing contact emails (from the BBC website or previous submissions), Audio Intel
                  enriches them with current presenter assignments, regional coverage areas, and submission timing preferences.
                </p>
                <p>
                  The platform identifies which BBC Introducing shows cover your region and genre, but you still need to gather the
                  basic contact details from BBC sources first.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                How often do BBC Radio 1 contacts change?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  BBC Radio 1 rotates producers between shows every 12 to 18 months on average. Presenter changes happen less
                  frequently but still occur multiple times per year. Public contact pages often lag weeks or months behind actual
                  team moves.
                </p>
                <p>
                  Audio Intel cross-references LinkedIn updates, BBC press releases, and recent programme credits during enrichment
                  to catch these changes before they damage your campaign.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                What file formats does Audio Intel accept for BBC Radio 1 contact lists?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Upload contacts as CSV files with columns for name and email address. The platform handles common formatting
                  variations automatically. You can also include optional fields like show name, genre, or previous notes.
                </p>
                <p>
                  After enrichment, export results as CSV for your email marketing tool or as PDF summaries for client reporting.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Does this work for BBC Radio 2 and other BBC stations?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Yes. The enrichment workflow is identical for BBC Radio 2, BBC 6 Music, BBC Radio 1Xtra, and regional BBC stations.
                  Upload your existing contact emails, tag the campaign with the target station, and the enrichment process scopes
                  the correct sources and submission guidelines.
                </p>
                <p>
                  Each BBC network has different playlisting structures and submission cultures. The enrichment process adapts
                  automatically based on the station context you provide.
                </p>
              </div>
            </details>
          </div>
        </section>

        <section id="getting-started" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How to Start Your Own BBC Radio 1 Enrichment Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you have any BBC Radio 1 contact data sitting in spreadsheets, old emails, or Airtable databases, you can run the same
            enrichment workflow today. Here is the step-by-step process.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 1: Gather Your Existing Contacts</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Collect every BBC Radio 1 contact you have from previous campaigns, LinkedIn searches, BBC website scraping, or
                industry databases. Even partial or outdated data works - the enrichment process validates and updates everything.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 2: Format as CSV</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Create a CSV file with at minimum a name column and email column. Optional fields like show name, genre, or previous
                notes help the enrichment process but are not required. Save the file and prepare for upload.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 3: Upload to Audio Intel</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Log into Audio Intel, start a new enrichment campaign, and upload your CSV. Tag the campaign as BBC Radio 1 so the
                platform knows to scope BBC programme pages, show schedules, and submission guidelines during processing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 4: Review Enriched Results</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Enrichment typically completes in under two minutes. Review the confidence scores, check flagged contacts for manual
                verification, and confirm submission preferences match your campaign goals.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 5: Export and Execute</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Export the enriched contact list as CSV for your email marketing platform, or download the PDF summary to share with
                artists or labels. The enriched data includes validated emails, submission rules, and follow-up timing recommendations.
              </p>
            </div>
          </div>
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

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do I need email addresses to use Audio Intel for BBC Radio 1 contacts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Audio Intel is a contact enrichment tool, not a contact discovery tool. You need basic email addresses to start the enrichment process. These can come from BBC website searches, LinkedIn profiles, industry databases, or previous campaign records. The enrichment process then verifies those emails are current, adds submission preferences, identifies show changes, and flags invalid addresses before you send anything."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate are the BBC Radio 1 contact validations?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The enrichment process uses SMTP validation, disposable domain detection, and role-based analysis to score each contact. Anything below 85 percent confidence gets flagged for manual review. Validation checks are live at enrichment time, so you get current accuracy based on today's BBC infrastructure rather than cached data from months ago."
              }
            },
            {
              "@type": "Question",
              "name": "Can Audio Intel find BBC Introducing contacts for unsigned artists?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If you already have BBC Introducing contact emails (from the BBC website or previous submissions), Audio Intel enriches them with current presenter assignments, regional coverage areas, and submission timing preferences. The platform identifies which BBC Introducing shows cover your region and genre, but you still need to gather the basic contact details from BBC sources first."
              }
            },
            {
              "@type": "Question",
              "name": "How often do BBC Radio 1 contacts change?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BBC Radio 1 rotates producers between shows every 12 to 18 months on average. Presenter changes happen less frequently but still occur multiple times per year. Public contact pages often lag weeks or months behind actual team moves. Audio Intel cross-references LinkedIn updates, BBC press releases, and recent programme credits during enrichment to catch these changes before they damage your campaign."
              }
            },
            {
              "@type": "Question",
              "name": "What file formats does Audio Intel accept for BBC Radio 1 contact lists?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upload contacts as CSV files with columns for name and email address. The platform handles common formatting variations automatically. You can also include optional fields like show name, genre, or previous notes. After enrichment, export results as CSV for your email marketing tool or as PDF summaries for client reporting."
              }
            },
            {
              "@type": "Question",
              "name": "Does this work for BBC Radio 2 and other BBC stations?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. The enrichment workflow is identical for BBC Radio 2, BBC 6 Music, BBC Radio 1Xtra, and regional BBC stations. Upload your existing contact emails, tag the campaign with the target station, and the enrichment process scopes the correct sources and submission guidelines. Each BBC network has different playlisting structures and submission cultures. The enrichment process adapts automatically based on the station context you provide."
              }
            }
          ]
        })
      }}
    />
    </PSEOPageWrapper>
  );
}
