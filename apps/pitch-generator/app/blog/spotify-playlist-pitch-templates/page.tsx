import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Spotify Playlist Pitch Templates: Real Response Rates for 2025',
  description:
    'Write Spotify playlist pitches that get placements. See proven templates (18-28% response by genre), curator benchmarks, and exactly what makes playlist curators respond.',
  keywords:
    'spotify playlist pitch, playlist pitch template, spotify curator pitch, playlist submission template, spotify pitch writing',
};

export default function SpotifyPlaylistPitchTemplates() {
  return (
    <article className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link
            href="/blog"
            className="text-amber-600 hover:text-amber-700 font-semibold mb-4 inline-block"
          >
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Spotify Playlist Pitch Templates: Stop Guessing What Curators Want
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm">
            <span className="font-semibold">Chris Schofield</span>
            <span>•</span>
            <span>Radio promoter & playlist curator</span>
            <span>•</span>
            <span>8 min read</span>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              After pitching 500+ tracks to Spotify playlists, here's the reality: generic "please
              add my track" pitches get 3-5% response rates. But a proper genre-specific pitch with
              streaming context and curator understanding? 18-28% depending on genre fit. Here's
              exactly how to write playlist pitches that actually get placements.
            </p>
          </div>
        </header>

        <div className="space-y-12 bg-white rounded-xl p-8 md:p-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">The Reality of Playlist Pitching</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just sent the same pitch to 30 different playlist curators. You got 2
              adds out of 30 submissions. Is that good? Terrible? Should you change your approach?
              Without understanding playlist benchmarks, you're just hoping.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generic Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Same pitch to every curator (3-5% response)</li>
                  <li>• No playlist-specific context</li>
                  <li>• Wrong genre positioning</li>
                  <li>• Generic "please add" language</li>
                  <li>• No streaming data context</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Playlist-specific pitches (18-28% response)</li>
                  <li>• Reference similar tracks on playlist</li>
                  <li>• Clear genre positioning</li>
                  <li>• Compelling context about fit</li>
                  <li>• Relevant streaming momentum</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Spotify Playlist Pitch Benchmarks (2025)
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real response rates from playlist pitches. Genre fit and playlist size
              massively impact your results.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-bold">Major Playlists (1M+ followers)</span>
                <span className="text-red-600 font-black">
                  2-4% response (editorial gatekeepers)
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-bold">Mid-Tier (50K-500K followers)</span>
                <span className="text-yellow-600 font-black">8-14% response</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-bold">Growing Playlists (10K-50K)</span>
                <span className="text-green-600 font-black">
                  18-28% with perfect genre fit (TARGET HERE)
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-bold">Niche Genre Playlists</span>
                <span className="text-amber-600 font-black">
                  22-32% when genre matches perfectly
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Proven Playlist Pitch Template</h2>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-amber-900">Subject Line (Critical)</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Perfect for [Playlist Name]:</strong> [Artist] - [Track] ([Similar Artist
                  on Playlist] vibes)
                </p>
                <p className="text-sm italic">
                  Example: "Perfect for Chill Beats: Midnight Rivers - Luna (Tom Misch vibes)"
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-amber-900">Opening (Show You Listen)</h3>
              <p className="text-gray-700">
                Reference a specific track on their playlist that's similar to yours. This proves
                you actually know the playlist and aren't mass submitting.
              </p>
              <div className="bg-white p-4 rounded border border-amber-200">
                <p className="text-gray-800 italic">
                  "Love the [Track Name] add on [Playlist Name] - that blend of lo-fi beats with
                  jazz guitar is exactly where our new track '[Your Track]' sits. Think we'd fit
                  perfectly alongside it."
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-green-900">Core Pitch (The Fit)</h3>
              <p className="text-gray-700">
                2-3 sentences. Genre positioning, why it fits THIS playlist specifically, reference
                points. Don't oversell.
              </p>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-gray-800 italic">
                  "[Artist Name]'s '[Track Name]' is downtempo electronica with live instrumentation
                  - guitar and Rhodes over subtle 808s. Perfect for late-night study sessions. Sits
                  between Alfa Mist and Jordan Rakei's more electronic moments."
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-yellow-900">Context (If Relevant)</h3>
              <p className="text-gray-700">
                Only mention streaming numbers if they're actually impressive for independent
                artists (20K+ streams in first month, growing Save Rate, etc.).
              </p>
              <div className="bg-white p-4 rounded border border-yellow-200">
                <p className="text-gray-800 italic">
                  "Track's at 28K streams in 3 weeks with 18% save rate - seems to be resonating
                  with the late-night chill crowd. Getting organic playlist adds on similar vibe
                  lists."
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-amber-900">Close (Make It Easy)</h3>
              <div className="bg-white p-4 rounded border border-amber-200">
                <p className="text-gray-800 italic">
                  "Spotify link: [Your Track Link]
                  <br />
                  Would love to be part of [Playlist Name].
                  <br />
                  <br />
                  Cheers,
                  <br />
                  [Your Name]"
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Mistakes Killing Your Playlist Response Rate
            </h2>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">
                  ❌ Mass submitting to playlists you've never heard
                </h3>
                <p className="text-gray-700">
                  Curators can tell. 3% response rate. Spend 2 minutes listening to the playlist
                  first.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">
                  ❌ Subject line: "Playlist Submission"
                </h3>
                <p className="text-gray-700">
                  They get 50+ of these daily. Use: "Perfect for [Playlist Name]: [Artist] -
                  [Track]"
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Wrong genre targeting</h3>
                <p className="text-gray-700">
                  Your indie rock track doesn't fit on a lo-fi playlist. Perfect genre fit = 5x
                  better response rate.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">
                  ❌ "My song has 1.2M streams please add"
                </h3>
                <p className="text-gray-700">
                  If you have 1M+ streams, you don't need small playlists. Focus on fit, not flex.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Pitching too early</h3>
                <p className="text-gray-700">
                  Pitch 2-4 weeks before release with pre-save link. Curators need time to listen
                  and schedule adds.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Generate Playlist Pitches in 60 Seconds
            </h2>
            <div className="bg-gradient-to-br from-amber-50 to-amber-50 border-2 border-amber-300 rounded-xl p-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Pitch Generator creates playlist-specific pitches using these exact templates and
                benchmarks. Input your track details once, get customised pitches for dozens of
                playlists with proven 18-28% response rates. Built by promoters who've pitched
                thousands of playlists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pitch/generate"
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors text-center shadow-md"
                >
                  Try Free (5 pitches/month) →
                </Link>
                <Link
                  href="/pricing"
                  className="bg-white text-amber-600 border-2 border-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors text-center"
                >
                  See Pricing
                </Link>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Related Guides</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog/bbc-radio-1-pitch-writing"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    → BBC Radio 1 Pitch Writing: Industry Benchmarks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/apple-music-playlist-pitches"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    → Apple Music Playlist Pitches: Editorial vs Algorithmic
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/music-blog-pitch-writing"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    → Music Blog Pitch Writing: Templates That Get Coverage
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
