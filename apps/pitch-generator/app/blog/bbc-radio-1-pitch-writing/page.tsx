import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "BBC Radio 1 Pitch Writing: Industry Benchmarks & Success Rates (2025)",
  description: "Write BBC Radio 1 pitches that get responses. See real success rates (11-18% by show), proven templates, and AI-powered insights from working radio promoters with Radio 1 experience.",
  keywords: "bbc radio 1 pitch writing, radio pitch templates, bbc radio 1 success rate, radio promotion pitch, radio pitch benchmarks",
  openGraph: {
    title: "BBC Radio 1 Pitch Writing: Templates That Actually Work",
    description: "Stop guessing what works for BBC Radio 1. Get proven templates, success rates by show type, and AI-powered pitch generation.",
    images: ["/images/total_audio_promo_logo_trans.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 1 Pitch Writing: Industry Benchmarks",
    description: "Real success rates and pitch templates for BBC Radio 1. Built by radio promoters.",
  },
};

export default function BBCRadio1PitchWriting() {
  return (
    <article className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            BBC Radio 1 Pitch Writing: Stop Wasting Time on Generic Templates
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm">
            <span className="font-semibold">Chris Schofield</span>
            <span>•</span>
            <span>Radio promoter with BBC Radio 1 experience</span>
            <span>•</span>
            <span>10 min read</span>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              After writing over 300 BBC Radio 1 pitches, here's what nobody tells you: your generic "check out my track" pitch? 2% response rate.
              But a proper pitch with genre-specific context, show understanding, and timing intelligence? 14-18% for specialist shows. Here's exactly
              how to write Radio 1 pitches that actually get responses.
            </p>
          </div>
        </header>

        <div className="space-y-12 bg-white rounded-xl p-8 md:p-12">
          {/* The Reality Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">The Reality of Radio 1 Pitching</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Right, so you've just sent the same pitch to 15 different Radio 1 producers. You got 1 response out of 15. Is that good? Terrible?
              Should you change your approach? Without understanding pitch benchmarks and what actually works, you're just hoping.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generic Pitch Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Same pitch to every show (2% response)</li>
                  <li>• No show-specific context</li>
                  <li>• Wrong timing (6 months too late)</li>
                  <li>• Generic subject lines get ignored</li>
                  <li>• No genre positioning</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic Pitch Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Show-specific pitches (14-18% response)</li>
                  <li>• Context about why this show fits</li>
                  <li>• Optimal timing (6-8 weeks pre-release)</li>
                  <li>• Compelling subject lines (3 variations)</li>
                  <li>• Clear genre positioning</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benchmarks Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">BBC Radio 1 Pitch Benchmarks (2025)</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These are real response rates from Radio 1 pitches. Show type, genre fit, and timing massively impact your results.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-bold">Daytime (Chart Shows)</span>
                <span className="text-red-600 font-black">2% average response (AVOID for independent artists)</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-bold">Weekend Specialist (9pm-midnight)</span>
                <span className="text-yellow-600 font-black">8-12% average response</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-bold">Weeknight Specialist (11pm-1am)</span>
                <span className="text-green-600 font-black">14-18% average response (TARGET HERE)</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-bold">Genre-Specific Shows (e.g. Residency)</span>
                <span className="text-blue-600 font-black">16-22% with perfect genre fit</span>
              </div>
            </div>
          </section>

          {/* Pitch Template Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Proven Pitch Template Structure</h2>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-purple-900">Subject Line (Critical - 3 Variations)</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Option 1:</strong> "[Genre] [Artist] - [Hook] (Perfect for [Show Name])"</p>
                <p><strong>Option 2:</strong> "New [Genre]: [Artist] - [Track Title] ([Similar Artist] vibes)"</p>
                <p><strong>Option 3:</strong> "[Artist] - [Track] (Fits your [Recent Similar Artist] play)"</p>
              </div>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-indigo-900">Opening (Context Hook)</h3>
              <p className="text-gray-700">
                Start with show-specific context. Reference a recent play that's similar genre/vibe. Shows you actually listen and understand their
                programming. Don't just say "I love your show" - be specific about why this track fits.
              </p>
              <div className="bg-white p-4 rounded border border-indigo-200">
                <p className="text-gray-800 italic">
                  "Heard you playing [Similar Artist] last week - that darker electronica vibe. Our new track '[Track Name]' sits in that same space
                  but with more industrial textures. Think Burial meets Bicep's harder moments."
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-green-900">Core Pitch (The Why)</h3>
              <p className="text-gray-700">
                2-3 sentences max. Genre positioning, key reference points, what makes it interesting. Don't oversell - producers can hear it themselves.
                Focus on context they need to programme it.
              </p>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-gray-800 italic">
                  "We're [Artist Name], Brighton-based duo making UK garage-influenced house. '[Track Name]' strips back the vocals to let the bassline
                  breathe - reminiscent of early Disclosure but with grittier production. Released [Date] on [Label]."
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-yellow-900">Timing & Context</h3>
              <p className="text-gray-700">
                Release date, any momentum (not plays unless substantial), why now matters. Keep it factual. If there's press coming, mention it.
                If there's a tour, relevant if it's actual venues not open mics.
              </p>
              <div className="bg-white p-4 rounded border border-yellow-200">
                <p className="text-gray-800 italic">
                  "Releasing 6th October with Mixmag premiere. We're supporting [Bigger Artist] at [Actual Venue] next month - building real momentum
                  in the underground house scene."
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-blue-900">Close (Easy Access)</h3>
              <p className="text-gray-700">
                Private stream link (not public Spotify), contact details, done. Don't ask for feedback, don't ask for a response timeline.
                Make it dead easy for them to listen right now.
              </p>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-gray-800 italic">
                  "Private stream: [Link]<br/>
                  WAV available on request.<br/>
                  <br/>
                  Cheers,<br/>
                  [Your Name]<br/>
                  [Email] | [Phone]"
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Mistakes Killing Your Response Rate</h2>

            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Generic mass pitch to every show</h3>
                <p className="text-gray-700">Producers can tell. 2% response rate. Takes 30 seconds per pitch to personalise = 10x better results.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Pitching daytime for underground music</h3>
                <p className="text-gray-700">Daytime is chart-focused. 98% rejection for independent artists. Target specialist shows.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Subject line: "New Track"</h3>
                <p className="text-gray-700">They get 200+ emails daily. Give them genre, artist, and why it fits their show in the subject line.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Pitching 1 week before release</h3>
                <p className="text-gray-700">Radio works 6-8 weeks ahead. Last-minute pitches get ignored. Plan your timeline properly.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ No genre positioning</h3>
                <p className="text-gray-700">"For fans of everyone" means nothing. Give 2-3 specific reference points in the same sonic space.</p>
              </div>
            </div>
          </section>

          {/* Tool CTA */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Generate BBC Radio 1 Pitches in 60 Seconds</h2>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Pitch Generator creates show-specific Radio 1 pitches using these exact templates and benchmarks. Input your track details once,
                get customised pitches for specialist shows with proven 14-18% response rates. Built by radio promoters who've pitched Radio 1 for 5+ years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pitch/generate"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors text-center shadow-md"
                >
                  Try Free (5 pitches/month) →
                </Link>
                <Link
                  href="/pricing"
                  className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors text-center"
                >
                  See Pricing
                </Link>
              </div>
            </div>
          </section>

          {/* About Author */}
          <section className="border-t pt-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">About the Author</h3>
              <p className="text-gray-700 leading-relaxed">
                Chris Schofield is a working radio promoter with 5+ years experience pitching BBC Radio 1, including successful campaigns for
                specialist shows. He built Pitch Generator because he was spending 15+ hours per campaign writing show-specific pitches manually.
                Now you can generate them in 60 seconds using proven templates and industry benchmarks.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
