'use client';

import { useState } from 'react';

interface PitchStatusToggleProps {
  pitchId: string;
  currentStatus: 'draft' | 'sent' | 'replied' | 'success';
  onStatusChange?: (newStatus: 'draft' | 'sent' | 'replied' | 'success') => void;
}

export default function PitchStatusToggle({
  pitchId,
  currentStatus,
  onStatusChange
}: PitchStatusToggleProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { value: 'replied', label: 'Replied', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ] as const;

  const handleStatusChange = async (newStatus: typeof status) => {
    if (newStatus === status || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pitches/${pitchId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => handleStatusChange(s.value)}
          disabled={isUpdating}
          className={`
            px-3 py-1 rounded-full text-sm font-medium transition-all
            ${status === s.value
              ? s.color.replace('hover:', '') + ' ring-2 ring-offset-2 ring-gray-300'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }
            ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
