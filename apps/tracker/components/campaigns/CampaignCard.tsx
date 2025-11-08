import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { StatusBadge } from '@/components/campaigns/StatusBadge';

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
              {campaign.name || campaign.artist_name || 'Untitled Campaign'}
            </h3>
            <p className="text-sm text-gray-700 font-bold">
              {campaign.artist_name}
            </p>
          </div>
          <StatusBadge status={campaign.status} />
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-gray-700">Budget:</span>
            <span className="text-gray-900 font-bold">
              £{Number(campaign.budget).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-gray-700">Timeline:</span>
            <span className="text-gray-900 font-bold">
              {campaign.start_date || '—'} → {campaign.end_date || '—'}
            </span>
          </div>
          {Array.isArray(campaign.platforms) &&
            campaign.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {campaign.platforms.slice(0, 3).map(platform => (
                  <span
                    key={platform}
                    className="px-2 py-1 bg-teal-100 text-teal-800 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {platform}
                  </span>
                ))}
                {campaign.platforms.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    +{campaign.platforms.length - 3}
                  </span>
                )}
              </div>
            )}
        </div>

        <div className="pt-4 border-t-2 border-black">
          <div className="flex gap-3">
            <span className="text-teal-600 text-sm font-black group-hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
