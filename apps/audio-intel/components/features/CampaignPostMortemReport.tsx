'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, FileText, Download, TrendingUp, Lightbulb, Target } from 'lucide-react';

interface CampaignPostMortem {
  id: string;
  campaign_name: string;
  artist_name: string | null;
  date_range_start: string | null;
  date_range_end: string | null;
  executive_summary: string;
  key_wins: string[];
  key_learnings: string[];
  improvement_recommendations: string[];
  total_contacts_reached: number | null;
  response_rate: number | null;
  success_rate: number | null;
  avg_response_time_hours: number | null;
  performance_by_channel: any;
  performance_by_genre: any;
  top_performing_pitches: any;
  underperforming_areas: any;
  created_at: string;
  generation_model: string | null;
}

interface CampaignPostMortemReportProps {
  campaignId: string;
  campaignName?: string;
  campaignData?: any;
  className?: string;
}

export function CampaignPostMortemReport({
  campaignId,
  campaignName,
  campaignData,
  className = '',
}: CampaignPostMortemReportProps) {
  const [postMortem, setPostMortem] = useState<CampaignPostMortem | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPostMortem();
  }, [campaignId]);

  async function fetchPostMortem() {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}/post-mortem`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch post-mortem');
      }

      setPostMortem(data.postMortem);
    } catch (err: any) {
      console.error('Error fetching post-mortem:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generatePostMortem() {
    if (!campaignData || !campaignName) {
      setError('Campaign data is required to generate post-mortem');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch(`/api/campaigns/${campaignId}/post-mortem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          ...campaignData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate post-mortem');
      }

      setPostMortem(data.postMortem);
    } catch (err: any) {
      console.error('Error generating post-mortem:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function exportPostMortem() {
    if (!postMortem) return;

    const content = formatPostMortemAsText(postMortem);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${postMortem.campaign_name.replace(/\s+/g, '_')}_PostMortem.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatPostMortemAsText(pm: CampaignPostMortem): string {
    return `
CAMPAIGN POST-MORTEM REPORT
============================

Campaign: ${pm.campaign_name}
${pm.artist_name ? `Artist: ${pm.artist_name}` : ''}
${pm.date_range_start && pm.date_range_end ? `Period: ${pm.date_range_start} to ${pm.date_range_end}` : ''}
Generated: ${new Date(pm.created_at).toLocaleDateString()}

EXECUTIVE SUMMARY
-----------------
${pm.executive_summary}

KEY METRICS
-----------
${pm.total_contacts_reached ? `Contacts Reached: ${pm.total_contacts_reached}` : ''}
${pm.response_rate ? `Response Rate: ${pm.response_rate}%` : ''}
${pm.success_rate ? `Success Rate: ${pm.success_rate}%` : ''}
${pm.avg_response_time_hours ? `Avg Response Time: ${pm.avg_response_time_hours} hours` : ''}

KEY WINS
--------
${pm.key_wins.map((win, idx) => `${idx + 1}. ${win}`).join('\n')}

KEY LEARNINGS
-------------
${pm.key_learnings.map((learning, idx) => `${idx + 1}. ${learning}`).join('\n')}

IMPROVEMENT RECOMMENDATIONS
---------------------------
${pm.improvement_recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

${pm.generation_model ? `\nGenerated using: ${pm.generation_model}` : ''}
`.trim();
  }

  if (loading) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading post-mortem...</p>
        </div>
      </Card>
    );
  }

  if (!postMortem && !error) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold">No Post-Mortem Yet</h3>
          <p className="mb-4 text-sm text-gray-500">
            Generate an AI-powered campaign analysis to identify wins, learnings, and improvements.
          </p>
          <Button onClick={generatePostMortem} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Analysis...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Post-Mortem
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="rounded bg-red-50 p-4 text-red-600">{error}</div>
      </Card>
    );
  }

  if (!postMortem) return null;

  return (
    <div className={className}>
      <Card className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{postMortem.campaign_name}</h2>
            {postMortem.artist_name && (
              <p className="text-sm text-gray-500">Artist: {postMortem.artist_name}</p>
            )}
            {postMortem.date_range_start && postMortem.date_range_end && (
              <p className="text-xs text-gray-400">
                {new Date(postMortem.date_range_start).toLocaleDateString()} -{' '}
                {new Date(postMortem.date_range_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={exportPostMortem}>
            <Download className="mr-2 h-3 w-3" />
            Export
          </Button>
        </div>

        {/* Key Metrics */}
        {(postMortem.total_contacts_reached ||
          postMortem.response_rate ||
          postMortem.success_rate) && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {postMortem.total_contacts_reached && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-sm text-blue-600">Contacts Reached</div>
                <div className="text-2xl font-bold text-blue-900">
                  {postMortem.total_contacts_reached}
                </div>
              </div>
            )}
            {postMortem.response_rate !== null && (
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-sm text-green-600">Response Rate</div>
                <div className="text-2xl font-bold text-green-900">{postMortem.response_rate}%</div>
              </div>
            )}
            {postMortem.success_rate !== null && (
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="text-sm text-purple-600">Success Rate</div>
                <div className="text-2xl font-bold text-purple-900">{postMortem.success_rate}%</div>
              </div>
            )}
          </div>
        )}

        {/* Executive Summary */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Executive Summary</h3>
          <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
            {postMortem.executive_summary}
          </div>
        </div>

        {/* Key Wins */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center text-lg font-semibold">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Key Wins
          </h3>
          <ul className="space-y-2">
            {postMortem.key_wins.map((win, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 font-semibold text-green-600">✓</span>
                <span className="text-gray-700">{win}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Learnings */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center text-lg font-semibold">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
            Key Learnings
          </h3>
          <ul className="space-y-2">
            {postMortem.key_learnings.map((learning, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 font-semibold text-yellow-600">💡</span>
                <span className="text-gray-700">{learning}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Recommendations */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center text-lg font-semibold">
            <Target className="mr-2 h-5 w-5 text-blue-600" />
            Improvement Recommendations
          </h3>
          <ul className="space-y-2">
            {postMortem.improvement_recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 font-semibold text-blue-600">→</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-xs text-gray-400">
          Generated on {new Date(postMortem.created_at).toLocaleDateString()}
          {postMortem.generation_model && ` using ${postMortem.generation_model}`}
        </div>
      </Card>
    </div>
  );
}
