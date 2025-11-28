import { z } from 'zod';

/**
 * Environment variable validation schema for Supabase configuration
 * Ensures all required env vars are present and valid at runtime
 */
const envSchema = z.object({
  // Supabase configuration (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be at least 10 characters',
  }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Application URL
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Feature flags (optional)
  FEATURE_METRICS_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  FEATURE_ANALYTICS_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  FEATURE_PAYMENTS_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('true'),

  // Phase 9: Autonomous Revenue Ops & Feedback Loops (optional)
  FEATURE_AGENT_OBSERVABILITY_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  FEATURE_GROWTH_REFLEX_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  FEATURE_FEEDBACK_DIGEST_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Observability integrations (optional)
  ANTHROPIC_API_KEY: z.string().min(10).optional(),
  TELEGRAM_BOT_TOKEN: z.string().min(10).optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Lazily validated environment variables
 * Only validates when accessed, avoiding build-time failures
 * Throws error at runtime if validation fails when accessed
 *
 * In browser/client-side: Only validates NEXT_PUBLIC_* vars that are actually set
 */
let _env: Env | null = null;
export const env = new Proxy({} as Env, {
  get(target, prop) {
    if (_env === null) {
      // Guard against process being undefined during static generation
      if (typeof process === 'undefined' || !process.env) {
        throw new Error(
          'Environment variables are not available in this context. ' +
            'This usually happens during static generation. Use dynamic rendering or client components.'
        );
      }

      // In browser/client-side, process.env only contains NEXT_PUBLIC_* vars
      // Use safeParse and provide defaults for missing optional vars
      const result = envSchema.safeParse(process.env);
      if (result.success) {
        _env = result.data;
      } else {
        // If validation fails, try to extract what we can and provide defaults
        // This handles cases where some vars might not be available in browser
        const partialEnv = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
          NODE_ENV:
            (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          FEATURE_METRICS_ENABLED: process.env.FEATURE_METRICS_ENABLED === 'true' || false,
          FEATURE_ANALYTICS_ENABLED: process.env.FEATURE_ANALYTICS_ENABLED === 'true' || false,
          FEATURE_PAYMENTS_ENABLED: process.env.FEATURE_PAYMENTS_ENABLED !== 'false',
          FEATURE_AGENT_OBSERVABILITY_ENABLED:
            process.env.FEATURE_AGENT_OBSERVABILITY_ENABLED === 'true' || false,
          FEATURE_GROWTH_REFLEX_ENABLED:
            process.env.FEATURE_GROWTH_REFLEX_ENABLED === 'true' || false,
          FEATURE_FEEDBACK_DIGEST_ENABLED:
            process.env.FEATURE_FEEDBACK_DIGEST_ENABLED === 'true' || false,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
          TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
          TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
        };

        // Validate required fields only
        if (!partialEnv.NEXT_PUBLIC_SUPABASE_URL || !partialEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error(
            `Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. ` +
              `Check your .env.local file and ensure Next.js is exposing these variables.`
          );
        }

        _env = partialEnv as Env;
      }
    }
    return _env[prop as keyof Env];
  },
});

/**
 * Safe environment access (returns undefined if validation fails)
 * Useful for optional features
 * Note: Only parse at runtime, not at module load time during static generation
 */
export const safeEnv =
  typeof process !== 'undefined' && process.env
    ? envSchema.safeParse(process.env)
    : { success: false as const, error: new z.ZodError([]) };

/**
 * Check if running in production environment
 */
export const isProduction = () => env.NODE_ENV === 'production';

/**
 * Check if running in development environment
 */
export const isDevelopment = () => env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = () => env.NODE_ENV === 'test';

/**
 * Validate environment variables at application startup
 * Call this in your app's entry point to fail fast on misconfiguration
 */
export function validateEnv() {
  // Guard against process being undefined
  if (typeof process === 'undefined' || !process.env) {
    console.warn('⚠️ Environment validation skipped: process.env not available');
    return false;
  }

  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Environment validation failed. Check your .env file.');
  }
}
