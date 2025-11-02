'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface FeedbackSummary {
  app: string;
  total_feedback: number;
  avg_rating: number;
  positive_feedback: number;
  negative_feedback: number;
  trend: 'up' | 'down' | 'stable';
}

interface RecentFeedback {
  id: string;
  user_id: string;
  app: string;
  agent_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [summary, setSummary] = useState<FeedbackSummary[]>([]);
  const [recent, setRecent] = useState<RecentFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced with Phase 9B feedback_events queries
    const mockSummary: FeedbackSummary[] = [
      {
        app: 'audio-intel',
        total_feedback: 247,
        avg_rating: 4.6,
        positive_feedback: 218,
        negative_feedback: 12,
        trend: 'up',
      },
      {
        app: 'pitch-generator',
        total_feedback: 156,
        avg_rating: 4.4,
        positive_feedback: 132,
        negative_feedback: 8,
        trend: 'stable',
      },
      {
        app: 'tracker',
        total_feedback: 89,
        avg_rating: 4.2,
        positive_feedback: 71,
        negative_feedback: 6,
        trend: 'up',
      },
    ];

    const mockRecent: RecentFeedback[] = [
      {
        id: '1',
        user_id: 'user_123',
        app: 'audio-intel',
        agent_id: 'IntelAgent',
        rating: 5,
        comment: 'Absolutely brilliant! Saved me hours of research. BBC Radio 6 contact was spot-on.',
        created_at: '2 hours ago',
      },
      {
        id: '2',
        user_id: 'user_456',
        app: 'pitch-generator',
        agent_id: 'PitchAgent',
        rating: 4,
        comment: 'Great pitches but would love more genre-specific templates.',
        created_at: '5 hours ago',
      },
      {
        id: '3',
        user_id: 'user_789',
        app: 'audio-intel',
        agent_id: null,
        rating: 5,
        comment: 'The mobile experience is perfect. Easy to use on the go.',
        created_at: '8 hours ago',
      },
      {
        id: '4',
        user_id: 'user_321',
        app: 'tracker',
        agent_id: 'TrackerAgent',
        rating: 3,
        comment: 'Good tracking but could use better filtering options.',
        created_at: '12 hours ago',
      },
      {
        id: '5',
        user_id: 'user_654',
        app: 'audio-intel',
        agent_id: 'IntelAgent',
        rating: 5,
        comment: 'Enrichment quality is unmatched. Worth every penny of the PRO tier.',
        created_at: '1 day ago',
      },
    ];

    setTimeout(() => {
      setSummary(mockSummary);
      setRecent(mockRecent);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">
          Loading feedback data...
        </div>
      </div>
    );
  }

  const totalFeedback = summary.reduce((sum, s) => sum + s.total_feedback, 0);
  const avgRating = summary.reduce((sum, s) => sum + s.avg_rating, 0) / summary.length;
  const totalPositive = summary.reduce((sum, s) => sum + s.positive_feedback, 0);
  const totalNegative = summary.reduce((sum, s) => sum + s.negative_feedback, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Feedback Intelligence</h2>
        </div>
        <p className="text-sm text-gray-600">User sentiment analysis from Phase 9B feedback layer</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Total Feedback</div>
          <div className="text-3xl font-black text-gray-900">{totalFeedback}</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Avg Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-black text-yellow-600">{avgRating.toFixed(1)}</div>
            <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Positive</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-black text-green-600">{totalPositive}</div>
            <ThumbsUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Negative</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-black text-red-600">{totalNegative}</div>
            <ThumbsDown className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* App-Specific Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {summary.map(app => (
          <div
            key={app.app}
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 capitalize">
                  {app.app.replace('-', ' ')}
                </h3>
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {app.total_feedback} responses
                </span>
              </div>
              {app.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
              {app.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
              {app.trend === 'stable' && <div className="h-5 w-5" />}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                <span className="text-2xl font-black text-gray-900">{app.avg_rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${(app.avg_rating / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-gray-200">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Positive</div>
                <div className="text-lg font-bold text-green-600">{app.positive_feedback}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Negative</div>
                <div className="text-lg font-bold text-red-600">{app.negative_feedback}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Feedback */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {recent.map(feedback => (
            <div
              key={feedback.id}
              className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    {feedback.app.replace('-', ' ')}
                  </span>
                  {feedback.agent_id && (
                    <span className="text-xs text-gray-400">→ {feedback.agent_id}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < feedback.rating
                          ? 'text-yellow-600 fill-yellow-600'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{feedback.created_at}</span>
                {feedback.rating >= 4 && (
                  <span className="text-xs font-bold text-green-600 uppercase">Positive</span>
                )}
                {feedback.rating <= 2 && (
                  <span className="text-xs font-bold text-red-600 uppercase">Needs Attention</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 9B Notice */}
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Phase 9B Feedback System Active</h4>
            <p className="text-sm text-blue-800">
              Feedback data from <code className="font-mono">feedback_events</code> table. Weekly digest automation coming via Telegram notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
