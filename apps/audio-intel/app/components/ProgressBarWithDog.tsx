import React from 'react';
import { Zap } from 'lucide-react';
import ContactLoadingState, { LoadingState } from '@/app/components/ContactLoadingState';

interface ProgressBarWithDogProps {
  current: number;
  total: number;
}

export default function ProgressBarWithDog({ current, total }: ProgressBarWithDogProps) {
  const percent = Math.round((current / total) * 100);

  const getLoadingState = (): LoadingState => {
    if (percent === 0) return 'upload';
    if (percent < 50) return 'processing';
    if (percent < 100) return 'analysing';
    return 'success';
  };

  const getProgressMessage = () => {
    if (percent === 0) return 'Preparing to upload your contacts...';
    if (percent < 25) return 'Starting AI analysis...';
    if (percent < 50) return 'Researching music industry contacts...';
    if (percent < 75) return 'Gathering contact intelligence...';
    if (percent < 100) return 'Finalizing enrichment data...';
    return 'Enrichment complete!';
  };

  return (
    <div className="flex flex-col items-center w-full py-6 animate-in fade-in duration-300">
      {/* New Animated Character Loading State */}
      <ContactLoadingState
        state={getLoadingState()}
        progress={percent}
        message={getProgressMessage()}
      />

      {/* Progress Details */}
      <div className="text-center space-y-2 mt-4">
        <div className="text-lg font-semibold text-white flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          {current} of {total} contacts enriched
        </div>
        <div className="text-2xl font-bold gradient-text">{percent}%</div>
      </div>

      {/* Progress Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="card-glass-hover text-center p-3">
          <div className="text-lg font-bold text-white">{current}</div>
          <div className="text-xs text-white/60">Processed</div>
        </div>
        <div className="card-glass-hover text-center p-3">
          <div className="text-lg font-bold text-white">{total - current}</div>
          <div className="text-xs text-white/60">Remaining</div>
        </div>
      </div>
    </div>
  );
}
