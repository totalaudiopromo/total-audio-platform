import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How to Find Music Industry Contacts (Without Wasting Hours) | Audio Intel",
  description: "Stop wasting hours hunting for music industry contacts. Learn the exact methods working promoters use to find radio DJs, playlist curators, and music bloggers.",
  keywords: "music industry contacts, find radio DJ contacts, playlist curator emails, music blogger contacts, contact research tools",
  alternates: { canonical: 'https://intel.totalaudiopromo.com/blog/music-industry-contacts' },
  openGraph: {
    url: 'https://intel.totalaudiopromo.com/blog/music-industry-contacts',
    title: "How to Find Music Industry Contacts (The Smart Way)",
    description: "The exact methods working promoters use to find quality music industry contacts without wasting hours.",
    images: [{ url: "/images/music-contacts-guide.png", alt: "Music industry contacts guide cover" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Find Music Industry Contacts (Without Wasting Hours)",
    description: "Stop hunting blindly for music contacts. Here's how the pros do it.",
  }
};

export default function MusicIndustryContacts() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "How to Find Music Industry Contacts (Without Wasting Hours)",
            description: "Stop wasting hours hunting for music industry contacts.",
            image: ["https://intel.totalaudiopromo.com/images/music-contacts-guide.png"],
            author: { "@type": "Person", name: "Chris Schofield" },
            publisher: { "@type": "Organization", name: "Total Audio Promo" },
            datePublished: "2025-08-30",
            dateModified: "2025-08-30",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://intel.totalaudiopromo.com/blog/music-industry-contacts"
            },
            inLanguage: "en-GB"
          })
        }}
      />
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          How to Find Music Industry Contacts (Without Wasting Hours)
        </h1>
        
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <span className="font-bold">Chris Schofield</span>
          <span>•</span>
          <span>5+ years contact research</span>
          <span>•</span>
          <span>9 min read</span>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
          <p className="text-lg text-gray-700 font-medium">
            Right, let's get real. Contact research used to eat up half my promotion time. Here's exactly how I find 
            quality music industry contacts without spending days hunting through outdated databases.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        
        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Problem with Most Contact Research</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Most artists approach contact research completely wrong. They either buy expensive databases full of outdated emails, 
          or waste hours googling "radio DJ email addresses" hoping to strike gold.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-red-900 mb-3">❌ What Doesn't Work:</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Buying generic "10,000 radio contacts" databases (mostly dead emails)</li>
            <li>• Random Google searches without a systematic approach</li>
            <li>• Using the same outdated contact list for years</li>
            <li>• Copying contact lists from other artists (they're probably wrong)</li>
            <li>• Hoping submissions forms on websites actually work</li>
          </ul>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          The result? Bounced emails, ignored submissions, and weeks of wasted effort. 
          Here's how to do it properly.
        </p>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Method 1: Social Media Reverse Engineering</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This is my go-to method because it gives you current, active contacts plus insight into their personality and preferences.
        </p>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">For Radio DJs:</h3>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Check the station's Instagram/Twitter:</strong> DJs often post about their shows with contact details</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Look at their personal accounts:</strong> Many link to submission emails in their bio</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Check show announcements:</strong> They often include "send music to..." details</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Follow their music posts:</strong> See what they're actually playing recently</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">For Playlist Curators:</h3>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Instagram bio links:</strong> Many curators put submission details here</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Spotify playlist descriptions:</strong> Often contain contact information</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Twitter profiles:</strong> Check for submission guidelines or contact details</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Recent activity:</strong> See if they're actively adding new music</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Method 2: The Website Deep Dive</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Most people check the "Contact" page and give up. But the real gold is buried deeper.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-blue-900 mb-3">🔍 Where to Look:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>About pages:</strong> Often list individual team members with emails</li>
            <li>• <strong>Press kits/Media pages:</strong> Usually have direct contact details</li>
            <li>• <strong>Staff listings:</strong> Names you can cross-reference on social media</li>
            <li>• <strong>Old blog posts:</strong> Authors often have contact info in bios</li>
            <li>• <strong>Partnership/Collaboration pages:</strong> Sometimes list submission processes</li>
          </ul>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Method 3: Network Effect Research</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This is where most people miss out. Instead of finding contacts in isolation, 
          look at who they interact with. Networks reveal quality connections.
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Check who they follow:</strong> DJs often follow other DJs in similar genres</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Look at their collaborations:</strong> Joint playlists, guest mixes, etc.</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Find industry events they attend:</strong> Often tagged in posts with other contacts</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Check their music recommendations:</strong> See who they're supporting</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Method 4: Smart Database Mining</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          I'm not against databases entirely - but most people use them wrong. 
          Here's how to extract value from contact databases:
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Use them as starting points:</strong> Get names and stations, then verify everything</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Cross-check with social media:</strong> Confirm they're still active</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Look for recent updates:</strong> Databases older than 6 months are mostly useless</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Focus on niche, not volume:</strong> 50 targeted contacts beat 5000 generic ones</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Verification: The Step Everyone Skips</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Finding contact details is only half the job. Verifying they're current and accurate saves you from embarrassing bounced emails.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-yellow-900 mb-3">✅ Quick Verification Checklist:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Check their recent social media activity (active in last month?)</li>
            <li>• Look for recent playlist updates or show announcements</li>
            <li>• Verify the email format matches their domain</li>
            <li>• Search their name + current year for recent mentions</li>
            <li>• Check if they've posted submission guidelines recently</li>
          </ul>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">My Contact Research Workflow</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Here's exactly how I research contacts for campaigns. This process takes about 10 minutes per contact 
          but gives me 80%+ delivery rates:
        </p>
        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-3">My 10-Minute Research Process:</h4>
          <ol className="text-sm text-gray-800 space-y-2 list-decimal pl-4">
            <li><strong>Start with their official platform</strong> (Spotify, station website, etc.)</li>
            <li><strong>Check all their social accounts</strong> for contact details and personality</li>
            <li><strong>Note recent music they've shared/played</strong> to understand their taste</li>
            <li><strong>Find their submission preferences</strong> (email format, timing, etc.)</li>
            <li><strong>Verify contact details are current</strong> (not from 2019)</li>
            <li><strong>Check their activity level</strong> (are they actually active?)</li>
            <li><strong>Note any personal details</strong> that could help personalise outreach</li>
            <li><strong>Save everything in a spreadsheet</strong> with contact date</li>
          </ol>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Tools That Actually Help</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Right, let's talk tools. Most are expensive and over-promise. But a few genuinely save time:
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-green-900 mb-3">✅ Tools I Actually Use:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Contact enrichment tools</strong> like <a href="https://intel.totalaudiopromo.com" className="underline">Audio Intel</a> (shameless plug, but it works)</li>
            <li>• <strong>Social media search tools</strong> for finding contact details in bios</li>
            <li>• <strong>Email verification services</strong> to check addresses before sending</li>
            <li>• <strong>Simple spreadsheet templates</strong> to organise everything</li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-red-900 mb-3">❌ Tools That Waste Money:</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• <strong>"Massive contact databases"</strong> - Usually 70%+ outdated</li>
            <li>• <strong>Auto-submission tools</strong> - Generic submissions get generic results</li>
            <li>• <strong>Contact scraping software</strong> - Often grabs wrong or inactive emails</li>
            <li>• <strong>Expensive "industry insider" lists</strong> - Same outdated contacts recycled</li>
          </ul>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Contact Categories That Actually Matter</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Not all contacts are created equal. Here's how I prioritise my research time:
        </p>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tier 1: Active Curators & DJs</h3>
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">Posted new music in the last week</li>
          <li className="list-disc">Respond to artists on social media</li>
          <li className="list-disc">Have clear submission guidelines</li>
          <li className="list-disc">Show engagement on their content</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tier 2: Established But Quiet</h3>
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">Good track record but less active lately</li>
          <li className="list-disc">Decent following but inconsistent posting</li>
          <li className="list-disc">Worth a shot but don't expect high response rates</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tier 3: Skip These</h3>
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">Haven't posted in 3+ months</li>
          <li className="list-disc">Generic bios with no personality</li>
          <li className="list-disc">No clear submission process</li>
          <li className="list-disc">Obvious bot or inactive accounts</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Time Investment Reality</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Let me be honest about time investment. Quality contact research isn't quick, but it's worth it:
        </p>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">50 quality contacts:</strong> About 8-10 hours of research</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">But higher response rates:</strong> 10-15% vs 2-3% with generic lists</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Better relationships:</strong> Personalised outreach builds connections</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Reusable intelligence:</strong> Good research pays off for years</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Common Research Mistakes to Avoid</h2>
        
        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc"><strong className="text-gray-900 font-bold">Focusing only on follower count:</strong> Engagement matters more than numbers</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Ignoring submission guidelines:</strong> If they say "no demos," don't send demos</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Not updating your lists:</strong> People change jobs, email addresses expire</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Copying other people's lists:</strong> Build your own relationships</li>
          <li className="list-disc"><strong className="text-gray-900 font-bold">Not verifying contact details:</strong> Bounced emails kill your reputation</li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Bottom Line</h2>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Look, contact research is tedious. But it's the foundation of every successful music promotion campaign. 
          You can have the best music in the world, but if it's not reaching the right people, it doesn't matter.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          The artists who succeed long-term are the ones who build genuine relationships with quality contacts, 
          not those who blast generic emails to massive lists.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">Want to skip the manual research?</strong> 
          I built <a href="https://intel.totalaudiopromo.com" className="text-blue-600 hover:text-blue-800 font-semibold">Audio Intel</a> 
          because I was tired of spending hours on contact research for every campaign. It enriches your basic contact lists 
          with submission preferences, social media handles, and personal details that make outreach actually work. 
          Free beta, no credit card required.
        </p>
        
        <hr className="my-12" />
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <Image 
                src="/images/chris-schofield-founder-photo.jpg" 
                alt="Chris Schofield - Contact Research Expert" 
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
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                    Audio Intel Founder
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    Contact Research Expert
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                After wasting literally thousands of hours on manual contact research over 5+ years, I built Audio Intel 
                to solve this problem properly. These methods are what I use for client campaigns.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Quality contact research is the difference between artists who succeed and those who give up. 
                If this guide saves you even a few hours of frustrating research, it's done its job.
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