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
 * Validated environment variables
 * Throws error at runtime if validation fails
 */
export const env = envSchema.parse(process.env);

/**
 * Safe environment access (returns undefined if validation fails)
 * Useful for optional features
 */
export const safeEnv = envSchema.safeParse(process.env);

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
