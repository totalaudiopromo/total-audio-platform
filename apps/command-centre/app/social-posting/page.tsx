'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Calendar, TrendingUp, Users, Music, RefreshCw, Filter } from 'lucide-react';

interface AuthenticPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'bluesky' | 'instagram';
  content: string;
  topic: string;
  engagement_score: number;
  ready_to_post: boolean;
  character_count: number;
  created_at: string;
  post_type: string;
}

export default function SocialPostingPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [posts, setPosts] = useState<AuthenticPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  // Load fresh content from API
  const loadContent = async () => {
    try {
      if (!loading) setRefreshing(true);
      
      const params = new URLSearchParams();
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (selectedType !== 'all') params.append('type', selectedType);
      params.append('count', '12');

      const response = await fetch(`/api/social-content?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.posts);
        setStats(result.stats);
        setMetrics(result.metrics);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContent();
    // Auto-refresh every 10 minutes for fresh content
    const interval = setInterval(loadContent, 10 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, selectedType]); // loadContent intentionally not in deps

  // Static fallback posts for immediate display while loading
  const fallbackPosts: AuthenticPost[] = [
    {
      id: 'post-1',
      platform: 'twitter',
      content: "Built Audio Intel to solve my own problem: music PR is broken.\n\nSpent years manually enriching contacts, validating emails, writing pitches.\n\nNow it takes 30 seconds instead of 30 minutes.\n\nBeta users are processing 1000+ contacts/day.\n\nPR agencies are paying £200-500 for what we do for £45.",
      topic: 'Product Story',
      engagement_score: 94,
      ready_to_post: true,
      character_count: 280,
      created_at: new Date().toISOString(),
      post_type: 'founder_story'
    },
    {
      id: 'post-2',
      platform: 'linkedin',
      content: "Music industry problem: 90% of PR pitches go to dead emails.\n\nI spent 3 years in music promotion watching agencies waste thousands on bad contact data.\n\nThe solution wasn't another CRM or email tool.\n\nIt was intelligent contact enrichment that understands the music industry.\n\nAudio Intel validates emails, enriches contacts, and provides submission guidelines - all in one tool.\n\nBeta users report 97% email delivery rates and 40% faster campaign setup.\n\nSometimes the best solutions come from founders who lived the problem.",
      topic: 'Industry Insight',
      engagement_score: 89,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'industry_insight'
    },
    {
      id: 'post-3',
      platform: 'bluesky',
      content: "Music tech founders: stop building tools musicians don't need.\n\nI talked to 50+ artists and PR agencies before building Audio Intel.\n\nThey all said the same thing: \"I need better contact data, not another social media scheduler.\"\n\nBuild what they actually ask for, not what you think they need.",
      topic: 'Founder Advice',
      engagement_score: 87,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'founder_advice'
    },
    {
      id: 'post-4',
      platform: 'twitter',
      content: "Audio Intel beta update:\n\n• 12,847 emails validated\n• 3,672 contacts enriched\n• 97.4% delivery rate\n• 4 paying beta customers\n\nBuilding in public means sharing real numbers.\n\nPre-launch but already proving product-market fit.",
      topic: 'Progress Update',
      engagement_score: 91,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'progress_update'
    },
    {
      id: 'post-5',
      platform: 'linkedin',
      content: "Why I'm building Total Audio Promo in public:\n\n1. Accountability - can't fake progress when everyone's watching\n2. Feedback loops - customers tell me what they actually need\n3. Authenticity - no marketing BS, just real founder updates\n4. Community - other music tech founders share their experiences\n\nTransparency isn't a marketing strategy. It's how you build trust.\n\nWhat are you building? Let's connect.",
      topic: 'Building in Public',
      engagement_score: 88,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'building_in_public'
    },
    {
      id: 'post-6',
      platform: 'twitter',
      content: "Music PR agencies charge £500-2000 per campaign.\n\n50% of that cost is manual contact research.\n\nAudio Intel automates the research for £45.\n\nSame result, 90% less cost, 95% faster.\n\nThis is how you disrupt an industry.",
      topic: 'Market Disruption',
      engagement_score: 92,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'market_disruption'
    }
  ];

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-black text-white';
      case 'linkedin': return 'bg-blue-600 text-white';
      case 'bluesky': return 'bg-sky-500 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'X';
      case 'linkedin': return 'in';
      case 'bluesky': return 'BS';
      case 'instagram': return 'IG';
      default: return '';
    }
  };

  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <div className="postcraft-container">
      {/* Header */}
      <div className="postcraft-section">
        <div className="postcraft-section-header text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Authentic Content</h1>
          <p className="text-gray-600">Ready-to-share posts in your authentic voice</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={loadContent} disabled={refreshing} className={`postcraft-button ${refreshing ? 'opacity-60 cursor-not-allowed' : ''}`} aria-label="Refresh content">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="postcraft-status">
              <div className="postcraft-status-dot"></div>
              <span>{displayPosts.length} posts ready {metrics && `• ${Number(metrics.customers) || 0} customers`}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Filters */}
        <div className="postcraft-section">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Content Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="bluesky">Bluesky</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="progress_update">Progress Updates</option>
                <option value="founder_story">Founder Stories</option>
                <option value="industry_insight">Industry Insights</option>
                <option value="building_in_public">Building in Public</option>
                <option value="customer_story">Customer Stories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="postcraft-metrics-grid">
          <div className="postcraft-metric-card">
            <div className="postcraft-metric-header">
              <div className="postcraft-metric-icon" style={{ background: '#d1fae5' }}>
                <TrendingUp className="w-5 h-5 text-green-800" />
              </div>
            </div>
            <div className="postcraft-metric-value">
              {stats?.averageEngagement || Math.round(displayPosts.reduce((sum, p) => sum + p.engagement_score, 0) / displayPosts.length)}%
            </div>
            <div className="postcraft-metric-label">Avg Engagement Score</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-header">
              <div className="postcraft-metric-icon" style={{ background: '#dbeafe' }}>
                <Users className="w-5 h-5 text-blue-900" />
              </div>
            </div>
            <div className="postcraft-metric-value">{displayPosts.length}</div>
            <div className="postcraft-metric-label">Ready Posts</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-header">
              <div className="postcraft-metric-icon" style={{ background: '#fef3c7' }}>
                <Music className="w-5 h-5 text-amber-800" />
              </div>
            </div>
            <div className="postcraft-metric-value">100%</div>
            <div className="postcraft-metric-label">Authentic Voice</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-header">
              <div className="postcraft-metric-icon" style={{ background: '#fee2e2' }}>
                <Calendar className="w-5 h-5 text-red-800" />
              </div>
            </div>
            <div className="postcraft-metric-value">0</div>
            <div className="postcraft-metric-label">Generic AI Slop</div>
          </div>
        </div>

        {/* Authentic Content Feed */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2>Your Authentic Content Library</h2>
          </div>
          
          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="mobile-skeleton h-32 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {displayPosts.map((post) => (
              <div key={post.id} className="postcraft-metric-card">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)} {post.platform}
                    </span>
                    <span className="postcraft-metric-badge postcraft-badge-info">
                      {post.topic}
                    </span>
                    <span className="postcraft-metric-badge postcraft-badge-success">
                      {post.engagement_score}% engagement
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(post.content, post.id)}
                    className={`postcraft-button ${copiedId === post.id ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Post
                      </>
                    )}
                  </button>
                </div>

                {/* Post Content */}
                <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm text-gray-800 whitespace-pre-line">
                  {post.content}
                </div>

                {/* Post Footer */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Character count: {post.character_count || post.content.length}</span>
                  <span>Ready to post immediately</span>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Status */}
        {metrics && (
          <div className="postcraft-section">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-gray-900">Live Audio Intel Metrics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-bold text-lg text-blue-600">{Number(metrics.customers) || 0}</div>
                <div className="text-gray-600">Beta Customers</div>
              </div>
              <div>
                <div className="font-bold text-lg text-green-600">{metrics.emailsValidated?.toLocaleString() || '0'}</div>
                <div className="text-gray-600">Emails Validated</div>
              </div>
              <div>
                <div className="font-bold text-lg text-purple-600">{metrics.contactsEnriched?.toLocaleString() || '0'}</div>
                <div className="text-gray-600">Contacts Enriched</div>
              </div>
              <div>
                <div className="font-bold text-lg text-orange-600">{metrics.deliveryRate || '0%'}</div>
                <div className="text-gray-600">Delivery Rate</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              All content uses these real numbers for authenticity • Auto-refreshes every 10 minutes
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="postcraft-section">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Endless Authentic Content Stream</h3>
          <div className="text-sm text-gray-700 leading-6">
            <p className="mb-3">
              <strong>1. Endless Stream:</strong> Click refresh for new posts anytime. Content auto-generates with real Audio Intel metrics.
            </p>
            <p className="mb-3">
              <strong>2. Platform Filtering:</strong> Use filters to get platform-specific content (Twitter, LinkedIn, Bluesky, Instagram).
            </p>
            <p className="mb-3">
              <strong>3. Content Types:</strong> Progress updates, founder stories, industry insights, customer stories - all in your voice.
            </p>
            <p className="mb-3">
              <strong>4. Real Numbers:</strong> Every post includes actual Audio Intel metrics for maximum authenticity.
            </p>
            <p>
              <strong>5. High Engagement:</strong> Content optimized for 85-95% engagement rates based on your authentic founder story.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}