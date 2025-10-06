'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { supabase, type Contact } from '@/lib/supabase';

interface FormData {
  contactId: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  releaseDate: string;
  keyHook: string;
  trackLink: string;
  tone: 'casual' | 'professional' | 'enthusiastic';
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

export default function GeneratePitchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<FormData>({
    contactId: '',
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

  function handleContactChange(contactId: string) {
    const contact = contacts.find(c => c.id === contactId);
    setSelectedContact(contact || null);
    setFormData(prev => ({
      ...prev,
      contactId,
      // Auto-set tone based on contact preference
      tone: contact?.preferred_tone || 'professional',
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedContact) {
      alert('Please select a contact');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/pitch/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contact: selectedContact,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pitch');
      }

      const result = await response.json();
      
      // Redirect to review page with the generated pitch
      router.push(`/pitch/review/${result.pitchId}`);
    } catch (error) {
      console.error('Error generating pitch:', error);
      alert('Failed to generate pitch. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const hookCharCount = formData.keyHook.length;
  const hookMaxLength = 500;

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
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-iris/20 p-3">
              <Sparkles className="h-6 w-6 text-brand-iris" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Generate Pitch</h1>
              <p className="mt-1 text-gray-600">Create a personalised pitch in 30 seconds</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Contact <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.contactId}
              onChange={(e) => handleContactChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Select a contact...</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} {contact.outlet ? `- ${contact.outlet}` : ''}
                </option>
              ))}
            </select>
            {contacts.length === 0 && (
              <p className="mt-2 text-xs text-gray-500">
                No contacts yet.{' '}
                <Link href="/pitch/contacts" className="text-blue-600 hover:underline">
                  Add your first contact
                </Link>
              </p>
            )}
            {selectedContact && (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                <p className="text-gray-600">
                  {selectedContact.role && <span className="font-medium">{selectedContact.role}</span>}
                  {selectedContact.outlet && <span className="text-gray-500"> at {selectedContact.outlet}</span>}
                </p>
                {selectedContact.genre_tags && selectedContact.genre_tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedContact.genre_tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-brand-iris/20 px-3 py-1 text-xs text-brand-iris">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Artist Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Artist Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              placeholder="e.g. The Midnight Sons"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Track Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Track Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.trackTitle}
              onChange={(e) => setFormData({ ...formData, trackTitle: e.target.value })}
              placeholder="e.g. Northern Lights"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Genre <span className="text-danger">*</span>
            </label>
            <select
              required
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre} className="bg-card text-foreground">
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Release Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Key Hook */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              What makes this track special? <span className="text-danger">*</span>
            </label>
            <textarea
              required
              value={formData.keyHook}
              onChange={(e) => setFormData({ ...formData, keyHook: e.target.value.slice(0, hookMaxLength) })}
              rows={4}
              placeholder="e.g. Intimate indie-folk about finding home after years of touring. Think Laura Marling meets Phoebe Bridgers - sparse production, honest lyrics, gorgeous harmonies."
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="mt-2 text-xs text-gray-500">
              {hookCharCount} / {hookMaxLength} characters
            </p>
          </div>

          {/* Track Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Link (Spotify/SoundCloud)
            </label>
            <input
              type="url"
              value={formData.trackLink}
              onChange={(e) => setFormData({ ...formData, trackLink: e.target.value })}
              placeholder="https://open.spotify.com/track/..."
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Tone
            </label>
            <div className="mt-3 flex gap-3">
              {(['casual', 'professional', 'enthusiastic'] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setFormData({ ...formData, tone })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    formData.tone === tone
                      ? 'border-brand-iris bg-brand-iris/20 text-brand-iris'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !formData.contactId}
              className="cta-button w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating your pitch...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Pitch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

