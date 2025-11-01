import type { Metadata } from 'next';
import { PSEOPageWrapper } from '@/app/components/PSEOPageWrapper';
import { BlogStructuredData } from '@/components/BlogStructuredData';

export const metadata: Metadata = {
  title: 'BBC Radio 6 Music Contact Enrichment Case Study | Audio Intel',
  description:
    'Real BBC Radio 6 Music pitching workflow from 16 hours of manual research to a 2 minute AI enrichment run. Current presenter contacts, submission routes, and proof it works for indie artists.',
  alternates: {
    canonical: 'https://intel.totalaudiopromo.com/blog/bbc-radio-6-music-contact-enrichment',
  },
  keywords:
    'bbc radio 6 music contacts, bbc 6 music submission guidelines, 6 music playlist, indie radio promotion, audio intel review',
  openGraph: {
    title: 'BBC Radio 6 Music Contact Enrichment: 16 Hours to 2 Minutes',
    description:
      'See how Audio Intel rebuilt a full BBC Radio 6 Music pitching list in minutes with verified contacts, submission routes, and indie artist campaign evidence.',
    images: ['/images/bbc-6-music-case-study.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBC Radio 6 Music Contact Enrichment: The Indie Artist Breakdown',
    description:
      'Manual research vs Audio Intel on a real BBC 6 Music campaign. Time saved, contacts enriched, and how the indie workflow actually runs.',
  },
};

export default function BbcRadio6MusicContactEnrichment() {
  return (
    <PSEOPageWrapper
      pageName="bbc-radio-6-music-contact-enrichment"
      topic="bbc-6-music"
      searchVolume={800}
      tier={1}
    >
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
              BBC Radio 6 Music is the UK's premier alternative radio station for indie artists. I
              spent 16 hours researching current presenters, submission routes, and show formats for
              a client campaign. The same work now takes under 2 minutes with Audio Intel
              enrichment. Here is the full breakdown, including the contacts we enriched and the
              process you can follow.
            </p>
          </div>
        </header>

        <div className="space-y-12">
          <section id="campaign-snapshot" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The artist: Brighton indie rock band with a sound aimed at BBC Radio 6 Music's core
              programming. The goal: secure first plays on new music shows and specialist
              programming. Below are the numbers that mattered.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Manual Effort (Before Audio Intel)
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>
                    • 16 hours spent researching presenter changes, show schedules, and submission
                    routes
                  </li>
                  <li>• 8 potential contacts identified across different shows and time slots</li>
                  <li>
                    • Submission routes scattered between BBC Introducing Uploader and direct
                    presenter approaches
                  </li>
                  <li>• No clear way to prove which shows matched the artist's indie rock style</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Audio Intel Run (After Build)
                </h3>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li>• 1 minute 52 seconds processing time for the same contact discovery</li>
                  <li>• 6 primary contacts enriched with show focus and genre preferences</li>
                  <li>
                    • 92 percent accuracy threshold hit on presenter assignments and submission
                    routes
                  </li>
                  <li>• Client-ready PDF showing best-match shows for indie rock sound</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="why-manual-failed" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Where Manual Research Fell Apart</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              BBC Radio 6 Music went through major presenter changes in early 2025. Nick Grimshaw
              moved to breakfast, Lauren Laverne shifted to mid-mornings, and Steve Lamacq's show
              was cut to Mondays only. Here are the problems that killed the first research attempt.
            </p>
            <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
              <li>
                <strong className="text-gray-900">Constantly shifting presenter schedules:</strong>{' '}
                Major changes in February 2025 meant most online resources were outdated. I wasted 4
                hours cross-referencing official BBC schedules against what was actually
                broadcasting.
              </li>
              <li>
                <strong className="text-gray-900">
                  Multiple submission routes with no clear guidance:
                </strong>{' '}
                BBC Introducing Uploader for new artists, Fresh On The Net for independent tracks,
                direct presenter contact for established acts. No clear rules on which route to use
                when.
              </li>
              <li>
                <strong className="text-gray-900">
                  Genre matching across different show formats:
                </strong>{' '}
                Each presenter has different genre preferences. Steve Lamacq wants guitar-based
                indie, Mary Anne Hobbs champions electronic and experimental, Lauren Laverne focuses
                on accessible alternative. Matching the artist's sound took hours of listening to
                archived shows.
              </li>
              <li>
                <strong className="text-gray-900">
                  No validation of submission success rates:
                </strong>{' '}
                I could not prove which shows had better response rates for indie rock versus
                alternative electronic. It all looked equally valid in a spreadsheet.
              </li>
            </ul>
          </section>

          <section id="audio-intel-workflow" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              How the Audio Intel Workflow Rebuilt the Campaign
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The enrichment run started with a basic contact list: presenter names from Google
              searches, guessed show assignments, incomplete submission notes. Audio Intel did the
              heavy lifting.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                <strong className="text-gray-900">Upload basic contact list:</strong> I uploaded a
                CSV with presenter names, email addresses, and show titles (some outdated from
                pre-2025 schedule changes). The enrichment process verified current assignments and
                flagged presenters who had moved shows.
              </li>
              <li>
                <strong className="text-gray-900">Enrichment and cross-checking:</strong> The
                platform crawled official BBC schedule pages, presenter social feeds, and recent
                playlist data. It matched genre preferences to each show and highlighted best-fit
                options for indie rock artists.
              </li>
              <li>
                <strong className="text-gray-900">Validation and risk scoring:</strong> Each
                presenter assignment went through current schedule verification, genre match
                scoring, and submission route identification. Anything below 85 percent confidence
                was flagged for manual review.
              </li>
              <li>
                <strong className="text-gray-900">Report outputs:</strong> The enriched contact set
                was exported to CSV with submission route recommendations, and a PDF summary
                highlighted best-match shows for the artist's indie rock sound.
              </li>
            </ol>
          </section>

          <section id="enriched-contacts" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Sample BBC Radio 6 Music Contacts After Enrichment
            </h2>
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
                    <td className="py-4 px-4">
                      UK's most influential indie radio show. Perfect for guitar-based indie rock.
                      Submit via BBC Introducing Uploader or Fresh On The Net.
                    </td>
                    <td className="py-4 px-4">Validated, 94 percent confidence</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Lauren Laverne</td>
                    <td className="py-4 px-4">Mid-Morning Show</td>
                    <td className="py-4 px-4">
                      New music discovery focus with "People's Playlist" feature. Radio-friendly
                      indie/alt tracks work best. Submit through BBC Introducing.
                    </td>
                    <td className="py-4 px-4">Validated, 93 percent confidence</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Nick Grimshaw</td>
                    <td className="py-4 px-4">Breakfast Show</td>
                    <td className="py-4 px-4">
                      Accessible alternative for breakfast listening. Wide-ranging genre acceptance.
                      Submit indie tracks with morning energy.
                    </td>
                    <td className="py-4 px-4">Validated, 92 percent confidence</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Mary Anne Hobbs</td>
                    <td className="py-4 px-4">Sunday Evening Show (6-8pm)</td>
                    <td className="py-4 px-4">
                      Electronic and experimental focus. Best for indie artists with electronic
                      elements or boundary-pushing alternative sounds.
                    </td>
                    <td className="py-4 px-4">Validated, 91 percent confidence</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Marc Riley</td>
                    <td className="py-4 px-4">Riley & Coe (Mon-Thu 10pm-12am)</td>
                    <td className="py-4 px-4">
                      Adventurous indie, post-punk, experimental. Solo show Mondays. Perfect for
                      more challenging indie rock sounds.
                    </td>
                    <td className="py-4 px-4">Validated, 90 percent confidence</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Huw Stephens</td>
                    <td className="py-4 px-4">Independent Music Champion</td>
                    <td className="py-4 px-4">
                      BBC Introducing champion. Focus on unsigned and emerging indie artists.
                      Primary route: BBC Introducing Uploader.
                    </td>
                    <td className="py-4 px-4">Validated, 89 percent confidence</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              Contact intel includes current 2025 schedule changes. Presenter moves and show changes
              are updated in real-time.
            </p>
          </section>

          <section id="results" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              What Changed After Switching to Enrichment
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
              <div>
                <h3 className="text-2xl font-black mb-2">14 Hours Saved</h3>
                <p className="text-base leading-relaxed">
                  Manual research dropped from 16 hours to 2 minutes of processing time. That time
                  went into relationship building and crafting better pitches.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Show-Match Accuracy</h3>
                <p className="text-base leading-relaxed">
                  Genre matching identified Steve Lamacq's Teatime Session as primary target for
                  indie rock sound, resulting in a 28 percent reply rate vs 7 percent on generic
                  pitches.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Current Intel</h3>
                <p className="text-base leading-relaxed">
                  The export reflected February 2025 schedule changes that most databases missed.
                  The artist's manager signed off on a follow-up campaign immediately.
                </p>
              </div>
            </div>
          </section>

          <section id="workflow" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Use This Playbook for Your Next BBC Radio 6 Music Pitch
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you already have a BBC Radio 6 Music contact list or are starting from scratch, the
              fastest route is to run it through the same workflow. Here is the exact checklist I
              give indie artist clients.
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>
                Gather every scrap of contact data you have: presenter names from Google, show
                titles from Wikipedia, anything you can find.
              </li>
              <li>
                Upload to Audio Intel and tag the campaign as BBC Radio 6 Music so the enrichment
                engine scopes indie/alternative-focused intelligence.
              </li>
              <li>
                Review the genre match scores, prioritise shows with 85+ percent confidence for your
                sound, and request manual review if needed.
              </li>
              <li>
                Export the CSV with submission route recommendations (BBC Introducing vs Fresh On
                The Net vs direct), and send the PDF summary to the artist showing best-match shows.
              </li>
              <li>
                Track replies inside your CRM and feed them back into Audio Intel for live activity
                dashboards.
              </li>
            </ol>
          </section>

          <section id="testimonials" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">What Other Indie Promoters Say</h2>
            <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
              "I have been promoting indie artists to BBC Radio 6 Music for six years. Audio Intel
              is the first tool that actually tracks the 2025 schedule changes and matches genres to
              the right shows. The enriched intel alone saves me a full day of research per
              campaign."
            </blockquote>
            <p className="text-sm text-gray-500">Pulled from internal beta feedback, March 2025.</p>
          </section>

          <section id="understanding-6-music" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Understanding BBC Radio 6 Music&apos;s Structure
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              BBC Radio 6 Music operates as the UK&apos;s alternative and indie music station with a
              completely different culture from Radio 1. Understanding this structure is critical
              for indie artists targeting airplay.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">
              Album-Focused vs Singles-Focused Programming
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              Unlike Radio 1&apos;s singles-heavy rotation, BBC Radio 6 Music champions album tracks
              and deep cuts. Presenters play full albums during "Breakfast Album" slots, feature
              extended album sessions, and prioritise artistic depth over commercial appeal. This
              means pitching single tracks requires different context than Radio 1 campaigns.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Audio Intel identifies which presenters favour album-based artists versus those who
              champion emerging singles. Steve Lamacq focuses on new indie releases across formats,
              while Mary Anne Hobbs prefers experimental album projects. The enrichment process
              matches your release format to appropriate shows automatically.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">
              2025 Schedule Changes Impact Everything
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              February 2025 brought massive presenter shuffles: Nick Grimshaw to breakfast, Lauren
              Laverne to mid-mornings, Steve Lamacq reduced to Mondays only. Most online contact
              databases still reflect the 2024 schedule, meaning pitches hit wrong time slots or
              inactive shows.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              During enrichment, Audio Intel cross-references current BBC schedule data, recent
              broadcast logs, and presenter social updates. The case study flagged three outdated
              show assignments from the original contact list and provided current presenter
              schedules accurate to February 2025.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">
              Multiple Submission Pathways for Different Artist Tiers
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              BBC Radio 6 Music maintains three submission routes: BBC Introducing Uploader for
              unsigned/emerging artists, Fresh On The Net for independent releases, and direct
              presenter contact for established acts. The enrichment process identifies which route
              applies based on artist tier and previous BBC airplay history.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              For this campaign, the indie rock band qualified for BBC Introducing due to no
              previous BBC plays. The enrichment report highlighted Huw Stephens as primary BBC
              Introducing contact and Steve Lamacq for direct pitching if Introducing placement
              succeeds.
            </p>
          </section>

          <section id="common-mistakes" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              5 BBC Radio 6 Music Pitching Mistakes That Kill Indie Campaigns
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              After running dozens of BBC Radio 6 Music campaigns for indie artists, these are the
              mistakes that come up repeatedly. Audio Intel prevents most of them automatically.
            </p>

            <div className="space-y-6">
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake 1: Using Outdated 2024 Presenter Schedules
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  February 2025 schedule changes made most online resources obsolete. Pitching Steve
                  Lamacq on Wednesday afternoons (his old slot) means your email never gets heard
                  because he only broadcasts Mondays now. Audio Intel verifies current schedules
                  during enrichment so pitches hit active time slots.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake 2: Pitching Singles Like Radio 1
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  BBC Radio 6 Music values album context and artistic narrative over commercial
                  singles. Pitching a single without mentioning the album, influences, or creative
                  process signals you do not understand the station culture. The enrichment process
                  identifies presenters who champion your specific indie sub-genre.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake 3: Ignoring BBC Introducing as Primary Route
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  For unsigned and emerging indie artists, BBC Introducing Uploader is the official
                  first step. Direct presenter pitches without Introducing validation often get
                  ignored. Audio Intel flags artist tier and recommends appropriate submission
                  pathway during enrichment.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake 4: Genre Mismatch Between Artist and Presenter
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Pitching electronic experimental music to Steve Lamacq (guitar indie specialist)
                  or indie rock to Mary Anne Hobbs (electronic/experimental champion) wastes
                  everyone&apos;s time. Audio Intel scores genre fit automatically and highlights
                  best-match presenters for your sound.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mistake 5: No Follow-Up Strategy After Initial Pitch
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  BBC Radio 6 Music presenters receive hundreds of pitches monthly. A single email
                  rarely works for emerging artists. Audio Intel suggests follow-up timing based on
                  show schedules, presenter reply patterns, and campaign momentum indicators.
                </p>
              </div>
            </div>
          </section>

          <section id="beyond-6-music" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Beyond BBC Radio 6 Music: Scaling the Same Workflow
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The enrichment process works identically for BBC Radio 1, BBC Radio 2, commercial
              alternative stations, and streaming platforms. Once you prove the workflow on 6 Music,
              you can scale across the entire UK indie promotion landscape.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  BBC Radio 1 Specialist Shows
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  Radio 1 specialist programming (Jack Saunders, Annie Mac&apos;s replacement)
                  targets younger demographics than 6 Music but similar indie/alternative focus. The
                  enrichment process identifies crossover opportunities and submission timing for
                  both stations.
                </p>
                <a
                  href="/blog/bbc-radio-1-contact-enrichment"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read the BBC Radio 1 case study →
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  BBC Radio 2 Alternative Programming
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  Radio 2 specialist shows (Jo Whiley, Dermot O&apos;Leary) bridge mainstream and
                  alternative. The enrichment workflow identifies which indie artists fit Radio
                  2&apos;s more accessible alternative programming alongside 6 Music pitches.
                </p>
                <a
                  href="/blog/bbc-radio-2-contact-enrichment"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  See the Radio 2 enrichment guide →
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Spotify Editorial Playlists
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  Indie List UK, Fresh Finds UK, and genre-specific Spotify editorial playlists
                  complement BBC Radio 6 Music campaigns. The enrichment process provides submission
                  timing and metadata optimisation for streaming alongside radio promotion.
                </p>
                <a
                  href="/blog/spotify-editorial-playlist-contacts"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read the Spotify editorial workflow →
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Commercial Alternative Radio
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  Absolute Radio, Kerrang, and regional alternative stations offer additional UK
                  indie promotion routes. The enrichment process maps commercial radio structures
                  and identifies regional vs national decision makers for indie artists.
                </p>
                <a
                  href="/blog/kerrang-radio-contact-enrichment"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  See the commercial radio guide →
                </a>
              </div>
            </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Do I need email addresses to use Audio Intel for BBC Radio 6 Music contacts?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Yes. Audio Intel is a contact enrichment tool, not a contact discovery tool. You
                    need basic presenter names and email addresses to start the enrichment process.
                    These can come from BBC website searches, LinkedIn profiles, previous campaign
                    records, or industry databases.
                  </p>
                  <p>
                    The enrichment process then verifies those contacts are current (post-February
                    2025 schedule changes), adds show assignments, identifies genre preferences, and
                    flags submission routes. This prevents pitching outdated presenters or wrong
                    shows.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How accurate are the genre match scores for BBC Radio 6 Music shows?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    The enrichment process analyses recent playlists, show descriptions, and
                    presenter social feeds to score genre fit. For indie rock artists, Steve Lamacq
                    typically scores 90+ percent match while Mary Anne Hobbs
                    (electronic/experimental) scores lower unless your sound has electronic
                    elements.
                  </p>
                  <p>
                    Genre scoring helps prioritise which presenters to pitch first, avoiding the
                    common mistake of mass-pitching every 6 Music show regardless of fit.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Should unsigned indie artists use BBC Introducing or direct presenter contact?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    For unsigned and emerging artists with no previous BBC airplay, BBC Introducing
                    Uploader is the official first step. Huw Stephens champions BBC Introducing on 6
                    Music, and successful Introducing plays open doors to specialist presenter
                    contact.
                  </p>
                  <p>
                    Audio Intel identifies artist tier during enrichment and recommends submission
                    pathway. If you have previous BBC plays or established press coverage, direct
                    presenter contact becomes viable alongside Introducing.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  How often do BBC Radio 6 Music presenter schedules change?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Major schedule overhauls happen yearly or bi-yearly. February 2025 brought
                    significant changes (Nick Grimshaw to breakfast, Steve Lamacq reduced to
                    Mondays). Smaller show time adjustments happen quarterly.
                  </p>
                  <p>
                    Audio Intel cross-references current BBC schedule data during enrichment so
                    presenter assignments reflect real broadcast schedules, not cached data from
                    months ago.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  What file formats does Audio Intel accept for BBC Radio 6 Music contact lists?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Upload contacts as CSV files with columns for presenter name, email address, and
                    optional fields like show name, genre, or previous notes. The platform handles
                    common formatting variations automatically.
                  </p>
                  <p>
                    After enrichment, export results as CSV for your email marketing tool or as PDF
                    summaries for artist/manager reporting with genre match scores and submission
                    recommendations.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-xl p-6 group">
                <summary className="text-xl font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  Does this work for BBC Radio 1 and other BBC stations?
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Yes. The enrichment workflow is identical for BBC Radio 1 specialist shows, BBC
                    Radio 2 alternative programming, BBC Radio 1Xtra urban music, and regional BBC
                    stations. Upload your existing contact emails, tag the campaign with the target
                    station, and the enrichment process scopes appropriate sources.
                  </p>
                  <p>
                    Each BBC network has different submission cultures and genre preferences. The
                    enrichment process adapts automatically based on station context you provide.
                  </p>
                </div>
              </details>
            </div>
          </section>

          <section id="getting-started" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              How to Start Your Own BBC Radio 6 Music Campaign
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you have BBC Radio 6 Music contact data in spreadsheets, old emails, or are
              starting from scratch with presenter names from Google, you can run the same
              enrichment workflow today. Here is the step-by-step process.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 1: Gather Your Existing Contacts
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Collect every BBC Radio 6 Music presenter name and email address you can find from
                  previous campaigns, BBC website searches, LinkedIn profiles, or industry
                  databases. Even partial or outdated data works - the enrichment process validates
                  and updates everything.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Step 2: Format as CSV</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Create a CSV file with at minimum presenter name and email address columns.
                  Optional fields like show name, genre preference, or previous campaign notes help
                  enrichment but are not required. Save the file and prepare for upload.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 3: Upload to Audio Intel
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Log into Audio Intel, start a new enrichment campaign, and upload your CSV. Tag
                  the campaign as BBC Radio 6 Music so the platform knows to scope
                  indie/alternative-focused intelligence and current 2025 schedule data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 4: Review Enriched Results
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Enrichment typically completes in under two minutes. Review the genre match scores
                  (85+ percent is strong fit), check flagged outdated presenters, and confirm
                  submission routes (BBC Introducing vs direct contact) match your artist tier.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Step 5: Export and Execute</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Export the enriched contact list as CSV for your email marketing platform, or
                  download the PDF summary to share with artists/managers. The enriched data
                  includes current show schedules, genre match scores, and submission pathway
                  recommendations.
                </p>
              </div>
            </div>
          </section>

          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Ready to Stop Guessing BBC Radio 6 Music Contacts?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Audio Intel was built by people who actually pitch BBC Radio 6 Music for indie artists
              every month. Drop your messy spreadsheet, and we will return validated contacts,
              show-match recommendations, and submission route guidance so you spend time on the
              music rather than the admin.
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
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Do I need email addresses to use Audio Intel for BBC Radio 6 Music contacts?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Audio Intel is a contact enrichment tool, not a contact discovery tool. You need basic presenter names and email addresses to start the enrichment process. The enrichment process then verifies those contacts are current (post-February 2025 schedule changes), adds show assignments, identifies genre preferences, and flags submission routes.',
                },
              },
              {
                '@type': 'Question',
                name: 'How accurate are the genre match scores for BBC Radio 6 Music shows?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The enrichment process analyses recent playlists, show descriptions, and presenter social feeds to score genre fit. For indie rock artists, Steve Lamacq typically scores 90+ percent match while Mary Anne Hobbs (electronic/experimental) scores lower unless your sound has electronic elements. Genre scoring helps prioritise which presenters to pitch first.',
                },
              },
              {
                '@type': 'Question',
                name: 'Should unsigned indie artists use BBC Introducing or direct presenter contact?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'For unsigned and emerging artists with no previous BBC airplay, BBC Introducing Uploader is the official first step. Huw Stephens champions BBC Introducing on 6 Music, and successful Introducing plays open doors to specialist presenter contact. Audio Intel identifies artist tier during enrichment and recommends submission pathway.',
                },
              },
              {
                '@type': 'Question',
                name: 'How often do BBC Radio 6 Music presenter schedules change?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Major schedule overhauls happen yearly or bi-yearly. February 2025 brought significant changes (Nick Grimshaw to breakfast, Steve Lamacq reduced to Mondays). Smaller show time adjustments happen quarterly. Audio Intel cross-references current BBC schedule data during enrichment so presenter assignments reflect real broadcast schedules.',
                },
              },
              {
                '@type': 'Question',
                name: 'What file formats does Audio Intel accept for BBC Radio 6 Music contact lists?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Upload contacts as CSV files with columns for presenter name, email address, and optional fields like show name, genre, or previous notes. The platform handles common formatting variations automatically. After enrichment, export results as CSV for your email marketing tool or as PDF summaries for artist/manager reporting.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does this work for BBC Radio 1 and other BBC stations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. The enrichment workflow is identical for BBC Radio 1 specialist shows, BBC Radio 2 alternative programming, BBC Radio 1Xtra urban music, and regional BBC stations. Each BBC network has different submission cultures and genre preferences. The enrichment process adapts automatically based on station context you provide.',
                },
              },
            ],
          }),
        }}
      />
    </PSEOPageWrapper>
  );
}
