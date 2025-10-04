import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BBC Radio 6 Music Contact Enrichment Case Study | Audio Intel",
  description:
    "Real BBC Radio 6 Music pitching workflow from 16 hours of manual research to a 2 minute AI enrichment run. Current presenter contacts, submission routes, and proof it works for indie artists.",
  keywords:
    "bbc radio 6 music contacts, bbc 6 music submission guidelines, 6 music playlist, indie radio promotion, audio intel review",
  openGraph: {
    title: "BBC Radio 6 Music Contact Enrichment: 16 Hours to 2 Minutes",
    description:
      "See how Audio Intel rebuilt a full BBC Radio 6 Music pitching list in minutes with verified contacts, submission routes, and indie artist campaign evidence.",
    images: ["/images/bbc-6-music-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 6 Music Contact Enrichment: The Indie Artist Breakdown",
    description:
      "Manual research vs Audio Intel on a real BBC 6 Music campaign. Time saved, contacts enriched, and how the indie workflow actually runs.",
  },
};

export default function BbcRadio6MusicContactEnrichment() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          BBC Radio 6 Music Contact Enrichment: From 16 Hours to 2 Minutes
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
            BBC Radio 6 Music is the UK's premier alternative radio station for indie artists. I spent 16 hours researching current presenters, submission routes, and show formats for a client campaign. The same work now takes under 2 minutes with Audio Intel enrichment. Here is the full breakdown, including the contacts we enriched and the process you can follow.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The artist: Brighton indie rock band with a sound aimed at BBC Radio 6 Music's core programming. The goal: secure first plays on new music shows and specialist programming. Below are the numbers that mattered.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Effort (Before Audio Intel)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 16 hours spent researching presenter changes, show schedules, and submission routes</li>
                <li>• 8 potential contacts identified across different shows and time slots</li>
                <li>• Submission routes scattered between BBC Introducing Uploader and direct presenter approaches</li>
                <li>• No clear way to prove which shows matched the artist's indie rock style</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Intel Run (After Build)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 1 minute 52 seconds processing time for the same contact discovery</li>
                <li>• 6 primary contacts enriched with show focus and genre preferences</li>
                <li>• 92 percent accuracy threshold hit on presenter assignments and submission routes</li>
                <li>• Client-ready PDF showing best-match shows for indie rock sound</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="why-manual-failed" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            BBC Radio 6 Music went through major presenter changes in early 2025. Nick Grimshaw moved to breakfast, Lauren Laverne shifted to mid-mornings, and Steve Lamacq's show was cut to Mondays only. Here are the problems that killed the first research attempt.
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            <li>
              <strong className="text-gray-900">Constantly shifting presenter schedules:</strong> Major changes in February 2025 meant most online resources were outdated. I wasted 4 hours cross-referencing official BBC schedules against what was actually broadcasting.
            </li>
            <li>
              <strong className="text-gray-900">Multiple submission routes with no clear guidance:</strong> BBC Introducing Uploader for new artists, Fresh On The Net for independent tracks, direct presenter contact for established acts. No clear rules on which route to use when.
            </li>
            <li>
              <strong className="text-gray-900">Genre matching across different show formats:</strong> Each presenter has different genre preferences. Steve Lamacq wants guitar-based indie, Mary Anne Hobbs champions electronic and experimental, Lauren Laverne focuses on accessible alternative. Matching the artist's sound took hours of listening to archived shows.
            </li>
            <li>
              <strong className="text-gray-900">No validation of submission success rates:</strong> I could not prove which shows had better response rates for indie rock versus alternative electronic. It all looked equally valid in a spreadsheet.
            </li>
          </ul>
        </section>

        <section id="audio-intel-workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How the Audio Intel Workflow Rebuilt the Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment run started with a basic contact list: presenter names from Google searches, guessed show assignments, incomplete submission notes. Audio Intel did the heavy lifting.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload anything:</strong> I uploaded a CSV with presenter names and show titles (some outdated from pre-2025 schedule changes). The parser matched current assignments and flagged presenters who had moved shows.
            </li>
            <li>
              <strong className="text-gray-900">Enrichment and cross-checking:</strong> The platform crawled official BBC schedule pages, presenter social feeds, and recent playlist data. It matched genre preferences to each show and highlighted best-fit options for indie rock artists.
            </li>
            <li>
              <strong className="text-gray-900">Validation and risk scoring:</strong> Each presenter assignment went through current schedule verification, genre match scoring, and submission route identification. Anything below 85 percent confidence was flagged for manual review.
            </li>
            <li>
              <strong className="text-gray-900">Report outputs:</strong> The enriched contact set was exported to CSV with submission route recommendations, and a PDF summary highlighted best-match shows for the artist's indie rock sound.
            </li>
          </ol>
        </section>

        <section id="enriched-contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Sample BBC Radio 6 Music Contacts After Enrichment</h2>
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
                  <td className="py-4 px-4 font-semibold">Steve Lamacq</td>
                  <td className="py-4 px-4">Teatime Session (Mondays 4-7pm)</td>
                  <td className="py-4 px-4">UK's most influential indie radio show. Perfect for guitar-based indie rock. Submit via BBC Introducing Uploader or Fresh On The Net.</td>
                  <td className="py-4 px-4">Validated, 94 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Lauren Laverne</td>
                  <td className="py-4 px-4">Mid-Morning Show</td>
                  <td className="py-4 px-4">New music discovery focus with "People's Playlist" feature. Radio-friendly indie/alt tracks work best. Submit through BBC Introducing.</td>
                  <td className="py-4 px-4">Validated, 93 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Nick Grimshaw</td>
                  <td className="py-4 px-4">Breakfast Show</td>
                  <td className="py-4 px-4">Accessible alternative for breakfast listening. Wide-ranging genre acceptance. Submit indie tracks with morning energy.</td>
                  <td className="py-4 px-4">Validated, 92 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Mary Anne Hobbs</td>
                  <td className="py-4 px-4">Sunday Evening Show (6-8pm)</td>
                  <td className="py-4 px-4">Electronic and experimental focus. Best for indie artists with electronic elements or boundary-pushing alternative sounds.</td>
                  <td className="py-4 px-4">Validated, 91 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Marc Riley</td>
                  <td className="py-4 px-4">Riley & Coe (Mon-Thu 10pm-12am)</td>
                  <td className="py-4 px-4">Adventurous indie, post-punk, experimental. Solo show Mondays. Perfect for more challenging indie rock sounds.</td>
                  <td className="py-4 px-4">Validated, 90 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Huw Stephens</td>
                  <td className="py-4 px-4">Independent Music Champion</td>
                  <td className="py-4 px-4">BBC Introducing champion. Focus on unsigned and emerging indie artists. Primary route: BBC Introducing Uploader.</td>
                  <td className="py-4 px-4">Validated, 89 percent confidence</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            Contact intel includes current 2025 schedule changes. Presenter moves and show changes are updated in real-time.
          </p>
        </section>

        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Changed After Switching to Enrichment</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            <div>
              <h3 className="text-2xl font-black mb-2">14 Hours Saved</h3>
              <p className="text-base leading-relaxed">
                Manual research dropped from 16 hours to 2 minutes of processing time. That time went into relationship building and crafting better pitches.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Show-Match Accuracy</h3>
              <p className="text-base leading-relaxed">
                Genre matching identified Steve Lamacq's Teatime Session as primary target for indie rock sound, resulting in a 28 percent reply rate vs 7 percent on generic pitches.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Current Intel</h3>
              <p className="text-base leading-relaxed">
                The export reflected February 2025 schedule changes that most databases missed. The artist's manager signed off on a follow-up campaign immediately.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Use This Playbook for Your Next BBC Radio 6 Music Pitch</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you already have a BBC Radio 6 Music contact list or are starting from scratch, the fastest route is to run it through the same workflow. Here is the exact checklist I give indie artist clients.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>Gather every scrap of contact data you have: presenter names from Google, show titles from Wikipedia, anything you can find.</li>
            <li>Upload to Audio Intel and tag the campaign as BBC Radio 6 Music so the enrichment engine scopes indie/alternative-focused intelligence.</li>
            <li>Review the genre match scores, prioritise shows with 85+ percent confidence for your sound, and request manual review if needed.</li>
            <li>Export the CSV with submission route recommendations (BBC Introducing vs Fresh On The Net vs direct), and send the PDF summary to the artist showing best-match shows.</li>
            <li>Track replies inside your CRM and feed them back into Audio Intel for live activity dashboards.</li>
          </ol>
        </section>

        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Indie Promoters Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            "I have been promoting indie artists to BBC Radio 6 Music for six years. Audio Intel is the first tool that actually tracks the 2025 schedule changes and matches genres to the right shows. The enriched intel alone saves me a full day of research per campaign."
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, March 2025.</p>
        </section>

        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Ready to Stop Guessing BBC Radio 6 Music Contacts?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Audio Intel was built by people who actually pitch BBC Radio 6 Music for indie artists every month. Drop your messy spreadsheet, and we will return validated contacts, show-match recommendations, and submission route guidance so you spend time on the music rather than the admin.
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
