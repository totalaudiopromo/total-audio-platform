'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  tier: string;
  betaAccess: boolean;
}

export function UsageStats() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !usage) {
    return null;
  }

  const percentageUsed = usage.percentage;
  const isNearLimit = percentageUsed >= 80;
  const isAtLimit = percentageUsed >= 100;

  return (
    <div className="flex items-center gap-3">
      {/* Usage badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-2 border-gray-200 rounded-lg">
        <Zap className={`h-4 w-4 ${isNearLimit ? 'text-amber-500' : 'text-blue-500'}`} />
        <span className="text-sm font-semibold text-gray-700">
          {usage.used}/{usage.limit}
        </span>
      </div>

      {/* Warning for near limit */}
      {isNearLimit && !isAtLimit && (
        <Link href="/pricing">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-700 cursor-pointer">
            <AlertCircle className="h-3 w-3 mr-1" />
            {usage.remaining} left
          </Badge>
        </Link>
      )}

      {/* Upgrade CTA for at limit */}
      {isAtLimit && (
        <Link href="/pricing">
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-700 cursor-pointer animate-pulse">
            <TrendingUp className="h-3 w-3 mr-1" />
            Upgrade
          </Badge>
        </Link>
      )}
    </div>
  );
}

export function UsageStatsDetailed() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const percentageUsed = usage.percentage;
  const isNearLimit = percentageUsed >= 80;
  const isAtLimit = percentageUsed >= 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`h-5 w-5 ${isNearLimit ? 'text-amber-500' : 'text-blue-500'}`} />
          <span className="text-sm font-semibold text-gray-700">
            {usage.used} / {usage.limit} enrichments
          </span>
        </div>
        {usage.betaAccess && (
          <Badge variant="outline" className="text-xs">
            Beta Access
          </Badge>
        )}
      </div>

      <Progress value={percentageUsed} className="h-2" />

      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{usage.remaining} remaining</span>
        <span>{percentageUsed.toFixed(0)}% used</span>
      </div>

      {isNearLimit && (
        <div
          className={`p-3 rounded-lg border-2 ${
            isAtLimit ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <p
            className={`text-sm font-semibold mb-2 ${
              isAtLimit ? 'text-red-800' : 'text-amber-800'
            }`}
          >
            {isAtLimit ? '🚫 Limit Reached' : '⚠️ Running Low'}
          </p>
          <p className={`text-xs mb-3 ${isAtLimit ? 'text-red-700' : 'text-amber-700'}`}>
            {isAtLimit
              ? 'You have used all your beta enrichments. Upgrade to continue.'
              : `Only ${usage.remaining} enrichments remaining. Upgrade for unlimited access.`}
          </p>
          <Link href="/pricing">
            <button
              className={`w-full py-2 px-4 rounded-lg font-bold text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isAtLimit ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              Upgrade Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
