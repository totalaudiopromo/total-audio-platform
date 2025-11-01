'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckSquare,
  Square,
  Trash2,
  Download,
  Archive,
  X,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BulkActionsBarProps {
  selectedIds: string[];
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkComplete: () => Promise<void>;
}

export function BulkActionsBar({
  selectedIds,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
}: BulkActionsBarProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const selectedCount = selectedIds.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/campaigns/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignIds: selectedIds }),
      });

      if (!response.ok) throw new Error('Failed to delete campaigns');

      // Track in GTM
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'bulk_campaigns_deleted',
          campaign_count: selectedCount,
        });
      }

      router.refresh();
      onDeselectAll();
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete campaigns. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/campaigns/bulk-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignIds: selectedIds }),
      });

      if (!response.ok) throw new Error('Failed to export campaigns');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaigns-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      // Track in GTM
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'bulk_campaigns_exported',
          campaign_count: selectedCount,
        });
      }

      onDeselectAll();
    } catch (error) {
      console.error('Bulk export error:', error);
      alert('Failed to export campaigns. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onBulkComplete();

      // Track in GTM
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'bulk_campaigns_completed',
          campaign_count: selectedCount,
        });
      }

      router.refresh();
      onDeselectAll();
    } catch (error) {
      console.error('Bulk update error:', error);
      alert('Failed to update campaigns. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-teal-600 to-teal-600 rounded-2xl border-4 border-black shadow-brutal-lg p-4 min-w-[320px] md:min-w-[600px]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors border-2 border-white/40"
              aria-label={allSelected ? 'Deselect all' : 'Select all'}
            >
              {allSelected ? (
                <CheckSquare className="h-5 w-5 text-white" />
              ) : (
                <Square className="h-5 w-5 text-white" />
              )}
            </button>
            <div className="text-white">
              <p className="text-sm font-black">
                {selectedCount} campaign{selectedCount !== 1 ? 's' : ''}{' '}
                selected
              </p>
              <p className="text-xs font-bold opacity-90">
                {allSelected
                  ? 'All campaigns selected'
                  : `${totalCount - selectedCount} remaining`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mark Complete */}
            <button
              onClick={handleBulkStatusUpdate}
              disabled={isUpdating || isDeleting || isExporting}
              className="px-4 py-2 bg-white text-teal-700 rounded-xl font-black text-sm hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isUpdating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Complete</span>
            </button>

            {/* Export */}
            <button
              onClick={handleBulkExport}
              disabled={isExporting || isDeleting || isUpdating}
              className="px-4 py-2 bg-white text-teal-700 rounded-xl font-black text-sm hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isExporting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Delete */}
            {!showConfirmDelete ? (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting || isExporting || isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-700 text-white rounded-xl font-black text-sm hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Confirm Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border-2 border-white/40"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}

            {/* Close */}
            <button
              onClick={onDeselectAll}
              disabled={isDeleting || isExporting || isUpdating}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border-2 border-white/40 disabled:opacity-50"
              aria-label="Close bulk actions"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
