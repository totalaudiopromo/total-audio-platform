"use client";
import { useTransition } from 'react';
import { createActivity } from '@/lib/activities';

export default function QuickActions({ campaignId, onDone }: { campaignId: string; onDone?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const add = (type: 'radio_submission'|'playlist_pitch'|'press_release'|'follow_up') => {
    startTransition(async () => {
      await createActivity({ campaign_id: campaignId, type, status: 'submitted', submitted_at: new Date().toISOString() } as any);
      onDone?.();
    });
  };
  return (
    <div className="flex flex-wrap gap-2">
      <button className="px-3 py-1 rounded border" onClick={() => add('radio_submission')} disabled={isPending}>+ Radio Submission</button>
      <button className="px-3 py-1 rounded border" onClick={() => add('playlist_pitch')} disabled={isPending}>+ Playlist Pitch</button>
      <button className="px-3 py-1 rounded border" onClick={() => add('press_release')} disabled={isPending}>+ Press Release</button>
      <button className="px-3 py-1 rounded border" onClick={() => add('follow_up')} disabled={isPending}>+ Follow-up</button>
    </div>
  );
}




