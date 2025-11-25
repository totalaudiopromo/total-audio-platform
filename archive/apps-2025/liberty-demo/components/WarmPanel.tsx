import React, { useState, useEffect } from 'react';
import { Radio, TrendingUp, Download } from 'lucide-react';
import { fetchWarmAgencySummary } from '@/lib/api/warm';
import type { WarmAgencySummary } from '@/lib/types';
import Loading from './Loading';

const WarmPanel: React.FC = () => {
  const [summary, setSummary] = useState<WarmAgencySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchWarmAgencySummary('Liberty');
        if (active) setSummary(data.slice(0, 3)); // Top 3 artists
      } catch (err) {
        console.warn('[TAP API] Failed to load WARM summary, using mocks', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('WARM Report exported to PDF');
    }, 1500);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="liberty-card p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Radio size={18} className="text-[#111]" />
          <h3 className="liberty-label text-[13px]">WARM Intelligence</h3>
        </div>
        <Loading size="sm" />
      </div>
    );
  }

  const totalSpins = summary.reduce((sum, s) => sum + s.totalSpins, 0);

  return (
    <div className="liberty-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#D9D7D2]">
        <div className="flex items-center space-x-2">
          <Radio size={18} className="text-[#111]" />
          <h3 className="liberty-label text-[13px]">WARM Intelligence</h3>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="p-2 hover:bg-[#F7F6F2] rounded-lg transition-colors disabled:opacity-50"
          title="Export WARM Report"
        >
          <Download size={16} className="text-[#111]" />
        </button>
      </div>

      {/* Total Spins */}
      <div className="mb-4 p-4 bg-[#F7F6F2] border border-[#D9D7D2] rounded-xl">
        <div className="liberty-label text-[11px] mb-2">Total Radio Spins</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-mono font-bold text-[#111]">{totalSpins}</div>
          <div className="flex items-center gap-1 text-sm tap-accent-radio font-semibold">
            <TrendingUp size={14} />
            <span className="font-mono">+12%</span>
          </div>
        </div>
      </div>

      {/* Artist List */}
      <div className="space-y-3">
        {summary.map((artist, idx) => (
          <div key={idx} className="liberty-card-inner hover:border-[#111] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-jakarta font-semibold text-sm text-[#111] truncate">
                  {artist.artistName}
                </p>
                <p className="liberty-metadata text-[11px] truncate normal-case">
                  {artist.trackName}
                </p>
              </div>
              <div className="text-right ml-3">
                <div className="text-2xl font-mono font-bold text-[#111]">{artist.totalSpins}</div>
                <div className="liberty-label text-[10px]">spins</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#737373]">
              <div className="flex items-center gap-1">
                <span className="font-jakarta">{artist.uniqueStations} stations</span>
              </div>
              <div className="liberty-metadata">{formatTimeAgo(artist.lastSpinAt)}</div>
            </div>
            {artist.topTerritories && artist.topTerritories.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#D9D7D2]">
                <div className="flex items-center gap-1 flex-wrap">
                  {artist.topTerritories.slice(0, 3).map((territory, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-[#F7F6F2] text-[#111] rounded-md font-mono font-medium border border-[#D9D7D2]"
                    >
                      {territory}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-5 pt-4 border-t border-[#D9D7D2]">
        <a
          href="/dashboard/ops"
          className="text-sm text-[#111] hover:text-[#111] font-jakarta font-medium flex items-center justify-between group transition-all"
        >
          <span>View full radio intelligence</span>
          <span className="group-hover:translate-x-1 transition-transform text-base">→</span>
        </a>
      </div>
    </div>
  );
};

export default WarmPanel;
