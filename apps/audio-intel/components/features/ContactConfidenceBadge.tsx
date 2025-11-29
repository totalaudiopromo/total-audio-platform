'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@total-audio/ui/components/badge';
import { Loader2 } from 'lucide-react';

interface ContactConfidence {
  id: string;
  overall_score: number;
  confidence_level: 'high' | 'medium' | 'low';
  email_validity_score: number;
  data_freshness_score: number;
  source_quality_score: number;
  enrichment_depth_score: number;
  verification_status_score: number;
  last_verified_at: string;
  requires_reverification: boolean;
  high_risk_contact: boolean;
}

interface ContactConfidenceBadgeProps {
  contactId: string;
  contactEmail?: string;
  className?: string;
  showDetails?: boolean;
}

export function ContactConfidenceBadge({
  contactId,
  contactEmail,
  className = '',
  showDetails = false,
}: ContactConfidenceBadgeProps) {
  const [confidence, setConfidence] = useState<ContactConfidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfidence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/contacts/confidence?contactId=${contactId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch confidence');
      }

      setConfidence(data.confidence);
    } catch (err: any) {
      console.error('Error fetching confidence:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchConfidence();
  }, [fetchConfidence]);

  if (loading) {
    return (
      <Badge variant="outline" className={className}>
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (error || !confidence) {
    return (
      <Badge variant="outline" className={className}>
        No confidence data
      </Badge>
    );
  }

  const { confidence_level, overall_score, requires_reverification, high_risk_contact } = confidence;

  // Traffic light colors
  const badgeVariant =
    confidence_level === 'high' ? 'default' : confidence_level === 'medium' ? 'secondary' : 'destructive';

  const scoreColor =
    confidence_level === 'high'
      ? 'text-green-600'
      : confidence_level === 'medium'
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className={className}>
      <Badge variant={badgeVariant} className="relative">
        {confidence_level === 'high' && '🟢'}
        {confidence_level === 'medium' && '🟡'}
        {confidence_level === 'low' && '🔴'}
        <span className="ml-1 capitalize">{confidence_level} Confidence</span>
        {requires_reverification && (
          <span className="ml-1 text-xs opacity-75">(Needs verification)</span>
        )}
      </Badge>

      {showDetails && (
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Overall Score:</span>
            <span className={`font-semibold ${scoreColor}`}>{overall_score}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>Email Validity: {confidence.email_validity_score}/100</div>
            <div>Data Freshness: {confidence.data_freshness_score}/100</div>
            <div>Source Quality: {confidence.source_quality_score}/100</div>
            <div>Enrichment Depth: {confidence.enrichment_depth_score}/100</div>
          </div>

          {high_risk_contact && (
            <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">
              ⚠️ High-risk contact - verify before use
            </div>
          )}

          <div className="text-xs text-gray-400">
            Last verified: {new Date(confidence.last_verified_at).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
