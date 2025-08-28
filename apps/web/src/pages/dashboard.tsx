import { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardStats {
  totalContacts: number;
  activeCampaigns: number;
  emailsSent: number;
  responseRate: number;
  recentReplies: number;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  emailsSent: number;
  replies: number;
  openRate: number;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  lastEngagement: string;
  responseRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    activeCampaigns: 0,
    emailsSent: 0,
    responseRate: 0,
    recentReplies: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch campaigns
        const campaignsResponse = await fetch('http://localhost:3001/api/mailchimp/campaigns');
        const campaignsData = await campaignsResponse.json();
        
        // Mock data for MVP - replace with real API calls
        const mockStats: DashboardStats = {
          totalContacts: 247,
          activeCampaigns: 3,
          emailsSent: 1247,
          responseRate: 23.5,
          recentReplies: 12
        };

        const mockCampaigns: Campaign[] = [
          {
            id: '1',
            name: 'Radio Campaign - Summer Release',
            type: 'Radio',
            status: 'Active',
            emailsSent: 156,
            replies: 23,
            openRate: 34.2,
            createdAt: '2024-07-15'
          },
          {
            id: '2',
            name: 'Press Outreach - EP Launch',
            type: 'Press',
            status: 'Active',
            emailsSent: 89,
            replies: 12,
            openRate: 28.7,
            createdAt: '2024-07-10'
          },
          {
            id: '3',
            name: 'Playlist Pitching - New Single',
            type: 'Playlisting',
            status: 'Active',
            emailsSent: 203,
            replies: 31,
            openRate: 41.3,
            createdAt: '2024-07-05'
          }
        ];

        const mockContacts: Contact[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@musicweekly.com',
            type: 'Journalist',
            status: 'Active',
            lastEngagement: '2024-07-18',
            responseRate: 85
          },
          {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@radioplay.com',
            type: 'Radio',
            status: 'Active',
            lastEngagement: '2024-07-17',
            responseRate: 92
          },
          {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@playlistcurator.com',
            type: 'Playlist',
            status: 'Active',
            lastEngagement: '2024-07-16',
            responseRate: 78
          }
        ];

        setStats(mockStats);
        setRecentCampaigns(mockCampaigns);
        setRecentContacts(mockContacts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const campaigns = [
    {
      name: 'Radio',
      color: 'bg-campaign-radio',
      border: 'border-campaign-radio',
      icon: '/assets/LOGOS/dog-logo.png',
      description: 'Get your music on the airwaves with our radio campaign tools and analytics.',
      href: '/campaigns?type=radio',
      count: stats.activeCampaigns
    },
    {
      name: 'Playlisting',
      color: 'bg-campaign-playlisting',
      border: 'border-campaign-playlisting',
      icon: '/assets/LOGOS/dog-logo.png',
      description: 'Pitch to top playlists and track your streaming growth.',
      href: '/campaigns?type=playlisting',
      count: stats.totalContacts
    },
    {
      name: 'Press',
      color: 'bg-campaign-press',
      border: 'border-campaign-press',
      icon: '/assets/LOGOS/dog-logo.png',
      description: 'Land features and reviews in music press and blogs.',
      href: '/campaigns?type=press',
      count: stats.emailsSent
    },
    {
      name: 'Influencer',
      color: 'bg-campaign-influencer',
      border: 'border-campaign-influencer',
      icon: '/assets/LOGOS/dog-logo.png',
      description: 'Connect with tastemakers and influencers to boost your reach.',
      href: '/campaigns?type=influencer',
      count: stats.recentReplies
    },
    {
      name: 'Analytics',
      color: 'bg-campaign-promo',
      border: 'border-campaign-promo',
      icon: '/assets/LOGOS/dog-logo.png',
      description: 'Track your campaign performance and engagement metrics.',
      href: '/analytics',
      count: `${stats.responseRate}%`
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen magazine-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magazine-bg flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-white/95 magazine-bg-alt border-b border-gray-200 mb-8">
        <Image src="/assets/LOGOS/dog-logo.png" alt="Total Audio Promo Logo" width={96} height={96} className="mb-6" />
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 text-center mb-4 tracking-tight leading-tight">Total Audio Promo</h1>
        <p className="text-xl md:text-2xl text-gray-700 text-center max-w-2xl mb-8">Smart systems, real people. Track your music promotion campaigns with real-time analytics.</p>
        <Link href="/campaigns" className="inline-block px-10 py-4 rounded-full bg-campaign-radio text-white font-bold text-xl shadow-lg hover:bg-campaign-radio/90 transition">Start a Campaign</Link>
      </section>

      {/* Stats Overview */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <div className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <div className="text-2xl font-bold text-gray-900">{stats.emailsSent}</div>
            <div className="text-sm text-gray-600">Emails Sent</div>
          </div>
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <div className="text-2xl font-bold text-gray-900">{stats.responseRate}%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <div className="text-2xl font-bold text-gray-900">{stats.recentReplies}</div>
            <div className="text-sm text-gray-600">Recent Replies</div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Campaigns</h3>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.type} • {campaign.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{campaign.replies} replies</div>
                      <div className="text-xs text-gray-600">{campaign.openRate}% open rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/campaigns" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block">
              View all campaigns →
            </Link>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white/95 rounded-xl p-6 shadow-lg magazine-bg-alt">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Contacts</h3>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.type} • {contact.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{contact.responseRate}% response</div>
                      <div className="text-xs text-gray-600">Last: {contact.lastEngagement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/contacts" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block">
              View all contacts →
            </Link>
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 pb-20">
        {campaigns.map((c) => (
          <Link key={c.name} href={c.href} className={`group relative flex flex-col items-start justify-between p-8 rounded-2xl shadow-2xl bg-white/95 ${c.border} border-l-8 hover:scale-105 transition-transform magazine-bg-alt min-h-[220px]`}>
            <div className="flex items-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${c.color} shadow-lg mr-4`}>
                <Image src={c.icon} alt={c.name + ' icon'} width={36} height={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:underline">{c.name}</h2>
                <div className="text-sm text-gray-600">{c.count}</div>
              </div>
            </div>
            <p className="text-gray-700 text-base mb-4 font-medium">{c.description}</p>
            <span className="text-campaign-radio font-semibold group-hover:underline">Explore &rarr;</span>
          </Link>
        ))}
      </section>
    </div>
  );
} 