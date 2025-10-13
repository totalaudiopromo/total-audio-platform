/**
 * Supabase client for browser-side authentication
 * Shared across all Total Audio apps
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

let clientInstance: SupabaseClient<Database> | null = null

/**
 * Create or return existing Supabase browser client
 * Uses singleton pattern to avoid multiple instances
 */
export function createClient(): SupabaseClient<Database> {
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  return clientInstance
}

/**
 * Reset client instance (useful for testing)
 */
export function resetClient(): void {
  clientInstance = null
}
