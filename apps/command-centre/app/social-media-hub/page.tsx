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
        name: 'Audio Intel Problem-Solution',
        category: 'announcement',
        content: `Music PR is broken. Here's how I know:

Spent 3 years watching agencies waste £1000s on bad contact data. 90% of PR pitches go to dead emails.

Built Audio Intel to solve this. Now beta users get 97% delivery rates and 40% faster campaign setup.

The tool that should have existed years ago.`,
        platforms: ['twitter', 'linkedin'],
        performance: {
          avgEngagement: 8.2,
          totalReach: 15400,
          conversionRate: 12.5
        }
      },
      {
        id: 'template-2', 
        name: 'Beta Update Numbers',
        category: 'announcement',
        content: `Audio Intel beta update:

• 12,847 emails validated
• 3,672 contacts enriched  
• 97.4% delivery rate
• 4 paying beta customers

Building in public means sharing real numbers.

Pre-launch but already proving product-market fit.`,
        platforms: ['twitter'],
        performance: {
          avgEngagement: 6.8,
          totalReach: 8900,
          conversionRate: 8.3
        }
      },
      {
        id: 'template-3',
        name: 'Building in Public Philosophy', 
        category: 'personal',
        content: `Why I'm building Total Audio Promo in public:

1. Accountability - can't fake progress when everyone's watching
2. Feedback loops - customers tell me what they actually need
3. Authenticity - no marketing BS, just real founder updates
4. Community - other music tech founders share their experiences

Transparency isn't a marketing strategy. It's how you build trust.

What are you building? Let's connect.`,
        platforms: ['linkedin'],
        performance: {
          avgEngagement: 12.1,
          totalReach: 22300,
          conversionRate: 15.2
        }
      }
    ];
    
    setContentTemplates(templates);
  };

  const loadScheduledPosts = async () => {
    const posts: ScheduledPost[] = [
      {
        id: 'post-1',
        platforms: ['twitter', 'linkedin'],
        content: 'Beta users are processing 1000+ contacts/day with Audio Intel. The manual research that used to take hours now takes minutes.',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'scheduled'
      },
      {
        id: 'post-2',
        platforms: ['linkedin'],
        content: 'The music industry has a contact data problem. Audio Intel is the solution. Currently in beta with real paying customers.',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled'
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Social Media Hub...</h2>
          <p className="text-gray-600">Preparing your content creation tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-container">
      {/* Header */}
      <div className="postcraft-section text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Social Media Hub
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Multi-platform content creation and scheduling
        </p>
        <div className="postcraft-status">
          <div className="postcraft-status-dot"></div>
          <span>{PLATFORMS.filter(p => p.connected).length} platforms connected</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="postcraft-section">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {[
            { key: 'compose', label: 'Compose', icon: Edit },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'templates', label: 'Templates', icon: Sparkles },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? 'postcraft-button-gradient text-white'
                  : 'text-gray-600 hover:text-gray-900'
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Post</h2>
            
            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Platforms
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map(platform => (
                  <label
                    key={platform.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!platform.connected ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => platform.connected && handlePlatformToggle(platform.id)}
                      disabled={!platform.connected}
                      className="hidden"
                    />
                    <span className={`px-2 py-1 rounded text-sm font-medium ${platform.color}`}>
                      {platform.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{platform.name}</div>
                      <div className="text-xs text-gray-500">
                        {platform.connected ? `${platform.maxChars} chars` : 'Not connected'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your authentic insights about the music industry..."
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className={getCharacterCount() > getCharacterLimit() ? 'text-red-600' : 'text-gray-500'}>
                  {getCharacterCount()}/{getCharacterLimit()} characters
                </span>
                {getCharacterCount() > getCharacterLimit() && (
                  <span className="text-red-600 font-medium">
                    Content too long for selected platforms
                  </span>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Schedule (Optional)
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setScheduledTime('')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    !scheduledTime
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSchedulePost}
              disabled={!content.trim() || selectedPlatforms.length === 0 || getCharacterCount() > getCharacterLimit()}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Clock size={16} />
              {scheduledTime ? 'Schedule Post' : 'Post Now'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {content ? (
              <div className="space-y-4">
                {selectedPlatforms.map(platformId => {
                  const platform = PLATFORMS.find(p => p.id === platformId);
                  if (!platform) return null;
                  
                  return (
                    <div key={platformId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${platform.color}`}>
                          {platform.icon}
                        </span>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm whitespace-pre-line">
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
              <div className="text-center text-gray-500 py-8">
                Content preview will appear here
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Content Templates</h2>
            <span className="text-sm text-gray-600">
              {contentTemplates.length} authentic templates
            </span>
          </div>

          <div className="space-y-4">
            {contentTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.category === 'announcement' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'insight' ? 'bg-green-100 text-green-800' :
                      template.category === 'personal' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(template.content, template.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copy content"
                    >
                      {copiedId === template.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => {
                        setContent(template.content);
                        setSelectedPlatforms(template.platforms);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-sm whitespace-pre-line">
                  {template.content}
                </div>

                {template.performance && (
                  <div className="flex justify-between text-xs text-gray-600">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Scheduled Posts</h2>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No scheduled posts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {post.platforms.map(platformId => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return platform ? (
                            <span key={platformId} className={`px-2 py-1 rounded text-xs font-medium ${platform.color}`}>
                              {platform.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-sm text-gray-600">
                        {post.scheduledTime.toLocaleString()}
                      </p>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-sm whitespace-pre-line">
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
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">8.7%</div>
                  <div className="text-sm text-gray-600">Avg Engagement Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">34,200</div>
                  <div className="text-sm text-gray-600">Total Reach</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Audio Intel Signups</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">11.2%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Templates</h2>
            <div className="space-y-4">
              {contentTemplates
                .filter(t => t.performance)
                .sort((a, b) => (b.performance?.conversionRate || 0) - (a.performance?.conversionRate || 0))
                .slice(0, 3)
                .map(template => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {template.performance?.conversionRate}% conversion
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>{template.performance?.avgEngagement}% engagement</span>
                      <span>{template.performance?.totalReach.toLocaleString()} reach</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}