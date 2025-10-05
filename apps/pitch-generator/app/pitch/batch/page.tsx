'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles, Copy, CheckCircle, Clock } from 'lucide-react';
import { supabase, type Contact } from '@/lib/supabase';

interface FormData {
  artistName: string;
  trackTitle: string;
  genre: string;
  releaseDate: string;
  keyHook: string;
  trackLink: string;
  tone: 'casual' | 'professional' | 'enthusiastic';
}

interface GeneratedPitch {
  contactId: string;
  contactName: string;
  contactOutlet: string;
  pitchBody: string;
  subjectLine: string;
  suggestedSendTime?: string;
  pitchId?: string;
}

const GENRES = [
  'indie',
  'electronic',
  'folk',
  'hiphop',
  'rock',
  'pop',
  'alternative',
  'punk',
  'metal',
  'jazz',
  'blues',
  'country',
  'r&b',
  'soul',
];

export default function BatchGeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [generatedPitches, setGeneratedPitches] = useState<GeneratedPitch[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    artistName: '',
    trackTitle: '',
    genre: 'indie',
    releaseDate: '',
    keyHook: '',
    trackLink: '',
    tone: 'professional',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadContacts();
    }
  }, [session]);

  async function loadContacts() {
    try {
      const userId = session?.user?.email || '';
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  function toggleContact(contactId: string) {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  }

  function selectAll() {
    setSelectedContactIds(contacts.map((c) => c.id));
  }

  function deselectAll() {
    setSelectedContactIds([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedContactIds.length === 0) {
      alert('Please select at least one contact');
      return;
    }

    setLoading(true);
    setGeneratedPitches([]);
    setCurrentProgress(0);

    const selectedContacts = contacts.filter((c) =>
      selectedContactIds.includes(c.id)
    );

    try {
      const pitches: GeneratedPitch[] = [];

      // Generate pitches one by one with progress updates
      for (let i = 0; i < selectedContacts.length; i++) {
        const contact = selectedContacts[i];
        setCurrentProgress(((i + 1) / selectedContacts.length) * 100);

        const response = await fetch('/api/pitch/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            contactId: contact.id,
            contact: contact,
          }),
        });

        if (!response.ok) {
          console.error(`Failed to generate pitch for ${contact.name}`);
          continue;
        }

        const result = await response.json();
        pitches.push({
          contactId: contact.id,
          contactName: contact.name,
          contactOutlet: contact.outlet || 'Unknown',
          pitchBody: result.pitch.pitch_body,
          subjectLine: result.pitch.subject_line,
          suggestedSendTime: result.pitch.suggested_send_time,
          pitchId: result.pitchId,
        });
      }

      setGeneratedPitches(pitches);
    } catch (error) {
      console.error('Error generating pitches:', error);
      alert('Failed to generate some pitches. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyPitch(pitch: GeneratedPitch, index: number) {
    const formattedPitch = `Subject: ${pitch.subjectLine}

${pitch.pitchBody}`;

    await navigator.clipboard.writeText(formattedPitch);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function copyAllPitches() {
    const allPitches = generatedPitches
      .map(
        (p) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TO: ${p.contactName} (${p.contactOutlet})
SUBJECT: ${p.subjectLine}
${p.suggestedSendTime ? `BEST SEND TIME: ${p.suggestedSendTime}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${p.pitchBody}

`
      )
      .join('\n\n');

    await navigator.clipboard.writeText(allPitches);
    alert(`Copied all ${generatedPitches.length} pitches to clipboard!`);
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-iris" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Batch Pitch Generator</h1>
          <p className="mt-2 text-gray-900/60">
            Generate personalised pitches for multiple contacts at once
          </p>
        </div>

        {generatedPitches.length === 0 ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Track Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Track Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">
                    Artist Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                    placeholder="e.g. The Midnight Hearts"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">
                    Track Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trackTitle}
                    onChange={(e) => setFormData({ ...formData, trackTitle: e.target.value })}
                    placeholder="e.g. Neon Dreams"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">
                    Genre <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                  >
                    {GENRES.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Track Link
                </label>
                <input
                  type="url"
                  value={formData.trackLink}
                  onChange={(e) => setFormData({ ...formData, trackLink: e.target.value })}
                  placeholder="https://soundcloud.com/..."
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Key Hook <span className="text-danger">*</span>
                </label>
                <textarea
                  required
                  value={formData.keyHook}
                  onChange={(e) => setFormData({ ...formData, keyHook: e.target.value })}
                  rows={3}
                  placeholder="What makes this track special? Why should they care?"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
                />
              </div>
            </div>

            {/* Contact Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Select Contacts ({selectedContactIds.length} selected)
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="subtle-button text-xs"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="subtle-button text-xs"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {contacts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-12 text-center">
                  <p className="text-sm text-gray-900/50">
                    No contacts found.{' '}
                    <Link href="/pitch/contacts" className="text-brand-iris underline">
                      Add contacts first
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => (
                    <label
                      key={contact.id}
                      className={`cursor-pointer rounded-2xl border-2 bg-gray-50 px-4 py-3 transition ${
                        selectedContactIds.includes(contact.id)
                          ? 'border-brand-iris bg-brand-iris/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedContactIds.includes(contact.id)}
                          onChange={() => toggleContact(contact.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-iris focus:ring-brand-iris"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{contact.name}</p>
                          {contact.outlet && (
                            <p className="mt-0.5 text-xs text-gray-900/60 truncate">
                              {contact.outlet}
                            </p>
                          )}
                          {contact.preferred_tone && (
                            <p className="mt-1 text-xs text-brand-iris/80">
                              Prefers: {contact.preferred_tone}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={loading || selectedContactIds.length === 0}
                className="cta-button flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating {Math.round(currentProgress)}%
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate {selectedContactIds.length} Pitch
                    {selectedContactIds.length !== 1 ? 'es' : ''}
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="w-full rounded-full bg-gray-200 h-2">
                <div
                  className="bg-brand-iris h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-success">
                  Generated {generatedPitches.length} Pitches
                </h2>
                <p className="mt-1 text-sm text-gray-900/60">
                  Ready to copy and send
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyAllPitches}
                  className="cta-button flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy All Pitches
                </button>
                <button
                  onClick={() => {
                    setGeneratedPitches([]);
                    setSelectedContactIds([]);
                  }}
                  className="subtle-button"
                >
                  Generate More
                </button>
              </div>
            </div>

            {/* Generated Pitches */}
            <div className="space-y-4">
              {generatedPitches.map((pitch, index) => (
                <div
                  key={pitch.contactId}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{pitch.contactName}</h3>
                      <p className="text-sm text-gray-900/60">{pitch.contactOutlet}</p>
                      {pitch.suggestedSendTime && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-iris">
                          <Clock className="h-3 w-3" />
                          Best send time: {pitch.suggestedSendTime}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copyPitch(pitch, index)}
                      className="subtle-button flex items-center gap-2 text-xs"
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-900/50">
                        Subject
                      </p>
                      <p className="mt-1 text-sm font-medium">{pitch.subjectLine}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-900/50">
                        Pitch
                      </p>
                      <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-900/80 font-sans">
                        {pitch.pitchBody}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
