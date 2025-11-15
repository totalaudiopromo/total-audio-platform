'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/campaigns/StatusBadge';
import { useState } from 'react';
import {
  Mail,
  Radio,
  Music,
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

interface Contact {
  name: string;
  role: string;
  platform: string;
  status: 'sent' | 'opened' | 'responded' | 'success' | 'no_response';
}

interface Activity {
  date: string;
  type: string;
  contact: string;
  details: string;
  status: 'success' | 'pending' | 'failed';
}

interface Campaign {
  id: number;
  name: string;
  artist: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platform: string;
  emailsSent: number;
  responses: number;
  coverageSecured: number;
  responseRate: number;
  contacts: Contact[];
  activities: Activity[];
  budget: number;
  spent: number;
}

const demoCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'UK Radio Campaign - Artist Release',
    artist: 'Liberty Music PR Client',
    status: 'active',
    platform: 'BBC Radio + Streaming',
    emailsSent: 50,
    responses: 42,
    coverageSecured: 8,
    responseRate: 84,
    budget: 500,
    spent: 375,
    contacts: [
      {
        name: 'Danny Howard',
        role: 'BBC Radio 1 Presenter',
        platform: 'Radio',
        status: 'success',
      },
      {
        name: 'Annie Mac',
        role: 'BBC Radio 1 Presenter',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Tom Ravenscroft',
        role: 'BBC 6 Music Show',
        platform: 'Radio',
        status: 'success',
      },
      {
        name: 'Pete Tong',
        role: 'BBC Radio 1 Dance',
        platform: 'Radio',
        status: 'opened',
      },
      {
        name: 'Huw Stephens',
        role: 'BBC Radio 1 Unsigned Playlist',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Spotify UK Editorial',
        role: 'New Music Friday UK',
        platform: 'Playlist',
        status: 'success',
      },
      {
        name: 'Apple Music Breaking',
        role: 'Breaking Music Playlist',
        platform: 'Playlist',
        status: 'opened',
      },
      {
        name: 'NME Music',
        role: 'Digital Editor',
        platform: 'Press',
        status: 'responded',
      },
    ],
    activities: [
      {
        date: '2025-11-14',
        type: 'Coverage Secured',
        contact: 'Spotify UK Editorial',
        details: 'Added to "New Music Friday UK" playlist (450k followers)',
        status: 'success',
      },
      {
        date: '2025-11-12',
        type: 'Coverage Secured',
        contact: 'Danny Howard',
        details: 'Scheduled for BBC Radio 1 afternoon show',
        status: 'success',
      },
      {
        date: '2025-11-11',
        type: 'Email Response',
        contact: 'Tom Ravenscroft',
        details: 'Interested, added to BBC 6 Music rotation',
        status: 'success',
      },
      {
        date: '2025-11-10',
        type: 'Follow-up Sent',
        contact: 'Annie Mac',
        details: 'Second follow-up with streaming stats',
        status: 'pending',
      },
      {
        date: '2025-11-08',
        type: 'Bulk Pitch Sent',
        contact: 'Multiple Contacts',
        details:
          '50 personalised pitches sent to BBC Radio, streaming, and press',
        status: 'success',
      },
      {
        date: '2025-11-05',
        type: 'Campaign Started',
        contact: 'Liberty Music PR',
        details:
          'Campaign created: 50 radio stations and playlist contacts imported',
        status: 'success',
      },
    ],
  },
  {
    id: 2,
    name: 'Dance Track Release - Liberty Client',
    artist: 'Liberty Music PR Client',
    status: 'completed',
    platform: 'Radio + Playlisting',
    emailsSent: 50,
    responses: 42,
    coverageSecured: 12,
    responseRate: 84,
    budget: 800,
    spent: 750,
    contacts: [
      {
        name: 'Annie Mac',
        role: 'BBC Radio 1',
        platform: 'Radio',
        status: 'success',
      },
      {
        name: 'MistaJam',
        role: 'Capital Xtra',
        platform: 'Radio',
        status: 'success',
      },
      {
        name: 'Spotify UK House',
        role: 'UK House Playlist',
        platform: 'Playlist',
        status: 'success',
      },
      {
        name: 'Apple Music Dance',
        role: 'New in Dance',
        platform: 'Playlist',
        status: 'responded',
      },
      {
        name: 'Kiss FM',
        role: 'Dance Specialist',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Rinse FM',
        role: 'House Show',
        platform: 'Radio',
        status: 'no_response',
      },
    ],
    activities: [
      {
        date: '2025-11-01',
        type: 'Campaign Completed',
        contact: 'System',
        details: 'All follow-ups sent, 3 placements secured',
        status: 'success',
      },
      {
        date: '2025-10-28',
        type: 'Playlist Add',
        contact: 'Spotify UK House',
        details: 'Added to UK House playlist (180k followers)',
        status: 'success',
      },
      {
        date: '2025-10-25',
        type: 'Radio Play Confirmed',
        contact: 'MistaJam',
        details: 'Played on Capital Xtra prime time show',
        status: 'success',
      },
      {
        date: '2025-10-22',
        type: 'Radio Play Confirmed',
        contact: 'Annie Mac',
        details: 'Featured on BBC Radio 1 - Future Sounds',
        status: 'success',
      },
      {
        date: '2025-10-20',
        type: 'Follow-up Sent',
        contact: 'Kiss FM',
        details: 'Second follow-up with streaming stats',
        status: 'pending',
      },
      {
        date: '2025-10-15',
        type: 'Bulk Pitch Sent',
        contact: 'Multiple',
        details: '12 personalised pitches sent to radio & playlists',
        status: 'success',
      },
    ],
  },
  {
    id: 3,
    name: 'Electronic EP - Liberty Music PR',
    artist: 'Liberty Music PR Artist',
    status: 'active',
    platform: 'Multi-platform Campaign',
    emailsSent: 50,
    responses: 30,
    coverageSecured: 6,
    responseRate: 60,
    budget: 1200,
    spent: 800,
    contacts: [
      {
        name: 'BBC Introducing',
        role: 'Regional Shows',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Deezer Editorial',
        role: 'Electronic Flow',
        platform: 'Playlist',
        status: 'success',
      },
      {
        name: 'Amazing Radio',
        role: 'New Music Show',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Beatport',
        role: 'Featured Release',
        platform: 'Store',
        status: 'sent',
      },
      {
        name: 'Resident Advisor',
        role: 'Reviews Editor',
        platform: 'Press',
        status: 'responded',
      },
      {
        name: 'Mixmag',
        role: 'Digital Editor',
        platform: 'Press',
        status: 'no_response',
      },
    ],
    activities: [
      {
        date: '2025-11-08',
        type: 'Playlist Add',
        contact: 'Deezer Editorial',
        details: 'Added to Electronic Flow playlist (45k followers)',
        status: 'success',
      },
      {
        date: '2025-11-05',
        type: 'Email Response',
        contact: 'BBC Introducing',
        details: 'Interested, requested full EP for review',
        status: 'success',
      },
      {
        date: '2025-11-03',
        type: 'Email Response',
        contact: 'Resident Advisor',
        details: 'Considering for review, no guarantee',
        status: 'pending',
      },
      {
        date: '2025-11-01',
        type: 'Follow-up Sent',
        contact: 'Amazing Radio',
        details: 'Second follow-up with live session offer',
        status: 'pending',
      },
      {
        date: '2025-10-28',
        type: 'Bulk Pitch Sent',
        contact: 'Multiple',
        details: '20 personalised pitches across radio, press, and playlists',
        status: 'success',
      },
      {
        date: '2025-10-25',
        type: 'Campaign Started',
        contact: 'System',
        details: 'Multi-platform campaign created',
        status: 'success',
      },
    ],
  },
];

export default function DemoPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const getStatusColor = (status: Contact['status']) => {
    const colors = {
      sent: 'bg-gray-100 text-gray-700 border-gray-300',
      opened: 'bg-blue-100 text-blue-700 border-blue-300',
      responded: 'bg-amber-100 text-amber-700 border-amber-300',
      success: 'bg-green-100 text-green-700 border-green-300',
      no_response: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status];
  };

  const getActivityStatusColor = (status: Activity['status']) => {
    const colors = {
      success: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      failed: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl font-black text-gray-900">
                  Campaign Tracker
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-bold text-sm"
              >
                Home
              </Link>
              <Link
                href="/auth/signin"
                className="bg-teal-600 text-white px-4 py-2 rounded font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-sm"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-teal-100 border-2 border-black rounded">
            <span className="text-sm font-black text-gray-900">DEMO DATA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Campaign Tracker Demo
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mb-4">
            Radio Promotion CRM for Liberty Music PR
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Track submissions, responses, and coverage across 50+ radio
            stations, playlists, and press contacts in one organised place. See
            how Tracker transforms campaign management from spreadsheet chaos
            into actionable intelligence.
          </p>
          <p className="text-sm text-gray-500">
            Click any campaign below to explore the full tracking interface
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {demoCampaigns.map(campaign => (
            <button
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className="text-left bg-white border-2 border-black rounded p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-600">
                    {campaign.artist}
                  </p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-black border border-teal-300">
                  {campaign.platform}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t-2 border-b-2 border-black">
                <div>
                  <p className="text-xs font-black text-gray-500 mb-1">SENT</p>
                  <p className="text-2xl font-black text-gray-900">
                    {campaign.emailsSent}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-500 mb-1">
                    RESPONSES
                  </p>
                  <p className="text-2xl font-black text-teal-600">
                    {campaign.responses}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-500 mb-1">
                    COVERAGE
                  </p>
                  <p className="text-2xl font-black text-green-600">
                    {campaign.coverageSecured}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-black text-gray-700 mb-2">
                  <span>RESPONSE RATE</span>
                  <span>{campaign.responseRate}%</span>
                </div>
                <div className="h-3 bg-gray-200 border border-black overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all"
                    style={{ width: `${campaign.responseRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-black flex justify-between text-sm font-bold">
                <span className="text-gray-600">Budget</span>
                <span className="text-gray-900">
                  £{campaign.spent} / £{campaign.budget}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Campaign Detail View */}
        {selectedCampaign && (
          <div className="bg-white border-4 border-black rounded p-6 sm:p-8 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                  {selectedCampaign.name}
                </h2>
                <p className="text-lg font-semibold text-gray-600">
                  {selectedCampaign.artist}
                </p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-600 hover:text-gray-900 font-black text-xl hover:bg-gray-100 p-2 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <p className="text-xs font-black text-gray-500">SENT</p>
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {selectedCampaign.emailsSent}
                </p>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <p className="text-xs font-black text-teal-600">RESPONSES</p>
                </div>
                <p className="text-3xl font-black text-teal-600">
                  {selectedCampaign.responses}
                </p>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-black text-green-600">COVERAGE</p>
                </div>
                <p className="text-3xl font-black text-green-600">
                  {selectedCampaign.coverageSecured}
                </p>
              </div>
              <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-black text-amber-600">RATE</p>
                </div>
                <p className="text-3xl font-black text-amber-600">
                  {selectedCampaign.responseRate}%
                </p>
              </div>
            </div>

            {/* Contacts and Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contacts List */}
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  Contacts ({selectedCampaign.contacts.length})
                </h3>
                <div className="space-y-3">
                  {selectedCampaign.contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-black text-gray-900 text-sm">
                            {contact.name}
                          </p>
                          <p className="text-xs font-semibold text-gray-600 mt-1">
                            {contact.role}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-black border border-black ${getStatusColor(contact.status)}`}
                        >
                          {contact.status === 'no_response'
                            ? 'no response'
                            : contact.status}
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold border border-gray-300">
                        {contact.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {selectedCampaign.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-black text-gray-900 text-sm">
                              {activity.type}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-black border border-black ${getActivityStatusColor(activity.status)}`}
                            >
                              {activity.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-600 mb-1">
                            {activity.contact}
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-bold">
                        {activity.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign Intelligence Section */}
            <div className="mt-8 bg-white border-3 border-teal-600 p-6 shadow-[4px_4px_0px_0px_rgba(20,184,166,0.5)]">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xl font-black text-gray-900 mb-3">
                    Campaign Intelligence
                  </h4>
                  <p className="text-sm font-semibold text-gray-700 mb-4">
                    Based on {selectedCampaign.emailsSent} submissions and{' '}
                    {selectedCampaign.responses} responses:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-teal-600 font-black text-lg leading-none">
                        ✓
                      </span>
                      <span className="font-medium">
                        Your {selectedCampaign.responseRate}% response rate is{' '}
                        <span className="font-black text-teal-600">
                          {selectedCampaign.responseRate > 30
                            ? 'above'
                            : 'below'}
                        </span>{' '}
                        industry average (30%)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-teal-600 font-black text-lg leading-none">
                        ✓
                      </span>
                      <span className="font-medium">
                        Radio stations and BBC contacts showing strongest
                        engagement rates
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-teal-600 font-black text-lg leading-none">
                        ✓
                      </span>
                      <span className="font-medium">
                        Follow-up suggestions: Contact non-responders after 7
                        days to boost coverage rate from{' '}
                        {selectedCampaign.coverageSecured} to{' '}
                        {Math.ceil(selectedCampaign.coverageSecured * 1.5)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Showcase */}
        <div className="bg-white border-4 border-black p-8 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            Campaign Tracker Features
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border-2 border-black p-6">
              <div className="flex items-start gap-3 mb-3">
                <Mail className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="font-black text-lg text-gray-900">
                  Email & Submission Tracking
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Log every pitch sent, track opens, and record responses. Keep
                detailed notes on each contact interaction and submission
                status.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <div className="flex items-start gap-3 mb-3">
                <Radio className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="font-black text-lg text-gray-900">
                  Contact Management
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Organise 50+ radio stations, playlists, and press contacts in
                one place. See contact history, status, and previous
                interactions at a glance.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="font-black text-lg text-gray-900">
                  Campaign Analytics
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Real-time metrics on response rates, coverage secured, and
                budget tracking. See what's working and adjust strategy
                accordingly.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <div className="flex items-start gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="font-black text-lg text-gray-900">
                  Intelligent Insights
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                AI-powered recommendations on follow-up timing, contact
                prioritisation, and campaign optimisation based on your
                performance data.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Stop Losing Hours to Spreadsheets
          </h2>
          <p className="text-lg text-gray-700 mb-2 max-w-2xl mx-auto">
            Campaign Tracker brings organisation and intelligence to radio
            promotion campaigns.
          </p>
          <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
            50+ contacts tracked. Real-time response rates. Intelligent
            follow-up suggestions. All in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/auth/signin"
              className="inline-block bg-teal-600 text-white px-8 py-4 font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
            >
              Start Tracking Free →
            </Link>
            <Link
              href="/"
              className="inline-block bg-white text-gray-900 px-8 py-4 font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
            >
              Learn More
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            No credit card required. 14-day free trial with full access. Perfect
            for Liberty Music PR and independent campaigners.
          </p>
        </div>
      </main>
    </div>
  );
}
