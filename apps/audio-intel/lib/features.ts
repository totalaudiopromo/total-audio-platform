/**
 * Feature Flags for Audio Intel
 *
 * Centralized feature flag management for gradual rollouts,
 * A/B testing, and production safety switches.
 *
 * Usage:
 *   if (features.isEnabled('new-enrichment-flow')) {
 *     // Use new enrichment logic
 *   }
 */

import { env } from '@total-audio/core-db/utils/env';

export type FeatureFlagName =
  | 'metrics-tracking'
  | 'analytics-dashboard'
  | 'payment-processing'
  | 'batch-enrichment'
  | 'export-formats'
  | 'ai-pitch-suggestions'
  | 'social-media-posting'
  | 'newsletter-automation';

export interface FeatureFlag {
  name: FeatureFlagName;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number; // 0-100, for gradual rollouts
  environments?: Array<'development' | 'production' | 'test'>;
}

/**
 * Feature flag registry
 * Configure feature availability here
 */
const FEATURE_FLAGS: Record<FeatureFlagName, FeatureFlag> = {
  'metrics-tracking': {
    name: 'metrics-tracking',
    enabled: env.FEATURE_METRICS_ENABLED,
    description: 'Track user events and usage metrics',
    environments: ['development', 'production'],
  },
  'analytics-dashboard': {
    name: 'analytics-dashboard',
    enabled: env.FEATURE_ANALYTICS_ENABLED,
    description: 'Show analytics dashboard in UI',
    environments: ['development', 'production'],
  },
  'payment-processing': {
    name: 'payment-processing',
    enabled: env.FEATURE_PAYMENTS_ENABLED,
    description: 'Enable Stripe payment processing',
    environments: ['production'],
  },
  'batch-enrichment': {
    name: 'batch-enrichment',
    enabled: true,
    description: 'Process multiple contacts in one operation',
    environments: ['development', 'production'],
  },
  'export-formats': {
    name: 'export-formats',
    enabled: true,
    description: 'CSV and JSON export functionality',
    environments: ['development', 'production'],
  },
  'ai-pitch-suggestions': {
    name: 'ai-pitch-suggestions',
    enabled: false,
    description: 'AI-powered pitch email suggestions (experimental)',
    rolloutPercentage: 10, // 10% gradual rollout
    environments: ['development'],
  },
  'social-media-posting': {
    name: 'social-media-posting',
    enabled: false,
    description: 'Automated social media posting integration',
    environments: ['development'],
  },
  'newsletter-automation': {
    name: 'newsletter-automation',
    enabled: true,
    description: 'The Unsigned Advantage newsletter automation',
    environments: ['development', 'production'],
  },
};

/**
 * Feature flag manager
 */
export const features = {
  /**
   * Check if a feature is enabled
   */
  isEnabled(featureName: FeatureFlagName): boolean {
    const flag = FEATURE_FLAGS[featureName];
    if (!flag) {
      console.warn(`Unknown feature flag: ${featureName}`);
      return false;
    }

    // Check environment restrictions
    if (flag.environments && !flag.environments.includes(env.NODE_ENV)) {
      return false;
    }

    // Check base enabled state
    if (!flag.enabled) {
      return false;
    }

    // Check rollout percentage (for gradual rollouts)
    if (flag.rolloutPercentage !== undefined) {
      const random = Math.random() * 100;
      return random < flag.rolloutPercentage;
    }

    return true;
  },

  /**
   * Get all enabled features
   */
  getAllEnabled(): FeatureFlagName[] {
    return (Object.keys(FEATURE_FLAGS) as FeatureFlagName[]).filter(name => this.isEnabled(name));
  },

  /**
   * Get feature flag details
   */
  getFlag(featureName: FeatureFlagName): FeatureFlag | undefined {
    return FEATURE_FLAGS[featureName];
  },

  /**
   * Check if a feature is available for a specific user (for A/B testing)
   */
  isEnabledForUser(featureName: FeatureFlagName, userId: string): boolean {
    const flag = FEATURE_FLAGS[featureName];
    if (!flag || !flag.enabled) {
      return false;
    }

    // Consistent hash-based A/B testing
    if (flag.rolloutPercentage !== undefined) {
      // Simple hash function to get consistent results for the same user
      const hash = userId.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);

      const bucket = Math.abs(hash % 100);
      return bucket < flag.rolloutPercentage;
    }

    return this.isEnabled(featureName);
  },

  /**
   * Get feature flag configuration for debugging
   */
  getDebugInfo(): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(FEATURE_FLAGS).map(([name, flag]) => [
        name,
        {
          enabled: this.isEnabled(name as FeatureFlagName),
          description: flag.description,
          rolloutPercentage: flag.rolloutPercentage,
          environments: flag.environments,
        },
      ])
    );
  },
};

/**
 * Middleware-friendly feature check
 * Use in API routes to conditionally enable features
 */
export function requireFeature(featureName: FeatureFlagName) {
  return (handler: (req: Request) => Promise<Response>) => {
    return async (req: Request): Promise<Response> => {
      if (!features.isEnabled(featureName)) {
        return new Response(
          JSON.stringify({
            error: 'Feature not available',
            feature: featureName,
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return handler(req);
    };
  };
}

/**
 * React hook for feature flags (client-side)
 * Usage: const isEnabled = useFeature('new-feature');
 */
export function useFeature(featureName: FeatureFlagName): boolean {
  // In a real React hook, you'd use useState/useEffect
  // For now, this is a simple wrapper
  return features.isEnabled(featureName);
}
