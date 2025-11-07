/**
 * Newsjacking Content Review Dashboard
 * Provides interface for Chris to review and approve generated newsletter content
 * before publication and distribution
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface GeneratedContent {
  id: string;
  storyId: string;
  originalStory: {
    title: string;
    source: string;
    publishedAt: Date;
    relevanceScore: number;
    url: string;
  };
  unsignedAngle: {
    type: string;
    angle: string;
    opportunity: string;
    actionable: string;
  };
  newsletterSections: NewsletterSection[];
  platformContent: PlatformContent;
  generatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  voiceScore: number;
  estimatedReach: number;
  urgency: 'immediate' | 'same_day' | 'this_week';
  feedback?: string;
}

export interface NewsletterSection {
  id: string;
  type: 'industry_intel' | 'trend_alert' | 'major_label_drama';
  title: string;
  content: string;
  keyTakeaways: string[];
  audioIntelConnection: string;
  urgency: string;
  estimatedReach: number;
}

export interface PlatformContent {
  twitter: {
    content: string[];
    hashtags: string[];
    scheduledFor: Date;
  };
  linkedin: {
    content: {
      title: string;
      article: string;
      summary: string;
    };
    scheduledFor: Date;
  };
  instagram: {
    content: {
      slides: Array<{ title: string; content: string }>;
      caption: string;
      hashtags: string[];
    };
    scheduledFor: Date;
  };
}

/**
 * Newsjacking Dashboard Component
 */
export function NewsjackingDashboard() {
  const [pendingContent, setPendingContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'published'>('pending');

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsjacking/content');
      const result = await response.json();

      if (result.success) {
        // Parse dates that come as strings from JSON
        const parsedContent = result.data.map((item: any) => ({
          id: item.id,
          storyId: item.id,
          originalStory: {
            title: item.originalStory.title,
            source: item.originalStory.source,
            publishedAt: new Date(item.originalStory.publishedAt),
            relevanceScore: item.originalStory.relevanceScore,
            url: item.originalStory.url,
          },
          unsignedAngle: {
            type: item.unsignedAngle.urgency,
            angle: item.unsignedAngle.angle,
            opportunity: item.unsignedAngle.keyInsight,
            actionable: item.unsignedAngle.actionableAdvice,
          },
          newsletterSections: item.newsletterSections.map((section: any) => ({
            id: section.title,
            type: section.type as 'industry_intel' | 'trend_alert' | 'major_label_drama',
            title: section.title,
            content: section.content,
            keyTakeaways: [item.unsignedAngle.keyInsight],
            audioIntelConnection: 'Contact data enrichment opportunity',
            urgency: item.unsignedAngle.urgency,
            estimatedReach: 15000,
          })),
          platformContent: {
            twitter: {
              content: item.multiPlatformContent.twitter.content,
              hashtags: ['#UnsignedAdvantage', '#IndieArtist', '#MusicBusiness'],
              scheduledFor: new Date(item.multiPlatformContent.twitter.scheduledFor),
            },
            linkedin: {
              content: {
                title: item.multiPlatformContent.linkedin.content.title,
                article: item.multiPlatformContent.linkedin.content.article,
                summary: item.multiPlatformContent.linkedin.content.title,
              },
              scheduledFor: new Date(item.multiPlatformContent.linkedin.scheduledFor),
            },
            instagram: {
              content: {
                slides: item.multiPlatformContent.instagram.content.slides.map(
                  (slide: string, index: number) => ({
                    title: `Slide ${index + 1}`,
                    content: slide,
                  })
                ),
                caption: item.multiPlatformContent.instagram.content.caption,
                hashtags: ['#UnsignedAdvantage', '#IndieArtist', '#MusicBusiness'],
              },
              scheduledFor: new Date(item.multiPlatformContent.instagram.scheduledFor),
            },
          },
          generatedAt: new Date(item.createdAt),
          status: item.status as 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published',
          voiceScore: item.voiceScore,
          estimatedReach: 25000,
          urgency:
            item.unsignedAngle.urgency === 'immediate'
              ? 'immediate'
              : item.unsignedAngle.urgency === 'high'
              ? 'same_day'
              : ('this_week' as 'immediate' | 'same_day' | 'this_week'),
          feedback: undefined,
        }));
        setPendingContent(parsedContent);
      }
    } catch (error) {
      console.error('Failed to load pending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveContent = async (contentId: string, feedback?: string) => {
    try {
      await fetch('/api/newsjacking/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', contentId }),
      });

      setPendingContent(prev =>
        prev.map(c => (c.id === contentId ? { ...c, status: 'approved', feedback } : c))
      );

      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const rejectContent = async (contentId: string, reason: string) => {
    try {
      await fetch('/api/newsjacking/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', contentId }),
      });

      setPendingContent(prev =>
        prev.map(c => (c.id === contentId ? { ...c, status: 'rejected', feedback: reason } : c))
      );

      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to reject content:', error);
    }
  };

  const scheduleContent = async (contentId: string, scheduleDate: Date) => {
    try {
      await fetch('/api/newsjacking/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'schedule', contentId, scheduledTime: scheduleDate }),
      });

      setPendingContent(prev =>
        prev.map(c => (c.id === contentId ? { ...c, status: 'scheduled' } : c))
      );
    } catch (error) {
      console.error('Failed to schedule content:', error);
    }
  };

  const filteredContent = pendingContent.filter(content => {
    if (filter === 'all') return true;
    return content.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading newsjacking content...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          The Unsigned Advantage - Content Review
        </h1>
        <p className="text-gray-600">
          Review and approve newsjacked content for newsletter and social platforms
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['all', 'pending', 'approved', 'published'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <span className="ml-2 text-sm">
                (
                {
                  pendingContent.filter(c => filterOption === 'all' || c.status === filterOption)
                    .length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>

          {filteredContent.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No content to review</div>
          ) : (
            filteredContent.map(content => (
              <ContentCard
                key={content.id}
                content={content}
                isSelected={selectedContent?.id === content.id}
                onClick={() => setSelectedContent(content)}
              />
            ))
          )}
        </div>

        {/* Content Preview */}
        <div className="lg:col-span-2">
          {selectedContent ? (
            <ContentPreview
              content={selectedContent}
              onApprove={feedback => approveContent(selectedContent.id, feedback)}
              onReject={reason => rejectContent(selectedContent.id, reason)}
              onSchedule={date => scheduleContent(selectedContent.id, date)}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-500">
                Select content from the list to preview and review
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Content Card Component
 */
function ContentCard({
  content,
  isSelected,
  onClick,
}: {
  content: GeneratedContent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-800';
      case 'same_day':
        return 'bg-orange-100 text-orange-800';
      case 'this_week':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}
        >
          {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
            content.urgency
          )}`}
        >
          {content.urgency.replace('_', ' ')}
        </span>
      </div>

      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{content.originalStory.title}</h3>

      <div className="text-sm text-gray-600 mb-2">
        {content.originalStory.source} • {content.originalStory.relevanceScore.toFixed(2)} relevance
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{content.newsletterSections.length} sections</span>
        <span>Voice: {(content.voiceScore * 100).toFixed(0)}%</span>
        <span>{content.estimatedReach.toLocaleString()} reach</span>
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {new Date(content.generatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

/**
 * Content Preview Component
 */
function ContentPreview({
  content,
  onApprove,
  onReject,
  onSchedule,
}: {
  content: GeneratedContent;
  onApprove: (feedback?: string) => void;
  onReject: (reason: string) => void;
  onSchedule: (date: Date) => void;
}) {
  const [activeTab, setActiveTab] = useState('newsletter');
  const [feedback, setFeedback] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Preview Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {content.originalStory.title}
            </h2>
            <div className="text-sm text-gray-600">
              {content.originalStory.source} • {content.unsignedAngle.type.replace('_', ' ')}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              Voice Score: {(content.voiceScore * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">
              Est. Reach: {content.estimatedReach.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Unsigned Angle Summary */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-yellow-900 mb-2">Unsigned Advantage Angle</h3>
          <p className="text-yellow-800 mb-2">{content.unsignedAngle.angle}</p>
          <div className="text-sm text-yellow-700">
            <strong>Opportunity:</strong> {content.unsignedAngle.opportunity}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4">
          {['newsletter', 'twitter', 'linkedin', 'instagram'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-6">
        {activeTab === 'newsletter' && <NewsletterPreview sections={content.newsletterSections} />}

        {activeTab === 'twitter' && <TwitterPreview content={content.platformContent.twitter} />}

        {activeTab === 'linkedin' && <LinkedInPreview content={content.platformContent.linkedin} />}

        {activeTab === 'instagram' && (
          <InstagramPreview content={content.platformContent.instagram} />
        )}
      </div>

      {/* Action Buttons */}
      {content.status === 'pending' && (
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => onApprove(feedback)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Approve & Publish
              </button>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Schedule
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Reject
              </button>
            </div>

            <div className="flex-1 max-w-md ml-4">
              <input
                type="text"
                placeholder="Add feedback (optional)..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals would go here for reject reason and schedule date */}
    </div>
  );
}

/**
 * Newsletter Preview Component
 */
function NewsletterPreview({ sections }: { sections: NewsletterSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={section.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {section.type}
            </span>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Audio Intel: {section.audioIntelConnection}</span>
              <span>Reach: {section.estimatedReach.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Twitter Preview Component
 */
function TwitterPreview({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Thread of {content.content.length} tweets • Scheduled:{' '}
        {content.scheduledFor.toLocaleString()}
      </div>

      {content.content.map((tweet: string, index: number) => (
        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500">Tweet {index + 1}</span>
            <span className="text-xs text-gray-400">{tweet.length}/280</span>
          </div>
          <p className="text-gray-800">{tweet}</p>
        </div>
      ))}

      <div className="text-xs text-gray-600">Hashtags: {content.hashtags.join(' ')}</div>
    </div>
  );
}

/**
 * LinkedIn Preview Component
 */
function LinkedInPreview({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Article • Scheduled: {content.scheduledFor.toLocaleString()}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.content.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{content.content.summary}</p>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 whitespace-pre-line">{content.content.article}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Instagram Preview Component
 */
function InstagramPreview({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Carousel of {content.content.slides.length} slides • Scheduled:{' '}
        {content.scheduledFor.toLocaleString()}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {content.content.slides.map((slide: any, index: number) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 aspect-square flex flex-col justify-center"
          >
            <h4 className="font-semibold text-gray-900 text-center mb-2">{slide.title}</h4>
            <p className="text-sm text-gray-700 text-center">{slide.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Caption</h4>
        <p className="text-gray-800 whitespace-pre-line">{content.content.caption}</p>
        <div className="text-xs text-gray-600 mt-2">{content.content.hashtags.join(' ')}</div>
      </div>
    </div>
  );
}
