import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types/database';
import { env } from './utils/env';

/**
 * Create a Supabase client for browser-side usage
 *
 * This client is for use in React components and client-side code.
 * It automatically handles authentication state and RLS policies.
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
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
