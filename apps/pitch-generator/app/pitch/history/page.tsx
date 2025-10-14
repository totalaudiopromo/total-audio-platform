'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, Search, Loader2, Copy } from 'lucide-react';
import { supabase, type Pitch } from '@/lib/supabase';
import PitchStatusToggle from '@/components/PitchStatusToggle';

export default function PitchHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadPitches();
    }
  }, [session]);

  useEffect(() => {
    filterPitches();
  }, [pitches, searchQuery, statusFilter]);

  async function loadPitches() {
    try {
      const response = await fetch('/api/pitches');
      if (!response.ok) throw new Error('Failed to fetch pitches');
      
      const data = await response.json();
      setPitches(data.pitches || []);
    } catch (error) {
      console.error('Error loading pitches:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterPitches() {
    let filtered = [...pitches];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.contact_name.toLowerCase().includes(query) ||
          p.artist_name.toLowerCase().includes(query) ||
          p.track_title.toLowerCase().includes(query) ||
          p.contact_outlet?.toLowerCase().includes(query)
      );
    }

    setFilteredPitches(filtered);
  }

  async function handleCopyPitch(pitch: Pitch) {
    const fullPitch = `Subject: ${pitch.subject_line}\n\n${pitch.pitch_body}`;
    await navigator.clipboard.writeText(fullPitch);
    alert('Pitch copied to clipboard!');
  }

  function handleStatusChange(newStatus: 'draft' | 'sent' | 'replied' | 'success') {
    // Reload pitches to reflect updated status
    loadPitches();
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'sent': return 'bg-brand-amber/20 text-brand-amber';
      case 'replied': return 'bg-success/20 text-success';
      case 'success': return 'bg-success/30 text-success';
      case 'no_reply': return 'bg-gray-50 text-gray-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-amber" />
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
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Pitch History</h1>
          <p className="mt-2 text-gray-900/60">All your generated pitches</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contact, artist, or track..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-900/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
            >
              <option value="all" className="bg-card text-foreground">All Status</option>
              <option value="draft" className="bg-card text-foreground">Draft</option>
              <option value="sent" className="bg-card text-foreground">Sent</option>
              <option value="replied" className="bg-card text-foreground">Replied</option>
              <option value="success" className="bg-card text-foreground">Success</option>
              <option value="no_reply" className="bg-card text-foreground">No Reply</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-gray-900/50">
          Showing {filteredPitches.length} of {pitches.length} pitches
        </p>

        {/* Pitches List */}
        {filteredPitches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-12 text-center">
            <p className="text-gray-900/60">No pitches found</p>
            <Link href="/pitch/generate" className="cta-button mt-6 inline-flex">
              Generate Your First Pitch
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="group rounded-2xl border border-white/10 bg-gray-50 px-6 py-5 transition hover:border-gray-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-semibold">{pitch.contact_name}</h3>
                      {pitch.contact_outlet && (
                        <>
                          <span className="text-gray-900/30">•</span>
                          <span className="truncate text-sm text-gray-900/60">{pitch.contact_outlet}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-900/70">
                      "{pitch.track_title}" by {pitch.artist_name}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <PitchStatusToggle
                        pitchId={pitch.id}
                        currentStatus={pitch.status as 'draft' | 'sent' | 'replied' | 'success'}
                        onStatusChange={handleStatusChange}
                        pitchData={{
                          contactName: pitch.contact_name,
                          contactEmail: '',
                          contactOutlet: pitch.contact_outlet || '',
                          artistName: pitch.artist_name,
                          trackTitle: pitch.track_title,
                          pitchBody: pitch.pitch_body,
                          subjectLine: pitch.subject_line,
                        }}
                      />
                      <span className="text-xs text-gray-900/50">
                        {new Date(pitch.created_at!).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyPitch(pitch)}
                      className="subtle-button flex items-center gap-2 text-xs opacity-0 transition group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                    <Link
                      href={`/pitch/review/${pitch.id}`}
                      className="subtle-button text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

