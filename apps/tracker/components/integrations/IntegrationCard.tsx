'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Settings, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

interface IntegrationCardProps {
  type: 'google_sheets' | 'gmail' | 'airtable' | 'mailchimp' | 'excel';
  name: string;
  description: string;
  connection: any;
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure?: () => void;
}

// Brand colors for each integration
const BRAND_COLORS = {
  google_sheets: {
    primary: '#0F9D58',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-500',
    button: 'bg-green-600 hover:bg-green-700',
  },
  gmail: {
    primary: '#EA4335',
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-500',
    button: 'bg-red-600 hover:bg-red-700',
  },
  airtable: {
    primary: '#FCB400',
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-500',
    button: 'bg-yellow-600 hover:bg-yellow-700',
  },
  mailchimp: {
    primary: '#FFE01B',
    bg: 'from-yellow-50 to-yellow-100',
    border: 'border-yellow-400',
    button: 'bg-yellow-500 hover:bg-yellow-600',
  },
  excel: {
    primary: '#217346',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-600',
    button: 'bg-green-700 hover:bg-green-800',
  },
};

// SVG Logos - using simple brand-colored icons
const BRAND_ICONS = {
  google_sheets: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0F9D58" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gmail: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#EA4335" />
      <path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  airtable: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#FCB400" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  mailchimp: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#FFE01B" />
      <path d="M8 10h8M10 14h4" stroke="#241C15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  excel: (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#217346" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export function IntegrationCard({
  type,
  name,
  description,
  connection,
  onConnect,
  onDisconnect,
  onConfigure,
}: IntegrationCardProps) {
  const isConnected = connection?.status === 'active';
  const hasError = connection?.status === 'error';
  const colors = BRAND_COLORS[type];
  const icon = BRAND_ICONS[type];

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden">
      {/* Header with brand gradient */}
      <div className={`bg-gradient-to-br ${colors.bg} border-b-4 border-black p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{name}</h3>
              {isConnected && (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-bold">Connected</span>
                </div>
              )}
              {hasError && (
                <div className="flex items-center gap-2 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-bold">Connection Error</span>
                </div>
              )}
            </div>
          </div>

          {/* Big brutalist connected badge */}
          {isConnected && (
            <div className="bg-green-500 text-white font-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3">
              ✓ CONNECTED
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-700 font-medium mb-6">{description}</p>

        {isConnected ? (
          <div className="space-y-4">
            {/* Connection info */}
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 font-medium">Last sync</span>
                  <p className="font-bold text-gray-900">
                    {connection.last_sync_at
                      ? formatDistanceToNow(new Date(connection.last_sync_at), { addSuffix: true })
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Status</span>
                  <p className="font-bold text-gray-900">
                    {connection.sync_enabled ? 'Auto-sync enabled' : 'Paused'}
                  </p>
                </div>
              </div>
            </div>

            {/* Error message if any */}
            {hasError && connection.error_message && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3">
                <p className="text-sm text-red-800 font-medium">{connection.error_message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {onConfigure && (
                <button
                  onClick={onConfigure}
                  className={`flex-1 ${colors.button} text-white font-bold px-4 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
              )}
              <button
                onClick={onDisconnect}
                className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onConnect}
            className={`w-full ${colors.button} text-white font-black px-6 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            <ExternalLink className="w-5 h-5" />
            Connect {name}
          </button>
        )}
      </div>
    </div>
  );
}
