import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getUserSubscriptionDetails,
  getSubscriptionLimits,
  getPricingTiers,
} from '@/lib/subscription';
import { BillingDashboard } from '@/components/billing/BillingDashboard';

export const metadata: Metadata = {
  title: 'Billing & Subscription | Campaign Tracker',
  description: 'Manage your subscription and billing settings',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile to determine user type
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('id', user.id)
    .single();

  const userType = profile?.user_type === 'agency' ? 'agency' : 'artist';

  // Get subscription details
  const subscriptionDetails = await getUserSubscriptionDetails(user.id);
  const limits = await getSubscriptionLimits(user.id);
  const pricingTiers = await getPricingTiers(userType);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">
          Manage your subscription plan and billing information
        </p>
      </div>

      <BillingDashboard
        subscriptionDetails={subscriptionDetails}
        limits={limits}
        pricingTiers={pricingTiers}
        userType={userType}
      />
    </div>
  );
}
