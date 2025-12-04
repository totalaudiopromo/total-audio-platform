import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName =
    user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  return <DashboardLayout userName={userName}>{children}</DashboardLayout>;
}
