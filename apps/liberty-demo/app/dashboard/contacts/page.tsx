'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Mail,
  CheckCircle,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Radio,
  Newspaper,
  Music,
  Users,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { fetchPriorityContacts } from '@/lib/api/intel';
import type { IntelContact } from '@/lib/types';

type RoleFilter = 'All' | 'Radio' | 'Press' | 'Playlist' | 'Influencer' | 'Other';

const roleIcons: Record<string, React.ReactNode> = {
  Radio: <Radio size={14} />,
  Press: <Newspaper size={14} />,
  Playlist: <Music size={14} />,
  Influencer: <Users size={14} />,
  Other: <Sparkles size={14} />,
};

const roleColours: Record<string, string> = {
  Radio: 'bg-blue-50 text-blue-700 border-blue-200',
  Press: 'bg-purple-50 text-purple-700 border-purple-200',
  Playlist: 'bg-green-50 text-green-700 border-green-200',
  Influencer: 'bg-orange-50 text-orange-700 border-orange-200',
  Other: 'bg-gray-50 text-gray-700 border-gray-200',
};

const emailStatusColours: Record<string, string> = {
  valid: 'text-green-600',
  risky: 'text-yellow-600',
  invalid: 'text-red-600',
  unknown: 'text-gray-400',
};

export default function ContactResearchPage() {
  const [contacts, setContacts] = useState<IntelContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [minCredibility, setMinCredibility] = useState(0);
  const [addedContacts, setAddedContacts] = useState<Set<string>>(new Set());
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPriorityContacts();
        if (active) setContacts(data);
      } catch (err) {
        console.warn('[Contact Research] Failed to load contacts', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          contact.name.toLowerCase().includes(query) ||
          contact.outlet.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Role filter
      if (roleFilter !== 'All' && contact.role !== roleFilter) {
        return false;
      }

      // Credibility filter
      if (contact.credibilityScore < minCredibility) {
        return false;
      }

      return true;
    });
  }, [contacts, searchQuery, roleFilter, minCredibility]);

  const stats = useMemo(() => {
    const byRole = contacts.reduce(
      (acc, c) => {
        acc[c.role] = (acc[c.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: contacts.length,
      avgCredibility: contacts.length
        ? Math.round(contacts.reduce((sum, c) => sum + c.credibilityScore, 0) / contacts.length)
        : 0,
      byRole,
      validEmails: contacts.filter(c => c.emailStatus === 'valid').length,
    };
  }, [contacts]);

  const handleAddToCampaign = (id: string) => {
    setAddedContacts(prev => new Set(prev).add(id));
  };

  const handleCopyEmail = async (email: string, id: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black font-sans tracking-tight">
            Contact Research
          </h1>
          <p className="text-sm text-[#737373] mt-1 font-sans">
            Find radio, press, and playlist contacts for your campaigns
          </p>
        </div>
        <a
          href="https://intel.totalaudiopromo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="liberty-btn-secondary gap-2"
        >
          <ExternalLink size={14} />
          Open Audio Intel
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9D7D2] rounded-lg p-4">
          <p className="liberty-metadata-micro mb-1">TOTAL CONTACTS</p>
          <p className="text-2xl font-mono font-semibold text-black">{stats.total}</p>
        </div>
        <div className="bg-white border border-[#D9D7D2] rounded-lg p-4">
          <p className="liberty-metadata-micro mb-1">AVG CREDIBILITY</p>
          <p className="text-2xl font-mono font-semibold tap-accent-crm">{stats.avgCredibility}%</p>
        </div>
        <div className="bg-white border border-[#D9D7D2] rounded-lg p-4">
          <p className="liberty-metadata-micro mb-1">VALID EMAILS</p>
          <p className="text-2xl font-mono font-semibold text-green-600">{stats.validEmails}</p>
        </div>
        <div className="bg-white border border-[#D9D7D2] rounded-lg p-4">
          <p className="liberty-metadata-micro mb-1">BY TYPE</p>
          <div className="flex gap-2 flex-wrap mt-1">
            {Object.entries(stats.byRole).map(([role, count]) => (
              <span
                key={role}
                className={`text-xs px-2 py-0.5 rounded border ${roleColours[role] || roleColours.Other}`}
              >
                {role}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#D9D7D2] rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search by name or outlet..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#D9D7D2] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3AA9BE] focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#737373]" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as RoleFilter)}
              className="border border-[#D9D7D2] rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#3AA9BE]"
            >
              <option value="All">All Types</option>
              <option value="Radio">Radio</option>
              <option value="Press">Press</option>
              <option value="Playlist">Playlist</option>
              <option value="Influencer">Influencer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Credibility Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373] font-sans">Min Credibility:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={minCredibility}
              onChange={e => setMinCredibility(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm font-mono text-black w-8">{minCredibility}</span>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#737373] font-sans">
          Showing <span className="font-semibold text-black">{filteredContacts.length}</span>{' '}
          contacts
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => {
          const isAdded = addedContacts.has(contact.id);
          const isCopied = copiedEmail === contact.id;

          return (
            <div
              key={contact.id}
              className="bg-white border border-[#D9D7D2] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#D9D7D2]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-black font-sans">{contact.name}</h3>
                    <p className="text-xs text-[#737373] font-sans mt-0.5">{contact.outlet}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${roleColours[contact.role] || roleColours.Other}`}
                  >
                    {roleIcons[contact.role]}
                    {contact.role}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                {/* Credibility Score */}
                <div className="flex items-center justify-between">
                  <span className="liberty-metadata-micro">CREDIBILITY</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3AA9BE] rounded-full transition-all"
                        style={{ width: `${contact.credibilityScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold text-black">
                      {contact.credibilityScore}
                    </span>
                  </div>
                </div>

                {/* Email Status */}
                <div className="flex items-center justify-between">
                  <span className="liberty-metadata-micro">EMAIL STATUS</span>
                  <span
                    className={`text-xs font-medium capitalize ${emailStatusColours[contact.emailStatus]}`}
                  >
                    {contact.emailStatus}
                  </span>
                </div>

                {/* Country */}
                {contact.country && (
                  <div className="flex items-center justify-between">
                    <span className="liberty-metadata-micro">COUNTRY</span>
                    <span className="text-xs text-black font-sans">{contact.country}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-[#FAFAF8] border-t border-[#D9D7D2] flex items-center gap-2">
                <button
                  onClick={() => handleCopyEmail(contact.email, contact.id)}
                  className="liberty-btn-secondary flex-1 gap-1.5 text-xs"
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  {isCopied ? 'Copied!' : 'Copy Email'}
                </button>
                <button
                  onClick={() => handleAddToCampaign(contact.id)}
                  disabled={isAdded}
                  className={`flex-1 gap-1.5 text-xs ${isAdded ? 'liberty-btn-secondary cursor-default' : 'liberty-btn-primary'}`}
                >
                  {isAdded ? <CheckCircle size={12} /> : <PlusCircle size={12} />}
                  {isAdded ? 'Added' : 'Add to Campaign'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={20} className="text-[#737373]" />
          </div>
          <h3 className="text-sm font-semibold text-black font-sans mb-1">No contacts found</h3>
          <p className="text-xs text-[#737373] font-sans">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Audio Intel CTA */}
      <div className="bg-gradient-to-r from-[#3AA9BE]/10 to-[#3AA9BE]/5 border border-[#3AA9BE]/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-black font-sans mb-1">Need more contacts?</h3>
            <p className="text-xs text-[#737373] font-sans">
              Use Audio Intel to discover and enrich new radio, press, and playlist contacts
            </p>
          </div>
          <a
            href="https://intel.totalaudiopromo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="liberty-btn-primary gap-2"
          >
            <ArrowUpRight size={14} />
            Open Audio Intel
          </a>
        </div>
      </div>
    </div>
  );
}
