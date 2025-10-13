/**
 * React hook for user profile data
 * Simplified hook that only focuses on profile information
 */

'use client'

import { useAuth } from './useAuth'
import type { UserProfile } from '../types'

export function useUser(): {
  profile: UserProfile | null
  loading: boolean
  error: Error | null
} {
  const { profile, loading, error } = useAuth()

  return {
    profile,
    loading,
    error,
  }
}
