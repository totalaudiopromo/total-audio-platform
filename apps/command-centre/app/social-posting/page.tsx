'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  Users,
  Music,
  RefreshCw,
  Filter,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface AuthenticPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'bluesky' | 'instagram' | 'threads';
  content: string;
  topic: string;
  engagement_score: number;
  ready_to_post: boolean;
  character_count: number;
  created_at: string;
  post_type: string;
}

interface PlatformConfig {
  configured: boolean;
  name: string;
  charLimit: number;
  note?: string;
}

interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
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

  // Direct posting state
  const [platformConfig, setPlatformConfig] = useState<Record<string, PlatformConfig>>({});
  const [posting, setPosting] = useState<Record<string, boolean>>({});
  const [postResults, setPostResults] = useState<Record<string, PostResult[]>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, string[]>>({});

  // Load platform configuration
  const loadPlatformConfig = async () => {
    try {
      const response = await fetch('/api/social/post');
      const result = await response.json();
      if (result.success) {
        setPlatformConfig(result.platforms);
      }
    } catch (error) {
      console.error('Failed to load platform config:', error);
    }
  };

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
    loadPlatformConfig();
    const interval = setInterval(loadContent, 10 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, selectedType]);

  // Direct post to platforms
  const handleDirectPost = async (postId: string, content: string) => {
    const platforms = selectedPlatforms[postId] || [];
    if (platforms.length === 0) {
      alert('Please select at least one platform to post to');
      return;
    }

    setPosting(prev => ({ ...prev, [postId]: true }));
    setPostResults(prev => ({ ...prev, [postId]: [] }));

    try {
      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms }),
      });

      const result = await response.json();
      setPostResults(prev => ({ ...prev, [postId]: result.results || [] }));
    } catch (error) {
      console.error('Direct post error:', error);
      setPostResults(prev => ({
        ...prev,
        [postId]: platforms.map(p => ({ platform: p, success: false, error: 'Request failed' })),
      }));
    } finally {
      setPosting(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Toggle platform selection for a post
  const togglePlatformSelection = (postId: string, platform: string) => {
    setSelectedPlatforms(prev => {
      const current = prev[postId] || [];
      if (current.includes(platform)) {
        return { ...prev, [postId]: current.filter(p => p !== platform) };
      } else {
        return { ...prev, [postId]: [...current, platform] };
      }
    });
  };

  // Static fallback posts
  const fallbackPosts: AuthenticPost[] = [
    {
      id: 'post-1',
      platform: 'twitter',
      content:
        'Built Audio Intel to solve my own problem: music PR is broken.\n\nSpent years manually enriching contacts, validating emails, writing pitches.\n\nNow it takes 30 seconds instead of 30 minutes.\n\nBeta users are processing 1000+ contacts/day.\n\nPR agencies are paying £200-500 for what we do for £45.',
      topic: 'Product Story',
      engagement_score: 94,
      ready_to_post: true,
      character_count: 280,
      created_at: new Date().toISOString(),
      post_type: 'founder_story',
    },
    {
      id: 'post-2',
      platform: 'linkedin',
      content:
        "Music industry problem: 90% of PR pitches go to dead emails.\n\nI spent 3 years in music promotion watching agencies waste thousands on bad contact data.\n\nThe solution wasn't another CRM or email tool.\n\nIt was intelligent contact enrichment that understands the music industry.\n\nAudio Intel validates emails, enriches contacts, and provides submission guidelines - all in one tool.\n\nBeta users report 97% email delivery rates and 40% faster campaign setup.\n\nSometimes the best solutions come from founders who lived the problem.",
      topic: 'Industry Insight',
      engagement_score: 89,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'industry_insight',
    },
    {
      id: 'post-3',
      platform: 'bluesky',
      content:
        'Music tech founders: stop building tools musicians don\'t need.\n\nI talked to 50+ artists and PR agencies before building Audio Intel.\n\nThey all said the same thing: "I need better contact data, not another social media scheduler."\n\nBuild what they actually ask for, not what you think they need.',
      topic: 'Founder Advice',
      engagement_score: 87,
      ready_to_post: true,
      character_count: 0,
      created_at: new Date().toISOString(),
      post_type: 'founder_advice',
    },
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
      case 'twitter':
        return 'bg-black text-white';
      case 'linkedin':
        return 'bg-blue-600 text-white';
      case 'bluesky':
        return 'bg-sky-500 text-white';
      case 'threads':
        return 'bg-gray-900 text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'X';
      case 'linkedin':
        return 'in';
      case 'bluesky':
        return 'BS';
      case 'threads':
        return 'TH';
      case 'instagram':
        return 'IG';
      default:
        return '';
    }
  };

  const displayPosts = posts.length > 0 ? posts : fallbackPosts;
  const configuredPlatforms = Object.entries(platformConfig).filter(
    ([, config]) => config.configured
  );

  return (
    <div className="postcraft-page postcraft-container">
      {/* Header */}
      <div className="postcraft-section">
        <div className="postcraft-section-header text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Social Posting Hub
          </h1>
          <p className="text-gray-600">Post directly to social platforms from your mobile</p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <button
              onClick={loadContent}
              disabled={refreshing}
              className={`postcraft-button ${refreshing ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label="Refresh content"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="postcraft-status">
              <div className="postcraft-status-dot"></div>
              <span>
                {displayPosts.length} posts ready • {configuredPlatforms.length} platforms connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="postcraft-section">
        <h3 className="font-semibold text-gray-900 mb-3">Connected Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(platformConfig).map(([key, config]) => (
            <div
              key={key}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                config.configured
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {config.name} {config.configured ? '✓' : '✗'}
            </div>
          ))}
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
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="bluesky">Bluesky</option>
                <option value="threads">Threads</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
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
              {stats?.averageEngagement ||
                Math.round(
                  displayPosts.reduce((sum, p) => sum + p.engagement_score, 0) / displayPosts.length
                )}
              %
            </div>
            <div className="postcraft-metric-label">Avg Engagement Score</div>
          </div>

          <div className="postcraft-metric-card">
            <div className="postcraft-metric-header">
              <div className="postcraft-metric-icon" style={{ background: '#dbeafe' }}>
                <Send className="w-5 h-5 text-blue-900" />
              </div>
            </div>
            <div className="postcraft-metric-value">{configuredPlatforms.length}</div>
            <div className="postcraft-metric-label">Platforms Ready</div>
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
            <div className="postcraft-metric-value">{displayPosts.length}</div>
            <div className="postcraft-metric-label">Ready Posts</div>
          </div>
        </div>

        {/* Content Feed with Direct Posting */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2>Post Directly to Platforms</h2>
          </div>

          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="mobile-skeleton h-32 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {displayPosts.map(post => (
                <div key={post.id} className="postcraft-metric-card">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(
                          post.platform
                        )}`}
                      >
                        {getPlatformIcon(post.platform)} {post.platform}
                      </span>
                      <span className="postcraft-metric-badge postcraft-badge-info">
                        {post.topic}
                      </span>
                      <span className="postcraft-metric-badge postcraft-badge-success">
                        {post.engagement_score}%
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(post.content, post.id)}
                      className={`postcraft-button ${
                        copiedId === post.id ? 'bg-green-100 text-green-800' : ''
                      }`}
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm text-gray-800 whitespace-pre-line mb-4">
                    {post.content}
                  </div>

                  {/* Platform Selection for Direct Post */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select platforms to post to:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(platformConfig)
                        .filter(([, config]) => config.configured)
                        .map(([key, config]) => {
                          const isSelected = (selectedPlatforms[post.id] || []).includes(key);
                          const charCount = post.content.length;
                          const overLimit = charCount > config.charLimit;

                          return (
                            <button
                              key={key}
                              onClick={() => togglePlatformSelection(post.id, key)}
                              disabled={overLimit}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                overLimit
                                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title={
                                overLimit
                                  ? `Content too long (${charCount}/${config.charLimit})`
                                  : config.name
                              }
                            >
                              {config.name}
                              {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                              {overLimit && <span className="ml-1 text-xs">⚠️</span>}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Direct Post Button */}
                  <button
                    onClick={() => handleDirectPost(post.id, post.content)}
                    disabled={posting[post.id] || (selectedPlatforms[post.id] || []).length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      posting[post.id]
                        ? 'bg-blue-400 text-white cursor-wait'
                        : (selectedPlatforms[post.id] || []).length === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
                    }`}
                  >
                    {posting[post.id] ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Post to {(selectedPlatforms[post.id] || []).length || 0} Platform
                        {(selectedPlatforms[post.id] || []).length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>

                  {/* Post Results */}
                  {postResults[post.id] && postResults[post.id].length > 0 && (
                    <div className="mt-4 space-y-2">
                      {postResults[post.id].map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg flex items-center justify-between ${
                            result.success
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-medium capitalize">{result.platform}</span>
                            <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                              {result.success ? 'Posted!' : result.error}
                            </span>
                          </div>
                          {result.url && (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              View <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Footer */}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>Character count: {post.content.length}</span>
                    <span>Tap platforms then post</span>
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
                <div className="font-bold text-lg text-blue-600">
                  {Number(metrics.customers) || 0}
                </div>
                <div className="text-gray-600">Beta Customers</div>
              </div>
              <div>
                <div className="font-bold text-lg text-green-600">
                  {metrics.emailsValidated?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-600">Emails Validated</div>
              </div>
              <div>
                <div className="font-bold text-lg text-purple-600">
                  {metrics.contactsEnriched?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-600">Contacts Enriched</div>
              </div>
              <div>
                <div className="font-bold text-lg text-orange-600">
                  {metrics.deliveryRate || '0%'}
                </div>
                <div className="text-gray-600">Delivery Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="postcraft-section">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">How to Post</h3>
          <div className="text-sm text-gray-700 leading-6">
            <p className="mb-3">
              <strong>1. Select Platforms:</strong> Tap the platform buttons below each post to
              select where you want to publish.
            </p>
            <p className="mb-3">
              <strong>2. Check Character Limits:</strong> Platforms with ⚠️ mean your content
              exceeds their character limit.
            </p>
            <p className="mb-3">
              <strong>3. Post Directly:</strong> Tap "Post to X Platforms" to publish immediately.
            </p>
            <p className="mb-3">
              <strong>4. View Results:</strong> Success and failure statuses appear below each post
              with links to view.
            </p>
            <p>
              <strong>5. Copy Option:</strong> Still want to post manually? Use the Copy button to
              paste anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
