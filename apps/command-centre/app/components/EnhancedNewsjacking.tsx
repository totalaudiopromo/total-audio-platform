'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  TrendingUp,
  Share2,
  Sparkles,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Zap,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Users,
  Target
} from 'lucide-react';

interface GeneratedContent {
  id: string;
  originalStory: {
    title: string;
    source: string;
    publishedAt: Date;
    relevanceScore: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  urgency: 'immediate' | 'same_day' | 'this_week';
  voiceScore: number;
  estimatedReach: number;
  generatedAt: Date;
  newsletterSections: any[];
}

export default function EnhancedNewsjacking() {
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'analytics' | 'approvals'>('opportunities');
  const [analytics, setAnalytics] = useState<any>(null);
  const [approvalQueue, setApprovalQueue] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    // Defer loading until user taps the button for a snappier first paint
  }, []);

  const loadContent = async () => {
    try {
      if (!loading) setRefreshing(true);
      // Abort if the request takes too long (mobile safety)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch('/api/newsjacking/content', { signal: controller.signal });
      clearTimeout(timeout);
      const result = await response.json();
      
      if (result.success) {
        const parsedContent = result.data.map((item: any) => ({
          id: item.id,
          originalStory: {
            title: item.originalStory.title,
            source: item.originalStory.source,
            publishedAt: new Date(item.originalStory.publishedAt),
            relevanceScore: item.originalStory.relevanceScore
          },
          status: item.status,
          urgency: item.unsignedAngle?.urgency === 'immediate' ? 'immediate' : 
                   item.unsignedAngle?.urgency === 'high' ? 'same_day' : 'this_week',
          voiceScore: item.voiceScore,
          estimatedReach: 25000,
          generatedAt: new Date(item.createdAt),
          newsletterSections: item.newsletterSections || []
        }));
        setContent(parsedContent);
        if (parsedContent.length > 0 && !selectedContent) {
          setSelectedContent(parsedContent[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return {
          color: 'bg-red-500 text-white',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'URGENT',
          description: 'Post within 1 hour'
        };
      case 'same_day':
        return {
          color: 'bg-orange-500 text-white',
          icon: <Clock className="w-4 h-4" />,
          label: 'SAME DAY',
          description: 'Post today'
        };
      default:
        return {
          color: 'bg-blue-500 text-white',
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'THIS WEEK',
          description: 'Post this week'
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="postcraft-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="postcraft-loading w-8 h-8 rounded-full"></div>
            <div className="postcraft-loading h-6 w-48"></div>
          </div>
          <div className="postcraft-loading h-4 w-full mb-2"></div>
          <div className="postcraft-loading h-4 w-3/4"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="postcraft-loading h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Industry Intelligence</h1>
            <p className="text-gray-600">{content.length} opportunities</p>
          </div>
          <button
            onClick={loadContent}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            aria-label="Refresh content"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Load Button */}
      {content.length === 0 && !refreshing && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Load latest opportunities</h2>
          <p className="text-gray-600 mb-4">Tap to fetch fresh industry stories and angles.</p>
          <button 
            onClick={loadContent} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" /> Load Opportunities
          </button>
        </div>
      )}

      {/* Podcast Episodes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Latest Podcast Episodes</h2>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/newsjacking/podcasts');
                const data = await res.json();
                if (data.success) setEpisodes(data.episodes.slice(0, 8));
              } catch (e) {
                console.error('Failed to load podcasts');
              }
            }}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
        {episodes.length === 0 ? (
          <p className="text-gray-600">Tap refresh to load recent episodes from your shows.</p>
        ) : (
          <div className="space-y-3">
            {episodes.map((ep) => (
              <div key={ep.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900">{ep.title}</div>
                  <span className="text-sm text-gray-500">{new Date(ep.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{ep.show}</div>
                <div className="flex items-center gap-2">
                  <a href={ep.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-800">Open Episode</a>
                  {ep.audioUrl && <audio controls preload="none" src={ep.audioUrl} className="h-8" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{content.length}</div>
          <div className="text-sm text-gray-600">TOTAL OPPORTUNITIES</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{content.filter(c => c.urgency === 'immediate').length}</div>
          <div className="text-sm text-gray-600">URGENT</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{content.filter(c => c.status === 'approved').length}</div>
          <div className="text-sm text-gray-600">APPROVED</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{content.filter(c => c.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">PENDING</div>
        </div>
      </div>

      {content.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">No opportunities found</h2>
          <p className="text-gray-500">Check back later for real-time industry intelligence</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Urgent Items */}
          {content.filter(item => item.urgency === 'immediate').length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-4">Urgent Opportunities</h2>
              <div className="space-y-3">
                {content.filter(item => item.urgency === 'immediate').slice(0, 2).map((item) => {
                  const urgencyConfig = getUrgencyConfig(item.urgency);
                  return (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${urgencyConfig.color}`}>
                          {urgencyConfig.icon}
                          <span className="ml-1">{urgencyConfig.label}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimeAgo(item.generatedAt)}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{item.originalStory.title}</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">{item.originalStory.source}</div>
                        <Link
                          href={`/social-posting?newsId=${item.id}&fromNews=true`}
                          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                        >
                          <Share2 className="w-4 h-4 mr-1 inline" /> Share Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Opportunities */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
            <div className="space-y-3">
              {content.slice(0, 10).map((item) => {
                const urgencyConfig = getUrgencyConfig(item.urgency);
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedContent?.id === item.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedContent(item)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${urgencyConfig.color}`}>
                        {urgencyConfig.icon}
                        <span className="ml-1">{urgencyConfig.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{formatTimeAgo(item.generatedAt)}</span>
                        {item.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{item.originalStory.title}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">{item.originalStory.source}</div>
                        <div className="text-sm text-gray-500">{item.originalStory.relevanceScore.toFixed(1)}/10</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContent(item);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <Link
                          href={`/social-posting?newsId=${item.id}&fromNews=true`}
                          className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 className="w-3 h-3 mr-1 inline" /> Share
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Preview */}
          {selectedContent && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Content Preview</h2>
                <Link
                  href={`/social-posting?newsId=${selectedContent.id}&fromNews=true`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" /> Create Post
                </Link>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedContent.originalStory.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{selectedContent.originalStory.source}</span>
                  <span>Relevance: {selectedContent.originalStory.relevanceScore.toFixed(2)}/10</span>
                  <span>Est. {selectedContent.estimatedReach.toLocaleString()} reach</span>
                </div>
              </div>

              {selectedContent.newsletterSections.length > 0 ? (
                <div className="space-y-4">
                  {selectedContent.newsletterSections.slice(0, 1).map((section: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
                      <div className="text-gray-700 leading-relaxed">
                        {section.content.split('\n').map((paragraph: string, pIndex: number) => 
                          paragraph.trim() && (
                            <p key={pIndex} className="mb-3">{paragraph}</p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Link
                    href={`/social-posting?newsId=${selectedContent.id}&fromNews=true`}
                    className="bg-blue-600 text-white w-full flex items-center justify-center px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Transform to Social Post
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                  <div className="text-yellow-800 font-semibold mb-2">Content being generated...</div>
                  <p className="text-yellow-700 text-sm">AI is crafting content in your voice. Check back in a few minutes.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}