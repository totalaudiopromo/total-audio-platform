/**
 * Overview Cards - Key Metrics Summary
 */

import type { FusionContext } from '@total-audio/fusion-layer';
import { Activity, Users, Mail, TrendingUp } from 'lucide-react';

interface Props {
  context: FusionContext;
}

export function OverviewCards({ context }: Props) {
  const cards = [
    {
      title: 'Total Contacts',
      value: context.intel.totalContacts.toLocaleString(),
      change: '+12% this month',
      icon: Users,
      color: 'cyan',
    },
    {
      title: 'Active Campaigns',
      value: context.tracker.activeCampaigns.toString(),
      change: `${context.tracker.totalCampaigns} total`,
      icon: Activity,
      color: 'blue',
    },
    {
      title: 'Email Performance',
      value: `${context.email.performanceMetrics.avgOpenRate.toFixed(1)}%`,
      change: 'Avg open rate',
      icon: Mail,
      color: 'purple',
    },
    {
      title: 'Response Rate',
      value: `${context.tracker.performanceMetrics.successRate.toFixed(1)}%`,
      change: 'Campaign success',
      icon: TrendingUp,
      color: 'green',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-[#3AA9BE]/10 p-2">
                <Icon className="h-5 w-5 text-[#3AA9BE]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-zinc-400">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{card.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
