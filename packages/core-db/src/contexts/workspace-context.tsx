'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../client';
import type { User } from '@supabase/supabase-js';

// ========================================
// Types
// ========================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  workspace_type: 'personal' | 'team' | 'agency';
  apps_enabled: string[];
  plan_tier: string;
  created_at?: string;
  app_permissions?: {
    intel?: { enabled: boolean; features: string[] };
    pitch?: { enabled: boolean; features: string[] };
    tracker?: { enabled: boolean; features: string[] };
  };
}

export interface WorkspaceContextValue {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  loading: boolean;
  hasAppAccess: (appName: string) => boolean;
  refreshWorkspaces: () => Promise<void>;
}

// ========================================
// Context
// ========================================

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

// ========================================
// Provider Component
// ========================================

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load user and workspaces on mount
  useEffect(() => {
    loadUserAndWorkspaces();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadWorkspaces(session.user.id);
      } else {
        setWorkspaces([]);
        setCurrentWorkspaceState(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user and workspaces
  const loadUserAndWorkspaces = async () => {
    try {
      setLoading(true);
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (currentUser) {
        await loadWorkspaces(currentUser.id);
      }
    } catch (error) {
      console.error('Error loading user and workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user's workspaces
  const loadWorkspaces = async (userId: string) => {
    try {
      // Fetch workspaces via workspace_members join
      const { data, error } = await supabase
        .from('workspace_members')
        .select(
          `
          workspaces (
            id,
            name,
            slug,
            owner_id,
            workspace_type,
            apps_enabled,
            plan_tier,
            created_at,
            app_permissions
          )
        `
        )
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading workspaces:', error);
        return;
      }

      // Extract workspaces from nested response
      const userWorkspaces = (data || [])
        .map(item => (item as any).workspaces)
        .filter(Boolean) as Workspace[];

      setWorkspaces(userWorkspaces);

      // Auto-select workspace
      if (userWorkspaces.length > 0) {
        // Try to restore from localStorage
        const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
        const savedWorkspace = userWorkspaces.find(w => w.id === savedWorkspaceId);

        if (savedWorkspace) {
          setCurrentWorkspaceState(savedWorkspace);
        } else {
          // Default to first workspace
          setCurrentWorkspaceState(userWorkspaces[0]);
        }
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    }
  };

  // Set current workspace (with localStorage persistence)
  const setCurrentWorkspace = (workspace: Workspace) => {
    setCurrentWorkspaceState(workspace);
    localStorage.setItem('currentWorkspaceId', workspace.id);
  };

  // Check if user has access to specific app in current workspace
  const hasAppAccess = (appName: string): boolean => {
    if (!currentWorkspace) return false;

    // Check apps_enabled array
    if (currentWorkspace.apps_enabled?.includes(appName)) {
      return true;
    }

    // Check app_permissions object (if available)
    if (currentWorkspace.app_permissions) {
      const appKey = appName as 'intel' | 'pitch' | 'tracker';
      return currentWorkspace.app_permissions[appKey]?.enabled ?? false;
    }

    return false;
  };

  // Refresh workspaces (for manual refresh)
  const refreshWorkspaces = async () => {
    if (user) {
      await loadWorkspaces(user.id);
    }
  };

  const value: WorkspaceContextValue = {
    user,
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    hasAppAccess,
    refreshWorkspaces,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

// ========================================
// Hook
// ========================================

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
