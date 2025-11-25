'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Mail, User, ChevronRight } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Slideover from '@/components/Slideover';
import Loading from '@/components/Loading';
import { fetchArtistBySlug, fetchArtistGmailThreads, type PortalArtist } from '@/lib/api/portal';

export default function CommunicationsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const artistData = await fetchArtistBySlug(slug);
        if (!artistData) {
          window.location.href = '/artist/login';
          return;
        }
        if (active) setArtist(artistData);

        const gmailThreads = await fetchArtistGmailThreads(slug);
        if (active) setThreads(gmailThreads);
      } catch (err) {
        console.error('[Portal] Failed to load communications', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || !artist) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <Loading message="Loading communications…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Communications</h1>
          <p className="liberty-body text-lg text-[#737373]">
            View email conversations related to your campaign.
          </p>
        </div>

        {/* Thread List */}
        <div className="liberty-card">
          <div className="pb-4 border-b border-[#D9D7D2] mb-0">
            <h2 className="liberty-heading text-xl">Email Threads</h2>
          </div>
          <div className="divide-y divide-[#D9D7D2]">
            {threads.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-[#D9D7D2] mx-auto mb-4" />
                <p className="text-[#737373]">No email threads yet.</p>
              </div>
            ) : (
              threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className="w-full p-6 hover:bg-[#FAFAF8] transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-tap-good/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 tap-accent-radio" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-jakarta font-semibold text-[#111] mb-1">
                          {thread.subject}
                        </h3>
                        <p className="text-sm text-[#737373] mb-2">{thread.sender}</p>
                        <p className="text-sm text-[#737373] line-clamp-2">{thread.snippet}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="liberty-metadata">{thread.timestamp.split('T')[0]}</span>
                      <ChevronRight className="w-5 h-5 text-[#737373]" />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Thread Detail Slideover */}
      <Slideover
        isOpen={!!selectedThread}
        onClose={() => setSelectedThread(null)}
        title={selectedThread?.subject || 'Email Thread'}
      >
        {selectedThread && (
          <div className="space-y-6">
            {/* Thread Info */}
            <div className="pb-4 border-b border-[#D9D7D2]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-tap-good/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 tap-accent-radio" />
                </div>
                <div>
                  <p className="font-jakarta font-medium text-[#111]">{selectedThread.sender}</p>
                  <p className="liberty-metadata">{selectedThread.timestamp}</p>
                </div>
              </div>
              <h2 className="liberty-heading text-lg">{selectedThread.subject}</h2>
            </div>

            {/* Thread Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-[#111] leading-relaxed whitespace-pre-wrap">
                {selectedThread.snippet}
                {'\n\n'}
                This is a preview of the email thread. In a production environment, this would
                display the full conversation history with all messages and replies.
              </p>
            </div>

            {/* Tags */}
            {selectedThread.tags && selectedThread.tags.length > 0 && (
              <div className="pt-4 border-t border-[#D9D7D2]">
                <p className="liberty-label text-[11px] mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedThread.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#F7F6F2] text-[#111] rounded text-xs font-medium border border-[#D9D7D2]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Slideover>
    </div>
  );
}
