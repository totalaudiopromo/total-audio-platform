'use client';

import React, { useState, useEffect } from 'react';
import { Network, Search, Filter, MoreHorizontal } from 'lucide-react';
import MermaidChart from '@/components/MermaidChart';
import Loading from '@/components/Loading';
import { SAMPLE_MERMAID_FLOW } from '@/lib/constants';
import { fetchPriorityContacts } from '@/lib/api/intel';
import type { IntelContact } from '@/lib/types';

const CRM: React.FC = () => {
  const [contacts, setContacts] = useState<IntelContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPriorityContacts();
        if (active) setContacts(data);
      } catch (err) {
        console.warn('[TAP API] Failed to load Intel contacts, using mocks', err);
        // Fallback already handled in fetchPriorityContacts
        try {
          const fallback = await fetchPriorityContacts();
          if (active) setContacts(fallback);
        } catch (fallbackErr) {
          console.error('[TAP API] Fallback also failed', fallbackErr);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-tap-line pb-6">
        <div>
          <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
            CRM Intelligence
          </h2>
          <p className="text-tap-muted text-sm mt-1">
            Network health and automated outreach flows.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-tap-bg border border-tap-line rounded text-sm font-medium text-tap-text hover:bg-tap-line/50 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-tap-text text-white rounded text-sm font-medium hover:bg-black transition-colors shadow-sm">
            <Search size={16} />
            <span>Find Contact</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Contact List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-tap-panel rounded-lg border border-tap-line shadow-sm overflow-hidden">
            <div className="p-4 border-b border-tap-line bg-tap-bg/30 flex justify-between items-center">
              <h3 className="font-heading font-normal tracking-tight text-tap-text">
                Priority Network
              </h3>
              <span className="text-xs text-tap-muted bg-tap-bg px-2 py-1 rounded border border-tap-line">
                Sorted by Credibility
              </span>
            </div>
            {loading ? (
              <Loading message="Loading contacts from Audio Intel…" />
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-tap-bg text-tap-muted font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Outlet</th>
                    <th className="px-4 py-3 font-medium">Credibility</th>
                    <th className="px-4 py-3 font-medium">Last Action</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tap-line">
                  {contacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-tap-bg/50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="font-medium text-tap-text">{contact.name}</div>
                        <div className="text-xs text-tap-muted">{contact.role}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-tap-text text-white rounded-full flex items-center justify-center text-[10px] font-medium">
                            {contact.outlet.charAt(0)}
                          </div>
                          <span className="text-tap-text font-medium">{contact.outlet}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-32">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono leading-none text-tap-text">
                            {contact.credibilityScore}
                          </span>
                          <div className="w-full h-1.5 bg-tap-bg rounded-full overflow-hidden border border-tap-line/50">
                            <div
                              className="h-full bg-tap-good"
                              style={{ width: `${contact.credibilityScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-tap-muted text-xs">
                        {contact.lastActionAt || '2 days ago'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-tap-muted hover:text-tap-text transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Stats & Flow */}
        <div className="space-y-8">
          {/* Network Health */}
          <div className="bg-tap-panel p-5 rounded-lg border border-tap-line shadow-sm">
            <h3 className="font-heading font-normal tracking-tight text-tap-text mb-4 flex items-center">
              <Network size={18} className="mr-2 text-tap-accent" />
              Network Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-tap-muted font-medium uppercase tracking-wide">
                    Tier 1 Relationships
                  </span>
                  <span className="text-tap-text font-mono">85%</span>
                </div>
                <div className="w-full h-2 bg-tap-bg rounded overflow-hidden border border-tap-line">
                  <div className="h-full bg-tap-good transition-all" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-tap-muted font-medium uppercase tracking-wide">
                    Response Rate
                  </span>
                  <span className="text-tap-text font-mono">62%</span>
                </div>
                <div className="w-full h-2 bg-tap-bg rounded overflow-hidden border border-tap-line">
                  <div className="h-full bg-tap-accent transition-all" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-tap-muted font-medium uppercase tracking-wide">
                    New Connections
                  </span>
                  <span className="text-tap-text font-mono">40%</span>
                </div>
                <div className="w-full h-2 bg-tap-bg rounded overflow-hidden border border-tap-line">
                  <div className="h-full bg-tap-risk transition-all" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Automated Flow */}
          <div className="bg-tap-panel p-5 rounded-lg border border-tap-line shadow-sm">
            <h3 className="font-heading font-normal tracking-tight text-tap-text mb-4">
              Automated Workflow
            </h3>
            <div className="text-xs text-tap-muted mb-4">
              Logic for <span className="font-medium text-tap-text">"Festival Season Pitch"</span>
            </div>
            <MermaidChart code={SAMPLE_MERMAID_FLOW} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
