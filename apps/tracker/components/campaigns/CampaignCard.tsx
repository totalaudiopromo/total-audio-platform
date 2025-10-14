import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { StatusBadge } from '@/components/campaigns/StatusBadge';

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-purple-700 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
              {campaign.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{campaign.artist_name}</p>
          </div>
          <StatusBadge status={campaign.status} />
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Budget:</span>
            <span className="text-slate-600 dark:text-slate-400">£{Number(campaign.budget).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Timeline:</span>
            <span className="text-slate-600 dark:text-slate-400">
              {campaign.start_date || '—'} → {campaign.end_date || '—'}
            </span>
          </div>
          {Array.isArray(campaign.platforms) && campaign.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {campaign.platforms.slice(0, 3).map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-blue-100 dark:bg-purple-900/30 text-purple-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                >
                  {platform}
                </span>
              ))}
              {campaign.platforms.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium">
                  +{campaign.platforms.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-3">
            <span className="text-purple-600 dark:text-blue-400 text-sm font-semibold group-hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}




