import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { createCampaign } from '@/lib/campaigns';

export default async function NewCampaignPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  async function handleCreate(values: any) {
    'use server';
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    const payload = {
      name: values.name,
      artist_name: values.artist_name,
      release_type: values.release_type || null,
      budget: Number(values.budget || 0),
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      platforms: values.platforms,
      goals: values.goals ? { notes: values.goals } : {},
      status: 'draft' as const,
    };
    await createCampaign(payload as any);
    redirect('/campaigns');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Create Campaign</h2>
      <CampaignForm onSubmit={handleCreate} />
    </div>
  );
}
