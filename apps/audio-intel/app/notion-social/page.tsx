'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Hash, TrendingUp, Plus, Edit, Trash2, Copy, CheckCircle, Share2, RefreshCw, ExternalLink } from 'lucide-react';

interface NotionPost {
  id: string;
  content: string;
  platform: 'x' | 'linkedin' | 'bluesky';
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  hashtags: string[];
  notionPageId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotionSocial() {
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Auto-sync from Notion on component mount
  useEffect(() => {
    syncFromNotion();
  }, []);

  const syncFromNotion = async () => {
    setSyncing(true);
    setError(null);
    
    try {
      console.log('🔄 Loading your content from Notion + Local files...');
      
      // Get content from both Notion and local files
      const hybridResponse = await fetch('/api/hybrid-content', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!hybridResponse.ok) {
        throw new Error(`Failed to load hybrid content: ${hybridResponse.status}`);
      }
      
      const hybridData = await hybridResponse.json();
      console.log('📄 Your hybrid content:', hybridData);
      
      if (hybridData.success && hybridData.posts) {
        // Use your combined content
        setPosts(hybridData.posts);
        setLastSync(new Date());
        console.log(`✅ Loaded ${hybridData.sources.total} posts (${hybridData.sources.notion} from Notion, ${hybridData.sources.local} from local files)`);
      } else {
        throw new Error('No posts found in your content sources');
      }
      
    } catch (err: any) {
      console.error('❌ Content load failed:', err);
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const addPostToScheduler = async (post: NotionPost) => {
    try {
      const response = await fetch('/api/agents/social-media-scheduler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          post: {
            content: post.content,
            platform: post.platform,
            scheduledTime: post.scheduledTime,
            hashtags: post.hashtags
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Post added to scheduler:', result);
        // Update the post status locally
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.id === post.id 
              ? { ...p, status: 'scheduled' as const }
              : p
          )
        );
      } else {
        throw new Error(`Failed to add post: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to add post to scheduler:', error);
      setError(`Failed to add post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = async (content: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Show temporary success state
      const button = document.getElementById(`copy-${postId}`);
      if (button) {
        button.innerHTML = 'Copied!';
        setTimeout(() => {
          button.innerHTML = 'Copy';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatPlatform = (platform: string) => {
    switch (platform) {
      case 'x': return 'X (Twitter)';
      case 'linkedin': return 'LinkedIn';
      case 'bluesky': return 'Blue Sky';
      default: return platform;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'x': return 'bg-black text-white';
      case 'linkedin': return 'bg-blue-600 text-white';
      case 'bluesky': return 'bg-sky-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'posted': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Posts state:', posts);
  console.log('Posts length:', posts.length);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Share2 className="w-8 h-8 mr-3 text-blue-600" />
                Your Content Hub
              </h1>
              <p className="text-gray-600 text-lg">
                Your authentic content from Notion + Local files - ready to schedule
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={syncFromNotion}
                disabled={syncing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync from Notion'}
              </button>
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Notion
              </a>
            </div>
          </div>
          
          {lastSync && (
            <p className="text-sm text-gray-500 mt-2">
              Last synced: {lastSync.toLocaleString()}
            </p>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Sync error: {error}</p>
            </div>
          )}
        </div>


        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                <div className="text-sm text-gray-600">Scheduled Posts</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Platforms</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Auto</div>
                <div className="text-sm text-gray-600">Sync Mode</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works with your content:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              <span>Write your authentic posts in Notion (with 🎵 or "Music Industry" keywords)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
              <span>This page automatically syncs your Notion content every 30 seconds</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
              <span>Click "Schedule Post" to add your content to the social media queue</span>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(post.platform)}`}>
                  {formatPlatform(post.platform)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{post.content}</p>
              </div>
              
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(post.scheduledTime).toLocaleString()}
                </span>
                {(post as any).engagement && (
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {(post as any).engagement.likes + (post as any).engagement.retweets + (post as any).engagement.comments} engagement
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(post.content, post.id)}
                  id={`copy-${post.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => addPostToScheduler(post)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
              Write some social media content in your Notion workspace with 🎵 or "Music Industry" keywords
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={syncFromNotion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2 inline" />
                Sync from Notion
              </button>
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2 inline" />
                Open Notion
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
