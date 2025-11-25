import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { fetchRecentTypeformSubmissions } from '@/lib/api/typeform';
import { TypeformSubmission } from '@/lib/types';

export default function TypeformIntakePanel() {
  const [submissions, setSubmissions] = useState<TypeformSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchRecentTypeformSubmissions();
        if (active) setSubmissions(data.slice(0, 3)); // Show latest 3
      } catch (error) {
        console.error('[TAP API] Failed to load Typeform submissions:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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

  if (loading) {
    return (
      <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-tap-text" />
          <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
            Recent Artist Intake
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-tap-line border-t-tap-text rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-tap-text" />
        <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
          Recent Artist Intake
        </h2>
      </div>

      <div className="space-y-4">
        {submissions.map(submission => (
          <div
            key={submission.id}
            className="pb-4 border-b border-tap-line last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-tap-text">{submission.artistName}</p>
                <p className="text-xs text-tap-muted font-mono mt-0.5">
                  {formatSubmittedDate(submission.submittedAt)}
                </p>
              </div>
              <span className="text-xs font-mono text-tap-text leading-none">
                {submission.completeness}%
              </span>
            </div>

            {/* Completeness Bar */}
            <div className="mb-2">
              <div className="w-full h-2 bg-tap-bg rounded-full border border-tap-line overflow-hidden">
                <div
                  className={`h-full ${getCompletenessColour(submission.completeness)} transition-all duration-300`}
                  style={{ width: `${Math.min(submission.completeness, 100)}%` }}
                />
              </div>
            </div>

            {/* Missing Fields */}
            {submission.missingFields.length > 0 && (
              <p className="text-xs text-tap-muted">
                <span className="font-medium">Missing:</span> {submission.missingFields.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-tap-line text-center">
        <a
          href="/dashboard/intake"
          className="text-sm text-tap-muted hover:text-tap-text transition-colors"
        >
          View all intake →
        </a>
      </div>
    </div>
  );
}
