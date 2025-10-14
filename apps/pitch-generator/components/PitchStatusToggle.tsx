'use client';

import { useState } from 'react';

interface PitchStatusToggleProps {
  pitchId: string;
  currentStatus: 'draft' | 'sent' | 'replied' | 'success';
  onStatusChange?: (newStatus: 'draft' | 'sent' | 'replied' | 'success') => void;
  pitchData?: {
    contactName: string;
    contactEmail: string;
    contactOutlet: string;
    artistName: string;
    trackTitle: string;
    pitchBody: string;
    subjectLine: string;
  };
}

export default function PitchStatusToggle({
  pitchId,
  currentStatus,
  onStatusChange,
  pitchData
}: PitchStatusToggleProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTrackOption, setShowTrackOption] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const statuses = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { value: 'sent', label: 'Sent', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    { value: 'replied', label: 'Replied', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ] as const;

  const handleStatusChange = async (newStatus: typeof status) => {
    if (newStatus === status || isUpdating) return;

    // If changing to "sent" and pitchData is available, show track option
    if (newStatus === 'sent' && pitchData) {
      setShowTrackOption(true);
      return;
    }

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

  const handleSendAndTrack = async () => {
    if (!pitchData) return;

    setIsUpdating(true);
    try {
      // Update status to sent
      const response = await fetch(`/api/pitches/${pitchId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sent' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setStatus('sent');
      onStatusChange?.('sent');

      // Prepare campaign data for clipboard
      const campaignData = {
        source: 'pitch',
        campaign: {
          name: `${pitchData.artistName} - ${pitchData.trackTitle}`,
          artist: pitchData.artistName,
          track: pitchData.trackTitle,
          contacts: [{
            name: pitchData.contactName,
            email: pitchData.contactEmail,
            outlet: pitchData.contactOutlet,
            status: 'sent',
            pitchBody: pitchData.pitchBody,
            subjectLine: pitchData.subjectLine,
            sentDate: new Date().toISOString(),
          }]
        }
      };

      // Copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify(campaignData));

      // Show notification
      setNotification('Pitch marked as sent! Opening Tracker...');

      // Open tracker
      window.open('https://tracker.totalaudiopromo.com/dashboard/import?source=clipboard', '_blank');

      // Hide track option and clear notification after delay
      setTimeout(() => {
        setShowTrackOption(false);
        setNotification(null);
      }, 3000);

    } catch (error) {
      console.error('Error in send & track:', error);
      setNotification('Failed to send & track. Please try again.');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleJustMarkSent = async () => {
    setShowTrackOption(false);
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pitches/${pitchId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sent' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setStatus('sent');
      onStatusChange?.('sent');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black font-bold max-w-md">
          {notification}
        </div>
      )}

      {/* Send & Track Modal */}
      {showTrackOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Track this pitch in Tracker?</h3>
            <p className="text-gray-600 mb-6">
              Would you like to automatically create a campaign in Tracker to monitor responses and follow-ups?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSendAndTrack}
                disabled={isUpdating}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                ✓ Send & Track
              </button>
              <button
                onClick={handleJustMarkSent}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                Just Mark Sent
              </button>
            </div>
            <button
              onClick={() => setShowTrackOption(false)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
    </>
  );
}
