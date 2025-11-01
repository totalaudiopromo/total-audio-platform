// Beta Access Control System
// Manages 14-day free trial for beta users

export interface BetaUser {
  email: string;
  signupDate: string;
  trialExpiresAt: string;
  hasLifetimeDiscount: boolean;
  status: 'active' | 'expired' | 'converted';
}

export function calculateTrialExpiry(signupDate: Date): Date {
  const expiry = new Date(signupDate);
  expiry.setDate(expiry.getDate() + 14); // 14-day trial
  return expiry;
}

export function checkTrialStatus(signupDate: string): {
  isActive: boolean;
  daysRemaining: number;
  hasExpired: boolean;
  expiresAt: Date;
} {
  const signup = new Date(signupDate);
  const expiry = calculateTrialExpiry(signup);
  const now = new Date();

  const msRemaining = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  return {
    isActive: daysRemaining > 0,
    daysRemaining: Math.max(0, daysRemaining),
    hasExpired: daysRemaining <= 0,
    expiresAt: expiry,
  };
}

export function getBetaUserStatus(email: string, signupTimestamp: string) {
  const trialStatus = checkTrialStatus(signupTimestamp);

  return {
    email,
    signupDate: signupTimestamp,
    trialExpiresAt: trialStatus.expiresAt.toISOString(),
    daysRemaining: trialStatus.daysRemaining,
    hasAccess: trialStatus.isActive,
    hasExpired: trialStatus.hasExpired,
    hasLifetimeDiscount: true, // All beta users get 50% lifetime discount
    discountPrice: '£9.99/month', // 50% off £19.99
    regularPrice: '£19.99/month',
  };
}

export function generateTrialExpiryMessage(daysRemaining: number): string {
  if (daysRemaining > 7) {
    return `You have ${daysRemaining} days left in your free beta trial.`;
  } else if (daysRemaining > 1) {
    return `⚠️ Your free trial expires in ${daysRemaining} days. Secure your 50% lifetime discount!`;
  } else if (daysRemaining === 1) {
    return `🚨 Last day of your free trial! Lock in £9.99/month forever (50% off) before it expires.`;
  } else {
    return `Your free trial has expired. Upgrade now to keep using Audio Intel with your exclusive 50% lifetime discount.`;
  }
}
