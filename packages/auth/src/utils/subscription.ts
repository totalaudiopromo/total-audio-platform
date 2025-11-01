/**
 * Subscription utility functions for Total Audio platform
 */

import type { SubscriptionTier, SubscriptionStatus } from '../types';

/**
 * Check if a subscription status is considered active
 */
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing';
}

/**
 * Check if a subscription requires payment attention
 */
export function requiresPaymentAction(status: SubscriptionStatus): boolean {
  return (
    status === 'past_due' ||
    status === 'incomplete' ||
    status === 'incomplete_expired' ||
    status === 'unpaid'
  );
}

/**
 * Get user-friendly subscription status message
 */
export function getSubscriptionStatusMessage(status: SubscriptionStatus): string {
  const messages: Record<SubscriptionStatus, string> = {
    active: 'Your subscription is active',
    trialing: 'You are on a trial period',
    cancelled: 'Your subscription has been cancelled',
    past_due: 'Payment is past due',
    incomplete: 'Payment is incomplete',
    incomplete_expired: 'Payment attempt expired',
    unpaid: 'Subscription is unpaid',
  };

  return messages[status] || 'Unknown subscription status';
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Free',
    pro: 'Professional',
    agency: 'Agency',
    bundle: 'Total Audio Bundle',
  };

  return names[tier];
}

/**
 * Get tier features description
 */
export function getTierFeatures(tier: SubscriptionTier): string[] {
  const features: Record<SubscriptionTier, string[]> = {
    free: ['10 contact enrichments per month', 'Audio Intel access', 'Basic export features'],
    pro: [
      'Unlimited contact enrichments',
      'Audio Intel full access',
      'Advanced export formats',
      'Priority support',
    ],
    agency: [
      'Unlimited contact enrichments',
      'Audio Intel full access',
      'Team collaboration features',
      'Agency dashboard',
      'Priority support',
    ],
    bundle: [
      'Access to ALL Total Audio tools',
      'Audio Intel (unlimited)',
      'Tracker (campaign management)',
      'Pitch Generator (AI-powered)',
      'Command Centre (productivity)',
      'Priority support',
      'Early access to new features',
    ],
  };

  return features[tier] || [];
}

/**
 * Get tier pricing (monthly)
 */
export function getTierPricing(tier: SubscriptionTier): {
  monthly: number;
  annual: number;
  currency: string;
} {
  const pricing: Record<SubscriptionTier, { monthly: number; annual: number; currency: string }> = {
    free: { monthly: 0, annual: 0, currency: 'GBP' },
    pro: { monthly: 19, annual: 190, currency: 'GBP' }, // ~£15.83/month if annual
    agency: { monthly: 79, annual: 790, currency: 'GBP' }, // ~£65.83/month if annual
    bundle: { monthly: 99, annual: 990, currency: 'GBP' }, // ~£82.50/month if annual
  };

  return pricing[tier];
}

/**
 * Calculate days until subscription period ends
 */
export function getDaysUntilPeriodEnd(periodEnd: string | null): number | null {
  if (!periodEnd) return null;

  const endDate = new Date(periodEnd);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(periodEnd: string | null): boolean {
  const days = getDaysUntilPeriodEnd(periodEnd);
  return days !== null && days > 0 && days <= 7;
}

/**
 * Format subscription period end date
 */
export function formatPeriodEndDate(periodEnd: string | null): string {
  if (!periodEnd) return 'No end date';

  const date = new Date(periodEnd);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
