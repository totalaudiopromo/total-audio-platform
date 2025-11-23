'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '../../components/shared';

interface ShowcaseExportButtonsProps {
  showcaseId: string;
}

export function ShowcaseExportButtons({ showcaseId }: ShowcaseExportButtonsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'markdown' | 'html' | 'pdf-spec') => {
    setExporting(format);
    try {
      const res = await fetch(`/api/anr/showcases/${showcaseId}/export?format=${format}`);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `showcase-${showcaseId}.${format === 'pdf-spec' ? 'json' : format === 'markdown' ? 'md' : 'html'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export showcase');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export showcase');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Export:</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('markdown')}
        disabled={exporting !== null}
      >
        {exporting === 'markdown' ? <LoadingSpinner size="sm" /> : 'Markdown'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('html')}
        disabled={exporting !== null}
      >
        {exporting === 'html' ? <LoadingSpinner size="sm" /> : 'HTML'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf-spec')}
        disabled={exporting !== null}
      >
        {exporting === 'pdf-spec' ? <LoadingSpinner size="sm" /> : 'PDF Spec'}
      </Button>
    </div>
  );
}
