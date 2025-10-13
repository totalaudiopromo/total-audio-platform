/**
 * React hook for app permissions
 * Check if user has access to specific apps
 */

'use client'

import { useAuth } from './useAuth'
import { hasAppAccess, getAccessibleApps } from '../utils/permissions'
import type { AppName, SubscriptionTier } from '../types'

export function usePermissions() {
  const { profile, loading } = useAuth()

  const tier: SubscriptionTier = profile?.subscription_tier || 'free'

  /**
   * Check if user has access to a specific app
   */
  const checkAccess = (appName: AppName): boolean => {
    return hasAppAccess(tier, appName)
  }

  /**
   * Get all apps user has access to
   */
  const accessibleApps = getAccessibleApps(tier)

  /**
   * Check if user has bundle access
   */
  const hasBundle = tier === 'bundle'

  return {
    tier,
    checkAccess,
    accessibleApps,
    hasBundle,
    loading,
  }
}
