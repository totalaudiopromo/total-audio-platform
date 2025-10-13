/**
 * Permission checking utilities for Total Audio apps
 */

import type { AppName, SubscriptionTier, AppAccessMatrix } from '../types'

/**
 * App access matrix - defines which subscription tiers grant access to which apps
 */
export const APP_ACCESS_MATRIX: AppAccessMatrix = {
  free: ['audio-intel'], // Free tier: 10 enrichments/month on Audio Intel
  pro: ['audio-intel'], // Pro tier: Unlimited enrichments on Audio Intel
  agency: ['audio-intel'], // Agency tier: Unlimited + team features on Audio Intel
  bundle: ['audio-intel', 'tracker', 'pitch-generator', 'command-centre'], // Bundle: All apps
}

/**
 * Check if a subscription tier has access to a specific app
 */
export function hasAppAccess(tier: SubscriptionTier, appName: AppName): boolean {
  const allowedApps = APP_ACCESS_MATRIX[tier]
  return allowedApps ? allowedApps.includes(appName) : false
}

/**
 * Get all apps a subscription tier has access to
 */
export function getAccessibleApps(tier: SubscriptionTier): AppName[] {
  return APP_ACCESS_MATRIX[tier] || []
}

/**
 * Get the minimum tier required for an app
 */
export function getMinimumTierForApp(appName: AppName): SubscriptionTier | null {
  for (const [tier, apps] of Object.entries(APP_ACCESS_MATRIX)) {
    if (apps.includes(appName)) {
      return tier as SubscriptionTier
    }
  }
  return null
}

/**
 * Check if a tier upgrade would grant access to new apps
 */
export function getNewAppsOnUpgrade(
  currentTier: SubscriptionTier,
  targetTier: SubscriptionTier
): AppName[] {
  const currentApps = new Set(getAccessibleApps(currentTier))
  const targetApps = getAccessibleApps(targetTier)

  return targetApps.filter((app) => !currentApps.has(app))
}

/**
 * Get upgrade recommendation for accessing a specific app
 */
export function getUpgradeRecommendation(
  currentTier: SubscriptionTier,
  desiredApp: AppName
): {
  needsUpgrade: boolean
  recommendedTier: SubscriptionTier | null
  additionalApps: AppName[]
} {
  const hasAccess = hasAppAccess(currentTier, desiredApp)

  if (hasAccess) {
    return {
      needsUpgrade: false,
      recommendedTier: null,
      additionalApps: [],
    }
  }

  // Find the minimum tier that grants access
  const minimumTier = getMinimumTierForApp(desiredApp)

  if (!minimumTier) {
    return {
      needsUpgrade: true,
      recommendedTier: null,
      additionalApps: [],
    }
  }

  // If the desired app is only in bundle, recommend bundle
  if (minimumTier === 'bundle') {
    const additionalApps = getNewAppsOnUpgrade(currentTier, 'bundle')
    return {
      needsUpgrade: true,
      recommendedTier: 'bundle',
      additionalApps,
    }
  }

  return {
    needsUpgrade: true,
    recommendedTier: minimumTier,
    additionalApps: getNewAppsOnUpgrade(currentTier, minimumTier),
  }
}
