'use client';

import { useState } from 'react';
import { FileText, Download, Mail, Upload, Grid3x3, Loader2 } from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';

interface GenerateReportButtonProps {
  campaignId: string;
  campaignName: string;
}

export function GenerateReportButton({ campaignId, campaignName }: GenerateReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connections } = useIntegrations();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: 'custom',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate report');
      }

      // Get the PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setReportUrl(url);

      // Auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${campaignName.toLowerCase().replace(/\s+/g, '-')}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err: any) {
      console.error('Report generation error:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const hasGoogleDrive = connections.google_sheets?.status === 'active';
  const hasGmail = connections.gmail?.status === 'active';
  const hasAirtable = connections.airtable?.status === 'active';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
      >
        <FileText className="w-4 h-4" />
        Generate Report
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-brutal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-b-4 border-black p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Generate Campaign Report</h2>
                  <p className="text-sm font-bold text-gray-700">{campaignName}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 font-black text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Report Preview - Simpler */}
              <div className="text-sm font-bold text-gray-600">
                Creates a professional PDF with executive summary, performance metrics, and activity timeline.
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-black">⚠</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-red-900 mb-1">Generation Failed</p>
                      <p className="text-xs font-bold text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Display */}
              {reportUrl && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-black text-xl">✓</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-green-900 mb-1">Report Generated!</p>
                      <p className="text-xs font-bold text-green-700 mb-3">
                        Your PDF has been downloaded automatically
                      </p>
                      <a
                        href={reportUrl}
                        download={`${campaignName.toLowerCase().replace(/\s+/g, '-')}-report.pdf`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-black hover:bg-green-700 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download Again
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-200 transition-colors"
                  disabled={isGenerating}
                >
                  {reportUrl ? 'Close' : 'Cancel'}
                </button>
                {!reportUrl && (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
