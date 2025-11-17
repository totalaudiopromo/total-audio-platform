'use client';

import { Download, FileDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CoveragebookExportButtonProps {
  campaignIds: string[];
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function CoveragebookExportButton({
  campaignIds,
  variant = 'default',
  size = 'md',
}: CoveragebookExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    if (campaignIds.length === 0) {
      setError('No campaigns selected');
      return;
    }

    setExporting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/campaigns/coveragebook-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Get coverage count from headers
      const coverageCount = response.headers.get('X-Coverage-Items-Count');
      const campaignsCount = response.headers.get('X-Campaigns-Count');

      // Download CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coveragebook-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      setSuccess(true);
      console.log(
        `Exported ${coverageCount} coverage items from ${campaignsCount} campaigns`
      );

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Export failed:', error);
      setError(error.message || 'Export failed. Please try again.');

      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setExporting(false);
    }
  }

  // Size variants
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  // Icon size variants
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Variant styles
  const variantClasses = {
    default:
      'rounded-xl border-4 border-black bg-brand-teal text-white font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
    primary: 'cta-button disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'rounded-xl border-2 border-brand-teal bg-white text-brand-teal font-black hover:bg-brand-teal/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        disabled={exporting || campaignIds.length === 0}
        className={`${variantClasses[variant]} ${sizeClasses[size]} flex items-center gap-2`}
      >
        {success ? (
          <>
            <CheckCircle2 className={iconSizes[size]} />
            <span>Exported!</span>
          </>
        ) : exporting ? (
          <>
            <FileDown className={`${iconSizes[size]} animate-bounce`} />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className={iconSizes[size]} />
            <span>Export for Coveragebook</span>
          </>
        )}
      </button>

      {/* Success message */}
      {success && (
        <div className="rounded-lg bg-success/10 border border-success px-3 py-2 text-xs text-success flex items-center gap-2">
          <CheckCircle2 className="h-3 w-3" />
          <span>
            CSV downloaded successfully. Ready to import into Coveragebook.
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-error/10 border border-error px-3 py-2 text-xs text-error flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Help text */}
      {campaignIds.length === 0 && (
        <p className="text-xs text-gray-500">
          Select campaigns to export coverage data
        </p>
      )}
    </div>
  );
}

/**
 * Coveragebook Export Instructions Component
 *
 * Shows users how to import the CSV into Coveragebook
 */
export function CoveragebookExportInstructions() {
  return (
    <div className="rounded-xl border-2 border-brand-teal/30 bg-brand-teal/5 p-4">
      <h4 className="text-sm font-black text-brand-teal mb-2 flex items-center gap-2">
        <FileDown className="h-4 w-4" />
        How to Import into Coveragebook
      </h4>
      <ol className="text-xs text-gray-900/70 space-y-1 list-decimal list-inside">
        <li>Click "Export for Coveragebook" to download CSV</li>
        <li>Log into your Coveragebook account</li>
        <li>Open the campaign report you want to update</li>
        <li>Manually add coverage items from the CSV data</li>
        <li>Coveragebook will automatically fetch metrics for URLs</li>
      </ol>
      <p className="mt-3 text-xs text-gray-900/50">
        <strong>Note:</strong> Coveragebook doesn't support automated CSV
        import. This export saves you hours by organizing your data in
        Coveragebook's format for manual entry.
      </p>
    </div>
  );
}
