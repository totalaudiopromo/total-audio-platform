/**
 * Shared authentication types for Total Audio Promo platform
 */

import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Subscription tiers available across the platform
 */
export type SubscriptionTier = 'free' | 'pro' | 'agency' | 'bundle'

/**
 * Available apps in the Total Audio ecosystem
 */
export type AppName = 'audio-intel' | 'tracker' | 'pitch-generator' | 'command-centre'

/**
 * Subscription status from Stripe
 */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'cancelled'
  | 'past_due'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'

/**
 * Extended user profile with subscription information
 */
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  subscription_tier: SubscriptionTier
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

/**
 * App permission record
 */
export interface AppPermission {
  id: string
  user_id: string
  app_name: AppName
  has_access: boolean
  granted_at: string
}

/**
 * Subscription record
 */
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  status: SubscriptionStatus
  plan_id: string
  plan_name: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

/**
 * Complete user object with profile and permissions
 */
export interface TotalAudioUser extends SupabaseUser {
  profile?: UserProfile
  permissions?: AppPermission[]
  subscription?: Subscription
}

/**
 * Auth state hook return type
 */
export interface AuthState {
  user: TotalAudioUser | null
  profile: UserProfile | null
  loading: boolean
  error: Error | null
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasAccess: boolean
  tier: SubscriptionTier
  reason?: string
}

/**
 * App access matrix configuration
 */
export interface AppAccessMatrix {
  [key: string]: AppName[]
}

/**
 * Auth configuration options
 */
export interface AuthConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  redirectTo?: string
}
