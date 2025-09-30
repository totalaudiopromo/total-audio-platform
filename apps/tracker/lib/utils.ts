import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SubscriptionStatus = 'trialing'|'active'|'past_due'|'canceled'|'unpaid'|'incomplete'|'incomplete_expired'|'paused'|'none';

export function isPro(status: SubscriptionStatus | null | undefined): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}

