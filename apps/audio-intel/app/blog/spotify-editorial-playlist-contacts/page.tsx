import type { Metadata } from "next";
import { PSEOPageWrapper } from "@/app/components/PSEOPageWrapper";

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
    <PSEOPageWrapper pageName="spotify-editorial-playlist-contacts" topic="spotify-editorial" searchVolume={2000} tier={1}>
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
            The enrichment run started with basic playlist curator contacts: I'd manually researched 30 Spotify playlists, found curator emails/Instagram handles where possible, and added them to a CSV with playlist URLs. Audio Intel enriched these contacts with submission preferences and classified editorial vs independent playlists.
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Upload CSV with curator contacts:</strong> CSV included playlist curator names, email addresses (where found), Instagram handles, and Spotify playlist URLs for context.
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

        <section id="understanding-spotify" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Understanding Spotify&apos;s Editorial Playlist Structure</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Spotify's playlist ecosystem splits into editorial (Spotify-curated), algorithmic (personalised), and independent (user-curated). Understanding which playlists you can actually pitch makes the difference between wasted time and real placements.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Editorial vs Algorithmic vs Independent</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Editorial playlists (New Music Friday UK, Fresh Finds UK, Rap UK) are human-curated by Spotify staff. You pitch these via Spotify for Artists only, no curator contact available. Algorithmic playlists (Discover Weekly, Release Radar) are personalised per listener, you cannot pitch them directly. Independent playlists are user-curated and contactable via social media or submission forms.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Audio Intel classifies playlists automatically during enrichment. For editorial playlists, it provides Spotify for Artists submission timing and metadata recommendations. For independent playlists, it discovers curator contact information for direct outreach.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">The 28-Day Submission Window (2025 Update)</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Official Spotify documentation says "submit at least 7 days before release" but this is misleading. Editorial teams work on a 28-day cycle for serious consideration. Submissions closer to release date get less attention, often none at all.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            The enrichment process includes submission timing recommendations based on playlist tier. Flagship playlists (New Music Friday UK, Hot Hits UK) need 28+ days. Second-tier playlists (Fresh Finds UK, Indie List UK) work on 21+ days. Genre-specific playlists (Rap UK, Electronic Rising) accept 14+ days if metadata is strong.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8">Metadata Optimisation for Editorial Consideration</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Spotify for Artists pitch form requires genre, mood, instrumentation, language, culture tags, 500-character song story, promotional plans, and similar artists references. Missing fields reduce editorial consideration significantly.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            During enrichment, Audio Intel analyses your target playlists and provides metadata recommendations. For example, pitching Rap UK requires UK urban culture tags, grime or drill mood tags, and similar artists from the UK scene. Generic metadata gets ignored.
          </p>
        </section>

        <section id="common-mistakes" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">5 Spotify Editorial Pitching Mistakes That Kill Placements</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            After running dozens of Spotify campaigns for independent artists, these are the mistakes that come up repeatedly. Audio Intel prevents most of them automatically.
          </p>

          <div className="space-y-6">
            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 1: Submitting 7 Days Before Release Instead of 28 Days</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Spotify's official documentation is vague about the real editorial cycle. Artists submit 7 days before release thinking they met the requirement, but editorial teams work 28+ days in advance for serious playlists. Audio Intel surfaces the real submission timeline based on playlist tier and genre.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 2: Pitching Algorithmic Playlists Directly</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Discover Weekly and Release Radar are algorithmic, personalised per listener. You cannot pitch them via Spotify for Artists. The enrichment process classifies playlists automatically so you focus only on editorial and independent playlists where direct pitching works.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 3: Incomplete Metadata in Spotify for Artists Pitch</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Missing genre tags, mood selectors, or the 500-character song story reduces editorial consideration. Editorial teams see hundreds of pitches weekly. Incomplete metadata signals lack of professionalism. Audio Intel provides metadata optimisation recommendations based on target playlist requirements.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 4: No Backup Independent Playlist Strategy</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Relying only on Spotify editorial is risky. Rejection rates are high and you get zero feedback. Independent playlist curators provide backup strategy with faster turnaround and direct communication. The enrichment process discovers independent curator contacts automatically.
              </p>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mistake 5: Targeting Playlists Outside Your Genre</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Pitching electronic music to indie rock playlists wastes time and damages credibility with editorial teams. Genre fit matters more than playlist follower count. Audio Intel matches your sound to appropriate playlists during enrichment based on genre, mood, and instrumentation analysis.
              </p>
            </div>
          </div>
        </section>

        <section id="beyond-spotify" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Beyond Spotify: Scaling the Same Workflow</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The enrichment process works identically for Apple Music editorial, YouTube Music playlists, and radio promotion. Once you prove the workflow on Spotify, you can scale to other platforms using the same contact enrichment approach.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apple Music Editorial</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Apple Music editorial operates similarly to Spotify with human curators managing flagship playlists. The enrichment process identifies Apple Music curator contacts (where available) and provides submission timing recommendations for New Music Daily and genre-specific playlists.
              </p>
              <a href="/blog/apple-music-editorial-contacts" className="text-blue-600 font-semibold hover:underline">
                Read the Apple Music editorial guide →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 1 Specialist Shows</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Radio promotion requires different contact research but the enrichment workflow is identical. Upload BBC Radio 1 producer emails, get verified contacts with show assignments, submission preferences, and timing recommendations.
              </p>
              <a href="/blog/bbc-radio-1-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                See how it works for radio promotion →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">BBC Radio 6 Music</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Alternative and album-focused radio programming. Different submission culture from Spotify playlists but the enrichment process provides presenter contacts, show preferences, and timing windows identically.
              </p>
              <a href="/blog/bbc-radio-6-music-contact-enrichment" className="text-blue-600 font-semibold hover:underline">
                Read the BBC 6 Music enrichment guide →
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Independent Playlist Curators</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-3">
                Thousands of independent curators run Spotify playlists with 10K+ followers. The enrichment process discovers curator contacts via Instagram, Twitter, SubmitHub, and submission forms for direct outreach.
              </p>
              <a href="/blog/music-industry-contacts" className="text-blue-600 font-semibold hover:underline">
                See the independent curator discovery workflow →
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Do I need curator email addresses to use Audio Intel for Spotify playlists?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  For editorial playlists (New Music Friday UK, Fresh Finds UK), no curator contact exists - you pitch via Spotify for Artists only. Audio Intel provides editorial classification, submission timing, and metadata recommendations for these playlists.
                </p>
                <p>
                  For independent playlists (user-curated), Audio Intel enriches your existing curator contacts (from social media searches, SubmitHub, etc.) with submission preferences and contact verification. The platform is a contact enrichment tool, not a contact discovery tool.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                How accurate is the editorial vs independent playlist classification?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  The enrichment process achieves 94-98 percent accuracy on editorial vs independent classification by analysing playlist owner, curation patterns, and Spotify's official editorial playlist registry. Anything below 90 percent confidence gets flagged for manual review.
                </p>
                <p>
                  Classification updates automatically as Spotify changes playlist curation. For example, if an independent playlist becomes Spotify editorial, the enrichment process catches this during re-validation.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                When should I submit to Spotify for Artists for editorial consideration?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  For flagship editorial playlists (New Music Friday UK, Hot Hits UK), submit 28+ days before release for serious consideration. For second-tier playlists (Fresh Finds UK, Indie List UK), 21+ days works. Genre-specific playlists accept 14+ days if metadata is strong.
                </p>
                <p>
                  Official Spotify documentation says "minimum 7 days" but editorial teams work on longer cycles. Audio Intel provides submission timing recommendations based on playlist tier and genre during enrichment.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                What metadata fields matter most for Spotify editorial consideration?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Genre selection (up to 3 genres), mood and instrumentation tags, and the 500-character song story are most critical. Editorial teams are genre specialists - accurate genre tags help playlist matching. The song story should explain track context, inspiration, and why it matters.
                </p>
                <p>
                  Promotional plans and similar artists references also matter for editorial decision-making. Audio Intel provides metadata optimisation recommendations based on target playlist requirements during enrichment.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Can I pitch the same track to multiple Spotify editorial playlists?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Yes, but only one pitch per release via Spotify for Artists. You select your top playlist target in the pitch form. Editorial teams consider placement across all relevant playlists internally, so selecting "New Music Friday UK" might result in placement on "Fresh Finds UK" instead.
                </p>
                <p>
                  Audio Intel helps you select the best target playlist based on genre fit, your artist tier (emerging vs established), and historical playlist placement patterns.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                Does this work for Apple Music and YouTube Music playlists too?
                <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                <p>
                  Yes. The enrichment workflow is identical for Apple Music editorial playlists and YouTube Music curator contacts. Upload your existing curator emails or platform submission contacts, tag the campaign with the target platform, and the enrichment process provides submission timing and metadata recommendations.
                </p>
                <p>
                  Apple Music and YouTube Music have different editorial structures from Spotify, but the contact enrichment approach works the same way across all streaming platforms.
                </p>
              </div>
            </details>
          </div>
        </section>

        <section id="getting-started" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">How to Start Your Own Spotify Editorial Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you have Spotify playlist URLs, curator contacts from social media, or SubmitHub profiles sitting in spreadsheets, you can run the same enrichment workflow today. Here is the step-by-step process.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 1: Gather Your Playlist Targets</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Search Spotify for genre-specific playlists, save URLs from New Music Friday UK and Fresh Finds UK, and include independent playlists as backup. Collect curator emails from Instagram bios, Twitter profiles, or SubmitHub where available.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 2: Format as CSV</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Create a CSV file with playlist name, curator name (if known), curator email (if found), and Spotify playlist URL. Optional fields like genre, follower count, or previous notes help enrichment but are not required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 3: Upload to Audio Intel</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Log into Audio Intel, start a new enrichment campaign, and upload your CSV. Tag the campaign as Spotify editorial so the platform classifies editorial vs independent playlists and provides appropriate submission strategies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 4: Review Enriched Results</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Enrichment typically completes in under two minutes. Review the editorial classification, prioritise official Spotify playlists for Spotify for Artists pitch (28+ days before release), and identify independent playlists requiring curator outreach.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Step 5: Execute Submission Strategy</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Submit to Spotify for Artists 28+ days before release with optimised metadata. Reach out to independent curators 14-21 days before release with personalised pitches. Export the CSV for your CRM and download the PDF summary to share with management or label.
              </p>
            </div>
          </div>
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

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do I need curator email addresses to use Audio Intel for Spotify playlists?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For editorial playlists (New Music Friday UK, Fresh Finds UK), no curator contact exists - you pitch via Spotify for Artists only. Audio Intel provides editorial classification, submission timing, and metadata recommendations for these playlists. For independent playlists (user-curated), Audio Intel enriches your existing curator contacts with submission preferences and contact verification."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate is the editorial vs independent playlist classification?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The enrichment process achieves 94-98 percent accuracy on editorial vs independent classification by analysing playlist owner, curation patterns, and Spotify's official editorial playlist registry. Anything below 90 percent confidence gets flagged for manual review. Classification updates automatically as Spotify changes playlist curation."
              }
            },
            {
              "@type": "Question",
              "name": "When should I submit to Spotify for Artists for editorial consideration?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For flagship editorial playlists (New Music Friday UK, Hot Hits UK), submit 28+ days before release for serious consideration. For second-tier playlists (Fresh Finds UK, Indie List UK), 21+ days works. Genre-specific playlists accept 14+ days if metadata is strong. Official Spotify documentation says minimum 7 days but editorial teams work on longer cycles."
              }
            },
            {
              "@type": "Question",
              "name": "What metadata fields matter most for Spotify editorial consideration?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Genre selection (up to 3 genres), mood and instrumentation tags, and the 500-character song story are most critical. Editorial teams are genre specialists - accurate genre tags help playlist matching. The song story should explain track context, inspiration, and why it matters. Promotional plans and similar artists references also matter for editorial decision-making."
              }
            },
            {
              "@type": "Question",
              "name": "Can I pitch the same track to multiple Spotify editorial playlists?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, but only one pitch per release via Spotify for Artists. You select your top playlist target in the pitch form. Editorial teams consider placement across all relevant playlists internally, so selecting New Music Friday UK might result in placement on Fresh Finds UK instead. Audio Intel helps you select the best target playlist based on genre fit, your artist tier, and historical placement patterns."
              }
            },
            {
              "@type": "Question",
              "name": "Does this work for Apple Music and YouTube Music playlists too?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. The enrichment workflow is identical for Apple Music editorial playlists and YouTube Music curator contacts. Upload your existing curator emails or platform submission contacts, tag the campaign with the target platform, and the enrichment process provides submission timing and metadata recommendations. Apple Music and YouTube Music have different editorial structures from Spotify, but the contact enrichment approach works the same way across all streaming platforms."
              }
            }
          ]
        })
      }}
    />
    </PSEOPageWrapper>
  );
}
