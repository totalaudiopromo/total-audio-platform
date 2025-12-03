'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ViewMode } from '@/components/campaigns/ViewToggle';

const STORAGE_KEY = 'tracker-view-preference';
const MOBILE_BREAKPOINT = 768;

interface UseViewPreferenceReturn {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobile: boolean;
  isLoading: boolean;
}

export function useViewPreference(): UseViewPreferenceReturn {
  // Default to cards for SSR safety
  const [viewMode, setViewModeState] = useState<ViewMode>('cards');
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're on mobile
  const checkMobile = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  // Load saved preference and set up resize listener
  useEffect(() => {
    const mobile = checkMobile();
    setIsMobile(mobile);

    if (mobile) {
      // Force cards on mobile
      setViewModeState('cards');
    } else {
      // Load saved preference on desktop
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'table' || saved === 'cards') {
          setViewModeState(saved);
        }
      } catch {
        // localStorage not available
      }
    }

    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      const nowMobile = checkMobile();
      setIsMobile(nowMobile);

      if (nowMobile) {
        // Force cards on mobile
        setViewModeState('cards');
      } else {
        // Restore saved preference on desktop
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved === 'table' || saved === 'cards') {
            setViewModeState(saved);
          }
        } catch {
          // localStorage not available
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);

  // Save preference when changed
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      // Don't allow table on mobile
      if (isMobile && mode === 'table') return;

      setViewModeState(mode);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // localStorage not available
      }
    },
    [isMobile]
  );

  return {
    viewMode,
    setViewMode,
    isMobile,
    isLoading,
  };
}
