/**
 * Live Indicator Component
 *
 * Animated indicator showing live feed status
 */

'use client';

interface LiveIndicatorProps {
  isLive: boolean;
}

export function LiveIndicator({ isLive }: LiveIndicatorProps) {
  if (!isLive) {
    return (
      <div className="flex items-center space-x-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1">
        <div className="h-2 w-2 rounded-full bg-slate-500" />
        <span className="text-xs font-medium text-slate-400">Paused</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 rounded-full border border-[#3AA9BE]/30 bg-[#3AA9BE]/10 px-3 py-1">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3AA9BE] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3AA9BE]" />
      </div>
      <span className="text-xs font-medium text-[#3AA9BE]">LIVE</span>
    </div>
  );
}
