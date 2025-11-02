/**
 * User Lifecycle Stage Definitions
 * Tracks user progression through product lifecycle
 */

export enum LifecycleStage {
  TRIAL = 'trial',
  ACTIVE = 'active',
  AT_RISK = 'at_risk',
  CHURNED = 'churned',
  REACTIVATED = 'reactivated',
}

export interface LifecycleTransition {
  from: LifecycleStage;
  to: LifecycleStage;
  reason: string;
  timestamp: Date;
  triggeredBy: 'system' | 'manual' | 'event';
}

export interface UserLifecycleStatus {
  userId: string;
  currentStage: LifecycleStage;
  previousStage?: LifecycleStage;
  stageEnteredAt: Date;
  daysSinceStageChange: number;
  engagementScore: number;
  transitions: LifecycleTransition[];
}

/**
 * Stage transition rules based on user behavior
 */
export const STAGE_TRANSITION_RULES = {
  // Trial -> Active: User makes first payment
  TRIAL_TO_ACTIVE: {
    condition: 'first_payment',
    description: 'User subscribed to paid plan',
  },

  // Active -> At Risk: No activity for 7 days
  ACTIVE_TO_AT_RISK: {
    condition: 'inactive_7_days',
    description: 'No engagement for 7 days',
    threshold: 7,
  },

  // At Risk -> Churned: No activity for 30 days or cancelled subscription
  AT_RISK_TO_CHURNED: {
    condition: 'inactive_30_days_or_cancelled',
    description: 'Extended inactivity or cancellation',
    threshold: 30,
  },

  // At Risk -> Active: User re-engages
  AT_RISK_TO_ACTIVE: {
    condition: 'recent_activity',
    description: 'User resumed engagement',
  },

  // Churned -> Reactivated: User comes back and engages
  CHURNED_TO_REACTIVATED: {
    condition: 'reengagement_after_churn',
    description: 'User returned after churning',
  },

  // Reactivated -> Active: Sustained engagement for 7 days
  REACTIVATED_TO_ACTIVE: {
    condition: 'sustained_engagement',
    description: 'Consistent activity after reactivation',
    threshold: 7,
  },
} as const;

/**
 * Stage thresholds and criteria
 */
export const STAGE_CRITERIA = {
  [LifecycleStage.TRIAL]: {
    description: 'New user, no payment yet',
    maxDays: 14,
    minEngagement: 0,
  },

  [LifecycleStage.ACTIVE]: {
    description: 'Paying customer with regular engagement',
    minDaysActive: 1,
    minEngagement: 40,
    minActivityDays: 2, // Active at least 2 days per week
  },

  [LifecycleStage.AT_RISK]: {
    description: 'Paying customer with declining engagement',
    inactiveDays: 7,
    maxEngagement: 39,
  },

  [LifecycleStage.CHURNED]: {
    description: 'Cancelled or inactive for extended period',
    inactiveDays: 30,
    engagementScore: 0,
  },

  [LifecycleStage.REACTIVATED]: {
    description: 'Returned after churning',
    minEngagement: 30,
    maxDaysSinceReturn: 14,
  },
} as const;

/**
 * Determine lifecycle stage based on user data
 */
export function determineLifecycleStage(params: {
  hasPayment: boolean;
  daysSinceLastActivity: number;
  engagementScore: number;
  subscriptionStatus: 'active' | 'cancelled' | 'none';
  daysSinceSignup: number;
}): LifecycleStage {
  const {
    hasPayment,
    daysSinceLastActivity,
    engagementScore,
    subscriptionStatus,
    daysSinceSignup,
  } = params;

  // Churned: No payment OR cancelled subscription OR 30+ days inactive
  if (
    (!hasPayment && daysSinceSignup > 14) ||
    subscriptionStatus === 'cancelled' ||
    daysSinceLastActivity >= 30
  ) {
    return LifecycleStage.CHURNED;
  }

  // Trial: No payment yet, within 14 days of signup
  if (!hasPayment && daysSinceSignup <= 14) {
    return LifecycleStage.TRIAL;
  }

  // At Risk: Has payment but 7+ days inactive OR low engagement
  if (hasPayment && (daysSinceLastActivity >= 7 || engagementScore < 40)) {
    return LifecycleStage.AT_RISK;
  }

  // Active: Has payment and regular engagement
  if (hasPayment && daysSinceLastActivity < 7 && engagementScore >= 40) {
    return LifecycleStage.ACTIVE;
  }

  // Reactivated: Recently returned after period of inactivity
  // (This would require more complex logic to track previous churn state)

  // Default to trial
  return LifecycleStage.TRIAL;
}

/**
 * Check if stage transition should occur
 */
export function shouldTransitionStage(
  currentStage: LifecycleStage,
  newStage: LifecycleStage
): boolean {
  // Don't transition if stages are the same
  if (currentStage === newStage) {
    return false;
  }

  // Define valid transitions
  const validTransitions: Record<LifecycleStage, LifecycleStage[]> = {
    [LifecycleStage.TRIAL]: [LifecycleStage.ACTIVE, LifecycleStage.CHURNED],
    [LifecycleStage.ACTIVE]: [LifecycleStage.AT_RISK, LifecycleStage.CHURNED],
    [LifecycleStage.AT_RISK]: [LifecycleStage.ACTIVE, LifecycleStage.CHURNED],
    [LifecycleStage.CHURNED]: [LifecycleStage.REACTIVATED],
    [LifecycleStage.REACTIVATED]: [LifecycleStage.ACTIVE, LifecycleStage.CHURNED],
  };

  return validTransitions[currentStage]?.includes(newStage) || false;
}

/**
 * Get stage display information
 */
export function getStageInfo(stage: LifecycleStage): {
  label: string;
  colour: string;
  icon: string;
  description: string;
} {
  const stageInfo = {
    [LifecycleStage.TRIAL]: {
      label: 'Trial',
      colour: 'blue',
      icon: '🆕',
      description: 'New user exploring the product',
    },
    [LifecycleStage.ACTIVE]: {
      label: 'Active',
      colour: 'green',
      icon: '✅',
      description: 'Engaged paying customer',
    },
    [LifecycleStage.AT_RISK]: {
      label: 'At Risk',
      colour: 'yellow',
      icon: '⚠️',
      description: 'Customer with declining engagement',
    },
    [LifecycleStage.CHURNED]: {
      label: 'Churned',
      colour: 'red',
      icon: '❌',
      description: 'Inactive or cancelled customer',
    },
    [LifecycleStage.REACTIVATED]: {
      label: 'Reactivated',
      colour: 'purple',
      icon: '🔄',
      description: 'Customer who returned after churning',
    },
  };

  return stageInfo[stage];
}
