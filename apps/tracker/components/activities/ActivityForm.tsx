"use client";
import { useState, useTransition } from 'react';
import { createActivity } from '@/lib/activities';
import type { ActivityType, ActivityStatus } from '@/lib/types';

const TYPES: ActivityType[] = ['radio_submission','playlist_pitch','press_release','social_post','follow_up','response'];
const STATUSES: ActivityStatus[] = ['pending','submitted','responded','accepted','declined','no_response'];

export default function ActivityForm({ campaignId, onCreated }: { campaignId: string; onCreated?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ type: 'radio_submission' as ActivityType, platform: '', contact_name: '', contact_email: '', status: 'submitted' as ActivityStatus, notes: '' });
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createActivity({
          campaign_id: campaignId,
          type: form.type,
          platform: form.platform || null,
          contact_name: form.contact_name || null,
          contact_email: form.contact_email || null,
          status: form.status,
          notes: form.notes || null,
          submitted_at: new Date().toISOString(),
        } as any);
        onCreated?.();
      } catch (err: any) {
        setError(err?.message || 'Failed to create activity');
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">Type
          <select className="mt-1 w-full border rounded p-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityType }))}>
            {TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
          </select>
        </label>
        <label className="text-sm">Status
          <select className="mt-1 w-full border rounded p-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ActivityStatus }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
        </label>
        <label className="text-sm">Platform
          <input className="mt-1 w-full border rounded p-2" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} placeholder="BBC Radio 1, Spotify Editorial" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm">Contact Name
          <input className="mt-1 w-full border rounded p-2" value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
        </label>
        <label className="text-sm">Contact Email
          <input className="mt-1 w-full border rounded p-2" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
        </label>
      </div>
      <label className="text-sm block">Notes
        <textarea className="mt-1 w-full border rounded p-2" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="What you sent, key details, etc." />
      </label>
      <button type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" disabled={isPending}>{isPending ? 'Saving…' : 'Log Activity'}</button>
    </form>
  );
}




