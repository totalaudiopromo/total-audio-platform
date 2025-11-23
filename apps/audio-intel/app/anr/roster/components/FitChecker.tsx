'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SectionCard } from '../../components/SectionCard';
import { ScorePill } from '../../components/ScorePill';
import { LoadingSpinner } from '../../components/shared';

export function FitChecker({ rosterId }: { rosterId: string }) {
  const [artistSlug, setArtistSlug] = useState('');
  const [fit, setFit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkFit = async () => {
    if (!artistSlug.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/anr/rosters/${rosterId}/fit/${artistSlug}`);
      if (res.ok) {
        const data = await res.json();
        setFit(data.fit);
      }
    } catch (error) {
      console.error('Failed to check fit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Fit Checker" description="Assess candidate fit for roster">
      <div className="space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={artistSlug}
            onChange={(e) => setArtistSlug(e.target.value)}
            placeholder="Enter artist slug"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3AA9BE]/50"
            onKeyDown={(e) => e.key === 'Enter' && checkFit()}
          />
          <Button onClick={checkFit} disabled={loading || !artistSlug.trim()}>
            {loading ? <LoadingSpinner size="sm" /> : 'Check Fit'}
          </Button>
        </div>

        {/* Results */}
        {fit && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-slate-500 mb-2">Strategic Fit</p>
              <ScorePill score={fit.strategic_fit || 0} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Uniqueness</p>
              <ScorePill score={fit.uniqueness_vs_roster || 0} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Redundancy Risk</p>
              <ScorePill score={1 - (fit.redundancy_risk || 0)} />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Portfolio Value</p>
              <ScorePill score={fit.portfolio_value || 0} />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
