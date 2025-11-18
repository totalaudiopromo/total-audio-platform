'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/campaigns/StatusBadge';
import { useState } from 'react';

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
    name: '"Maybe (i)" Single Launch',
    artist: 'sadact',
    status: 'active',
    platform: 'BBC Radio + Spotify',
    emailsSent: 5,
    responses: 2,
    coverageSecured: 1,
    responseRate: 40,
    budget: 500,
    spent: 125,
    contacts: [
      {
        name: 'Danny Howard',
        role: 'BBC Radio 1',
        platform: 'Radio',
        status: 'responded',
      },
      {
        name: 'Pete Tong',
        role: 'BBC Radio 1',
        platform: 'Radio',
        status: 'sent',
      },
      {
        name: 'Tom Ravenscroft',
        role: 'BBC 6 Music',
        platform: 'Radio',
        status: 'success',
      },
      {
        name: 'Spotify Editorial',
        role: 'Electronic Chill',
        platform: 'Playlist',
        status: 'opened',
      },
      {
        name: 'Apple Music',
        role: 'Breaking Electronic',
        platform: 'Playlist',
        status: 'no_response',
      },
    ],
    activities: [
      {
        date: '2025-11-09',
        type: 'Coverage Secured',
        contact: 'Tom Ravenscroft',
        details: 'Confirmed play on BBC 6 Music - Late Junction',
        status: 'success',
      },
      {
        date: '2025-11-08',
        type: 'Email Response',
        contact: 'Danny Howard',
        details: 'Interested, requested full track',
        status: 'success',
      },
      {
        date: '2025-11-07',
        type: 'Email Sent',
        contact: 'Pete Tong',
        details: 'Personalised pitch sent with BBC contact history',
        status: 'pending',
      },
      {
        date: '2025-11-06',
        type: 'Email Sent',
        contact: 'Spotify Editorial',
        details: 'Submission via playlist contact form',
        status: 'pending',
      },
      {
        date: '2025-11-05',
        type: 'Campaign Started',
        contact: 'System',
        details: 'Campaign created and contacts imported',
        status: 'success',
      },
    ],
  },
  {
    id: 2,
    name: 'House Track Release',
    artist: 'Liberty Client',
    status: 'completed',
    platform: 'Radio + Playlisting',
    emailsSent: 12,
    responses: 8,
    coverageSecured: 3,
    responseRate: 67,
    budget: 800,
    spent: 800,
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
    name: 'Electronic EP Campaign',
    artist: 'Emerging Artist',
    status: 'active',
    platform: 'Multi-platform',
    emailsSent: 20,
    responses: 6,
    coverageSecured: 2,
    responseRate: 30,
    budget: 1200,
    spent: 600,
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
      responded: 'bg-orange-100 text-orange-700 border-orange-300',
      success: 'bg-green-100 text-green-700 border-green-300',
      no_response: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status];
  };

  const getActivityStatusColor = (status: Activity['status']) => {
    const colors = {
      success: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-orange-100 text-orange-700 border-orange-300',
      failed: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header with Coveragebook Badge */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-teal-100 border-2 border-teal-600 rounded-full">
            <span className="text-sm font-bold text-teal-800">📊 COVERAGEBOOK-COMPATIBLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Campaign Tracker Demo
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Professional campaign tracking with Coveragebook CSV export. Stop spending weekends updating spreadsheets.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Liberty Music PR integration • Real campaign data • One-click CSV export
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {demoCampaigns.map(campaign => (
            <button
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className="text-left bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600">{campaign.artist}</p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                  {campaign.platform}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sent</p>
                  <p className="text-lg font-bold text-gray-900">
                    {campaign.emailsSent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Responses</p>
                  <p className="text-lg font-bold text-teal-600">
                    {campaign.responses}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Coverage</p>
                  <p className="text-lg font-bold text-green-600">
                    {campaign.coverageSecured}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Response Rate</span>
                  <span className="font-bold">{campaign.responseRate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${campaign.responseRate}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Budget</span>
                <span className="font-medium text-gray-900">
                  £{campaign.spent} / £{campaign.budget}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Campaign Detail View */}
        {selectedCampaign && (
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  {selectedCampaign.name}
                </h2>
                <p className="text-lg text-gray-600">
                  {selectedCampaign.artist}
                </p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                Close ✕
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCampaign.emailsSent}
                </p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <p className="text-xs text-teal-600 mb-1">Responses</p>
                <p className="text-2xl font-bold text-teal-700">
                  {selectedCampaign.responses}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-green-600 mb-1">Coverage Secured</p>
                <p className="text-2xl font-bold text-green-700">
                  {selectedCampaign.coverageSecured}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-xs text-orange-600 mb-1">Response Rate</p>
                <p className="text-2xl font-bold text-orange-700">
                  {selectedCampaign.responseRate}%
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contacts List */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Contacts ({selectedCampaign.contacts.length})
                </h3>
                <div className="space-y-3">
                  {selectedCampaign.contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {contact.role}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(contact.status)}`}
                        >
                          {contact.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {contact.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {selectedCampaign.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {activity.type}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold border ${getActivityStatusColor(activity.status)}`}
                            >
                              {activity.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            {activity.contact}
                          </p>
                          <p className="text-sm text-gray-700">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {activity.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights Section */}
            <div className="mt-8 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-600 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Campaign Intelligence
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Based on {selectedCampaign.emailsSent} pitches and{' '}
                    {selectedCampaign.responses} responses, here's what's
                    working:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        Your {selectedCampaign.responseRate}% response rate is{' '}
                        {selectedCampaign.responseRate > 30 ? 'above' : 'below'}{' '}
                        industry average (30%)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        Personalised pitches to BBC contacts showing strongest
                        conversion
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        Follow up with non-responders after 7 days to improve
                        coverage rate
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Showcase */}
        <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            What You're Seeing
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Manual Activity Logging
              </h3>
              <p className="text-sm text-gray-600">
                All campaign activities are manually logged by you. Track emails
                sent, responses received, and coverage secured. Simple,
                transparent, and in your control.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Contact Status Tracking
              </h3>
              <p className="text-sm text-gray-600">
                See at a glance which contacts you've pitched, who's opened your
                emails, who's responded, and where you've secured coverage.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Campaign Intelligence
              </h3>
              <p className="text-sm text-gray-600">
                Get AI-powered insights on your campaign performance, response
                rates, and suggested next actions based on industry benchmarks.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Professional Reporting
              </h3>
              <p className="text-sm text-gray-600">
                Stop spending weekends updating spreadsheets. Track everything
                in one place and see what's actually working across all your
                campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-teal-50 to-cyan-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            Ready to track your campaigns properly?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            This demo shows example campaigns. Start tracking your real
            campaigns, get intelligent insights, and stop losing hours to messy
            spreadsheets.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            Start Tracking Free →
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required. Full access to campaign tracking.
          </p>
        </div>
      </main>
    </div>
  );
}
