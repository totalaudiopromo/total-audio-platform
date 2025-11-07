import { z } from 'zod';

/**
 * Phase 9D: Environment Variable Validation
 * Ensures all required env vars are present and valid at build time
 */

// Check if we're in a build environment without full env vars (GitHub Actions CI)
const isBuildTime =
  process.env.CI === 'true' || process.env.NEXT_PHASE === 'phase-production-build';

const envSchema = z.object({
  // Database (optional during build, required at runtime)
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL').optional(),
  // Make Supabase vars optional during CI builds, required otherwise
  NEXT_PUBLIC_SUPABASE_URL: isBuildTime
    ? z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL').optional()
    : z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isBuildTime
    ? z.string().optional()
    : z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // AI/Automation (optional during build, required at runtime for automation features)
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required').optional(),
  CONVERTKIT_API_KEY: z.string().optional(),
  CONVERTKIT_API_SECRET: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),

  // Social Media Integrations
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),

  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),

  BLUESKY_IDENTIFIER: z.string().optional(),
  BLUESKY_APP_PASSWORD: z.string().optional(),

  THREADS_USER_ID: z.string().optional(),
  THREADS_ACCESS_TOKEN: z.string().optional(),

  // Notifications
  TAP_DISCORD_BOT_TOKEN: z.string().optional(), // Telegram bot token
  TELEGRAM_CHAT_ID: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),

  // Feature Flags
  FEATURE_AUTOMATION: z
    .enum(['true', 'false'])
    .default('false')
    .transform(val => val === 'true'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns typed env object
 * Throws detailed error if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => {
        return `  - ${issue.path.join('.')}: ${issue.message}`;
      });

      console.error('\n❌ Environment validation failed:\n');
      console.error(missingVars.join('\n'));
      console.error('\n💡 Check your .env.local file and Vercel environment variables\n');

      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}

/**
 * Safe env access - returns validated env or throws error
 * Use this instead of direct process.env access
 *
 * Schema automatically relaxes validation during CI builds
 */
export const env = validateEnv();

/**
 * Helper to check if specific integrations are configured
 */
export const integrations = {
  twitter: !!(env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET),
  linkedin: !!(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
  bluesky: !!(env.BLUESKY_IDENTIFIER && env.BLUESKY_APP_PASSWORD),
  threads: !!(env.THREADS_USER_ID && env.THREADS_ACCESS_TOKEN),
  telegram: !!env.TAP_DISCORD_BOT_TOKEN,
  convertkit: !!(env.CONVERTKIT_API_KEY && env.CONVERTKIT_API_SECRET),
  plausible: !!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
} as const;
