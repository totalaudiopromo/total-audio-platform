import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Campaign {params.id}</h2>
      <p className="text-slate-600">Form coming soon.</p>
    </div>
  );
}
