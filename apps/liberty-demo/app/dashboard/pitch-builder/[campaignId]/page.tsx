'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Music,
  Link as LinkIcon,
} from 'lucide-react';
import { generatePitchForCampaign } from '@/lib/api/pitchBuilder';
import { fetchCampaignDetail } from '@/lib/api/tracker';
import { fetchAssetById } from '@/lib/api/drive';
import { ARTISTS } from '@/lib/constants';
import type { Pitch, PitchType } from '@/lib/pitchBuilderModel';
import type { DriveAsset } from '@/lib/types';
import Loading from '@/components/Loading';
import Slideover from '@/components/Slideover';
import { fetchPriorityContacts } from '@/lib/api/intel';
import { sendPitchEmail } from '@/lib/api/pitchBuilder';
import type { IntelContact } from '@/lib/types';
import { Send, User } from 'lucide-react';

const PITCH_TYPES: { value: PitchType; label: string }[] = [
  { value: 'radio', label: 'Radio' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'blogs', label: 'Blogs' },
  { value: 'playlists', label: 'Playlists' },
  { value: 'sync', label: 'Sync' },
  { value: 'brand', label: 'Brand' },
];

export default function PitchBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.campaignId as string | undefined;

  const [campaign, setCampaign] = useState<any>(null);
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [assets, setAssets] = useState<DriveAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [pitchType, setPitchType] = useState<PitchType>('editorial');
  const [copied, setCopied] = useState(false);

  // Send to Editor State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [contacts, setContacts] = useState<IntelContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<IntelContact | null>(null);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Load contacts when modal opens
  useEffect(() => {
    if (isSendModalOpen && contacts.length === 0) {
      fetchPriorityContacts().then(setContacts);
    }
  }, [isSendModalOpen, contacts.length]);

  const handleSendClick = () => {
    setIsSendModalOpen(true);
    setSendSuccess(false);
    setSelectedContact(null);
  };

  const handleConfirmSend = async () => {
    if (!selectedContact || !pitch || !campaignId) return;

    setSending(true);
    try {
      await sendPitchEmail(campaignId, selectedContact.id, pitch);
      setSendSuccess(true);
      setTimeout(() => {
        setIsSendModalOpen(false);
        setSendSuccess(false);
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!campaignId) return;

      try {
        const campaignData = await fetchCampaignDetail(campaignId);
        if (active) setCampaign(campaignData);

        const pitchData = await generatePitchForCampaign(campaignId, pitchType);
        if (active) {
          setPitch(pitchData);

          // Fetch assets referenced in pitch
          const assetIds = pitchData.recommendedAssets.map(a => a.assetId);
          const assetPromises = assetIds.map(id => fetchAssetById(id));
          const fetchedAssets = await Promise.all(assetPromises);
          setAssets(fetchedAssets.filter(a => a !== null) as DriveAsset[]);
        }
      } catch (err) {
        console.warn('[Pitch Builder] Failed to load pitch', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [campaignId, pitchType]);

  const handleCopyPitch = async () => {
    if (!pitch) return;

    const pitchText = buildPitchText(pitch);
    await navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildPitchText = (p: Pitch): string => {
    let text = `${p.subjectLine}\n\n`;
    text += `${p.greeting},\n\n`;
    text += `${p.openingHook}\n\n`;
    text += `${p.narrative}\n\n`;

    if (p.keyAngles.length > 0) {
      text += `Key angles:\n`;
      p.keyAngles.forEach(angle => {
        text += `• ${angle}\n`;
      });
      text += `\n`;
    }

    if (p.stats.length > 0) {
      text += `Campaign stats:\n`;
      p.stats.forEach(stat => {
        text += `• ${stat.label}: ${stat.value}${stat.context ? ` (${stat.context})` : ''}\n`;
      });
      text += `\n`;
    }

    text += `${p.callToAction}\n\n`;

    if (p.followUpNote) {
      text += `${p.followUpNote}\n\n`;
    }

    text += `Best,\nLiberty Music PR\n`;

    return text;
  };

  const getAssetIcon = (kind: string) => {
    switch (kind) {
      case 'press-release':
        return <FileText className="w-4 h-4 tap-accent-press" />;
      case 'artwork':
        return <ImageIcon className="w-4 h-4 tap-accent-crm" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 tap-accent-playlist" />;
      case 'audio':
        return <Music className="w-4 h-4 tap-accent-radio" />;
      default:
        return <LinkIcon className="w-4 h-4 text-[#737373]" />;
    }
  };

  if (loading || !campaign || !pitch) {
    return (
      <div className="min-h-screen bg-tap-bg flex items-center justify-center">
        <Loading message="Loading pitch builder…" />
      </div>
    );
  }

  const artist = Object.values(ARTISTS).find(a => a.name === campaign.artistName) || ARTISTS['1'];

  return (
    <div className="min-h-screen bg-tap-bg">
      {/* Header */}
      <header className="bg-tap-panel border-b border-tap-line px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-tap-bg rounded-md transition-colors"
              >
                <ArrowLeft size={20} className="text-tap-muted" />
              </button>
              <div>
                <nav className="text-xs text-tap-muted font-mono mb-1">
                  Dashboard → Pitch Builder → {campaign.campaignName}
                </nav>
                <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text">
                  Pitch Builder
                </h1>
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSendClick}
              className="px-4 py-2 bg-tap-text text-white rounded-md hover:bg-tap-text/90 transition-colors flex items-center space-x-2 text-sm mr-2"
            >
              <Send size={16} />
              <span>Send to Editor</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopyPitch}
              className="px-4 py-2 bg-tap-accent text-white rounded-md hover:bg-tap-accent/90 transition-colors flex items-center space-x-2 text-sm"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy pitch to clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Campaign info */}
          <div className="flex items-center space-x-4">
            {artist?.image && (
              <img
                src={artist.image}
                alt={artist.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-tap-line"
              />
            )}
            <div>
              <p className="text-sm font-medium text-tap-text">{campaign.artistName}</p>
              <p className="text-xs text-tap-muted">{campaign.campaignName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Main pitch content (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pitch type tabs */}
            <div className="bg-tap-panel rounded-lg border border-tap-line p-1 flex flex-wrap gap-1">
              {PITCH_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setPitchType(type.value)}
                  className={`flex-1 min-w-[100px] px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pitchType === type.value
                      ? 'bg-tap-accent text-white'
                      : 'text-tap-muted hover:text-tap-text hover:bg-tap-bg'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* To: line */}
            <div className="bg-tap-panel rounded-lg border border-tap-line p-4">
              <p className="text-xs text-tap-muted uppercase tracking-wide mb-1 font-mono">To:</p>
              <p className="text-sm text-tap-text font-medium">{pitch.targetSegmentLabel}</p>
            </div>

            {/* Subject line */}
            <div className="bg-tap-panel rounded-lg border border-tap-line p-4">
              <p className="text-xs text-tap-muted uppercase tracking-wide mb-2 font-mono">
                Subject:
              </p>
              <p className="text-sm font-mono text-tap-text bg-tap-bg p-3 rounded border border-tap-line select-all">
                {pitch.subjectLine}
              </p>
            </div>

            {/* Body */}
            <div className="bg-tap-panel rounded-lg border border-tap-line p-6 space-y-6">
              {/* Greeting */}
              <p className="text-sm text-tap-text font-heading font-normal tracking-tight">
                {pitch.greeting},
              </p>

              {/* Opening hook */}
              <p className="text-sm leading-relaxed text-tap-text font-heading font-normal tracking-tight">
                {pitch.openingHook}
              </p>

              {/* Narrative */}
              <div className="prose prose-sm max-w-none">
                {pitch.narrative.split('\n\n').map((para, idx) => (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed text-tap-text/90 font-heading font-normal tracking-tight mb-4"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Key angles */}
              {pitch.keyAngles.length > 0 && (
                <div>
                  <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-3 uppercase tracking-wide">
                    Key Angles
                  </h3>
                  <ul className="space-y-2">
                    {pitch.keyAngles.map((angle, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-tap-text/90">
                        <span className="text-tap-accent mt-1">•</span>
                        <span className="flex-1">{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats */}
              {pitch.stats.length > 0 && (
                <div className="bg-tap-bg rounded-md border border-tap-line p-4">
                  <h3 className="text-xs font-heading font-normal tracking-tight text-tap-text mb-3 uppercase tracking-wide">
                    Campaign Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {pitch.stats.map((stat, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">
                          {stat.label}
                        </p>
                        <p className="text-sm font-mono leading-none text-tap-text">{stat.value}</p>
                        {stat.context && (
                          <p className="text-xs text-tap-muted mt-1">{stat.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action */}
              <p className="text-sm leading-relaxed text-tap-text font-heading font-normal tracking-tight">
                {pitch.callToAction}
              </p>

              {/* Follow-up note */}
              {pitch.followUpNote && (
                <p className="text-xs leading-relaxed text-tap-muted italic font-heading font-normal tracking-tight">
                  {pitch.followUpNote}
                </p>
              )}

              {/* Signature */}
              <p className="text-sm text-tap-text font-heading font-normal tracking-tight mt-6">
                Best,
                <br />
                Liberty Music PR
              </p>
            </div>
          </div>

          {/* Right: Sidebar (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Assets */}
            {pitch.recommendedAssets.length > 0 && (
              <div className="bg-tap-panel rounded-lg border border-tap-line p-5">
                <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-4 uppercase tracking-wide">
                  Recommended Assets
                </h3>
                <div className="space-y-3">
                  {pitch.recommendedAssets.map(assetRef => {
                    const asset = assets.find(a => a.id === assetRef.assetId);
                    return (
                      <div
                        key={assetRef.assetId}
                        className="p-3 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getAssetIcon(assetRef.kind)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-tap-text">{assetRef.label}</p>
                            {asset && (
                              <p className="text-xs text-tap-muted font-mono truncate">
                                {asset.name}
                              </p>
                            )}
                          </div>
                          {asset && (
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-tap-accent hover:underline"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Campaign context */}
            <div className="bg-tap-panel rounded-lg border border-tap-line p-5">
              <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-4 uppercase tracking-wide">
                Campaign Context
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">Momentum</p>
                  <p className="text-lg font-mono leading-none text-tap-text">
                    {campaign.momentum}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">
                    Health Score
                  </p>
                  <p className="text-lg font-mono leading-none text-tap-text">{campaign.health}%</p>
                </div>
                {campaign.openRate > 0 && (
                  <div>
                    <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">Open Rate</p>
                    <p className="text-sm font-mono leading-none text-tap-text">
                      {campaign.openRate}%
                    </p>
                  </div>
                )}
                {campaign.replyRate > 0 && (
                  <div>
                    <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">
                      Reply Rate
                    </p>
                    <p className="text-sm font-mono leading-none text-tap-text">
                      {campaign.replyRate}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Press profile tags (if available) */}
            {pitch.keyAngles.length > 0 && (
              <div className="bg-tap-panel rounded-lg border border-tap-line p-5">
                <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-4 uppercase tracking-wide">
                  Key Angles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pitch.keyAngles.slice(0, 6).map((angle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-tap-bg/50 border border-tap-line rounded text-xs text-tap-text"
                    >
                      {angle.split(' — ')[0] || angle.slice(0, 20)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send to Editor Slideover */}
      <Slideover
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send to Editor"
      >
        {sendSuccess ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-tap-good/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-tap-good" />
            </div>
            <h3 className="text-xl font-heading font-medium text-tap-text mb-2">Pitch Sent!</h3>
            <p className="text-tap-muted">Your pitch has been queued for delivery.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Select Contact */}
            <section>
              <h3 className="text-sm font-heading font-medium text-tap-text mb-4 uppercase tracking-wide">
                1. Select Recipient
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-tap-line rounded-lg p-2">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-center p-3 rounded-md border transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-tap-accent/5 border-tap-accent ring-1 ring-tap-accent'
                        : 'bg-white border-transparent hover:bg-tap-bg'
                    }`}
                  >
                    <div className="w-8 h-8 bg-tap-bg rounded-full flex items-center justify-center mr-3 border border-tap-line">
                      <User size={14} className="text-tap-muted" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-tap-text">{contact.name}</div>
                      <div className="text-xs text-tap-muted">
                        {contact.outlet} • {contact.role}
                      </div>
                    </div>
                    {selectedContact?.id === contact.id && (
                      <Check size={16} className="text-tap-accent" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Confirm Pitch Variant */}
            <section>
              <h3 className="text-sm font-heading font-medium text-tap-text mb-4 uppercase tracking-wide">
                2. Pitch Variant
              </h3>
              <div className="p-4 bg-tap-bg rounded-lg border border-tap-line">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-tap-text capitalize">
                    {pitchType} Pitch
                  </span>
                  <span className="text-xs text-tap-muted font-mono">v1.0</span>
                </div>
                <p className="text-xs text-tap-muted">
                  Optimised for {pitchType} contacts with relevant angles and assets.
                </p>
              </div>
            </section>

            {/* 3. Preview */}
            <section>
              <h3 className="text-sm font-heading font-medium text-tap-text mb-4 uppercase tracking-wide">
                3. Preview
              </h3>
              {selectedContact && pitch && (
                <div className="border border-tap-line rounded-lg overflow-hidden">
                  <div className="bg-tap-bg px-4 py-2 border-b border-tap-line flex items-center gap-2">
                    <span className="text-xs text-tap-muted uppercase tracking-wide">To:</span>
                    <span className="text-sm text-tap-text font-mono">{selectedContact.email}</span>
                  </div>
                  <div className="bg-tap-bg px-4 py-2 border-b border-tap-line flex items-center gap-2">
                    <span className="text-xs text-tap-muted uppercase tracking-wide">Subject:</span>
                    <span className="text-sm text-tap-text font-mono truncate">
                      {pitch.subjectLine}
                    </span>
                  </div>
                  <div className="p-4 bg-white max-h-60 overflow-y-auto text-sm text-tap-text whitespace-pre-wrap font-sans">
                    {buildPitchText(pitch)}
                  </div>
                </div>
              )}
            </section>

            {/* Actions */}
            <div className="pt-4 border-t border-tap-line flex justify-end gap-3">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-tap-muted hover:text-tap-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={!selectedContact || sending}
                className="px-6 py-2 bg-tap-text text-white rounded-md hover:bg-tap-text/90 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <Loading size="sm" className="!p-0" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Slideover>
    </div>
  );
}
