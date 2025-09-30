import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getCampaigns } from '@/lib/campaigns';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CampaignStats } from '@/components/campaigns/CampaignStats';

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const campaigns = await getCampaigns();
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Campaigns</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage and track all your music campaigns in one place</p>
        </div>
        <a
          href="/campaigns/new"
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          + New Campaign
        </a>
      </div>
      <CampaignStats campaigns={campaigns} />
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
