/**
 * useAppProfiles Hook
 * React hook for managing app profiles
 * Phase 3 - Desktop Experience Layer
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAppProfile,
  setAppProfile,
  getPinnedApps,
  toggleAppPinning,
  type AppProfile,
  type LaunchMode,
} from '@total-audio/operator-os';
import type { OperatorAppID } from '../appsRegistry';

export function useAppProfiles(userId: string | undefined, workspaceId: string | undefined) {
  const [profiles, setProfiles] = useState<Record<string, AppProfile>>({});
  const [pinnedApps, setPinnedApps] = useState<AppProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all pinned apps
  const refreshPinnedApps = useCallback(async () => {
    if (!userId || !workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const pinned = await getPinnedApps(userId, workspaceId);
      setPinnedApps(pinned);

      // Also update profiles map
      const profilesMap: Record<string, AppProfile> = {};
      pinned.forEach((profile) => {
        profilesMap[profile.app_id] = profile;
      });
      setProfiles((prev) => ({ ...prev, ...profilesMap }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pinned apps'));
      console.error('Error fetching pinned apps:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, workspaceId]);

  // Fetch a specific app profile
  const fetchProfile = useCallback(
    async (appId: OperatorAppID) => {
      if (!userId || !workspaceId) return null;

      try {
        const profile = await getAppProfile(userId, workspaceId, appId);
        if (profile) {
          setProfiles((prev) => ({ ...prev, [appId]: profile }));
        }
        return profile;
      } catch (err) {
        console.error(`Error fetching profile for ${appId}:`, err);
        return null;
      }
    },
    [userId, workspaceId]
  );

  // Update an app profile
  const updateProfile = useCallback(
    async (appId: OperatorAppID, updates: Partial<AppProfile>) => {
      if (!userId || !workspaceId) return;

      try {
        setError(null);
        await setAppProfile(userId, workspaceId, appId, updates);

        // Update local state
        setProfiles((prev) => ({
          ...prev,
          [appId]: {
            ...prev[appId],
            ...updates,
            app_id: appId,
          } as AppProfile,
        }));

        // Refresh pinned apps if pinned state changed
        if (updates.pinned !== undefined) {
          await refreshPinnedApps();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update profile'));
        console.error('Error updating profile:', err);
        throw err;
      }
    },
    [userId, workspaceId, refreshPinnedApps]
  );

  // Toggle pin status
  const togglePin = useCallback(
    async (appId: OperatorAppID) => {
      if (!userId || !workspaceId) return false;

      try {
        setError(null);
        const newPinnedState = await toggleAppPinning(userId, workspaceId, appId);

        // Update local state
        setProfiles((prev) => ({
          ...prev,
          [appId]: {
            ...prev[appId],
            pinned: newPinnedState,
            app_id: appId,
          } as AppProfile,
        }));

        // Refresh pinned apps
        await refreshPinnedApps();

        return newPinnedState;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to toggle pin'));
        console.error('Error toggling pin:', err);
        return false;
      }
    },
    [userId, workspaceId, refreshPinnedApps]
  );

  // Set launch mode for an app
  const setLaunchMode = useCallback(
    async (appId: OperatorAppID, launchMode: LaunchMode) => {
      await updateProfile(appId, { launch_mode: launchMode });
    },
    [updateProfile]
  );

  // Set preferred layout for an app
  const setPreferredLayout = useCallback(
    async (appId: OperatorAppID, layoutName: string | undefined) => {
      await updateProfile(appId, { preferred_layout_name: layoutName });
    },
    [updateProfile]
  );

  // Get profile for an app (from cache or fetch)
  const getProfile = useCallback(
    async (appId: OperatorAppID): Promise<AppProfile | null> => {
      // Return from cache if available
      if (profiles[appId]) {
        return profiles[appId];
      }

      // Otherwise fetch
      return await fetchProfile(appId);
    },
    [profiles, fetchProfile]
  );

  // Check if app is pinned
  const isPinned = useCallback(
    (appId: OperatorAppID): boolean => {
      return profiles[appId]?.pinned || false;
    },
    [profiles]
  );

  // Get launch mode for an app
  const getLaunchMode = useCallback(
    (appId: OperatorAppID): LaunchMode => {
      return profiles[appId]?.launch_mode || 'floating';
    },
    [profiles]
  );

  // Load pinned apps on mount
  useEffect(() => {
    refreshPinnedApps();
  }, [refreshPinnedApps]);

  return {
    profiles,
    pinnedApps,
    loading,
    error,
    fetchProfile,
    updateProfile,
    togglePin,
    setLaunchMode,
    setPreferredLayout,
    getProfile,
    isPinned,
    getLaunchMode,
    refreshPinnedApps,
  };
}
