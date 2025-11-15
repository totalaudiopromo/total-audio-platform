'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@total-audio/ui/components/card';
import { Badge } from '@total-audio/ui/components/badge';
import { Button } from '@total-audio/ui/components/button';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface EnrichmentAuditLog {
  id: string;
  contact_email: string;
  contact_name: string | null;
  enrichment_source: 'perplexity' | 'claude' | 'manual' | 'cache';
  enrichment_method: string | null;
  response_time_ms: number | null;
  api_tokens_used: number | null;
  api_cost_cents: number | null;
  confidence_score: number | null;
  data_quality_score: number | null;
  fields_enriched: string[] | null;
  status: 'success' | 'partial' | 'failed' | 'cached' | 'rate-limited';
  error_message: string | null;
  retry_count: number;
  changes_detected: string[] | null;
  verification_score: number | null;
  sources_used: string[] | null;
  created_at: string;
}

interface EnrichmentAuditTrailProps {
  contactEmail?: string;
  contactId?: string;
  limit?: number;
  className?: string;
}

export function EnrichmentAuditTrail({
  contactEmail,
  contactId,
  limit = 20,
  className = '',
}: EnrichmentAuditTrailProps) {
  const [logs, setLogs] = useState<EnrichmentAuditLog[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, [contactEmail, contactId, limit]);

  async function fetchAuditLogs() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (contactEmail) params.append('contactEmail', contactEmail);
      if (contactId) params.append('contactId', contactId);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/audit/enrichment?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch audit logs');
      }

      setLogs(data.auditLogs || []);
      setSummary(data.summary);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleExpanded(id: string) {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  }

  function getStatusBadge(status: EnrichmentAuditLog['status']) {
    const variants: Record<typeof status, any> = {
      success: 'default',
      cached: 'secondary',
      partial: 'outline',
      failed: 'destructive',
      'rate-limited': 'outline',
    };

    const colors: Record<typeof status, string> = {
      success: '🟢',
      cached: '⚡',
      partial: '🟡',
      failed: '🔴',
      'rate-limited': '⏸️',
    };

    return (
      <Badge variant={variants[status]}>
        <span className="mr-1">{colors[status]}</span>
        {status}
      </Badge>
    );
  }

  function getSourceBadge(source: EnrichmentAuditLog['enrichment_source']) {
    const colors: Record<typeof source, string> = {
      perplexity: 'bg-purple-100 text-purple-700',
      claude: 'bg-orange-100 text-orange-700',
      manual: 'bg-blue-100 text-blue-700',
      cache: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors[source]}`}>
        {source}
      </span>
    );
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span className="text-sm text-gray-500">Loading audit trail...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Summary */}
      {summary && (
        <Card className="mb-4 p-4">
          <h3 className="mb-3 text-sm font-semibold">Enrichment Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-gray-500">Total</div>
              <div className="text-lg font-semibold">{summary.totalEnrichments}</div>
            </div>
            <div>
              <div className="text-gray-500">Success Rate</div>
              <div className="text-lg font-semibold text-green-600">{summary.successRate}%</div>
            </div>
            <div>
              <div className="text-gray-500">Avg Response</div>
              <div className="text-lg font-semibold">{summary.avgResponseTimeMs}ms</div>
            </div>
            <div>
              <div className="text-gray-500">Total Cost</div>
              <div className="text-lg font-semibold">£{summary.totalCostPounds}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Logs */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Audit Trail</h3>

        {logs.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No audit logs found</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-lg border p-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">
                        {log.contact_name || log.contact_email}
                      </span>
                      {getStatusBadge(log.status)}
                      {getSourceBadge(log.enrichment_source)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                      {log.response_time_ms && ` • ${log.response_time_ms}ms`}
                      {log.api_tokens_used && ` • ${log.api_tokens_used} tokens`}
                      {log.api_cost_cents && ` • £${(log.api_cost_cents / 100).toFixed(4)}`}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(log.id)}
                  >
                    {expandedIds.has(log.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Expanded Details */}
                {expandedIds.has(log.id) && (
                  <div className="mt-3 space-y-2 border-t pt-3 text-xs">
                    {log.confidence_score !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence Score:</span>
                        <span className="font-medium">{log.confidence_score}/100</span>
                      </div>
                    )}

                    {log.data_quality_score !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Quality:</span>
                        <span className="font-medium">{log.data_quality_score}/100</span>
                      </div>
                    )}

                    {log.fields_enriched && log.fields_enriched.length > 0 && (
                      <div>
                        <div className="mb-1 text-gray-600">Fields Enriched:</div>
                        <div className="flex flex-wrap gap-1">
                          {log.fields_enriched.map((field) => (
                            <span
                              key={field}
                              className="rounded bg-blue-50 px-2 py-0.5 text-blue-700"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.changes_detected && log.changes_detected.length > 0 && (
                      <div>
                        <div className="mb-1 text-gray-600">Changes Detected:</div>
                        <div className="flex flex-wrap gap-1">
                          {log.changes_detected.map((change) => (
                            <span
                              key={change}
                              className="rounded bg-green-50 px-2 py-0.5 text-green-700"
                            >
                              {change}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.sources_used && log.sources_used.length > 0 && (
                      <div>
                        <div className="mb-1 text-gray-600">Sources:</div>
                        <div className="text-gray-700">
                          {log.sources_used.join(', ')}
                        </div>
                      </div>
                    )}

                    {log.error_message && (
                      <div className="rounded bg-red-50 p-2 text-red-700">
                        <strong>Error:</strong> {log.error_message}
                      </div>
                    )}

                    {log.retry_count > 0 && (
                      <div className="text-gray-600">Retries: {log.retry_count}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
