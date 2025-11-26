'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Star, Paperclip, ChevronRight, ExternalLink } from 'lucide-react';
import { fetchGmailThreads, parseSenderName, formatRelativeTime } from '@/lib/api/gmail';
import type { GmailThread } from '@/lib/api/gmail';
import { EmptyState, ErrorState, DataFreshness, LoadingState } from '@/components/ui';

export default function GmailInboxPanel() {
  const [threads, setThreads] = useState<GmailThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGmailThreads(undefined, 5);
      setThreads(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Gmail Panel] Failed to load:', err);
      setError('Failed to load emails');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unreadCount = threads.filter(t => t.unread).length;

  const renderContent = () => {
    if (loading && threads.length === 0) {
      return <LoadingState message="Connecting to Gmail..." size="sm" />;
    }

    if (error && threads.length === 0) {
      return <ErrorState variant="default" onRetry={loadData} />;
    }

    if (threads.length === 0) {
      return (
        <EmptyState variant="emails" description="No recent emails found. Your inbox is clear!" />
      );
    }

    return (
      <div className="space-y-1">
        {threads.map((thread, index) => {
          const sender = parseSenderName(thread.from);
          const isImportant = thread.labels.includes('IMPORTANT');
          const isHovered = hoveredId === thread.id;

          return (
            <div
              key={thread.id}
              className={`
                group relative rounded-lg transition-all duration-200 ease-out cursor-pointer
                ${
                  thread.unread
                    ? 'bg-[#FAFAF8] hover:bg-white'
                    : 'bg-transparent hover:bg-[#FAFAF8]'
                }
                ${isHovered ? 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''}
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onMouseEnter={() => setHoveredId(thread.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Unread indicator bar */}
              {thread.unread && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#3AA9BE] rounded-full" />
              )}

              <div className={`p-3 ${thread.unread ? 'pl-4' : 'pl-3'}`}>
                {/* Top row: Sender + Time */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Avatar */}
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                        transition-all duration-200
                        ${thread.unread ? 'bg-[#111] text-white' : 'bg-[#E8E6E1] text-[#737373]'}
                      `}
                    >
                      {sender.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Sender name */}
                    <span
                      className={`
                        text-sm truncate
                        ${
                          thread.unread ? 'font-semibold text-[#111]' : 'font-medium text-[#737373]'
                        }
                      `}
                    >
                      {sender.name}
                    </span>

                    {/* Important star */}
                    {isImportant && (
                      <Star size={12} className="flex-shrink-0 fill-[#EAB308] text-[#EAB308]" />
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wide flex-shrink-0">
                    {formatRelativeTime(thread.date)}
                  </span>
                </div>

                {/* Subject line */}
                <p
                  className={`
                    text-sm mb-1 truncate leading-snug
                    ${thread.unread ? 'font-medium text-[#111]' : 'text-[#737373]'}
                  `}
                >
                  {thread.subject}
                </p>

                {/* Preview snippet */}
                <p className="text-xs text-[#A1A1A1] line-clamp-1 leading-relaxed">
                  {thread.snippet}
                </p>

                {/* Hover action */}
                <div
                  className={`
                    absolute right-3 top-1/2 -translate-y-1/2
                    transition-all duration-200
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E6E1] bg-gradient-to-r from-white to-[#FAFAF8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center">
              <Mail size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#111] tracking-tight flex items-center gap-2">
                Liberty Inbox
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-[#3AA9BE] rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#A1A1A1] font-mono uppercase tracking-wide">
                chrisschofield@libertymusicpr.com
              </p>
            </div>
          </div>
          <DataFreshness
            lastUpdated={lastUpdated}
            isLoading={loading}
            onRefresh={loadData}
            showRefreshButton={!loading}
          />
        </div>
      </div>

      {/* Email list */}
      <div className="p-2">{renderContent()}</div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#E8E6E1] bg-[#FAFAF8]">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2
            text-sm text-[#737373] hover:text-[#111]
            transition-colors duration-150
            min-h-[44px]
          "
        >
          <span>Open in Gmail</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
