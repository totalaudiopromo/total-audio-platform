'use client';

import React, { useState, useEffect } from 'react';
import { fetchRecentTypeformSubmissions } from '@/lib/api/typeform';
import { TypeformSubmission } from '@/lib/types';
import { FileText, AlertCircle } from 'lucide-react';
import Loading from '@/components/Loading';

const IntakePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<TypeformSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyNeedsFollowup, setShowOnlyNeedsFollowup] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchRecentTypeformSubmissions();
        if (active) setSubmissions(data);
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

  if (loading) {
    return <Loading message="Loading artist intake submissions…" />;
  }

  const filteredSubmissions = showOnlyNeedsFollowup
    ? submissions.filter(sub => sub.completeness < 80)
    : submissions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  const getCompletenessColour = (completeness: number) => {
    if (completeness >= 85) return 'bg-tap-good';
    if (completeness >= 70) return 'bg-tap-accent';
    return 'bg-tap-risk';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-tap-line">
        <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text">
          Artist Intake
        </h1>
        <p className="text-sm text-tap-muted mt-2">Typeform submissions and onboarding status</p>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyNeedsFollowup(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showOnlyNeedsFollowup
                ? 'bg-tap-text text-white'
                : 'bg-tap-panel text-tap-muted border border-tap-line hover:text-tap-text'
            }`}
          >
            All submissions
          </button>
          <button
            onClick={() => setShowOnlyNeedsFollowup(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showOnlyNeedsFollowup
                ? 'bg-tap-text text-white'
                : 'bg-tap-panel text-tap-muted border border-tap-line hover:text-tap-text'
            }`}
          >
            Needs follow-up only
          </button>
        </div>
        <p className="text-sm text-tap-muted font-mono">
          Showing {filteredSubmissions.length} submission
          {filteredSubmissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <div className="bg-tap-panel rounded-lg border border-tap-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tap-bg text-tap-muted font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Artist Name</th>
                <th className="text-left px-6 py-3 font-medium">Submitted</th>
                <th className="text-left px-6 py-3 font-medium">Completeness</th>
                <th className="text-left px-6 py-3 font-medium">Missing Fields</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tap-line">
              {filteredSubmissions.map(submission => (
                <tr key={submission.id} className="hover:bg-tap-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-tap-muted" />
                      <span className="text-tap-text font-medium">{submission.artistName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-tap-muted">
                      {formatDate(submission.submittedAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[200px]">
                        <div className="h-2 bg-tap-bg rounded-full overflow-hidden border border-tap-line">
                          <div
                            className={`h-full ${getCompletenessColour(submission.completeness)} transition-all duration-300`}
                            style={{ width: `${submission.completeness}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-mono text-tap-text min-w-[3rem] text-right leading-none">
                        {submission.completeness}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {submission.missingFields.length === 0 ? (
                      <span className="text-sm text-tap-good flex items-center gap-1 font-medium">
                        <span className="text-lg leading-none">✓</span>
                        <span>Complete</span>
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {submission.missingFields.map((field, fieldIndex) => (
                          <span
                            key={fieldIndex}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-tap-risk/10 text-tap-risk border border-tap-risk/20 font-medium"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertCircle className="w-8 h-8 text-tap-muted mx-auto mb-3" />
            <p className="text-tap-muted">
              {showOnlyNeedsFollowup ? 'No submissions need follow-up' : 'No submissions found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntakePage;
