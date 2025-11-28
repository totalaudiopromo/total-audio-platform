import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { Database } from './types/database';
import type { cookies } from 'next/headers';

/**
 * Get environment variables at runtime (not import time)
 * This avoids RSC serialisation issues during static generation
 */
function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  return { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
}

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
  const { supabaseUrl, supabaseAnonKey } = getEnvVars();

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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
  });
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
export async function createAdminClient(cookieStore: ReturnType<typeof cookies>) {
  const { supabaseUrl, supabaseServiceKey } = getEnvVars();

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. This is required for admin operations.');
  }

  const cookieStoreInstance = await cookieStore;

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseServiceKey, {
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
  });
}

/**
 * Alias for createServerClient for backwards compatibility
 * @deprecated Use createServerClient instead
 */
export const createClient = createServerClient;

/**
 * Get the current Supabase session for authenticated users
 *
 * @param cookieStore - Next.js cookies() promise
 * @returns The user session or null if not authenticated
 *
 * @example
 * ```typescript
 * import { getSupabaseSession } from "@total-audio/core-db/server";
 * import { cookies } from "next/headers";
 *
 * const session = await getSupabaseSession(cookies());
 * if (!session) {
 *   // User not authenticated
 * }
 * ```
 */
export async function getSupabaseSession(cookieStore: ReturnType<typeof cookies>) {
  const supabase = await createServerClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
