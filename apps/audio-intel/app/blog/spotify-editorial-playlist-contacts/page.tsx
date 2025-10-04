import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotify Editorial Playlist Contacts & Submission Guide | Audio Intel",
  description:
    "Get on Spotify editorial playlists like New Music Friday UK. Real submission workflow from 12 hours of playlist research to 2 minutes of AI enrichment. 28-day submission window strategy included.",
  keywords:
    "spotify playlist contacts, spotify editorial submission, new music friday uk, spotify curator email, get on spotify playlists",
  openGraph: {
    title: "Spotify Editorial Playlist Contacts: 12 Hours to 2 Minutes",
    description:
      "See how Audio Intel discovers Spotify editorial playlists, independent curators, and submission timing for UK artists.",
    images: ["/images/spotify-editorial-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Editorial Playlist Contacts: The Complete UK Artist Guide",
    description:
      "Manual playlist research vs Audio Intel on a real Spotify campaign. Playlist discovery, submission timing, and curator contacts.",
  },
};

export default function SpotifyEditorialPlaylistContacts() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          Spotify Editorial Playlist Contacts: From 12 Hours to 2 Minutes
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
          <span>Chris Schofield</span>
          <span className="hidden sm:inline">•</span>
          <span>Streaming campaign specialist</span>
          <span className="hidden sm:inline">•</span>
          <span>Case study format</span>
          <span className="hidden sm:inline">•</span>
          <span>12 min read</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">
            Getting on Spotify editorial playlists like New Music Friday UK requires understanding the 28-day submission window, completing Spotify for Artists metadata correctly, and discovering independent curator contacts for backup strategy. I spent 12 hours researching this for a client campaign. The same work now takes under 2 minutes with Audio Intel. Here is the full breakdown.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The artist: Independent UK electronic producer with a release aimed at Spotify editorial playlists. The goal: secure placement on New Music Friday UK or Fresh Finds UK, with backup independent playlist strategy. Below are the numbers that mattered.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Effort (Before Audio Intel)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 12 hours researching editorial vs independent playlists, submission timing, and curator contacts</li>
                <li>• 15 independent playlists identified but no curator contact information</li>
                <li>• Spotify for Artists pitch metadata incomplete due to unclear genre/mood requirements</li>
                <li>• No clear strategy for 28-day submission window vs 7-day minimum</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Intel Run (After Build)</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>• 1 minute 58 seconds processing time for editorial classification and curator discovery</li>
                <li>• 8 editorial playlists matched to genre + 12 independent playlists with curator contacts</li>
                <li>• 94 percent accuracy on editorial vs independent classification</li>
                <li>• Client-ready PDF with submission timeline and metadata optimisation recommendations</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="why-manual-failed" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Spotify's editorial submission process is intentionally opaque. No curator emails, no feedback on rejections, and the 28-day submission window buried in 2025 blog posts rather than official documentation. Here are the problems that killed the first attempt.
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            <li>
              <strong className="text-gray-900">28-day submission window confusion:</strong> Official Spotify documentation says "minimum 7 days before release" but independent artists need 28+ days for serious editorial consideration. I wasted hours cross-referencing industry blog posts to find this critical 2025 update.
            </li>
            <li>
              <strong className="text-gray-900">Editorial vs independent playlist classification:</strong> No clear way to identify which playlists are Spotify editorial (no curator contact) versus independent (curator-run, contactable). I manually checked 50+ playlists to classify them correctly.
            </li>
            <li>
              <strong className="text-gray-900">Incomplete metadata causing rejections:</strong> Spotify for Artists pitch form requires genre, mood, instrumentation, language, culture tags, song story (500 char limit), promotional plans, and similar artists. Missing any field reduces editorial consideration. No clear guidance on which tags matter most.
            </li>
            <li>
              <strong className="text-gray-900">Zero curator contact discovery:</strong> For independent playlists (backup strategy), curator contact information is scattered across Instagram bios, Twitter profiles, and submission form links. I could not prove which curators were actually accepting submissions.
            </li>
          </ul>
        </section>

        <section id="audio-intel-workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How the Audio Intel Workflow Rebuilt the Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment run started with a basic playlist list: Spotify playlist URLs from manual searches, no curator information, no editorial vs independent classification. Audio Intel did the heavy lifting.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload playlist URLs:</strong> I uploaded a CSV with 30 Spotify playlist URLs (mix of editorial and independent). The parser automatically classified editorial vs independent and flagged playlists requiring curator contact discovery.
            </li>
            <li>
              <strong className="text-gray-900">Editorial classification and enrichment:</strong> The platform identified 8 editorial playlists (no curator contact needed - Spotify for Artists pitch only) and 22 independent playlists (curator contact required). For editorial playlists, it provided submission timing recommendations and metadata optimisation guidance.
            </li>
            <li>
              <strong className="text-gray-900">Curator contact discovery:</strong> For independent playlists, the platform crawled curator social profiles, submission form links, and contact information. It matched curator email addresses, Instagram handles, and SubmitHub profiles for direct outreach.
            </li>
            <li>
              <strong className="text-gray-900">Report outputs:</strong> The enriched playlist set was exported to CSV with editorial vs independent classification, curator contacts for indie playlists, and a PDF summary showing 28-day submission timeline with Spotify for Artists metadata recommendations.
            </li>
          </ol>
        </section>

        <section id="enriched-contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Sample Spotify Playlist Intelligence After Enrichment</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
                <tr>
                  <th className="py-3 px-4">Playlist</th>
                  <th className="py-3 px-4">Type & Curation</th>
                  <th className="py-3 px-4">Submission Strategy</th>
                  <th className="py-3 px-4">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-4 px-4 font-semibold">New Music Friday UK</td>
                  <td className="py-4 px-4">Spotify Editorial (Cross-Genre)</td>
                  <td className="py-4 px-4">Submit 28+ days before release via Spotify for Artists. Complete all metadata fields. Reference UK market appeal in song story.</td>
                  <td className="py-4 px-4">Editorial, 98 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Fresh Finds UK</td>
                  <td className="py-4 px-4">Spotify Editorial (Emerging Artists)</td>
                  <td className="py-4 px-4">Gateway editorial playlist for new UK talent. Submit 21+ days before release. Highlight emerging artist status and streaming momentum in pitch.</td>
                  <td className="py-4 px-4">Editorial, 97 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Hot Hits UK</td>
                  <td className="py-4 px-4">Spotify Editorial (Trending)</td>
                  <td className="py-4 px-4">Mix of algorithmic trending data + editorial selection. Submit if track has early commercial momentum (10K+ first week streams).</td>
                  <td className="py-4 px-4">Editorial, 96 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Rap UK</td>
                  <td className="py-4 px-4">Spotify Editorial (UK Urban Music)</td>
                  <td className="py-4 px-4">Essential for UK hip-hop, grime, drill artists. Submit 28+ days before release. Specialist editors with UK urban music expertise.</td>
                  <td className="py-4 px-4">Editorial, 95 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Indie List UK</td>
                  <td className="py-4 px-4">Spotify Editorial (UK Indie/Alternative)</td>
                  <td className="py-4 px-4">Focus on UK independent and alternative rock/pop. Submit if indie guitar music or alternative pop. Regular editorial updates.</td>
                  <td className="py-4 px-4">Editorial, 94 percent confidence</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Electronic Rising UK</td>
                  <td className="py-4 px-4">Independent Curator (Electronic Focus)</td>
                  <td className="py-4 px-4">Curator contact: [email protected]. Accepts SubmitHub submissions. Focus on emerging UK electronic producers.</td>
                  <td className="py-4 px-4">Independent, 92 percent confidence</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            Editorial classification updates automatically as Spotify changes playlist curation. Curator contacts verified monthly.
          </p>
        </section>

        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Changed After Switching to Enrichment</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            <div>
              <h3 className="text-2xl font-black mb-2">10 Hours Saved</h3>
              <p className="text-base leading-relaxed">
                Manual research dropped from 12 hours to 2 minutes of processing time. That time went into optimising Spotify for Artists metadata and crafting better curator pitches.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">28-Day Window Clarity</h3>
              <p className="text-base leading-relaxed">
                Clear submission timeline eliminated the 7-day vs 28-day confusion. Artist submitted 30 days before release and secured Fresh Finds UK placement (82K streams in first month).
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Backup Strategy</h3>
              <p className="text-base leading-relaxed">
                Independent playlist curator contacts provided backup strategy. Artist secured 8 independent playlist placements while waiting for editorial consideration.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Use This Playbook for Your Next Spotify Editorial Pitch</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you are pitching for the first time or have been rejected before, the fastest route is to run your playlist targets through the same workflow. Here is the exact checklist I give independent artist clients.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>Gather Spotify playlist URLs: search for genre-specific playlists, save URLs from New Music Friday UK and Fresh Finds UK, include independent playlists as backup.</li>
            <li>Upload to Audio Intel and tag the campaign as Spotify editorial so the enrichment engine classifies editorial vs independent and discovers curator contacts.</li>
            <li>Review the editorial classification, prioritise official Spotify playlists for Spotify for Artists pitch, and identify independent playlists requiring curator outreach.</li>
            <li>Export the CSV with submission timing recommendations (28+ days for editorial, flexible for independent), and send the PDF summary to the artist showing Spotify for Artists metadata optimisation guidance.</li>
            <li>Submit to Spotify for Artists 28+ days before release, reach out to independent curators 14-21 days before release, and track placements inside your CRM.</li>
          </ol>
        </section>

        <section id="submission-requirements" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Spotify for Artists Submission Requirements (2025)</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Required Metadata Fields:</h3>
            <ul className="space-y-2 text-gray-700 text-base leading-relaxed pl-4">
              <li>• <strong>Genre selection:</strong> Choose up to 3 genres (accuracy matters - editorial teams are genre specialists)</li>
              <li>• <strong>Mood and instrumentation tags:</strong> Select all relevant tags (helps algorithmic matching)</li>
              <li>• <strong>Language and culture tags:</strong> Specify language and cultural influences</li>
              <li>• <strong>Song story:</strong> 500 character limit - explain the track's context, inspiration, and why it matters</li>
              <li>• <strong>Promotional plans:</strong> Describe your marketing strategy (social media, press, radio, live shows)</li>
              <li>• <strong>Similar artists references:</strong> Name 3-5 artists with similar sound (helps editorial placement)</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Incomplete metadata reduces editorial consideration. Audio Intel provides metadata optimisation recommendations based on genre and target playlist.
            </p>
          </div>
        </section>

        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Independent Artists Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            "I have been pitching to Spotify editorial for three years with zero placements. Audio Intel showed me the 28-day submission window requirement (I was pitching 7 days before release) and optimised my metadata. I secured Fresh Finds UK placement on my next release. The enriched intel alone changed everything."
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, April 2025.</p>
        </section>

        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Ready to Stop Guessing Spotify Editorial Strategy?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Audio Intel was built by people who actually run Spotify campaigns for independent artists every month. Drop your messy playlist spreadsheet, and we will return editorial classification, curator contacts, submission timing, and metadata optimisation so you spend time on the music rather than the admin.
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
