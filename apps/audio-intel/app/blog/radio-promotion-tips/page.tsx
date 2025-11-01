import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Radio Promotion Tips That Actually Work in 2025 | Audio Intel',
  description:
    '5+ years of radio promotion experience distilled into actionable tips. Learn what actually works for getting airplay in 2025 from a working radio promoter.',
  keywords:
    'radio promotion tips, get radio airplay, radio DJ contacts, music promotion strategies, radio submission tips',
  alternates: { canonical: 'https://intel.totalaudiopromo.com/blog/radio-promotion-tips' },
  openGraph: {
    url: 'https://intel.totalaudiopromo.com/blog/radio-promotion-tips',
    title: 'Radio Promotion Tips That Actually Work (From 5+ Years Experience)',
    description:
      "Stop wasting time on radio promotion that doesn't work. Here's what actually gets you airplay in 2025.",
    images: [{ url: '/images/radio-promotion-guide.png', alt: 'Radio promotion tips guide cover' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radio Promotion Tips That Actually Work in 2025',
    description:
      'Real advice from a working radio promoter - not the generic stuff everyone else tells you.',
  },
};

export default function RadioPromotionTips() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: 'Radio Promotion Tips That Actually Work in 2025',
            description: '5+ years of radio promotion experience distilled into actionable tips.',
            image: ['https://intel.totalaudiopromo.com/images/radio-promotion-guide.png'],
            author: { '@type': 'Person', name: 'Chris Schofield' },
            publisher: { '@type': 'Organization', name: 'Total Audio Promo' },
            datePublished: '2025-08-30',
            dateModified: '2025-08-30',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://intel.totalaudiopromo.com/blog/radio-promotion-tips',
            },
            inLanguage: 'en-GB',
          }),
        }}
      />
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          Radio Promotion Tips That Actually Work in 2025
        </h1>

        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <span className="font-bold">Chris Schofield</span>
          <span>•</span>
          <span>5+ years radio promotion</span>
          <span>•</span>
          <span>6 min read</span>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <p className="text-lg text-gray-700 font-medium">
            Right, let's cut through the BS. After 5+ years promoting music to radio, here's what
            actually works - not the generic advice everyone parrots, but real tactics that get you
            airplay in 2025.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">
          Stop Doing These Things (They Don't Work)
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Before we get to what works, let me save you some time by telling you what doesn't. I've
          seen hundreds of artists waste months on these approaches:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Mass email blasts:</strong> "Dear Radio DJ"
            emails sent to 500 stations simultaneously
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Generic press releases:</strong> Boring,
            corporate-speak that says nothing about why anyone should care
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Following up every day:</strong> This just
            pisses people off and gets you blocked
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">
              Paying for "guaranteed" playlist spots:
            </strong>{' '}
            Usually fake playlists or ones with zero engagement
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">
              Submitting to stations that don't play your genre:
            </strong>{' '}
            Research before you waste everyone's time
          </li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">
          What Actually Gets You Airplay
        </h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          1. Research Like Your Career Depends On It
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This is where 90% of artists fail. They blast their track to every radio email they can
          find without doing any research. Here's what proper research looks like:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">Listen to the station for at least a week before submitting</li>
          <li className="list-disc">
            Note what genres, tempos, and energy levels they actually play
          </li>
          <li className="list-disc">
            Find out the DJ's name, show name, and submission preferences
          </li>
          <li className="list-disc">
            Check their social media to understand their personality and interests
          </li>
          <li className="list-disc">
            Look for recent playlist additions that sound similar to your track
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Write Emails That Don't Suck</h3>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Your email is everything. Here's the formula I use that actually gets responses:
        </p>

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-3">Email Template That Works:</h4>
          <div className="font-mono text-sm space-y-2">
            <p>
              <strong>Subject:</strong> New track for [Show Name] - [Your Artist Name]
            </p>
            <p>
              <strong>Body:</strong>
            </p>
            <p>Hi [DJ Name],</p>
            <p>
              Love what you did with [specific recent playlist add] - perfect energy for late night
              drives.
            </p>
            <p>
              Got a new track that might fit your [specific time slot/show style]. It's similar to
              [artist they actually play] but with more [specific difference].
            </p>
            <p>
              30-second preview: [streaming link]
              <br />
              Download: [private link]
              <br />
              Artist: [Your Name]
              <br />
              Track: [Song Title]
              <br />
              Genre: [Be specific]
            </p>
            <p>
              Cheers,
              <br />
              [Your name]
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Timing Is Everything</h3>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          When you send matters more than you think. Here's what I've learned:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Tuesday-Thursday, 10am-2pm:</strong> Peak
            response times for most DJs
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Avoid Mondays:</strong> They're catching up
            from the weekend
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Fridays are hit or miss:</strong> Some are
            planning weekend shows, others have checked out
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Follow up once after 2 weeks:</strong> No
            response usually means no, but one follow-up is acceptable
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Build Actual Relationships</h3>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          This isn't networking BS - it's about being genuinely interested in what DJs do. The DJs
          who play my artists' music most are ones I have actual conversations with.
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            Share their shows on your socials (when you actually listen)
          </li>
          <li className="list-disc">
            Send them music from other artists they might like (not just your own)
          </li>
          <li className="list-disc">Engage with their posts about music (not just promo posts)</li>
          <li className="list-disc">
            Remember details about their shows and reference them in future emails
          </li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">
          The Numbers Game (But Smarter)
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Yes, radio promotion is partly a numbers game, but it's about quality numbers, not
          quantity. Here's my realistic breakdown:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">50 targeted submissions:</strong> Better
            than 500 generic ones
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">5-10% response rate:</strong> If you're
            doing it right
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">2-3 actual playlist adds:</strong> From a
            good campaign
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">1 regular supporter:</strong> Worth 50
            one-time plays
          </li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">Tools That Actually Help</h2>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Right, here's the honest truth about tools. Most are overpriced and overpromise. But a few
          actually make the job easier:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Contact enrichment tools:</strong> Get
            proper names and submission preferences (shameless plug:{' '}
            <a
              href="https://intel.totalaudiopromo.com"
              className="text-blue-600 hover:text-blue-800"
            >
              Audio Intel
            </a>{' '}
            does this properly)
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Social media schedulers:</strong> For
            consistent engagement without being glued to your phone
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Simple CRM:</strong> Even a Google Sheet to
            track who you've contacted and when
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Analytics tools:</strong> To see which
            stations actually drive streams
          </li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">
          Common Mistakes That Kill Campaigns
        </h2>

        <ul className="text-gray-700 mb-6 space-y-2 pl-6">
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Submitting unfinished music:</strong> "It's
            95% done" isn't good enough
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">No proper metadata:</strong> Your file
            should have all info embedded
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Broken download links:</strong> Test
            everything before sending
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">Expecting instant results:</strong> Radio
            moves slowly, plan accordingly
          </li>
          <li className="list-disc">
            <strong className="text-gray-900 font-bold">
              Not following submission guidelines:
            </strong>{' '}
            If they say Dropbox only, don't send a SoundCloud link
          </li>
        </ul>

        <h2 className="text-3xl font-black text-gray-900 mb-6 mt-12">The Reality Check</h2>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Look, radio promotion in 2025 is harder than ever. Streaming has changed everything, and
          most radio shows get hundreds of submissions weekly. But it's not impossible - you just
          need to be smarter about it.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          The artists who succeed are the ones who understand that radio promotion is relationship
          building, not spam distribution. They put in the research, write personalised emails, and
          follow up professionally.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">Most importantly:</strong> Your music needs to
          be genuinely good and properly produced. No amount of promotion can fix a weak track.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          <strong className="text-gray-900 font-bold">Want better results faster?</strong> Get
          proper contact intelligence before you start your campaign.
          <a
            href="https://intel.totalaudiopromo.com"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Audio Intel's free beta
          </a>{' '}
          enriches your contact lists with submission preferences and personal details that make
          your outreach actually work. No credit card required.
        </p>

        <hr className="my-12" />

        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <Image
                src="/images/chris-schofield-founder-photo.jpg"
                alt="Chris Schofield - Radio Promoter"
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
                    Radio Promoter
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    Audio Intel Founder
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    Music Producer (sadact)
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                5+ years promoting music to radio stations across the UK. Built Audio Intel after
                getting tired of manually researching contact details for every single campaign.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These tips come from real campaigns - the successes and the failures. If you found
                this helpful, give Audio Intel a try. It's exactly what I wish existed when I
                started in radio promotion.
              </p>
              <div className="mt-6">
                <a
                  href="https://intel.totalaudiopromo.com"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Try Audio Intel Free Beta
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
