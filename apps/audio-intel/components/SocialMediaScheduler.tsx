'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Hash,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
} from 'lucide-react';

interface SocialMediaPost {
  id: string;
  content: string;
  platform: 'x' | 'linkedin' | 'bluesky';
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  hashtags: string[];
  engagement?: {
    likes: number;
    retweets: number;
    comments: number;
  };
  notionPageId?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialMediaSchedulerProps {
  compactMode?: boolean;
}

const SocialMediaScheduler: React.FC<SocialMediaSchedulerProps> = ({ compactMode = false }) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    platform: 'x' as 'x' | 'linkedin' | 'bluesky',
    scheduledTime: '',
    hashtags: '',
  });
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/agents/social-media-scheduler');
      const data = await response.json();
      if (data.success) {
        setPosts(data.upcomingPosts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async () => {
    if (!newPost.content.trim()) return;

    try {
      const response = await fetch('/api/agents/social-media-scheduler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          post: {
            ...newPost,
            hashtags: newPost.hashtags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean),
          },
        }),
      });

      if (response.ok) {
        setNewPost({ content: '', platform: 'x', scheduledTime: '', hashtags: '' });
        setShowAddForm(false);
        loadPosts();
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  const copyToClipboard = async (content: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatPlatform = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'X (Twitter)';
      case 'linkedin':
        return 'LinkedIn';
      case 'bluesky':
        return 'Blue Sky';
      default:
        return platform;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'x':
        return 'bg-black text-white';
      case 'linkedin':
        return 'bg-blue-600 text-white';
      case 'bluesky':
        return 'bg-sky-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'posted':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
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

  if (compactMode) {
    return (
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Social Media Scheduler
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Post
          </button>
        </div>

        <div className="space-y-3">
          {posts.slice(0, 3).map(post => (
            <div key={post.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(
                    post.platform
                  )}`}
                >
                  {formatPlatform(post.platform)}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}
                >
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(post.scheduledTime).toLocaleString()}
                </span>
                <button
                  onClick={() => copyToClipboard(post.content, post.id)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  {copiedPostId === post.id ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Enter your post content..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={e => setNewPost({ ...newPost, platform: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="x">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="bluesky">Blue Sky</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={newPost.scheduledTime}
                    onChange={e => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hashtags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.hashtags}
                    onChange={e => setNewPost({ ...newPost, hashtags: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="#MusicTech #IndieMusic"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addPost}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Schedule Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Hash className="w-6 h-6 mr-2" />
          Social Media Scheduler
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(
                  post.platform
                )}`}
              >
                {formatPlatform(post.platform)}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}
              >
                {post.status}
              </span>
            </div>

            <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(post.scheduledTime).toLocaleString()}
              </span>
              {post.engagement && (
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {post.engagement.likes + post.engagement.retweets + post.engagement.comments}{' '}
                  engagement
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(post.content, post.id)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                {copiedPostId === post.id ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copiedPostId === post.id ? 'Copied!' : 'Copy'}
              </button>
              <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                <Edit className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts scheduled</h3>
          <p className="text-gray-500 mb-4">Start by adding your first social media post</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Post
          </button>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-6">Add New Social Media Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Enter your post content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={e => setNewPost({ ...newPost, platform: e.target.value as any })}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="x">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="bluesky">Blue Sky</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={newPost.scheduledTime}
                    onChange={e => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hashtags (comma-separated)</label>
                <input
                  type="text"
                  value={newPost.hashtags}
                  onChange={e => setNewPost({ ...newPost, hashtags: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="#MusicTech #IndieMusic #MusicIndustry"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addPost}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaScheduler;
