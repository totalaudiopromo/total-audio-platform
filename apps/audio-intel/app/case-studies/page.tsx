'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react'

// Case Study Data
const caseStudies = [
  {
    id: 'bbc-radio-1',
    title: 'BBC Radio 1 Campaign: Electronic Artist Launch',
    artist: 'sadact (Electronic Producer)',
    genre: 'House / Electronic',
    campaignType: 'National Radio Push',
    timeline: '4 weeks',
    beforeImage: '/assets/case-studies/before-chaos.png',
    afterImage: '/assets/case-studies/after-organised.png',
    problem: {
      title: 'The Chaos Before Audio Intel',
      points: [
        '3 different Excel files with contact info',
        '15+ hours researching BBC Radio 1 presenter preferences',
        'Missing submission guidelines for most contacts',
        'No validation - sending to outdated emails',
        'Manual compilation of pitch requirements per show',
      ],
    },
    solution: {
      title: 'The Audio Intel Transformation',
      timeSaved: '14 hours',
      contactsEnriched: 47,
      successRate: '100%',
      results: [
        'Enriched 47 BBC contacts in 15 minutes',
        'Validated all email addresses automatically',
        'Retrieved submission guidelines for all shows',
        'Identified optimal pitch timing per presenter',
        'Discovered 12 new relevant contacts via platform search',
      ],
    },
    metrics: [
      { label: 'Research Time', before: '15 hours', after: '15 minutes', improvement: '98% reduction' },
      { label: 'Contact Quality', before: '60% valid', after: '100% validated', improvement: '40% improvement' },
      { label: 'Campaign Confidence', before: 'Low', after: 'High', improvement: 'Game changer' },
    ],
    quote: {
      text: 'I was spending entire weekends researching BBC Radio 1 contacts. Audio Intel gave me back my weekends and delivered better data than I could manually compile.',
      author: 'Chris Schofield',
      role: 'Radio Promoter / Producer (sadact)',
    },
    contacts: [
      { name: 'Greg James', platform: 'BBC Radio 1', show: 'Breakfast Show', timing: '6:30-10am', genre: 'Pop, Electronic' },
      { name: 'Danny Howard', platform: 'BBC Radio 1', show: 'Dance', timing: 'Friday 7-9pm', genre: 'House, Techno' },
      { name: 'Pete Tong', platform: 'BBC Radio 1', show: 'Essential Selection', timing: 'Friday 8-10pm', genre: 'Dance, Electronic' },
    ],
  },
  {
    id: 'spotify-editorial',
    title: 'Spotify Editorial: House Music Playlist Push',
    artist: 'Underground House Producer',
    genre: 'House / Dance',
    campaignType: 'Playlist Targeting',
    timeline: '6 weeks',
    beforeImage: '/assets/case-studies/spotify-before.png',
    afterImage: '/assets/case-studies/spotify-after.png',
    problem: {
      title: 'The Spotify Submission Maze',
      points: [
        'No clear contact information for editorial teams',
        'Generic submission forms with low response rates',
        'Missing information on playlist submission windows',
        'No data on curator preferences or submission history',
        '10+ hours researching optimal submission strategies',
      ],
    },
    solution: {
      title: 'Targeted Editorial Intelligence',
      timeSaved: '12 hours',
      contactsEnriched: 34,
      successRate: '100%',
      results: [
        'Identified 34 relevant playlist curators and contacts',
        'Retrieved submission timing requirements (4-week lead)',
        'Discovered genre-specific curator preferences',
        'Found alternative submission routes beyond Spotify for Artists',
        'Compiled submission guidelines for 12 major playlists',
      ],
    },
    metrics: [
      { label: 'Research Time', before: '10 hours', after: '20 minutes', improvement: '97% reduction' },
      { label: 'Playlist Targets', before: '8 generic', after: '34 specific', improvement: '325% increase' },
      { label: 'Submission Strategy', before: 'Hope & pray', after: 'Data-driven', improvement: 'Confidence boost' },
    ],
    quote: {
      text: 'Spotify editorial was a black box. Audio Intel gave me the intelligence to submit strategically, not desperately.',
      author: 'Chris Schofield',
      role: 'Electronic Music Promoter',
    },
    contacts: [
      { name: 'Spotify Editorial', platform: 'Spotify', show: 'New Music Friday UK', timing: '4-week lead', genre: 'All genres' },
      { name: 'Mint Playlist', platform: 'Spotify', show: 'Dance Hits', timing: 'Tuesday updates', genre: 'Dance, House' },
      { name: 'Hot Hits UK', platform: 'Spotify', show: 'Pop Focus', timing: 'Friday refresh', genre: 'Pop, Dance-Pop' },
    ],
  },
  {
    id: 'multi-platform',
    title: 'Multi-Platform Campaign: 200+ Contact Database',
    artist: 'Liberty Music PR (Agency)',
    genre: 'Multi-Genre Agency',
    campaignType: 'Full Campaign Management',
    timeline: 'Ongoing',
    beforeImage: '/assets/case-studies/agency-before.png',
    afterImage: '/assets/case-studies/agency-after.png',
    problem: {
      title: 'Agency-Scale Contact Chaos',
      points: [
        '200+ contacts across radio, press, and playlisting',
        'Multiple artists with different genre requirements',
        '20+ hours per week on contact research and validation',
        'Team coordination nightmare with shared spreadsheets',
        'No centralised intelligence or submission tracking',
      ],
    },
    solution: {
      title: 'Centralised Intelligence Platform',
      timeSaved: '18 hours/week',
      contactsEnriched: 237,
      successRate: '95%',
      results: [
        'Enriched 237 cross-platform contacts (radio, press, playlisting)',
        'Validated and cleaned entire contact database',
        'Genre-tagged all contacts for artist-specific filtering',
        'Retrieved submission guidelines for 180+ contacts',
        'Created exportable databases for team collaboration',
      ],
    },
    metrics: [
      { label: 'Weekly Research', before: '20 hours', after: '2 hours', improvement: '90% reduction' },
      { label: 'Contact Database', before: '60% accurate', after: '95% validated', improvement: '35% improvement' },
      { label: 'Team Efficiency', before: 'Siloed chaos', after: 'Centralised intel', improvement: 'Game changer' },
    ],
    quote: {
      text: 'We were spending a day per week just keeping our contact list current. Audio Intel turned that into a 20-minute weekly task.',
      author: 'Dan McCarthy',
      role: 'Founder, Liberty Music PR',
    },
    contacts: [
      { name: 'BBC Radio 1', platform: 'National Radio', show: 'Multiple Shows', timing: 'Various', genre: 'All genres' },
      { name: 'Spotify Editorial', platform: 'Playlisting', show: 'Multiple Playlists', timing: '4-week lead', genre: 'All genres' },
      { name: 'Regional Radio', platform: 'Local Radio', show: '40+ Stations', timing: 'Various', genre: 'Pop, Dance' },
    ],
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="border-b-4 border-black bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
            Real Campaigns, Real Results
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6">
            Audio Intel Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how real radio promoters, playlist curators, and PR agencies use Audio Intel to transform chaotic research into organised contact intelligence.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-24">
          {caseStudies.map((study, index) => (
            <div key={study.id} className="max-w-6xl mx-auto">
              {/* Case Study Header */}
              <div className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-white p-8 mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">
                    Case Study {index + 1}
                  </span>
                  <span className="rounded-full bg-gray-200 px-4 py-1 text-sm font-bold text-gray-700">
                    {study.genre}
                  </span>
                  <span className="rounded-full bg-purple-200 px-4 py-1 text-sm font-bold text-purple-700">
                    {study.campaignType}
                  </span>
                </div>
                <h2 className="text-4xl font-black mb-4">{study.title}</h2>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{study.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{study.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Problem Section */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="glass-panel border-red-500 bg-gradient-to-br from-red-50 to-white p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800 mb-6">
                    Before
                  </div>
                  <h3 className="text-2xl font-black mb-4">{study.problem.title}</h3>
                  <ul className="space-y-3">
                    {study.problem.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel border-green-500 bg-gradient-to-br from-green-50 to-white p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-800 mb-6">
                    After Audio Intel
                  </div>
                  <h3 className="text-2xl font-black mb-4">{study.solution.title}</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-600">{study.solution.timeSaved}</div>
                      <div className="text-xs text-gray-600">Time Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-600">{study.solution.contactsEnriched}</div>
                      <div className="text-xs text-gray-600">Contacts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-600">{study.solution.successRate}</div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {study.solution.results.map((result, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-gray-700">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Metrics Comparison */}
              <div className="glass-panel bg-white p-8 mb-8">
                <h3 className="text-2xl font-black mb-6 text-center">The Numbers</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {study.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-sm font-bold text-gray-600 mb-3">{metric.label}</div>
                      <div className="space-y-2">
                        <div className="text-red-600 font-bold line-through">{metric.before}</div>
                        <div className="text-2xl font-black text-green-600">{metric.after}</div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                        <TrendingUp className="w-3 h-3" />
                        {metric.improvement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Contacts */}
              <div className="glass-panel border-purple-500 bg-gradient-to-br from-purple-50 to-white p-8 mb-8">
                <h3 className="text-2xl font-black mb-6">Example Enriched Contacts</h3>
                <div className="space-y-4">
                  {study.contacts.map((contact, i) => (
                    <div key={i} className="bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-lg">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.platform} · {contact.show}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{contact.timing}</div>
                          <div className="text-xs text-gray-600">{contact.genre}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-purple-100 border border-purple-300 p-4">
                  <p className="text-sm text-purple-900">
                    <strong>Audio Intel provides:</strong> Submission guidelines, pitch timing, genre preferences, contact history, response rates, and current activity status for every contact.
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="glass-panel bg-gradient-to-br from-blue-100 to-purple-100 p-8 text-center">
                <div className="text-6xl text-blue-600 mb-4">"</div>
                <p className="text-xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-relaxed">
                  {study.quote.text}
                </p>
                <div className="font-bold text-gray-900">{study.quote.author}</div>
                <div className="text-sm text-gray-600">{study.quote.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-4 border-black bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to transform your campaigns?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join radio promoters, playlist curators, and PR agencies who've saved hundreds of hours with Audio Intel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/demo" className="cta-button">
              Try Live Demo →
            </Link>
            <Link href="/pricing" className="subtle-button">
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
