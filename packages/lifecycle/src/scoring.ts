/**
 * User Engagement Scoring System
 * Calculates engagement scores based on user activity
 */

export interface EngagementMetrics {
  userId: string;
  periodStart: Date;
  periodEnd: Date;

  // Activity metrics
  loginCount: number;
  enrichmentCount: number;
  exportCount: number;
  spreadsheetUploadCount: number;
  contactsEnriched: number;

  // Time-based metrics
  daysSinceLastLogin: number;
  daysSinceLastEnrichment: number;
  consecutiveDaysActive: number;

  // Product adoption
  featuresUsed: string[];
  hasCompletedOnboarding: boolean;
}

export interface EngagementScore {
  userId: string;
  score: number; // 0-100
  breakdown: {
    activity: number; // 0-40 points
    frequency: number; // 0-30 points
    recency: number; // 0-20 points
    adoption: number; // 0-10 points
  };
  calculatedAt: Date;
}

/**
 * Score thresholds for lifecycle stages
 */
export const ENGAGEMENT_THRESHOLDS = {
  HIGHLY_ENGAGED: 70, // Active users
  MODERATELY_ENGAGED: 40, // Borderline users
  LOW_ENGAGEMENT: 20, // At-risk users
  INACTIVE: 0, // Churned users
} as const;

/**
 * Activity score weights
 */
const ACTIVITY_WEIGHTS = {
  enrichment: 5, // Most valuable action
  export: 3, // Shows data usage
  login: 1, // Basic engagement
  spreadsheetUpload: 4, // Shows intent to use
} as const;

/**
 * Calculate activity score (0-40 points)
 * Based on weighted actions over the period
 */
function calculateActivityScore(metrics: EngagementMetrics): number {
  const { enrichmentCount, exportCount, loginCount, spreadsheetUploadCount } = metrics;

  let rawScore = 0;
  rawScore += enrichmentCount * ACTIVITY_WEIGHTS.enrichment;
  rawScore += exportCount * ACTIVITY_WEIGHTS.export;
  rawScore += loginCount * ACTIVITY_WEIGHTS.login;
  rawScore += spreadsheetUploadCount * ACTIVITY_WEIGHTS.spreadsheetUpload;

  // Cap at 40 points (e.g., 8 enrichments would max out)
  return Math.min(40, rawScore);
}

/**
 * Calculate frequency score (0-30 points)
 * Based on consistency of usage over time
 */
function calculateFrequencyScore(metrics: EngagementMetrics): number {
  const { consecutiveDaysActive, enrichmentCount, loginCount } = metrics;

  let score = 0;

  // Consecutive days active (0-15 points)
  // 7+ consecutive days = 15 points
  score += Math.min(15, consecutiveDaysActive * 2);

  // Regular usage pattern (0-15 points)
  // Multiple enrichments per week shows regular usage
  const periodDays = Math.max(
    1,
    Math.floor(
      (metrics.periodEnd.getTime() - metrics.periodStart.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const enrichmentsPerWeek = (enrichmentCount / periodDays) * 7;

  if (enrichmentsPerWeek >= 3) {
    score += 15; // Power user
  } else if (enrichmentsPerWeek >= 1) {
    score += 10; // Regular user
  } else if (enrichmentsPerWeek >= 0.5) {
    score += 5; // Occasional user
  }

  return Math.min(30, score);
}

/**
 * Calculate recency score (0-20 points)
 * Based on how recently user was active
 */
function calculateRecencyScore(metrics: EngagementMetrics): number {
  const { daysSinceLastLogin, daysSinceLastEnrichment } = metrics;

  let score = 0;

  // Login recency (0-10 points)
  if (daysSinceLastLogin === 0) {
    score += 10; // Logged in today
  } else if (daysSinceLastLogin === 1) {
    score += 8; // Yesterday
  } else if (daysSinceLastLogin <= 3) {
    score += 6; // Within 3 days
  } else if (daysSinceLastLogin <= 7) {
    score += 3; // Within a week
  }

  // Enrichment recency (0-10 points)
  if (daysSinceLastEnrichment === 0) {
    score += 10; // Enriched today
  } else if (daysSinceLastEnrichment === 1) {
    score += 8; // Yesterday
  } else if (daysSinceLastEnrichment <= 3) {
    score += 6; // Within 3 days
  } else if (daysSinceLastEnrichment <= 7) {
    score += 3; // Within a week
  }

  return Math.min(20, score);
}

/**
 * Calculate product adoption score (0-10 points)
 * Based on feature usage and onboarding completion
 */
function calculateAdoptionScore(metrics: EngagementMetrics): number {
  const { featuresUsed, hasCompletedOnboarding, contactsEnriched } = metrics;

  let score = 0;

  // Onboarding completion (0-3 points)
  if (hasCompletedOnboarding) {
    score += 3;
  }

  // Feature diversity (0-4 points)
  // More features used = better product understanding
  const featureCount = featuresUsed.length;
  if (featureCount >= 5) {
    score += 4; // Power user
  } else if (featureCount >= 3) {
    score += 3; // Regular user
  } else if (featureCount >= 2) {
    score += 2; // Basic user
  } else if (featureCount >= 1) {
    score += 1; // Trying features
  }

  // Data volume (0-3 points)
  // Number of contacts enriched shows real usage
  if (contactsEnriched >= 100) {
    score += 3; // Heavy user
  } else if (contactsEnriched >= 50) {
    score += 2; // Regular user
  } else if (contactsEnriched >= 10) {
    score += 1; // Light user
  }

  return Math.min(10, score);
}

/**
 * Calculate comprehensive engagement score
 */
export function calculateEngagementScore(metrics: EngagementMetrics): EngagementScore {
  const activity = calculateActivityScore(metrics);
  const frequency = calculateFrequencyScore(metrics);
  const recency = calculateRecencyScore(metrics);
  const adoption = calculateAdoptionScore(metrics);

  const totalScore = activity + frequency + recency + adoption;

  return {
    userId: metrics.userId,
    score: Math.min(100, Math.round(totalScore)),
    breakdown: {
      activity: Math.round(activity),
      frequency: Math.round(frequency),
      recency: Math.round(recency),
      adoption: Math.round(adoption),
    },
    calculatedAt: new Date(),
  };
}

/**
 * Get engagement level label based on score
 */
export function getEngagementLevel(
  score: number
): 'highly_engaged' | 'moderately_engaged' | 'low_engagement' | 'inactive' {
  if (score >= ENGAGEMENT_THRESHOLDS.HIGHLY_ENGAGED) {
    return 'highly_engaged';
  } else if (score >= ENGAGEMENT_THRESHOLDS.MODERATELY_ENGAGED) {
    return 'moderately_engaged';
  } else if (score >= ENGAGEMENT_THRESHOLDS.LOW_ENGAGEMENT) {
    return 'low_engagement';
  } else {
    return 'inactive';
  }
}

/**
 * Get engagement trend based on historical scores
 */
export function getEngagementTrend(
  currentScore: number,
  previousScore: number
): 'improving' | 'stable' | 'declining' {
  const difference = currentScore - previousScore;

  if (difference >= 10) {
    return 'improving';
  } else if (difference <= -10) {
    return 'declining';
  } else {
    return 'stable';
  }
}

/**
 * Predict churn risk based on engagement score and trend
 */
export function predictChurnRisk(
  score: number,
  trend: 'improving' | 'stable' | 'declining',
  daysSinceLastActivity: number
): 'high' | 'medium' | 'low' {
  // High risk: Low score + declining trend + inactive
  if (
    score < ENGAGEMENT_THRESHOLDS.MODERATELY_ENGAGED &&
    trend === 'declining' &&
    daysSinceLastActivity >= 7
  ) {
    return 'high';
  }

  // Medium risk: Moderate score but declining, or low score but stable
  if (
    (score < ENGAGEMENT_THRESHOLDS.HIGHLY_ENGAGED && trend === 'declining') ||
    (score < ENGAGEMENT_THRESHOLDS.MODERATELY_ENGAGED && daysSinceLastActivity >= 3)
  ) {
    return 'medium';
  }

  // Low risk: High score or improving trend
  return 'low';
}

/**
 * Generate engagement insights for user
 */
export function generateEngagementInsights(
  score: EngagementScore,
  trend: 'improving' | 'stable' | 'declining',
  churnRisk: 'high' | 'medium' | 'low'
): {
  summary: string;
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
} {
  const insights = {
    summary: '',
    strengths: [] as string[],
    opportunities: [] as string[],
    recommendations: [] as string[],
  };

  // Generate summary
  const level = getEngagementLevel(score.score);
  insights.summary = `Engagement score: ${score.score}/100 (${level.replace('_', ' ')})`;

  // Identify strengths
  if (score.breakdown.activity >= 30) {
    insights.strengths.push('High activity level - frequently using the product');
  }
  if (score.breakdown.frequency >= 20) {
    insights.strengths.push('Consistent usage pattern - regular engagement');
  }
  if (score.breakdown.recency >= 15) {
    insights.strengths.push('Recently active - currently engaged');
  }
  if (score.breakdown.adoption >= 7) {
    insights.strengths.push('Strong product adoption - exploring features');
  }

  // Identify opportunities
  if (score.breakdown.activity < 20) {
    insights.opportunities.push('Increase product usage frequency');
  }
  if (score.breakdown.frequency < 15) {
    insights.opportunities.push('Build more consistent usage habits');
  }
  if (score.breakdown.recency < 10) {
    insights.opportunities.push('Re-engage with the product');
  }
  if (score.breakdown.adoption < 5) {
    insights.opportunities.push('Explore more product features');
  }

  // Generate recommendations based on churn risk
  if (churnRisk === 'high') {
    insights.recommendations.push(
      'URGENT: Send win-back campaign',
      'Offer personalized onboarding session',
      'Identify blockers preventing usage'
    );
  } else if (churnRisk === 'medium') {
    insights.recommendations.push(
      'Send engagement email with tips',
      'Highlight unused features',
      'Check in on user satisfaction'
    );
  } else {
    insights.recommendations.push(
      'Encourage advanced feature usage',
      'Request testimonial or case study',
      'Offer referral incentive'
    );
  }

  return insights;
}
