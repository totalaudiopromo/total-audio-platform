import React, { useState, useEffect, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { fetchRecentTypeformSubmissions } from '@/lib/api/typeform';
import { TypeformSubmission } from '@/lib/types';
import { EmptyState, ErrorState, DataFreshness, LoadingState } from '@/components/ui';

export default function TypeformIntakePanel() {
  const [submissions, setSubmissions] = useState<TypeformSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentTypeformSubmissions();
      setSubmissions(data.slice(0, 3)); // Show latest 3
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Typeform] Failed to load submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCompletenessColour = (score: number) => {
    if (score >= 85) return 'bg-tap-good';
    if (score >= 70) return 'bg-tap-accent';
    return 'bg-tap-risk';
  };

  const formatSubmittedDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  const renderContent = () => {
    if (loading && submissions.length === 0) {
      return <LoadingState message="Loading submissions..." size="sm" />;
    }

    if (error && submissions.length === 0) {
      return <ErrorState variant="default" onRetry={loadData} />;
    }

    if (submissions.length === 0) {
      return (
        <EmptyState
          variant="submissions"
          description="No artist intake submissions yet. Share your Typeform link to start receiving submissions."
        />
      );
    }

    return (
      <div className="space-y-4">
        {submissions.map(submission => (
          <div
            key={submission.id}
            className="pb-4 border-b border-tap-line last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1 mr-2">
                <p className="font-medium text-tap-text truncate">{submission.artistName}</p>
                <p className="text-xs text-tap-muted font-mono mt-0.5">
                  {formatSubmittedDate(submission.submittedAt)}
                </p>
              </div>
              <span className="text-xs font-mono text-tap-text leading-none flex-shrink-0">
                {submission.completeness}%
              </span>
            </div>

            {/* Completeness Bar */}
            <div className="mb-2">
              <div className="w-full h-2 bg-tap-bg rounded-full border border-tap-line overflow-hidden">
                <div
                  className={
                    'h-full transition-all duration-300 ease-out ' +
                    getCompletenessColour(submission.completeness)
                  }
                  style={{ width: Math.min(submission.completeness, 100) + '%' }}
                />
              </div>
            </div>

            {/* Missing Fields */}
            {submission.missingFields.length > 0 && (
              <p className="text-xs text-tap-muted line-clamp-2">
                <span className="font-medium">Missing:</span> {submission.missingFields.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-tap-text" />
          <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
            Recent Artist Intake
          </h2>
        </div>
        <DataFreshness
          lastUpdated={lastUpdated}
          isLoading={loading}
          onRefresh={loadData}
          showRefreshButton={!loading}
        />
      </div>

      {renderContent()}

      <div className="mt-4 pt-3 border-t border-tap-line text-center">
        <a
          href="/dashboard/intake"
          className="inline-flex items-center justify-center text-sm text-tap-muted hover:text-tap-text transition-colors min-h-[44px] px-4"
        >
          View all intake →
        </a>
      </div>
    </div>
  );
}
