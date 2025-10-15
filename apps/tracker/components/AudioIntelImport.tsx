'use client';

import { useState } from 'react';
import { Upload, ExternalLink } from 'lucide-react';

export function AudioIntelImport() {
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    // Redirect to Audio Intel with return URL
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://intel.totalaudiopromo.com?return=${returnUrl}&action=export`;
  };

  return (
    <div className="rounded-xl border-2 border-black bg-gradient-to-br from-amber-50 to-indigo-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">Import from Audio Intel</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Use your enriched contacts from Audio Intel to quickly add campaign targets
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:bg-amber-700 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4" />
            {importing ? 'Opening Audio Intel...' : 'Import Contacts'}
          </button>
        </div>
      </div>
    </div>
  );
}
