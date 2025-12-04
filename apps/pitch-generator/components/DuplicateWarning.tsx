'use client';

import { AlertTriangle, X } from 'lucide-react';

export interface DuplicateWarningProps {
  contactName: string;
  lastPitchDate: string;
  trackTitle: string;
  onProceed: () => void;
  onCancel: () => void;
  onDismiss?: () => void;
}

export function DuplicateWarning({
  contactName,
  lastPitchDate,
  trackTitle,
  onProceed,
  onCancel,
  onDismiss,
}: DuplicateWarningProps) {
  const formattedDate = new Date(lastPitchDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-amber-50 border-4 border-amber-500 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-black text-amber-900">Previous Pitch Found</h4>
          <p className="text-amber-800 font-medium mt-1">
            You pitched <strong>{contactName}</strong> for "{trackTitle}" on {formattedDate}.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onProceed}
              className="px-4 py-2 bg-amber-500 text-white font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all min-h-[44px]"
            >
              Generate Anyway
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 hover:bg-amber-100 rounded">
            <X className="h-5 w-5 text-amber-600" />
          </button>
        )}
      </div>
    </div>
  );
}
