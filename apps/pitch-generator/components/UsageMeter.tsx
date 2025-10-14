'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp } from 'lucide-react';
import { trackUpgradeClicked, trackUsageLimitReached } from '@/lib/analytics';

interface UsageMeterProps {
  userId: string;
  className?: string;
}

interface UsageData {
  currentUsage: number;
  limit: number;
  tier: 'free' | 'professional' | 'bundle' | 'agency';
  percentageUsed: number;
}

export function UsageMeter({ userId, className = '' }: UsageMeterProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage');
        if (!response.ok) {
          console.error('Failed to fetch usage data');
          return;
        }

        const data = await response.json();
        setUsage(data);

        // Track if user has reached their limit
        if (data.tier === 'free' && data.currentUsage >= data.limit) {
          trackUsageLimitReached(data.currentUsage);
        }
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
  }, [userId]);

  if (isLoading) {
    return (
      <div className={`glass-panel px-6 py-4 animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!usage || usage.tier !== 'free') {
    // Don't show meter for non-free users
    return null;
  }

  const { currentUsage, limit, percentageUsed } = usage;
  const remaining = limit - currentUsage;
  const isNearLimit = percentageUsed >= 80;
  const isAtLimit = currentUsage >= limit;

  return (
    <div className={`glass-panel relative overflow-hidden ${className}`}>
      {/* Background gradient based on usage */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isNearLimit
            ? 'bg-gradient-to-br from-yellow-50/80 to-orange-50/80 opacity-100'
            : 'bg-gradient-to-br from-amber-50/50 to-amber-50/50 opacity-50'
        }`}
      />

      <div className="relative px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className={`h-5 w-5 ${isNearLimit ? 'text-yellow-600' : 'text-brand-amber'}`} />
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Free Tier Usage
              </h3>
              <p className="text-xs text-gray-600">
                {currentUsage} / {limit} pitches this month
              </p>
            </div>
          </div>

          {isNearLimit && (
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {isAtLimit ? 'Limit Reached' : 'Almost Full'}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                isAtLimit
                  ? 'bg-red-600'
                  : isNearLimit
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-amber-600 to-amber-600'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={`font-medium ${isAtLimit ? 'text-red-600' : 'text-gray-600'}`}>
              {remaining} {remaining === 1 ? 'pitch' : 'pitches'} remaining
            </span>
            <span className="text-gray-500">{Math.round(percentageUsed)}%</span>
          </div>
        </div>

        {/* Upgrade CTA */}
        {isNearLimit && (
          <div className={`mt-4 rounded-xl border-2 p-4 ${
            isAtLimit
              ? 'border-red-600 bg-red-50'
              : 'border-yellow-500 bg-yellow-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <TrendingUp className={`h-5 w-5 ${isAtLimit ? 'text-red-600' : 'text-yellow-700'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${isAtLimit ? 'text-red-900' : 'text-yellow-900'}`}>
                  {isAtLimit ? 'You\'ve reached your free limit' : 'Running low on pitches'}
                </h4>
                <p className={`mt-1 text-xs ${isAtLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                  {isAtLimit
                    ? 'Upgrade to PRO for unlimited pitch generation and priority support'
                    : `Upgrade to PRO now and never worry about limits again. Only £12/month for unlimited pitches.`}
                </p>
                <Link
                  href="/pricing"
                  onClick={() => trackUpgradeClicked('usage_meter', 'professional')}
                  className={`mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 ${
                    isAtLimit
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Upgrade to PRO
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info for users not near limit */}
        {!isNearLimit && (
          <div className="mt-3 text-xs text-gray-600">
            <p>
              Need more? <Link href="/pricing" onClick={() => trackUpgradeClicked('usage_meter_info', 'professional')} className="text-amber-600 hover:underline font-medium">Upgrade to PRO</Link> for unlimited pitches (£12/month)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
