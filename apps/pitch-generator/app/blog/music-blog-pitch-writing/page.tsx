import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Music Blog Pitch Writing: Stop Wasting Time on Generic Templates",
  description: "Write music blog pitches that get coverage. Learn response rates (8-16% by blog tier), proven templates, and which approaches work for blog coverage.",
  keywords: "music blog pitch, blog pitch template, music blog submission, blog coverage pitch, music pr pitch",
};

export default function MusicBlogPitchWriting() {
  return (
    <article className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href="/blog" className="text-amber-600 hover:text-amber-700 font-semibold mb-4 inline-block">
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Music Blog Pitch Writing: Templates That Actually Get Coverage
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm">
            <span className="font-semibold">Chris Schofield</span>
            <span>•</span>
            <span>Music PR & radio promoter</span>
            <span>•</span>
            <span>9 min read</span>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              After pitching 400+ tracks to music blogs, the reality: generic press release pitches get 4-7% coverage rates. But a proper story-driven
              pitch with blog-specific context and clear angle? 12-18% depending on blog tier. Here's how to write blog pitches that actually get coverage.
            </p>
          </div>
        </header>

        <div className="space-y-12 bg-white rounded-xl p-8 md:p-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Blog Pitch Benchmarks (2025)</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-bold">Major Blogs (Pitchfork, NME, Stereogum)</span>
                <span className="text-red-600 font-black">2-5% coverage (extremely selective)</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-bold">Mid-Tier Genre Blogs</span>
                <span className="text-yellow-600 font-black">8-12% coverage</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-bold">Smaller Specialist Blogs</span>
                <span className="text-green-600 font-black">14-20% with perfect story angle (TARGET HERE)</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">What Blogs Actually Want</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Blogs don't want press releases. They want stories their readers care about. Genre fit, timing, and angle matter more than track quality.
            </p>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Stories That Get Coverage:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Unique production story:</strong> "Recorded entirely on vintage Soviet synths"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Collaborations:</strong> "Features unexpected collab with [Known Artist]"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Cultural/political angle:</strong> "Written during pandemic lockdown, explores isolation"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Genre-bending:</strong> "UK garage meets ambient drone - not heard this before"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Local angle:</strong> "Brighton's underground techno scene is evolving"</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Proven Blog Pitch Template</h2>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-amber-900">Subject Line</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Hook + Artist:</strong> [Unique Angle] - [Artist] new [Genre] track</p>
                <p className="text-sm italic">Example: "UK garage meets ambient drone - Midnight Rivers' genre-bending new single"</p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-amber-900">Opening (The Hook)</h3>
              <p className="text-gray-700">
                Lead with the story, not the track. What makes this interesting to their readers? Why now? Why this blog specifically?
              </p>
              <div className="bg-white p-4 rounded border border-amber-200">
                <p className="text-gray-800 italic">
                  "Brighton's underground techno scene is having a moment. [Artist]'s new track '[Track Name]' captures that raw warehouse energy
                  you covered in your [Recent Article] piece - thought your readers would dig it."
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-green-900">The Story</h3>
              <p className="text-gray-700">
                2-3 paragraphs. Production story, influences, what makes it unique. Give them the angle they can write about.
              </p>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-gray-800 italic">
                  "Recorded entirely on vintage Soviet synths sourced from eBay over 2 years - the Polivoks and Formanta give it that gritty,
                  unstable character you can't get from soft synths. Think Bjarki's industrial textures but with more melody.<br/><br/>
                  '[Track Name]' started as a warehouse jam session that got out of hand. We kept the mistakes - the timing wobbles, the feedback
                  squeals - because they made it feel alive. Very different from the polished techno dominating playlists right now."
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-yellow-900">Context & Assets</h3>
              <div className="bg-white p-4 rounded border border-yellow-200">
                <p className="text-gray-800 italic">
                  "Releasing [Date]. We've got:<br/>
                  • Stream: [Private Link]<br/>
                  • High-res press photos<br/>
                  • Interview availability<br/>
                  • Behind-the-scenes studio footage<br/>
                  <br/>
                  Happy to provide whatever you need for coverage."
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Common Mistakes</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Sending press releases as pitches</h3>
                <p className="text-gray-700">Blogs want stories, not corporate announcements. 5% coverage rate for press releases.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ No unique angle</h3>
                <p className="text-gray-700">"Check out my new single" gets ignored. "Recorded on vintage Soviet synths" gets clicks.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-2">❌ Wrong blog targeting</h3>
                <p className="text-gray-700">Your folk-pop track doesn't fit on a metal blog. Perfect genre fit = 3x better coverage rate.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Generate Blog Pitches in 60 Seconds</h2>
            <div className="bg-gradient-to-br from-amber-50 to-amber-50 border-2 border-amber-300 rounded-xl p-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Pitch Generator creates blog-specific pitches with proven story angles and benchmarks. Input your track details and unique story,
                get customised pitches for dozens of blogs with 12-18% coverage rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pitch/generate" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors text-center shadow-md">
                  Try Free (5 pitches/month) →
                </Link>
                <Link href="/pricing" className="bg-white text-amber-600 border-2 border-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors text-center">
                  See Pricing
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
