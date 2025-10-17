import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/total_audio_promo_logo_trans.png"
            alt="Total Audio Promo Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-black text-gray-900">Tracker</h1>
          <p className="text-gray-700 font-bold mt-2">Music Campaign Management</p>
        </div>
        {children}
      </div>
    </div>
  );
}
