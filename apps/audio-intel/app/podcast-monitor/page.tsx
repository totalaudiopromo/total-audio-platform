'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Podcast, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface PodcastEpisode {
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  aiInsights: string[];
  techFeatures: string[];
  musicIndustryRelevance: 'High' | 'Medium' | 'Low';
  actionableTips: string[];
  newsletterContent: string;
}

interface PodcastResult {
  success: boolean;
  podcast: {
    title: string;
    description: string;
    totalEpisodes: number;
    lastChecked: string;
  };
  episodes: {
    all: PodcastEpisode[];
    highRelevance: PodcastEpisode[];
    mediumRelevance: PodcastEpisode[];
  };
  newsletterContent: string;
  stats: {
    totalEpisodes: number;
    highRelevance: number;
    mediumRelevance: number;
    lowRelevance: number;
  };
}

export default function PodcastMonitorPage() {
  const [feedUrl, setFeedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PodcastResult | null>(null);
  const [error, setError] = useState('');

  const handleMonitor = async () => {
    if (!feedUrl.trim()) {
      setError('Please enter a podcast feed URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/podcast-monitor?feedUrl=${encodeURIComponent(feedUrl)}`);
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to monitor podcast');
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎙️ Podcast Monitor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor Apple Podcasts feeds for AI and technology insights relevant to the music
            industry. Discover cutting-edge tools and features that podcasters are testing first.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Podcast className="h-5 w-5" />
              Monitor Podcast Feed
            </CardTitle>
            <CardDescription>
              Enter an Apple Podcasts RSS feed URL to analyze episodes for AI and tech insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://feeds.apple.com/podcasts/your-podcast-feed"
                value={feedUrl}
                onChange={e => setFeedUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleMonitor} disabled={isLoading} className="px-8">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Monitoring...
                  </>
                ) : (
                  'Monitor Feed'
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            {/* Podcast Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {result.podcast.title}
                </CardTitle>
                <CardDescription>{result.podcast.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.stats.totalEpisodes}
                    </div>
                    <div className="text-sm text-gray-600">Total Episodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.stats.highRelevance}
                    </div>
                    <div className="text-sm text-gray-600">High Relevance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {result.stats.mediumRelevance}
                    </div>
                    <div className="text-sm text-gray-600">Medium Relevance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Content */}
            {result.newsletterContent && (
              <Card>
                <CardHeader>
                  <CardTitle>📧 Newsletter Content</CardTitle>
                  <CardDescription>Ready-to-use content for your newsletter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {result.newsletterContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* High Relevance Episodes */}
            {result.episodes.highRelevance.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">🔥 High-Impact Episodes</CardTitle>
                  <CardDescription>
                    Episodes with significant AI/tech insights for music industry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.episodes.highRelevance.map((episode, index) => (
                      <div
                        key={index}
                        className="border border-green-200 rounded-lg p-4 bg-green-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-green-900">{episode.title}</h3>
                          <Badge className={getRelevanceColor(episode.musicIndustryRelevance)}>
                            {episode.musicIndustryRelevance}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{episode.description}</p>

                        {episode.aiInsights.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              AI Insights:
                            </h4>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                              {episode.aiInsights.map((insight, i) => (
                                <li key={i}>{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {episode.techFeatures.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              Tech Features:
                            </h4>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                              {episode.techFeatures.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {episode.actionableTips.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              Actionable Tips:
                            </h4>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                              {episode.actionableTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Published: {formatDate(episode.publishedAt)}</span>
                          <span>Duration: {episode.duration}</span>
                        </div>

                        {episode.url && (
                          <div className="mt-3">
                            <a
                              href={episode.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Listen to Episode
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medium Relevance Episodes */}
            {result.episodes.mediumRelevance.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-700">📱 Medium-Impact Episodes</CardTitle>
                  <CardDescription>Episodes with some relevant AI/tech content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.episodes.mediumRelevance.slice(0, 5).map((episode, index) => (
                      <div
                        key={index}
                        className="border border-yellow-200 rounded-lg p-3 bg-yellow-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-yellow-900">{episode.title}</h3>
                          <Badge className={getRelevanceColor(episode.musicIndustryRelevance)}>
                            {episode.musicIndustryRelevance}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {episode.description.substring(0, 200)}...
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Published: {formatDate(episode.publishedAt)}</span>
                          <span>Duration: {episode.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Example Feed URLs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 Example Feed URLs</CardTitle>
            <CardDescription>Try these popular tech and AI podcasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">AI & Tech Podcasts:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• The AI Podcast (NVIDIA)</li>
                  <li>• Lex Fridman Podcast</li>
                  <li>• The Daily (AI episodes)</li>
                  <li>• Hard Fork (NYT)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Music Industry Podcasts:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Music Business Worldwide</li>
                  <li>• The New Music Industry</li>
                  <li>• Indie Music Marketing</li>
                  <li>• Music Industry How To</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
