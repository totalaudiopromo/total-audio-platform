'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, RefreshCw, Mail, FileSpreadsheet } from 'lucide-react';

interface ActivityLog {
  id: string;
  integration_type: string;
  activity_type: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export function IntegrationActivityFeed() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const loadActivities = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('integration_activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Failed to load integration activity:', error);
      setActivities([]);
      setLoading(false);
      return;
    }
    if (data) {
      setActivities(data as ActivityLog[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initialise = async () => {
      await loadActivities();
      if (!isMounted) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) {
        return;
      }

      channel = supabase
        .channel(`activity_log_changes_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'integration_activity_log',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setActivities((prev) => [payload.new as ActivityLog, ...prev].slice(0, 20));
          }
        )
        .subscribe();
    };

    initialise();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadActivities, supabase]);

  const getIcon = (activityType: string, integrationType: string) => {
    if (activityType.includes('reply')) return <Mail className="w-5 h-5" />;
    if (activityType.includes('sheet') || integrationType === 'google_sheets') return <FileSpreadsheet className="w-5 h-5" />;
    return <RefreshCw className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 border-green-500';
      case 'error': return 'text-red-600 bg-red-100 border-red-500';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-500';
      default: return 'text-gray-600 bg-gray-100 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-gray-900">Integration Activity</h3>
        <button
          onClick={loadActivities}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No activity yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Integration syncs will appear here in real-time
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors"
            >
              {/* Icon */}
              <div className={`flex-shrink-0 p-2 rounded-lg border-2 ${getStatusColor(activity.status)}`}>
                {getIcon(activity.activity_type, activity.integration_type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    {activity.message}
                  </p>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </div>
                </div>

                {/* Metadata */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    {activity.metadata?.records_synced && (
                      <span className="font-medium">
                        {activity.metadata.records_synced} records synced
                      </span>
                    )}
                    {activity.metadata?.campaign_name && (
                      <span className="font-medium truncate">
                        Campaign: {activity.metadata.campaign_name}
                      </span>
                    )}
                    {activity.metadata?.contact_email && (
                      <span className="font-medium truncate">
                        {activity.metadata.contact_email}
                      </span>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t-2 border-gray-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600 font-medium">Live updates</span>
      </div>
    </div>
  );
}
