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
  Share2
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
    connected: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'in',
    color: 'bg-blue-600 text-white',
    maxChars: 3000,
    connected: true
  },
  {
    id: 'bluesky',
    name: 'Blue Sky',
    icon: 'BS',
    color: 'bg-sky-500 text-white',
    maxChars: 300,
    connected: false
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: 'TH',
    color: 'bg-gray-900 text-white',
    maxChars: 500,
    connected: false
  }
];

export default function SocialMediaHubPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'calendar' | 'templates' | 'analytics'>('compose');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentTemplates, setContentTemplates] = useState<ContentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        content: `Spent 15 hours researching contacts for my last radio campaign.

BBC Radio 6 Music, local stations, specialist shows - all scattered across emails, LinkedIn, outdated websites.

Built Audio Intel because this is broken.

Upload your messy spreadsheet → get enriched contacts with emails, socials, and recent activity.

15 hours → 15 minutes.

Free trial: intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin']
      },
      {
        id: 'template-2',
        name: 'Real Problem, Real Solution',
        category: 'announcement',
        content: `Why most radio campaigns fail:

You're pitching dead emails.

That BBC Radio 1 contact left 6 months ago. The email you found is from 2019. The person who replied once never responds again.

Audio Intel fixes this:
• Real-time contact validation
• Social media profiles
• Recent activity tracking
• Role verification

Stop wasting pitches on ghosts.

Try it free: intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin', 'threads']
      },
      {
        id: 'template-3',
        name: 'Personal Origin Story',
        category: 'personal',
        content: `I've pitched BBC Radio 1 as sadact (my electronic music project).

I know what it's like spending weekends researching contacts instead of making music.

That's why I built Audio Intel.

Not another submission platform charging £50/pitch. A tool that gives you the contact intelligence to do your own radio promotion properly.

Currently 0 paying customers. Building in public. Would love your feedback if you've ever done radio promotion.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin']
      },
      {
        id: 'template-4',
        name: 'Case Study Thread',
        category: 'insight',
        content: `Tested Audio Intel with a real radio campaign:

Target: 50 UK radio contacts (BBC, community, specialist)

Before:
• 15+ hours researching
• 30% email bounce rate
• Outdated info from 2020-2021
• No social media links

After Audio Intel:
• 20 minutes enrichment
• 8% bounce rate
• Current roles verified
• Twitter/LinkedIn for every contact

This is the tool I wish existed 3 years ago.

Free trial: intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads']
      },
      {
        id: 'template-5',
        name: 'Weekend Reality Check',
        category: 'personal',
        content: `It's Saturday.

You should be in the studio.

Instead you're:
• Googling "BBC Radio 6 Music contacts 2025"
• Checking if that email still works
• LinkedIn-stalking presenters
• Building spreadsheets

What if this took 15 minutes instead of 15 hours?

That's Audio Intel. Built by a producer who got sick of this.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads']
      },
      {
        id: 'template-6',
        name: 'LinkedIn Professional Hook',
        category: 'announcement',
        content: `After 5 years doing radio promotion, I can tell you the real problem:

It's not that radio gatekeepers don't want new music. It's that 90% of pitches never reach the right person.

Why?
• Outdated contact databases
• Generic submission platforms
• No way to verify current roles
• Missing social context

Audio Intel solves this with real-time contact enrichment:
✓ Verify emails still work
✓ Check current roles
✓ Get social media profiles
✓ Track recent activity

If you've ever struggled with radio promotion, I'd love your feedback.

Currently in beta, free to try: intel.totalaudiopromo.com`,
        platforms: ['linkedin']
      },
      {
        id: 'template-7',
        name: 'Founder Vulnerability',
        category: 'personal',
        content: `Honest founder update:

Audio Intel: 0 paying customers
Time invested: 6+ months
Technical status: Production ready
Problem solved: Definitely (I use it myself)

Why no customers yet?

Because I was building features instead of talking to people.

Changed strategy: Focusing on radio promoters first. 85% interested after demos.

If you do radio promotion and this sounds useful, let's talk. I'll give you lifetime free access for feedback.

DM me or: intel.totalaudiopromo.com`,
        platforms: ['twitter']
      },
      {
        id: 'template-8',
        name: 'BBC Radio Case Study',
        category: 'insight',
        content: `Real test with BBC Radio contacts:

Took a spreadsheet with 25 "BBC Radio" contacts from 2020-2023.

Audio Intel found:
• 8 people moved roles
• 4 email addresses changed
• 3 no longer at BBC
• 2 shows cancelled
• 1 department restructured

Only 7 contacts (28%) were actually current and correct.

This is why your pitches go nowhere.

Want to test your contact list? intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin']
      },
      {
        id: 'template-9',
        name: 'Industry Pain Point',
        category: 'insight',
        content: `The music industry's dirty secret:

Every radio promoter has a spreadsheet of "contacts" they don't trust.

You pitch anyway. Because what else can you do?

But 60-70% of those emails either:
• Bounce
• Go to someone who left
• Hit an unmonitored inbox
• Reach the wrong department

Audio Intel verifies this in real-time before you hit send.

Stop wasting pitches.
intel.totalaudiopromo.com`,
        platforms: ['twitter', 'linkedin', 'threads']
      },
      {
        id: 'template-10',
        name: 'Short Hook for X',
        category: 'announcement',
        content: `Your radio contact spreadsheet is probably 60% wrong.

People move roles. Emails change. Shows get cancelled.

Audio Intel fixes this in 15 minutes.

intel.totalaudiopromo.com`,
        platforms: ['twitter', 'threads']
      }
    ];

    setContentTemplates(templates);
  };

  const loadScheduledPosts = async () => {
    const posts: ScheduledPost[] = [
      {
        id: 'post-1',
        platforms: ['twitter'],
        content: 'Spent 15 hours researching contacts for my last radio campaign.\n\nBBC Radio 6 Music, local stations, specialist shows - all scattered across emails, LinkedIn, outdated websites.\n\nBuilt Audio Intel because this is broken.\n\nFree trial: intel.totalaudiopromo.com',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'draft'
      },
      {
        id: 'post-2',
        platforms: ['linkedin'],
        content: 'After 5 years doing radio promotion, I can tell you the real problem:\n\nIt\'s not that radio gatekeepers don\'t want new music. It\'s that 90% of pitches never reach the right person.\n\nCurrently in beta, free to try: intel.totalaudiopromo.com',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'draft'
      }
    ];

    setScheduledPosts(posts);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getCharacterCount = () => {
    return content.length;
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 280;
    const limits = selectedPlatforms.map(pid => 
      PLATFORMS.find(p => p.id === pid)?.maxChars || 280
    );
    return Math.min(...limits);
  };

  const handleSchedulePost = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      platforms: selectedPlatforms,
      content: content.trim(),
      scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
      status: scheduledTime ? 'scheduled' : 'draft'
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
          <span className="font-bold text-gray-900">{PLATFORMS.filter(p => p.connected).length} platforms connected</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="postcraft-section mb-8">
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'compose', label: 'Compose', icon: Edit },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'templates', label: 'Templates', icon: Sparkles },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`postcraft-button flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-black text-white'
                  : ''
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
              <label className="postcraft-label mb-3">
                Select Platforms
              </label>
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
                    <span className={`px-2 py-1 rounded text-sm font-bold border-2 border-black ${platform.color}`}>
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
              <label className="postcraft-label mb-3">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your authentic insights about the music industry..."
                rows={8}
                className="w-full p-4 border-3 border-black rounded-xl text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <div className="flex justify-between items-center mt-2 text-xs font-bold">
                <span className={getCharacterCount() > getCharacterLimit() ? 'text-red-600' : 'text-gray-600'}>
                  {getCharacterCount()}/{getCharacterLimit()} characters
                </span>
                {getCharacterCount() > getCharacterLimit() && (
                  <span className="text-red-600">
                    Content too long for selected platforms
                  </span>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="mb-6">
              <label className="postcraft-label mb-3">
                Schedule (Optional)
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setScheduledTime('')}
                  className={`flex-1 postcraft-button flex items-center justify-center gap-2 ${
                    !scheduledTime
                      ? 'bg-black text-white'
                      : ''
                  }`}
                >
                  <Send size={16} />
                  Post Now
                </button>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="flex-1 px-4 py-3 border-3 border-black rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSchedulePost}
              disabled={!content.trim() || selectedPlatforms.length === 0 || getCharacterCount() > getCharacterLimit()}
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
                    <div key={platformId} className="border-3 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${platform.color}`}>
                          {platform.icon}
                        </span>
                        <span className="text-sm font-bold">{platform.name}</span>
                      </div>
                      <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-sm whitespace-pre-line">
                        {content.length > platform.maxChars ?
                          content.substring(0, platform.maxChars) + '...' :
                          content
                        }
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
        <div className="postcraft-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="postcraft-section-title">Content Templates</h2>
            <span className="postcraft-text">
              {contentTemplates.length} authentic templates
            </span>
          </div>

          <div className="space-y-4">
            {contentTemplates.map(template => (
              <div key={template.id} className="border-3 border-black rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="postcraft-label mb-2">
                      {template.name}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                      template.category === 'announcement' ? 'bg-blue-500 text-white' :
                      template.category === 'insight' ? 'bg-green-500 text-white' :
                      template.category === 'personal' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {template.category}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(template.content, template.id)}
                      className="p-2 border-3 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      title="Copy content"
                    >
                      {copiedId === template.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => {
                        setContent(template.content);
                        setSelectedPlatforms(template.platforms);
                      }}
                      className="postcraft-button"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

                <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mb-4 text-sm whitespace-pre-line font-medium">
                  {template.content}
                </div>

                {template.performance && (
                  <div className="flex justify-between text-xs font-bold text-gray-900">
                    <span>{template.performance.avgEngagement}% avg engagement</span>
                    <span>{template.performance.totalReach.toLocaleString()} total reach</span>
                    <span>{template.performance.conversionRate}% conversion</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="postcraft-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="postcraft-section-title">Scheduled Posts</h2>
            <button
              onClick={fetchData}
              className="postcraft-button flex items-center gap-2"
            >
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
                <div key={post.id} className="border-3 border-black rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {post.platforms.map(platformId => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return platform ? (
                            <span key={platformId} className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${platform.color}`}>
                              {platform.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {post.scheduledTime.toLocaleString()}
                      </p>
                    </div>

                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                      post.status === 'scheduled' ? 'bg-blue-500 text-white' :
                      post.status === 'published' ? 'bg-green-500 text-white' :
                      post.status === 'failed' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
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
                        <div className="font-semibold text-green-600">{post.performance.signups}</div>
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
              Focus: Radio promoters, solo artists, and PR agencies. All content emphasises real pain points and authentic experience.
            </p>
            <div className="space-y-4">
              {contentTemplates.slice(0, 5).map(template => (
                <div key={template.id} className="p-4 border-3 border-black rounded-xl bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="postcraft-label">{template.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 border-black ${
                      template.category === 'insight' ? 'bg-green-500 text-white' :
                      template.category === 'personal' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Platforms: {template.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.name).join(', ')}
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
                  <span className="px-4 py-2 bg-green-500 text-white font-black rounded-lg border-2 border-black">85%</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">Highest priority - proven interest after demos</p>
              </div>
              <div className="p-4 border-3 border-black rounded-xl bg-blue-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">PR Agencies</span>
                  <span className="px-4 py-2 bg-blue-500 text-white font-black rounded-lg border-2 border-black">70%</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">Multi-client processing, agency tier pricing</p>
              </div>
              <div className="p-4 border-3 border-black rounded-xl bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Solo Artists with Budget</span>
                  <span className="px-4 py-2 bg-orange-500 text-white font-black rounded-lg border-2 border-black">60%</span>
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