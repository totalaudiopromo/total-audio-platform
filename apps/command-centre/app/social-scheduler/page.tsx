'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Filter,
  Trash2,
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
  createdAt: string;
  postType?: string;
}

export default function SocialSchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'posted' | 'failed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledTime: '',
  });

  // Load scheduled posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data
      // In production, this would fetch from your database
      const mockPosts: ScheduledPost[] = [
        {
          id: 'post_1',
          content:
            'Built Audio Intel to solve my own problem: music PR is broken.\n\nSpent years manually enriching contacts, validating emails, writing pitches.\n\nNow it takes 30 seconds instead of 30 minutes.',
          platforms: ['twitter', 'linkedin'],
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          postType: 'founder_story',
        },
        {
          id: 'post_2',
          content:
            'Music industry problem: 90% of PR pitches go to dead emails.\n\nI spent 3 years in music promotion watching agencies waste thousands on bad contact data.',
          platforms: ['bluesky'],
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          postType: 'industry_insight',
        },
        {
          id: 'post_3',
          content:
            'Audio Intel beta update: 12,847 emails validated, 3,672 contacts enriched, 97.4% delivery rate.',
          platforms: ['twitter'],
          scheduledTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          status: 'posted',
          createdAt: new Date().toISOString(),
          postType: 'progress_update',
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAddPost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0) {
      alert('Please fill in content and select at least one platform');
      return;
    }

    try {
      const response = await fetch('/api/social-media/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: newPost.platforms,
          content: newPost.content,
          scheduledTime: newPost.scheduledTime || undefined,
        }),
      });

      if (response.ok) {
        setNewPost({ content: '', platforms: [], scheduledTime: '' });
        setShowAddForm(false);
        loadPosts(); // Refresh the list
        alert('Post scheduled successfully!');
      } else {
        throw new Error('Failed to schedule post');
      }
    } catch (error) {
      console.error('Failed to schedule post:', error);
      alert('Failed to schedule post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled post?')) return;

    // In production, this would call a delete API
    setPosts(posts.filter(p => p.id !== postId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'posted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'posted':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div className="postcraft-page postcraft-container">
      {/* Header */}
      <div className="postcraft-section">
        <div className="postcraft-section-header text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Social Scheduler
          </h1>
          <p className="text-gray-600">Manage your scheduled social media posts</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={loadPosts}
              disabled={loading}
              className={`postcraft-button ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="postcraft-button bg-green-100 text-green-800 hover:bg-green-200"
            >
              <Plus className="w-4 h-4" />
              Add Post
            </button>
          </div>
        </div>
      </div>

      {/* Add Post Form */}
      {showAddForm && (
        <div className="postcraft-section">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Schedule New Post</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={4}
                placeholder="What do you want to post?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
              <div className="flex gap-2 flex-wrap">
                {['twitter', 'linkedin', 'bluesky', 'instagram'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => {
                      const platforms = newPost.platforms.includes(platform)
                        ? newPost.platforms.filter(p => p !== platform)
                        : [...newPost.platforms, platform];
                      setNewPost({ ...newPost, platforms });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      newPost.platforms.includes(platform)
                        ? getPlatformColor(platform)
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={newPost.scheduledTime}
                onChange={e => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to post immediately</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddPost}
                className="postcraft-button bg-purple-100 text-purple-800 hover:bg-purple-200"
              >
                <Calendar className="w-4 h-4" />
                Schedule Post
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="postcraft-button bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="postcraft-section">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter Posts</h3>
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Posts', count: posts.length },
            {
              key: 'scheduled',
              label: 'Scheduled',
              count: posts.filter(p => p.status === 'scheduled').length,
            },
            {
              key: 'posted',
              label: 'Posted',
              count: posts.filter(p => p.status === 'posted').length,
            },
            {
              key: 'failed',
              label: 'Failed',
              count: posts.filter(p => p.status === 'failed').length,
            },
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === filterOption.key
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="postcraft-section">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Scheduled Posts</h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="mobile-skeleton h-32 rounded-lg"></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No posts found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="postcraft-metric-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(post.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.scheduledTime).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex gap-1 flex-wrap">
                    {post.platforms.map(platform => (
                      <span
                        key={platform}
                        className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(
                          platform
                        )}`}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded border-4 border-black font-mono text-sm text-gray-800 whitespace-pre-line">
                  {post.content}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
                  <span>ID: {post.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="postcraft-section">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">How It Works</h3>
        <div className="text-sm text-gray-700 leading-6">
          <p className="mb-3">
            <strong>1. Schedule Posts:</strong> Add new posts with content, select platforms, and
            set timing.
          </p>
          <p className="mb-3">
            <strong>2. Automatic Posting:</strong> Posts are automatically published at the
            scheduled time.
          </p>
          <p className="mb-3">
            <strong>3. Platform Support:</strong> Twitter, LinkedIn, Bluesky, and Instagram
            integration.
          </p>
          <p className="mb-3">
            <strong>4. Status Tracking:</strong> Monitor scheduled, posted, and failed posts.
          </p>
          <p>
            <strong>5. Easy Management:</strong> Edit, delete, or reschedule posts as needed.
          </p>
        </div>
      </div>
    </div>
  );
}
