import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types/database';

/**
 * Create a Supabase client for browser-side usage
 *
 * This client is for use in React components and client-side code.
 * It automatically handles authentication state and RLS policies.
 *
 * Environment variables are accessed at call time (not import time) to avoid
 * issues during Next.js static generation when process.env may not be available.
 *
 * @example
 * ```typescript
 * import { createClient } from "@total-audio/core-db/client";
 *
 * const supabase = createClient();
 * const { data, error } = await supabase.from("campaigns").select("*");
 * ```
 */
export function createClient() {
  // Access environment variables at runtime, not import time
  // This avoids RSC serialisation issues during static generation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
