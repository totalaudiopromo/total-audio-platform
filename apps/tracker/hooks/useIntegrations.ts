'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@total-audio/core-db/client';

export type IntegrationType =
  | 'google_sheets'
  | 'gmail'
  | 'airtable'
  | 'mailchimp'
  | 'excel';

// Convert underscore type to hyphenated API route
const typeToRoute = (type: IntegrationType): string => type.replace(/_/g, '-');

export interface Integration {
  id: string;
  user_id: string;
  integration_type: IntegrationType;
  status: 'active' | 'paused' | 'error' | 'disconnected';
  last_sync_at: string | null;
  sync_enabled: boolean;
  error_message: string | null;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useIntegrations() {
  const [connections, setConnections] = useState<
    Record<IntegrationType, Integration | null>
  >({
    google_sheets: null,
    gmail: null,
    airtable: null,
    mailchimp: null,
    excel: null,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Record<IntegrationType, boolean>>({
    google_sheets: false,
    gmail: false,
    airtable: false,
    mailchimp: false,
    excel: false,
  });

  const supabase = useMemo(() => createClient(), []);
  const userIdRef = useRef<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);

  const resetConnections = useCallback(() => {
    setConnections({
      google_sheets: null,
      gmail: null,
      airtable: null,
      mailchimp: null,
      excel: null,
    });
  }, []);

  const loadConnections = useCallback(async () => {
    if (!userIdRef.current) {
      if (isMountedRef.current) {
        resetConnections();
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('user_id', userIdRef.current);

      if (error) throw error;

      if (!isMountedRef.current) return;

      const mapped: Partial<Record<IntegrationType, Integration>> = {};
      (data || []).forEach((conn: Integration) => {
        mapped[conn.integration_type] = conn;
      });

      setConnections({
        google_sheets: mapped.google_sheets || null,
        gmail: mapped.gmail || null,
        airtable: mapped.airtable || null,
        mailchimp: mapped.mailchimp || null,
        excel: mapped.excel || null,
      });
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error loading integrations:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [resetConnections, supabase]);

  useEffect(() => {
    let active = true;
    isMountedRef.current = true;

    const initialize = async () => {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active || !isMountedRef.current) {
        return;
      }

      if (error) {
        console.error('Error fetching user for integrations:', error);
        resetConnections();
        setLoading(false);
        return;
      }

      if (!user) {
        resetConnections();
        setLoading(false);
        return;
      }

      userIdRef.current = user.id;

      await loadConnections();
      if (!active || !isMountedRef.current) {
        return;
      }

      const channel = supabase
        .channel('integration_connections_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'integration_connections',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadConnections();
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    initialize();

    return () => {
      active = false;
      isMountedRef.current = false;

      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [loadConnections, resetConnections, supabase]);

  const connect = useCallback(async (type: IntegrationType) => {
    // Redirect to OAuth flow (convert underscore to hyphen for URL)
    window.location.href = `/api/integrations/${typeToRoute(type)}/connect`;
  }, []);

  const disconnect = useCallback(
    async (type: IntegrationType) => {
      try {
        const { error } = await supabase
          .from('integration_connections')
          .update({
            status: 'disconnected',
            sync_enabled: false,
          })
          .eq('integration_type', type);

        if (error) throw error;

        await loadConnections();
      } catch (error) {
        console.error(`Error disconnecting ${type}:`, error);
        throw error;
      }
    },
    [loadConnections, supabase]
  );

  const manualSync = useCallback(
    async (type: IntegrationType) => {
      setSyncing(prev => ({ ...prev, [type]: true }));

      try {
        const response = await fetch(
          `/api/integrations/${typeToRoute(type)}/sync`,
          {
            method: 'POST',
          }
        );

        if (!response.ok) {
          throw new Error('Sync failed');
        }

        await loadConnections();
      } catch (error) {
        console.error(`Error syncing ${type}:`, error);
        throw error;
      } finally {
        setSyncing(prev => ({ ...prev, [type]: false }));
      }
    },
    [loadConnections]
  );

  const updateSettings = useCallback(
    async (type: IntegrationType, settings: Record<string, any>) => {
      try {
        const { error } = await supabase
          .from('integration_connections')
          .update({ settings })
          .eq('integration_type', type);

        if (error) throw error;

        await loadConnections();
      } catch (error) {
        console.error(`Error updating ${type} settings:`, error);
        throw error;
      }
    },
    [loadConnections, supabase]
  );

  const toggleSync = useCallback(
    async (type: IntegrationType, enabled: boolean) => {
      try {
        const { error } = await supabase
          .from('integration_connections')
          .update({ sync_enabled: enabled })
          .eq('integration_type', type);

        if (error) throw error;

        await loadConnections();
      } catch (error) {
        console.error(`Error toggling sync for ${type}:`, error);
        throw error;
      }
    },
    [loadConnections, supabase]
  );

  return {
    connections,
    loading,
    syncing,
    connect,
    disconnect,
    manualSync,
    updateSettings,
    toggleSync,
    reload: loadConnections,
  };
}
