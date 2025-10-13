import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "5 Playlist Promotion Mistakes Killing Your Music Career | Audio Intel",
  description: "Stop making these deadly playlist promotion mistakes. Learn what actually works from someone who's seen hundreds of failed campaigns.",
  keywords: "playlist promotion mistakes, spotify playlist submission, music playlist promotion, playlist curator contacts, music promotion errors",
  alternates: { canonical: 'https://intel.totalaudiopromo.com/blog/playlist-promotion-mistakes' },
  openGraph: {
    url: 'https://intel.totalaudiopromo.com/blog/playlist-promotion-mistakes',
    title: "5 Playlist Promotion Mistakes That Are Killing Your Music Career",
    description: "These common playlist promotion mistakes are sabotaging your music career. Here's how to fix them.",
    images: [{ url: "/images/playlist-mistakes-guide.png", alt: "Playlist promotion mistakes guide cover" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "5 Playlist Promotion Mistakes Killing Your Music Career",
    description: "Don't let these playlist promotion mistakes destroy your music career before it starts.",
  }
};

export default function PlaylistPromotionMistakes() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "5 Playlist Promotion Mistakes Killing Your Music Career",
            description: "Stop making these deadly playlist promotion mistakes.",
            image: ["https://intel.totalaudiopromo.com/images/playlist-mistakes-guide.png"],
            author: { "@type": "Person", name: "Chris Schofield" },
            publisher: { "@type": "Organization", name: "Total Audio Promo" },
            datePublished: "2025-08-30",
            dateModified: "2025-08-30",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://intel.totalaudiopromo.com/blog/playlist-promotion-mistakes"
            },
            inLanguage: "en-GB"
          })
        }}
      />
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          5 Playlist Promotion Mistakes Killing Your Music Career
        </h1>
        
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <span className="font-bold">Chris Schofield</span>
          <span>•</span>
          <span>5+ years music promotion</span>
          <span>•</span>
          <span>7 min read</span>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <p className="text-lg text-gray-700 font-medium">
            Right, I'm going to be brutally honest here. After watching hundreds of artists fail at playlist promotion, 
            I've spotted the same 5 mistakes over and over. Fix these, and your campaign success rate will double.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        
        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Mistake #1: Targeting Every Playlist You Can Find</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This is the biggest one. Artists see a playlist with 10k followers and think "brilliant, I'll submit to that." 
          They don't check if it's actually active, if it fits their genre, or if it has any real engagement.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-yellow-900 mb-3">⚠️ What This Looks Like:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Submitting techno tracks to indie rock playlists</li>
            <li>• Targeting playlists that haven't updated in 6+ months</li>
            <li>• Hitting up massive playlists with zero personal connection</li>
            <li>• Going for follower count over engagement quality</li>
          </ul>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">The Fix:</strong> Research properly. I spend 10 minutes minimum researching each playlist before submission. 
          Check recent additions, engagement on social posts, and whether they actually respond to submissions.
        </p>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Mistake #2: Generic "Please Add My Song" Emails</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Playlist curators get dozens of these daily. Your generic template stands out for all the wrong reasons:
        </p>

        <div className="bg-red-100 border border-red-300 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-red-900 mb-3">❌ Email That Gets Ignored:</h4>
          <div className="font-mono text-sm text-red-800 italic">
            "Hi, I'm an up-and-coming artist. Please consider my new single for your amazing playlist. 
            It has great potential and I think your followers would love it. Here's the Spotify link..."
          </div>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-green-900 mb-3">✅ Email That Gets Results:</h4>
          <div className="font-mono text-sm text-green-800">
            "Hi Sarah, loved the [Artist Name] track you added last week - perfect fit alongside [another specific track]. 
            Got a new release that sits nicely between [Artist A] and [Artist B] style-wise. 
            Similar tempo to your recent adds but with a bit more [specific element]. 
            30-sec preview: [link]. Worth a listen? Cheers, [Name]"
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Mistake #3: Ignoring Playlist Data & Analytics</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Most artists submit blindly without checking if a playlist actually drives streams. 
          I've seen tracks added to 50k follower playlists that generated 12 streams. Total.
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Check follower-to-stream ratios:</strong> A good playlist should generate 1-5% of its followers in streams per track</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Look at recent additions:</strong> How many streams do they have after a few weeks?</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Monitor your own results:</strong> Track which playlists actually move the needle</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Quality over quantity:</strong> 10 active followers beat 1000 inactive ones</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Mistake #4: Terrible Timing & Follow-Up Etiquette</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Timing your submissions wrong can kill even the best pitch. Here's what I've learned about when curators actually check their emails:
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-blue-900 mb-3">⏰ Best Times to Submit:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Tuesday-Thursday, 9am-1pm:</strong> Peak response window</li>
            <li>• <strong>Avoid Mondays:</strong> They're catching up from the weekend</li>
            <li>• <strong>Friday afternoons are risky:</strong> Weekend mode is kicking in</li>
            <li>• <strong>Follow up once after 2 weeks:</strong> If no response, move on</li>
          </ul>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">The Follow-Up Rule:</strong> One follow-up maximum. If they don't respond, they're not interested. 
          Pestering them just gets you blocked and ruins it for other artists.
        </p>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Mistake #5: Not Building Relationships Before You Need Them</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This is the mistake that separates one-hit wonders from career artists. Most people only reach out when they need something. 
          The smart ones build relationships first.
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Engage genuinely:</strong> Comment on their posts about music (not just when promoting)</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Share their playlists:</strong> When you actually listen and enjoy them</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Send them music from others:</strong> Tracks they might like from artists you know</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Be patient:</strong> Relationships take time, but they last</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Numbers Game Reality Check</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Let me give you realistic expectations. Even with perfect execution, playlist promotion is a numbers game:
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">50 quality submissions:</strong> Properly researched and personalised</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">10% response rate:</strong> If you're doing everything right</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">2-5 playlist adds:</strong> From a successful campaign</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">1-2 valuable connections:</strong> Worth more than dozens of one-off adds</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Tools That Actually Help (And Ones That Don't)</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Right, let's talk tools. The playlist promotion space is full of expensive platforms promising the world. 
          Most are rubbish. Here's what actually works:
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-green-900 mb-3">✅ Tools Worth Using:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Contact enrichment tools</strong> (like <a href="https://intel.totalaudiopromo.com" className="underline">Audio Intel</a>) for proper curator details</li>
            <li>• <strong>Spotify for Artists</strong> to track which playlists actually drive streams</li>
            <li>• <strong>Social media schedulers</strong> for consistent curator engagement</li>
            <li>• <strong>Simple CRM systems</strong> to track relationships and submissions</li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-red-900 mb-3">❌ Tools to Avoid:</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• <strong>"Guaranteed" playlist placement services</strong> - Usually fake or bot playlists</li>
            <li>• <strong>Mass submission platforms</strong> - Generic submissions get generic results</li>
            <li>• <strong>Follower buying services</strong> - Fake engagement hurts more than it helps</li>
            <li>• <strong>Expensive "industry contact" databases</strong> - Often outdated and overpriced</li>
          </ul>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Harsh Truth About Playlist Promotion</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Look, I'm going to level with you. Playlist promotion in 2025 is saturated. Every artist and their dog is trying it, 
          which means curators are overwhelmed and increasingly selective.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">But here's the thing:</strong> Most artists are doing it wrong. They're making the mistakes I've outlined above, 
          which means there's still opportunity for those who do it properly.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          The artists succeeding are the ones who:
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">Research thoroughly before submitting</li>
          <li className="list-disc">Write personalised, relevant pitches</li>
          <li className="list-disc">Build genuine relationships with curators</li>
          <li className="list-disc">Track their results and optimise accordingly</li>
          <li className="list-disc">Have realistic expectations and play the long game</li>
        </ul>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">Most importantly:</strong> Your music needs to be playlist-ready. 
          No amount of promotion can fix a poorly produced track that doesn't fit the playlist's vibe.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">Ready to stop making these mistakes?</strong> 
          Start by getting proper contact intelligence. <a href="https://intel.totalaudiopromo.com" className="text-blue-600 hover:text-blue-800 font-semibold">Audio Intel's free beta</a> 
          gives you curator names, submission preferences, and contact details that make your pitches actually work. 
          No credit card required - just better playlist promotion results.
        </p>
        
        <hr className="my-12" />
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <Image 
                src="/images/chris-schofield-founder-photo.jpg" 
                alt="Chris Schofield - Music Promotion Expert" 
                width={120} 
                height={120} 
                className="rounded-full border-4 border-white shadow-lg object-cover aspect-square"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="font-black text-2xl text-gray-900 mb-2">Chris Schofield</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    Music Promoter
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    Audio Intel Founder
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    Producer (sadact)
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                5+ years promoting music for indie artists and labels. I've seen every playlist promotion mistake possible - 
                and made most of them myself. Built Audio Intel to fix the contact research problem.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These mistakes cost artists thousands in wasted time and money. If this article saved you from even one of them, 
                it's done its job. Want better playlist promotion results? Start with better contact intelligence.
              </p>
              <div className="mt-6">
                <a 
                  href="https://intel.totalaudiopromo.com" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Try Audio Intel Free Beta
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </article>
  );
}