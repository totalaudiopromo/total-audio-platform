import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle,
  Sparkles,
  BrainCircuit,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { fetchLeadSuggestionsForArtist } from '@/lib/api/intel';
import type { IntelContact } from '@/lib/types';

const LeadGenPanel: React.FC = () => {
  const [leads, setLeads] = useState<IntelContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedLeads, setAddedLeads] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchLeadSuggestionsForArtist('1');
        if (active) setLeads(data);
      } catch (err) {
        console.warn('[TAP API] Failed to load lead suggestions, using mocks', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = (id: string) => {
    setAddedLeads(prev => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#D9D7D2] rounded-xl overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-[#D9D7D2] flex justify-between items-center">
          <h3 className="font-sans font-semibold tracking-tight text-black flex items-center text-sm">
            <Sparkles size={14} className="mr-2 text-neutral-400" />
            AI Lead Gen
          </h3>
          <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
            BETA
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-neutral-500 font-sans">Loading suggestions…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-[#D9D7D2] flex justify-between items-center">
        <h3 className="font-sans font-semibold tracking-tight text-black flex items-center text-sm">
          <Sparkles size={14} className="mr-2 text-neutral-400" />
          AI Lead Gen
        </h3>
        <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
          BETA
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {leads.map(lead => {
          const isAdded = addedLeads.has(lead.id);
          const fitScore = Math.min(95, lead.credibilityScore + 10);

          return (
            <div
              key={lead.id}
              className="p-0 rounded-lg border border-[#D9D7D2] bg-white hover:border-neutral-300 transition-all group"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#D9D7D2] flex justify-between items-start">
                <div>
                  <h4 className="text-black text-sm font-sans font-semibold">{lead.name}</h4>
                  <div className="flex flex-col mt-1">
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-medium font-sans">
                      Contact at
                    </span>
                    <span className="text-xs font-semibold text-black font-sans">
                      {lead.outlet}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xl font-mono leading-none block ${fitScore > 90 ? 'tap-accent-crm' : 'text-black'}`}
                  >
                    {fitScore}%
                  </span>
                  <div className="text-[8px] uppercase text-neutral-400 font-medium tracking-widest mt-0.5 font-sans">
                    FIT SCORE
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Reasoning Block */}
                <div>
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <BrainCircuit size={12} className="text-neutral-400" />
                    <p className="text-[9px] uppercase text-neutral-400 font-medium tracking-wider font-sans">
                      Reasoning
                    </p>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed border-l-2 border-[#D9D7D2] pl-2.5 py-0.5 font-sans">
                    High credibility {lead.role} contact with strong track record. Email status:{' '}
                    {lead.emailStatus}.{lead.country && ` Based in ${lead.country}.`}
                  </p>
                </div>

                {/* Why this contact? */}
                <div className="bg-neutral-50 p-3 rounded border border-[#D9D7D2]">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <UserCheck size={12} className="text-neutral-400" />
                    <p className="text-[9px] uppercase text-neutral-400 font-medium tracking-wider font-sans">
                      Why this contact?
                    </p>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed italic font-sans">
                    "Credibility score of{' '}
                    <span className="text-black not-italic font-semibold tap-accent-crm">
                      {lead.credibilityScore}
                    </span>{' '}
                    indicates strong industry influence and engagement history."
                  </p>
                </div>

                {/* Suggested Angle */}
                <div>
                  <p className="text-[9px] uppercase text-neutral-400 font-medium tracking-wider mb-1.5 font-sans">
                    Suggested Angle
                  </p>
                  <div className="flex items-start space-x-2">
                    <ArrowRight size={12} className="text-neutral-400 mt-0.5 shrink-0" />
                    <p className="text-xs font-medium text-black font-sans">
                      "Pitch exclusive premiere or interview opportunity for {lead.outlet} audience"
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="px-4 py-3 bg-neutral-50 border-t border-[#D9D7D2] flex justify-end">
                <button
                  onClick={() => handleAdd(lead.id)}
                  disabled={isAdded}
                  className={`text-xs font-medium font-sans flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all ${
                    isAdded
                      ? 'bg-neutral-100 text-neutral-500 border border-[#D9D7D2] cursor-default'
                      : 'bg-black text-white hover:bg-neutral-800 border border-black'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle size={14} /> <span>Added</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={14} /> <span>Add to Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadGenPanel;
