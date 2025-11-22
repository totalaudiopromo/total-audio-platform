'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle2, Edit3, Send, Sparkles, Clock, Loader2 } from 'lucide-react';
import { supabase, type Pitch } from '@/lib/supabase';

export default function ReviewPitchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const pitchId = params.id as string;

  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('option2');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email && pitchId) {
      loadPitch();
    }
  }, [session, pitchId]);

  async function loadPitch() {
    try {
      const userId = session?.user?.email || '';
      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', pitchId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setPitch(data);
      setEditedBody(data.pitch_body);
    } catch (error) {
      console.error('Error loading pitch:', error);
      alert('Pitch not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!pitch) return;

    const subject =
      pitch.subject_line_options?.[selectedSubject as keyof typeof pitch.subject_line_options] ||
      pitch.subject_line;
    const fullPitch = `Subject: ${subject}\n\n${editing ? editedBody : pitch.pitch_body}`;

    await navigator.clipboard.writeText(fullPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!pitch) return;

    setSaving(true);
    try {
      const subject =
        pitch.subject_line_options?.[selectedSubject as keyof typeof pitch.subject_line_options] ||
        pitch.subject_line;

      const { error } = await supabase
        .from('pitches')
        .update({
          pitch_body: editedBody,
          subject_line: subject,
        })
        .eq('id', pitch.id);

      if (error) throw error;

      setPitch({
        ...pitch,
        pitch_body: editedBody,
        subject_line: subject,
      });
      setEditing(false);
      alert('Pitch saved successfully!');
    } catch (error) {
      console.error('Error saving pitch:', error);
      alert('Failed to save pitch');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkAsSent() {
    if (!pitch) return;

    const confirmed = confirm('Mark this pitch as sent?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('pitches')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', pitch.id);

      if (error) throw error;

      alert('Pitch marked as sent!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating pitch:', error);
      alert('Failed to update pitch');
    }
  }

  async function handleRegenerate() {
    const confirmed = confirm('Regenerate this pitch? Your current version will be lost.');
    if (!confirmed) return;

    router.push('/pitch/generate');
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-iris" />
      </div>
    );
  }

  if (!session || !pitch) {
    return null;
  }

  const subjectOptions = pitch.subject_line_options || {
    option1: pitch.subject_line,
    option2: pitch.subject_line,
    option3: pitch.subject_line,
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-success/20 p-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <h1 className="text-2xl font-bold">Pitch Generated!</h1>
              </div>
              <p className="mt-3 text-lg text-gray-900/70">
                For <span className="font-semibold text-gray-900">{pitch.contact_name}</span>
                {pitch.contact_outlet && (
                  <span className="text-gray-900/50"> at {pitch.contact_outlet}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-gray-900/50">
                "{pitch.track_title}" by {pitch.artist_name}
              </p>
            </div>
            <button
              onClick={handleRegenerate}
              className="subtle-button flex items-center gap-2 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Subject Line Options */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900/90">
            Subject Line (select one)
          </label>
          <div className="mt-3 space-y-2">
            {Object.entries(subjectOptions).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSubject(key)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedSubject === key
                    ? 'border-brand-iris bg-brand-iris/10 text-gray-900'
                    : 'border-gray-300 bg-gray-50 text-gray-900/70 hover:border-white/30'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Pitch Body */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-900/90">Pitch Body</label>
            <button
              onClick={() => setEditing(!editing)}
              className="subtle-button flex items-center gap-2 text-xs"
            >
              <Edit3 className="h-3 w-3" />
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <textarea
              value={editedBody}
              onChange={e => setEditedBody(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 font-mono text-sm text-gray-900 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          ) : (
            <div className="rounded-xl border border-gray-300 bg-gray-50 px-6 py-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900/90">
                {pitch.pitch_body}
              </pre>
            </div>
          )}
        </div>

        {/* Suggested Send Time */}
        {pitch.suggested_send_time && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-amber/30 bg-brand-amber/10 px-4 py-3">
            <Clock className="h-5 w-5 text-brand-amber" />
            <div>
              <p className="text-sm font-medium text-brand-amber">Best time to send</p>
              <p className="text-sm text-gray-900/70">{pitch.suggested_send_time}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          {editing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="cta-button flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          ) : (
            <>
              <button onClick={handleCopy} className="cta-button flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
              <button onClick={handleMarkAsSent} className="subtle-button flex items-center gap-2">
                <Send className="h-4 w-4" />
                Mark as Sent
              </button>
            </>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8 glass-panel px-8 py-6">
        <h3 className="text-lg font-semibold">What's next?</h3>
        <ul className="mt-4 space-y-3 text-sm text-gray-900/70">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-iris/20 text-xs font-semibold text-brand-iris">
              1
            </span>
            <span>Copy this pitch and paste it into your email client</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-magenta/20 text-xs font-semibold text-brand-magenta">
              2
            </span>
            <span>Send it at the suggested time for best response rates</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-amber/20 text-xs font-semibold text-brand-amber">
              3
            </span>
            <span>Mark it as sent here so you can track your success rate</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
