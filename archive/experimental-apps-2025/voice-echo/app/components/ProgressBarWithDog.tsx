import React from 'react';
import Image from 'next/image';
import { Sparkles, Zap } from 'lucide-react';

interface ProgressBarWithDogProps {
  current: number;
  total: number;
}

export default function ProgressBarWithDog({ current, total }: ProgressBarWithDogProps) {
  const percent = Math.round((current / total) * 100);

  const getProgressMessage = () => {
    if (percent < 25) return 'Starting AI analysis...';
    if (percent < 50) return 'Researching music industry contacts...';
    if (percent < 75) return 'Gathering contact intelligence...';
    if (percent < 100) return 'Finalizing enrichment data...';
    return 'Enrichment complete!';
  };

  const getProgressColor = () => {
    if (percent < 25) return 'from-blue-400 to-cyan-400';
    if (percent < 50) return 'from-cyan-400 to-indigo-400';
    if (percent < 75) return 'from-indigo-400 to-purple-400';
    return 'from-purple-400 to-pink-400';
  };

  return (
    <div className="flex flex-col items-center w-full py-6 animate-in fade-in duration-300">
      {/* Enhanced Dog Logo with Animation */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-full p-4 mb-6 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <Image
          src="/dog-logo.png"
          alt="Loading dog logo"
          width={60}
          height={60}
          className="animate-spin-slow relative z-10"
          style={{ height: 60, width: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
        />
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl h-6 overflow-hidden p-1 relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"></div>

          {/* Progress fill with enhanced styling */}
          <div
            className={`bg-gradient-to-r ${getProgressColor()} h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${percent}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

            {/* Progress indicator dots */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white bg-opacity-60 rounded-full animate-pulse"></div>
                <div
                  className="w-1 h-1 bg-white bg-opacity-40 rounded-full animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-1 h-1 bg-white bg-opacity-20 rounded-full animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Text */}
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-white flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          {getProgressMessage()}
        </div>
        <div className="text-sm text-white/70 font-medium">
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

      {/* Loading Animation */}
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  );
}
