'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Send,
  Clock,
  Target,
  BarChart3,
  Copy,
  Check,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  maxChars: number;
  connected: boolean;
}

interface ContentTemplate {
  id: string;
  name: string;
  category: 'announcement' | 'feature' | 'insight' | 'news' | 'personal';
  content: string;
  platforms: string[];
  performance?: {
    avgEngagement: number;
    totalReach: number;
    conversionRate: number;
  };
}

interface ScheduledPost {
  id: string;
  platforms: string[];
  content: string;
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  performance?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    signups: number;
  };
}

const PLATFORMS: Platform[] = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'X',
    color: 'bg-black text-white',
    maxChars: 280,
    connected: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'in',
    color: 'bg-blue-600 text-white',
    maxChars: 3000,
    connected: true,
  },
  {
    id: 'bluesky',
    name: 'Blue Sky',
    icon: 'BS',
    color: 'bg-sky-500 text-white',
    maxChars: 300,
    connected: false,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: 'TH',
    color: 'bg-gray-900 text-white',
    maxChars: 500,
    connected: false,
  },
];

export default function SocialMediaHubPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'calendar' | 'templates' | 'analytics'>(
    'compose'
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateSeed, setTemplateSeed] = useState(0);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchData intentionally not in deps

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await loadContentTemplates();
      await loadScheduledPosts();
    } catch (error) {
      console.error('Failed to load social media data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContentTemplates = async () => {
    const templates: ContentTemplate[] = [
      {
        id: 'template-1',
        name: 'Radio Promoter Pain Point',
        category: 'insight',
        content: `15 hours researching radio contacts last campaign.

BBC 6, local stations - all scattered.

Audio Intel: 15 minutes.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-2',
        name: 'Dead Emails Problem',
        category: 'announcement',
        content: `Your radio pitches fail because you're hitting dead emails.

BBC contact left 6 months ago. Email from 2019.

Audio Intel validates in real-time.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin', 'threads'],
      },
      {
        id: 'template-3',
        name: 'Personal Origin',
        category: 'personal',
        content: `I've pitched BBC Radio 1 as sadact.

Spent weekends researching instead of making music.

Built Audio Intel to fix this.

0 customers. Building in public.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-4',
        name: 'BBC Case Study',
        category: 'insight',
        content: `Tested 25 BBC Radio contacts from 2020-2023:

• 8 moved roles
• 4 emails changed
• 3 left BBC
• 2 shows cancelled

Only 28% still valid.

This is why pitches fail.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-5',
        name: 'Weekend Reality',
        category: 'personal',
        content: `It's Saturday. You should be in the studio.

Instead: Googling "BBC 6 Music contacts 2025"

Audio Intel: 15 minutes instead of 15 hours.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-6',
        name: 'Founder Honesty',
        category: 'personal',
        content: `Audio Intel: 0 customers, 6 months building, production ready.

Why no customers? Built features instead of talking to people.

Now: 85% interest from radio promoters after demos.

intel.totalaudiopromo.com`,
        platforms: ['twitter'],
      },
      {
        id: 'template-7',
        name: 'Industry Secret',
        category: 'insight',
        content: `Every radio promoter has a spreadsheet of contacts they don't trust.

60-70% bounce, wrong person, or unmonitored inbox.

Audio Intel verifies before you send.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin', 'threads'],
      },
      {
        id: 'template-8',
        name: 'Short Hook',
        category: 'announcement',
        content: `Your radio contact spreadsheet is 60% wrong.

People move. Emails change. Shows cancel.

Audio Intel fixes this in 15 minutes.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-9',
        name: 'Producer Economics',
        category: 'insight',
        content: `Studio time: £50-100/hour

15 hours researching radio contacts = £750-1500 wasted

Audio Intel: £19/month, 15 minutes

The maths is simple.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-10',
        name: 'Failed Pitch Reasons',
        category: 'insight',
        content: `Why your pitch failed:

❌ Wrong email (left 8 months ago)
❌ Wrong show (format changed)
❌ Wrong timing (on sabbatical)

Audio Intel catches this before you send.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-11',
        name: 'Technical Founder',
        category: 'personal',
        content: `I'm not a marketer who built a music tool.

I'm a producer (sadact) who built the tool I needed.

6 months. 100% enrichment rate. 0 customers 😅

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-12',
        name: 'Platform Comparison',
        category: 'insight',
        content: `Submission platforms: £50/pitch, they choose contacts
Audio Intel: £19/month, you control everything

Built for people who want to own their promo strategy.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-13',
        name: 'Sunday Night Reality',
        category: 'personal',
        content: `Sunday 11pm.

6 hours building a contact spreadsheet.

Half will bounce. The rest might be outdated.

Tomorrow: work.

This is why I built Audio Intel.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-14',
        name: 'Data Accuracy Stats',
        category: 'insight',
        content: `UK radio contact data accuracy:

Promoter lists: 52%
Paid databases: 61%
Online directories: 38%
LinkedIn manual: 71% (20+ hours)

Audio Intel: 92% in 15 minutes

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-15',
        name: 'Building in Public',
        category: 'personal',
        content: `What I learned building Audio Intel:

1. Perfect product ≠ customers
2. 85% conversion after demos
3. Vulnerability > fake success
4. Building in public works

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-16',
        name: 'BBC Restructure',
        category: 'news',
        content: `BBC Radio restructured music teams in 2024.

Contact list from 2023? 50%+ wrong.

Presenters moved. Shows changed. Emails updated.

Don't pitch ghosts.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-17',
        name: 'Community Radio',
        category: 'insight',
        content: `Community radio: best for breaking new music, worst for contact data.

Websites from 2018. Generic emails. No info.

Audio Intel specializes in this.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-18',
        name: 'Bounce Rate Reality',
        category: 'insight',
        content: `Radio campaign bounce rates:

30% = normal (terrible)
50% = very outdated
70% = wasting time

Audio Intel: 5-8% bounce rate

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-19',
        name: 'Spotify Feature',
        category: 'feature',
        content: `Just added Spotify playlist curator validation to Audio Intel.

Same problem as radio: outdated contacts, dead emails.

Verify before you pitch.

Coming soon.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-20',
        name: 'ROI Calculator',
        category: 'announcement',
        content: `Audio Intel ROI:

1 campaign/month:
15 hours × £20 = £300
Audio Intel: £19

Savings: £281/month

Tool pays for itself 15x over.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-21',
        name: 'Competitor Honesty',
        category: 'personal',
        content: `Honest comparison:

SubmitHub: Better for playlists
RepostExchange: Better for SoundCloud
MusoSoup: Better for budgets

Audio Intel: For people who want control

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-22',
        name: 'DIY Empowerment',
        category: 'personal',
        content: `You don't need a PR agency for radio play.

You need:
✓ Good music
✓ Verified contacts
✓ Personalised pitches
✓ Persistence

Audio Intel handles contacts.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-23',
        name: 'Local Radio Gold',
        category: 'insight',
        content: `Local radio: massively underrated.

Better response rates. More supportive. Real community.

Problem: contact info is nightmare fuel.

Audio Intel specializes in this.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-24',
        name: 'Month 7 Update',
        category: 'personal',
        content: `Month 7 of building Audio Intel:

✅ Production ready
✅ 100% enrichment success
✅ Mobile-first
✅ 0 customers

Now: 10 demos booked, focusing on conversion

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-25',
        name: 'Genre Filtering',
        category: 'feature',
        content: `Audio Intel now has genre-specific filtering:

📻 Electronic/Dance
📻 Rock/Metal
📻 Hip Hop/Grime
📻 Folk/Acoustic

Stop pitching irrelevant shows.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-26',
        name: 'Founder Mistakes',
        category: 'personal',
        content: `Mistakes building Audio Intel:

❌ Built features nobody asked for
❌ Perfect UI before customers
❌ "Build it they will come"

Now:

✅ Demo first
✅ 10 conversations/week

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-27',
        name: 'Turnover Stats',
        category: 'insight',
        content: `Radio presenter turnover:

BBC: ~25%/year
Commercial: ~35%/year
Community: ~40%/year

Your 2023 list? 35%+ wrong

Audio Intel checks real-time.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-28',
        name: 'Budget Reality',
        category: 'insight',
        content: `PR agencies cost £1000-3000/campaign.

£19/month for verified contacts is affordable.

Audio Intel: DIY promotion done properly.

No fluff. Just verified contacts.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-29',
        name: 'Social Proof Ask',
        category: 'personal',
        content: `If you've struggled with radio promotion, I'd love 10 minutes of your time.

Customer research. No sales pitch.

Lifetime free access for feedback.

DM me

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-30',
        name: 'Email Deliverability',
        category: 'insight',
        content: `Deliverability > pitch quality

Perfect pitch + dead email = 0% success
Average pitch + verified email = possible success

Audio Intel focuses on foundation.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-31',
        name: 'UK Market Focus',
        category: 'announcement',
        content: `Audio Intel is UK-focused because:

→ BBC Radio matters uniquely here
→ UK community radio is different
→ I'm UK based, know the landscape

Not for everyone. For UK artists.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-32',
        name: 'Producer Real Talk',
        category: 'personal',
        content: `Your music is ready.
Your mix is solid.
Your master is professional.

But your pitch goes to an email from 2021 that bounces.

Audio Intel fills this gap.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-33',
        name: 'Conversion Transparency',
        category: 'personal',
        content: `Real conversion rates:

Radio promoters: 85% interested
Solo artists: 60% potential
Agencies: 70% interested

Sample: 20 conversations
Revenue: £0

Building in public.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-34',
        name: 'Threads Community',
        category: 'personal',
        content: `Who does their own radio promotion?

Building Audio Intel to solve the contact research nightmare.

0 customers, production ready, getting demos

Let's connect 👋

intel.totalaudiopromo.com`,
        platforms: ['threads', 'bluesky'],
      },
      {
        id: 'template-35',
        name: 'Pitch Failure Stats',
        category: 'insight',
        content: `90% of radio pitches never reach the right person.

Not because gatekeepers don't care.

Because your contact data is wrong.

Audio Intel fixes this.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-36',
        name: 'Time Value',
        category: 'insight',
        content: `Your time matters.

15 hours researching contacts = £750-1500 as a producer.

Audio Intel: £19/month, 15 minutes.

This should be a no-brainer.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-37',
        name: 'Agency ROI',
        category: 'announcement',
        content: `Music PR agencies:

Junior staff: 15 hours/campaign = £250-400 labour
Audio Intel: £79/month unlimited campaigns

ROI positive after 1 campaign.

intel.totalaudiopromo.com`,
        platforms: ['linkedin'],
      },
      {
        id: 'template-38',
        name: 'Validation Over Pitch',
        category: 'insight',
        content: `Step 1: Verify your contacts
Step 2: Write great pitches

Most people skip step 1.

That's why 60%+ bounce or go nowhere.

Audio Intel does step 1.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
      {
        id: 'template-39',
        name: 'Contact List Audit',
        category: 'feature',
        content: `Free offer:

Send me your radio contact list (5-10 contacts).

I'll run it through Audio Intel and show you what's wrong.

DM me or visit:

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads'],
      },
      {
        id: 'template-40',
        name: 'Zero to Hero Story',
        category: 'personal',
        content: `From idea to 0 customers in 7 months 😅

But:
✓ 100% enrichment success
✓ 85% demo conversion
✓ Production ready

Next: First paying customer

Building in public.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin'],
      },
    ];

    setContentTemplates(templates);
  };

  const loadScheduledPosts = async () => {
    const posts: ScheduledPost[] = [
      {
        id: 'post-1',
        platforms: ['twitter'],
        content:
          'Spent 15 hours researching contacts for my last radio campaign.\n\nBBC Radio 6 Music, local stations, specialist shows - all scattered across emails, LinkedIn, outdated websites.\n\nBuilt Audio Intel because this is broken.\n\nFree trial: intel.totalaudiopromo.com',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'draft',
      },
      {
        id: 'post-2',
        platforms: ['linkedin'],
        content:
          "After 5 years doing radio promotion, I can tell you the real problem:\n\nIt's not that radio gatekeepers don't want new music. It's that 90% of pitches never reach the right person.\n\nCurrently in beta, free to try: intel.totalaudiopromo.com",
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'draft',
      },
    ];

    setScheduledPosts(posts);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId]
    );
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 280;
    const limits = selectedPlatforms.map(pid => PLATFORMS.find(p => p.id === pid)?.maxChars || 280);
    return Math.min(...limits);
  };

  const handleSchedulePost = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      platforms: selectedPlatforms,
      content: content.trim(),
      scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
      status: scheduledTime ? 'scheduled' : 'draft',
    };

    setScheduledPosts(prev => [...prev, newPost]);
    setContent('');
    setScheduledTime('');
  };

  const useTemplate = (template: ContentTemplate) => {
    setContent(template.content);
    setSelectedPlatforms(template.platforms);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="postcraft-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <h2 className="postcraft-section-title">Loading Social Media Hub...</h2>
          <p className="postcraft-text">Preparing your content creation tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-page">
      {/* Header */}
      <div className="postcraft-header mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="postcraft-title mb-1">Social Media Hub</h1>
            <p className="postcraft-subtitle">Multi-platform content creation and scheduling</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 rounded-xl border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-fit">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span className="font-bold text-gray-900">
            {PLATFORMS.filter(p => p.connected).length} platforms connected
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="postcraft-section mb-8">
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'compose', label: 'Compose', icon: Edit },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'templates', label: 'Templates', icon: Sparkles },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`postcraft-button flex items-center gap-2 ${
                activeTab === tab.key ? 'bg-black text-white' : ''
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Composer */}
          <div className="postcraft-card">
            <h2 className="postcraft-section-title mb-6">Create Post</h2>

            {/* Platform Selection */}
            <div className="mb-6">
              <label className="postcraft-label mb-3">Select Platforms</label>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map(platform => (
                  <label
                    key={platform.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-3 cursor-pointer transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-black bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    } ${!platform.connected ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => platform.connected && handlePlatformToggle(platform.id)}
                      disabled={!platform.connected}
                      className="hidden"
                    />
                    <span
                      className={`px-2 py-1 rounded text-sm font-bold border-2 border-black ${platform.color}`}
                    >
                      {platform.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{platform.name}</div>
                      <div className="text-xs text-gray-600 font-medium">
                        {platform.connected ? `${platform.maxChars} chars` : 'Not connected'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <label className="postcraft-label mb-3">Post Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share your authentic insights about the music industry..."
                rows={8}
                className="w-full p-4 border-3 border-black rounded-xl text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <div className="flex justify-between items-center mt-2 text-xs font-bold">
                <span
                  className={
                    getCharacterCount() > getCharacterLimit() ? 'text-red-600' : 'text-gray-600'
                  }
                >
                  {getCharacterCount()}/{getCharacterLimit()} characters
                </span>
                {getCharacterCount() > getCharacterLimit() && (
                  <span className="text-red-600">Content too long for selected platforms</span>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="mb-6">
              <label className="postcraft-label mb-3">Schedule (Optional)</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setScheduledTime('')}
                  className={`flex-1 postcraft-button flex items-center justify-center gap-2 ${
                    !scheduledTime ? 'bg-black text-white' : ''
                  }`}
                >
                  <Send size={16} />
                  Post Now
                </button>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="flex-1 px-4 py-3 border-3 border-black rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSchedulePost}
              disabled={
                !content.trim() ||
                selectedPlatforms.length === 0 ||
                getCharacterCount() > getCharacterLimit()
              }
              className="w-full postcraft-button bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock size={16} />
              {scheduledTime ? 'Schedule Post' : 'Post Now'}
            </button>
          </div>

          {/* Preview */}
          <div className="postcraft-card">
            <h3 className="postcraft-label mb-4">Preview</h3>
            {content ? (
              <div className="space-y-4">
                {selectedPlatforms.map(platformId => {
                  const platform = PLATFORMS.find(p => p.id === platformId);
                  if (!platform) return null;

                  return (
                    <div
                      key={platformId}
                      className="border-3 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${platform.color}`}
                        >
                          {platform.icon}
                        </span>
                        <span className="text-sm font-bold">{platform.name}</span>
                      </div>
                      <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-sm whitespace-pre-line">
                        {content.length > platform.maxChars
                          ? content.substring(0, platform.maxChars) + '...'
                          : content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center postcraft-text py-8">
                Content preview will appear here
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Refresh Button */}
          <div className="postcraft-card">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="postcraft-section-title mb-2">Content Templates</h2>
                <p className="postcraft-text">
                  {contentTemplates.length} authentic templates • 4 random per platform shown
                </p>
              </div>
              <button
                onClick={() => setTemplateSeed(prev => prev + 1)}
                className="postcraft-button bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh Templates
              </button>
            </div>
          </div>

          {/* Templates by Platform */}
          {PLATFORMS.filter(p => p.connected).map(platform => {
            // Get templates for this platform
            const platformTemplates = contentTemplates.filter(t =>
              t.platforms.includes(platform.id)
            );

            // Seeded shuffle function
            const seededShuffle = (array: ContentTemplate[], seed: number) => {
              const shuffled = [...array];
              let currentSeed = seed;

              // Simple seeded random number generator
              const random = () => {
                currentSeed = (currentSeed * 9301 + 49297) % 233280;
                return currentSeed / 233280;
              };

              // Fisher-Yates shuffle with seeded random
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }

              return shuffled;
            };

            // Shuffle based on seed and take first 4
            const shuffled = seededShuffle(
              platformTemplates,
              templateSeed + platform.id.charCodeAt(0)
            ).slice(0, 4);

            return (
              <div key={platform.id} className="postcraft-card">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`px-3 py-2 rounded-lg text-sm font-bold border-3 border-black ${platform.color}`}
                  >
                    {platform.icon}
                  </span>
                  <div>
                    <h3 className="postcraft-label">{platform.name}</h3>
                    <p className="text-sm font-medium text-gray-600">
                      {platformTemplates.length} total templates • Showing 4 random
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {shuffled.map(template => (
                    <div
                      key={template.id}
                      className="border-3 border-black rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="postcraft-label mb-2">{template.name}</h4>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                              template.category === 'announcement'
                                ? 'bg-blue-500 text-white'
                                : template.category === 'insight'
                                ? 'bg-green-500 text-white'
                                : template.category === 'personal'
                                ? 'bg-orange-500 text-white'
                                : template.category === 'news'
                                ? 'bg-purple-500 text-white'
                                : template.category === 'feature'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {template.category}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(template.content, template.id)}
                            className="p-2 border-3 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                            title="Copy content"
                          >
                            {copiedId === template.id ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setContent(template.content);
                              setSelectedPlatforms(template.platforms);
                              setActiveTab('compose');
                            }}
                            className="postcraft-button"
                          >
                            Use Template
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border-2 border-black rounded-lg p-4 text-sm whitespace-pre-line font-medium">
                        {template.content}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-600">
                        <span>Also for:</span>
                        {template.platforms
                          .filter(pid => pid !== platform.id)
                          .map(pid => {
                            const p = PLATFORMS.find(pl => pl.id === pid);
                            return p ? (
                              <span
                                key={pid}
                                className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${p.color}`}
                              >
                                {p.icon}
                              </span>
                            ) : null;
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="postcraft-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="postcraft-section-title">Scheduled Posts</h2>
            <button onClick={fetchData} className="postcraft-button flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="text-center postcraft-text py-12">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No scheduled posts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map(post => (
                <div
                  key={post.id}
                  className="border-3 border-black rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {post.platforms.map(platformId => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return platform ? (
                            <span
                              key={platformId}
                              className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${platform.color}`}
                            >
                              {platform.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {post.scheduledTime.toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                        post.status === 'scheduled'
                          ? 'bg-blue-500 text-white'
                          : post.status === 'published'
                          ? 'bg-green-500 text-white'
                          : post.status === 'failed'
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mb-4 text-sm whitespace-pre-line font-medium">
                    {post.content}
                  </div>

                  {post.performance && (
                    <div className="grid grid-cols-5 gap-4 text-center text-xs">
                      <div>
                        <div className="font-semibold">{post.performance.views}</div>
                        <div className="text-gray-600">Views</div>
                      </div>
                      <div>
                        <div className="font-semibold">{post.performance.likes}</div>
                        <div className="text-gray-600">Likes</div>
                      </div>
                      <div>
                        <div className="font-semibold">{post.performance.shares}</div>
                        <div className="text-gray-600">Shares</div>
                      </div>
                      <div>
                        <div className="font-semibold">{post.performance.comments}</div>
                        <div className="text-gray-600">Comments</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">
                          {post.performance.signups}
                        </div>
                        <div className="text-gray-600">Signups</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Current Status Banner */}
          <div className="postcraft-card bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="postcraft-section-title mb-2">Customer Acquisition Phase</h2>
                <p className="postcraft-text mb-4">
                  Currently: 0 paying customers | Goal: First £500/month by November 2025
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                  <div>
                    <span className="text-gray-600">Target Segment:</span>
                    <span className="ml-2">Radio Promoters (85% interest)</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product Status:</span>
                    <span className="ml-2 text-green-600">Production Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acquisition Goals */}
          <div className="postcraft-metrics-grid">
            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">2+</div>
              <div className="postcraft-metric-label">Demo Calls Target (Weekly)</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-green-500 to-emerald-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">5+</div>
              <div className="postcraft-metric-label">Beta Signups Target (Weekly)</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-yellow-500 to-orange-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">25+</div>
              <div className="postcraft-metric-label">Newsletter Subscribers (Monthly)</div>
            </div>

            <div className="postcraft-metric-card">
              <div className="postcraft-metric-icon bg-gradient-to-br from-red-500 to-pink-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="postcraft-metric-value">£500</div>
              <div className="postcraft-metric-label">MRR Target (November)</div>
            </div>
          </div>

          {/* Content Strategy */}
          <div className="postcraft-card">
            <h2 className="postcraft-section-title mb-6">Customer Acquisition Templates</h2>
            <p className="postcraft-text mb-6">
              Focus: Radio promoters, solo artists, and PR agencies. All content emphasises real
              pain points and authentic experience.
            </p>
            <div className="space-y-4">
              {contentTemplates.slice(0, 5).map(template => (
                <div
                  key={template.id}
                  className="p-4 border-3 border-black rounded-xl bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="postcraft-label">{template.name}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                        template.category === 'insight'
                          ? 'bg-green-500 text-white'
                          : template.category === 'personal'
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {template.category}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Platforms:{' '}
                    {template.platforms
                      .map(p => PLATFORMS.find(pl => pl.id === p)?.name)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Targets */}
          <div className="postcraft-card">
            <h2 className="postcraft-section-title mb-6">Target Conversion Rates</h2>
            <div className="space-y-4">
              <div className="p-4 border-3 border-black rounded-xl bg-green-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Radio Promoters</span>
                  <span className="px-4 py-2 bg-green-500 text-white font-black rounded-lg border-2 border-black">
                    85%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Highest priority - proven interest after demos
                </p>
              </div>
              <div className="p-4 border-3 border-black rounded-xl bg-blue-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">PR Agencies</span>
                  <span className="px-4 py-2 bg-blue-500 text-white font-black rounded-lg border-2 border-black">
                    70%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Multi-client processing, agency tier pricing
                </p>
              </div>
              <div className="p-4 border-3 border-black rounded-xl bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Solo Artists with Budget</span>
                  <span className="px-4 py-2 bg-orange-500 text-white font-black rounded-lg border-2 border-black">
                    60%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">Free trial → PRO tier conversion focus</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
