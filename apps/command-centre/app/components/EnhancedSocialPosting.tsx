'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Clock,
  Sparkles,
  Image,
  Hash,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface PostTemplate {
  id: string;
  name: string;
  category: 'announcement' | 'beta-update' | 'feature' | 'launch' | 'news';
  content: string;
  hashtags: string[];
  platforms: string[];
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  content?: string;
  relevanceScore: number;
  urgency: 'immediate' | 'same_day' | 'this_week';
}

interface ScheduledPost {
  id: string;
  platforms: string[];
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
}

const PLATFORMS = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'X',
    color: 'bg-black text-white',
    maxChars: 280,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'in',
    color: 'bg-blue-600 text-white',
    maxChars: 3000,
  },
  {
    id: 'bluesky',
    name: 'Blue Sky',
    icon: 'BS',
    color: 'bg-sky-500 text-white',
    maxChars: 300,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: 'TH',
    color: 'bg-gray-900 text-white',
    maxChars: 500,
  },
];

interface EnhancedSocialPostingProps {
  newsItem?: NewsItem;
  fromNews?: boolean;
}

export default function EnhancedSocialPosting({
  newsItem,
  fromNews = false,
}: EnhancedSocialPostingProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'twitter',
    'linkedin',
    'bluesky',
  ]);
  const [content, setContent] = useState('');
  const [aiEnhancedContent, setAiEnhancedContent] = useState('');
  const [hashtags, setHashtags] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState<'compose' | 'enhance' | 'review' | 'schedule'>(
    'compose'
  );

  useEffect(() => {
    if (newsItem) {
      setContent(`Music Tech News: ${newsItem.title}
      
${newsItem.content || 'Interesting developments in the music industry...'}

What are your thoughts on this?`);
      setCurrentStep('enhance');
    }
    fetchTemplates();
  }, [newsItem]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/social-media/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const enhanceWithAI = async () => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    try {
      // Simulate AI enhancement - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const enhanced = `${content}

Key takeaway: This shows how innovation drives the music industry forward.

#MusicTech #Innovation #AudioIndustry #TotalAudioPromo`;

      setAiEnhancedContent(enhanced);
      setCurrentStep('review');
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId]
    );
  };

  const handleSchedulePost = async () => {
    const finalContent = aiEnhancedContent || content;
    if (!finalContent.trim() || selectedPlatforms.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          content: finalContent + (hashtags ? ` ${hashtags}` : ''),
          scheduledTime: scheduledTime || undefined,
          newsItemId: newsItem?.id,
          fromNews,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (fromNews) {
            window.history.back();
          } else {
            // Reset form
            setContent('');
            setAiEnhancedContent('');
            setHashtags('');
            setScheduledTime('');
            setCurrentStep('compose');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Scheduling failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacterCount = () => {
    const finalContent = aiEnhancedContent || content;
    return finalContent.length + (hashtags ? hashtags.length + 1 : 0);
  };

  const getCharacterLimit = () => {
    const selectedPlatform = PLATFORMS.find(p => selectedPlatforms.includes(p.id));
    return selectedPlatform ? selectedPlatform.maxChars : 280;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (showSuccess) {
    return (
      <div className="mobile-card text-center py-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="mobile-heading-2 text-green-700 mb-2">Post Scheduled!</h2>
        <p className="mobile-body text-gray-600">
          Your content will be published to {selectedPlatforms.length} platform
          {selectedPlatforms.length > 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {fromNews && (
            <button
              onClick={() => window.history.back()}
              className="mobile-button mobile-button-secondary p-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="mobile-heading-1">{fromNews ? 'Share News' : 'Social Posting'}</h1>
            <p className="mobile-caption">
              {newsItem ? `From: ${newsItem.source}` : 'Multi-platform publishing'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mobile-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-600">Progress</span>
          <span className="text-sm text-blue-600">
            Step{' '}
            {currentStep === 'compose'
              ? 1
              : currentStep === 'enhance'
                ? 2
                : currentStep === 'review'
                  ? 3
                  : 4}{' '}
            of 4
          </span>
        </div>
        <div className="flex space-x-2">
          {['compose', 'enhance', 'review', 'schedule'].map((step, index) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full ${
                currentStep === step
                  ? 'bg-blue-600'
                  : index < ['compose', 'enhance', 'review', 'schedule'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mobile-card">
        <h2 className="mobile-heading-3 mb-4">Select Platforms</h2>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map(platform => (
            <label
              key={platform.id}
              className={`
                mobile-quick-action cursor-pointer transition-all
                ${selectedPlatforms.includes(platform.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform.id)}
                onChange={() => handlePlatformToggle(platform.id)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-sm ${platform.color}`}>
                  {platform.icon}
                </span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{platform.name}</div>
                  <div className="text-xs text-gray-500">{platform.maxChars} chars</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Content Composition */}
      {currentStep === 'compose' && (
        <div className="mobile-card">
          <h2 className="mobile-heading-3 mb-4">Compose Content</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Post Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's happening in the music industry?"
                rows={6}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-base resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-sm ${
                    getCharacterCount() > getCharacterLimit() ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {getCharacterCount()}/{getCharacterLimit()} characters
                </span>
                <button
                  onClick={() => setCurrentStep('enhance')}
                  disabled={!content.trim()}
                  className="mobile-button mobile-button-primary px-4 py-2 text-sm"
                >
                  Next: Enhance <Sparkles className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Enhancement Step */}
      {currentStep === 'enhance' && (
        <div className="mobile-card">
          <h2 className="mobile-heading-3 mb-4">AI Enhancement</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Original Content</h3>
            <p className="text-gray-700">{content}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={enhanceWithAI}
              disabled={isEnhancing}
              className="mobile-button mobile-button-primary w-full"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enhancing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enhance with Chris's Voice
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep('review')}
              className="mobile-button mobile-button-secondary w-full"
            >
              Skip Enhancement
            </button>
          </div>
        </div>
      )}

      {/* Review Step */}
      {currentStep === 'review' && (
        <div className="mobile-card">
          <h2 className="mobile-heading-3 mb-4">Review Content</h2>

          <div className="space-y-4">
            {aiEnhancedContent && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">AI Enhanced Version</h3>
                  <button
                    onClick={() => copyToClipboard(aiEnhancedContent)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{aiEnhancedContent}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Original Version</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentStep('schedule')}
                className="mobile-button mobile-button-primary flex-1"
              >
                Use {aiEnhancedContent ? 'Enhanced' : 'Original'}
              </button>
              <button
                onClick={() => setCurrentStep('enhance')}
                className="mobile-button mobile-button-secondary flex-1"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Step */}
      {currentStep === 'schedule' && (
        <div className="space-y-4">
          <div className="mobile-card">
            <h2 className="mobile-heading-3 mb-4">Schedule Publishing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publishing Time
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setScheduledTime('')}
                    className={`mobile-button flex-1 ${
                      !scheduledTime ? 'mobile-button-primary' : 'mobile-button-secondary'
                    }`}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Now
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      now.setHours(now.getHours() + 1);
                      setScheduledTime(now.toISOString().slice(0, 16));
                    }}
                    className={`mobile-button flex-1 ${
                      scheduledTime ? 'mobile-button-primary' : 'mobile-button-secondary'
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </button>
                </div>
              </div>

              {scheduledTime && (
                <div>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mobile-card">
            <h3 className="font-semibold text-gray-900 mb-3">Final Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{aiEnhancedContent || content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPlatforms.map(platformId => {
                const platform = PLATFORMS.find(p => p.id === platformId);
                return platform ? (
                  <span key={platform.id} className={`px-2 py-1 rounded text-xs ${platform.color}`}>
                    {platform.icon} {platform.name}
                  </span>
                ) : null;
              })}
            </div>

            <button
              onClick={handleSchedulePost}
              disabled={isLoading || selectedPlatforms.length === 0}
              className="mobile-button mobile-button-primary w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {scheduledTime ? 'Scheduling...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {scheduledTime ? 'Schedule' : 'Publish'} to {selectedPlatforms.length} Platform
                  {selectedPlatforms.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
