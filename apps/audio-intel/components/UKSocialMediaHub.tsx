'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Share2,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Copy,
  Zap,
} from 'lucide-react';

interface UKPost {
  id: string;
  content: string;
  platform: string;
  hashtags: string[];
  status: 'ready' | 'scheduled' | 'posted';
  source: 'notion' | 'local';
  optimalTime?: string;
  ukTime?: string;
}

interface UKSocialMediaHubProps {
  compact?: boolean;
}

export default function UKSocialMediaHub({ compact = false }: UKSocialMediaHubProps) {
  const [posts, setPosts] = useState<UKPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState<string | null>(null);

  // UK Optimal Posting Times (GMT)
  const UK_OPTIMAL_TIMES = {
    'X (Twitter)': ['07:00', '12:00', '17:00'],
    LinkedIn: ['08:00', '12:00', '17:00'],
    Threads: ['07:00', '12:00', '18:00'],
    Facebook: ['09:00', '13:00', '18:00'],
    'Blue Sky': ['08:00', '13:00', '19:00'],
  };

  useEffect(() => {
    loadUKContent();
  }, []);

  const loadUKContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hybrid-content');
      const data = await response.json();

      if (data.success && data.posts) {
        // Convert to UK format with optimal times
        const ukPosts = data.posts.map((post: any) => ({
          ...post,
          ukTime: getNextOptimalTime(post.platform),
          optimalTime:
            UK_OPTIMAL_TIMES[post.platform as keyof typeof UK_OPTIMAL_TIMES]?.[0] || '12:00',
        }));

        setPosts(ukPosts);
      }
    } catch (error) {
      console.error('Failed to load UK content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextOptimalTime = (platform: string) => {
    const times = UK_OPTIMAL_TIMES[platform as keyof typeof UK_OPTIMAL_TIMES];
    if (!times) return '12:00';

    const now = new Date();
    const currentHour = now.getHours();

    // Find next optimal time today
    for (const time of times) {
      const [hour] = time.split(':').map(Number);
      if (hour > currentHour) {
        return time;
      }
    }

    // If no time today, use first time tomorrow
    return times[0];
  };

  const postToAllPlatforms = async (postId: string) => {
    setPosting(postId);

    try {
      // Simulate posting to all platforms
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update post status
      setPosts(prev =>
        prev.map(post => (post.id === postId ? { ...post, status: 'posted' as const } : post))
      );

      console.log('Posted to all platforms successfully');
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setPosting(null);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlatformColour = (platform: string) => {
    const colours = {
      'X (Twitter)': 'bg-black text-white',
      LinkedIn: 'bg-blue-600 text-white',
      Threads: 'bg-blue-600 text-white',
      Facebook: 'bg-blue-500 text-white',
      'Blue Sky': 'bg-sky-500 text-white',
    };
    return colours[platform as keyof typeof colours] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-blue-600" />
            UK Social Hub
          </h3>
          <span className="text-sm text-gray-500">{posts.length} posts ready</span>
        </div>

        <div className="space-y-2">
          {posts.slice(0, 2).map(post => (
            <div
              key={post.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{post.content.substring(0, 60)}...</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${getPlatformColour(post.platform)}`}>
                    {post.platform}
                  </span>
                  <span className="text-xs text-gray-500">{post.ukTime}</span>
                </div>
              </div>
              <button
                onClick={() => postToAllPlatforms(post.id)}
                disabled={posting === post.id || post.status === 'posted'}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {posting === post.id ? 'Posting...' : 'Post Now'}
              </button>
            </div>
          ))}
        </div>

        {posts.length > 2 && (
          <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700">
            View all {posts.length} posts
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Share2 className="w-6 h-6 mr-3 text-blue-600" />
            UK Social Media Hub
          </h2>
          <p className="text-gray-600 mt-1">Your authentic content, optimised for UK audiences</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
            <div className="text-sm text-gray-500">Posts Ready</div>
          </div>
          <button
            onClick={loadUKContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Zap className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* UK Optimal Times Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          UK Optimal Posting Times (GMT)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {Object.entries(UK_OPTIMAL_TIMES).map(([platform, times]) => (
            <div key={platform} className="text-center">
              <div className="font-medium text-blue-700">{platform}</div>
              <div className="text-blue-600">{times.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(post.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColour(post.platform)}`}
                >
                  {post.platform}
                </span>
                <span className="text-sm text-gray-500">Next: {post.ukTime} GMT</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(post.content)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => postToAllPlatforms(post.id)}
                  disabled={posting === post.id || post.status === 'posted'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {posting === post.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : post.status === 'posted' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Posted
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Post Now
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>

            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
