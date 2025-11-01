import React, { useState } from 'react';
import { exportToCsv } from '@/utils/exportToCsv';
// import { exportToExcel } from '@/utils/exportToExcel';

interface ExportButtonsProps {
  enriched: Array<{ name: string; email: string; contactIntelligence: string }>;
  onExport?: (format: string, enrichedCount: number) => void;
}

export default function ExportButtons({ enriched, onExport }: ExportButtonsProps) {
  const [error, setError] = useState<string | null>(null);

  // Minimal analytics error tracker
  function trackError(errorType: string, details: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error', { errorType, details });
    }
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'error',
        data: { errorType, details, timestamp: new Date().toISOString() },
      }),
    });
  }

  const handleExportCsv = () => {
    try {
      const csv = exportToCsv(enriched);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audio-intel-enriched-contacts.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onExport) onExport('csv', enriched.length);
      setError(null);
    } catch (err: any) {
      setError('Export failed, please try again');
      trackError('export_error', err?.message || 'CSV export failed');
    }
  };

  const handleExportExcel = () => {
    try {
      window.open('/api/download?format=excel', '_blank');
      if (onExport) onExport('excel', enriched.length);
      setError(null);
    } catch (err: any) {
      setError('Export failed, please try again');
      trackError('export_error', err?.message || 'Excel export failed');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-6 w-full max-w-xs">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-semibold text-center border border-red-300 mb-2">
          {error}
        </div>
      )}
      <div className="flex gap-4">
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow w-full"
        >
          Export as CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold shadow w-full"
        >
          Export as Excel
        </button>
      </div>
    </div>
  );
}
