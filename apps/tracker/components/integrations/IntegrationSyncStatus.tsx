'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileSpreadsheet,
  Mail,
  Grid3x3,
  Mails,
  BarChart3,
  Cable,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Connection {
  id: string;
  integration_type: string;
  status: string;
  last_sync_at: string | null;
  sync_enabled: boolean;
}

export function IntegrationSyncStatus() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const loadConnections = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load integration connections:', error);
      setConnections([]);
      setLoading(false);
      return;
    }

    const typedConnections = (data || []) as Connection[];
    const filtered = typedConnections.filter((conn) => conn.status !== 'disconnected');

    setConnections(filtered);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initialise = async () => {
      await loadConnections();
      if (!isMounted) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) {
        return;
      }

      channel = supabase
        .channel(`connections_status_${user.id}`)
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
    };

    initialise();

    const interval = setInterval(() => {
      loadConnections();
    }, 60000);

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearInterval(interval);
    };
  }, [loadConnections, supabase]);

  const getIntegrationName = (type: string) => {
    const names: Record<string, string> = {
      google_sheets: 'Google Sheets',
      gmail: 'Gmail',
      airtable: 'Airtable',
      mailchimp: 'Mailchimp',
      excel: 'Excel',
    };
    return names[type] || type;
  };

  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, LucideIcon> = {
      google_sheets: FileSpreadsheet,
      gmail: Mail,
      airtable: Grid3x3,
      mailchimp: Mails,
      excel: BarChart3,
    };

    const Icon = icons[type] || Cable;
    return <Icon className="w-6 h-6 text-gray-700" aria-hidden="true" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
        <h3 className="text-lg font-black text-gray-900 mb-3">Integrations</h3>
        <div className="text-center py-6">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">No integrations connected</p>
          <Link
            href="/dashboard/integrations"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Connect Integrations
          </Link>
        </div>
      </div>
    );
  }

  const activeCount = connections.filter((conn) => conn.status === 'active').length;

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-gray-900">Integrations</h3>
        <div className="flex items-center gap-2 bg-green-100 border-2 border-green-500 px-3 py-1 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-black text-green-900">{activeCount} Active</span>
        </div>
      </div>

      <div className="space-y-2">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg border border-gray-200">
                {getIntegrationIcon(connection.integration_type)}
              </span>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {getIntegrationName(connection.integration_type)}
                </p>
                {connection.last_sync_at ? (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Synced {formatDistanceToNow(new Date(connection.last_sync_at), { addSuffix: true })}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Never synced</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {connection.status === 'error' ? (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs font-bold">Error</span>
                </div>
              ) : connection.sync_enabled ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Paused</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/integrations"
        className="block text-center mt-4 pt-4 border-t-2 border-gray-200 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
      >
        Manage Integrations →
      </Link>
    </div>
  );
}
