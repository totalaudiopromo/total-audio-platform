import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { Database } from './types/database';
import { env } from './utils/env';
import type { cookies } from 'next/headers';

/**
 * Create a Supabase client for server-side usage (anon key)
 *
 * This client is for use in Server Components, Server Actions, and Route Handlers.
 * It respects RLS policies and uses the user's authentication context.
 *
 * @param cookieStore - Next.js cookies() promise
 *
 * @example
 * ```typescript
 * import { createServerClient } from "@total-audio/core-db/server";
 * import { cookies } from "next/headers";
 *
 * const supabase = await createServerClient(cookies());
 * const { data } = await supabase.from("campaigns").select("*");
 * ```
 */
export async function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  const cookieStoreInstance = await cookieStore;

  return createSupabaseServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStoreInstance.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStoreInstance.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors (e.g., in middleware)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStoreInstance.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role key for admin operations
 *
 * ⚠️ WARNING: This bypasses RLS and should ONLY be used in secure server contexts
 * for administrative operations like user management or data migrations.
 *
 * @param cookieStore - Next.js cookies() promise
 *
 * @example
 * ```typescript
 * import { createAdminClient } from "@total-audio/core-db/server";
 * import { cookies } from "next/headers";
 *
 * // Only use in API routes or server actions that verify admin permissions
 * const supabase = await createAdminClient(cookies());
 * const { data } = await supabase.from("users").select("*"); // Bypasses RLS
 * ```
 */
/**
 * Convenience wrapper for API routes
 * Automatically imports and passes cookies()
 *
 * @deprecated Use createServerClient(cookies()) directly for better type safety
 */
export async function createClient() {
  const { cookies: getCookies } = await import('next/headers');
  return createServerClient(getCookies());
}

export async function createAdminClient(cookieStore: ReturnType<typeof cookies>) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. This is required for admin operations.');
  }

  const cookieStoreInstance = await cookieStore;

  return createSupabaseServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStoreInstance.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStoreInstance.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStoreInstance.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}
