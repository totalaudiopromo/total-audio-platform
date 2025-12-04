'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useAuth';
import { CheckCircle, ExternalLink, AlertCircle, Mail, Trash2, Settings } from 'lucide-react';

interface GmailConnection {
  id: string;
  connection_name: string;
  status: string;
  last_sync_at: string | null;
  error_message?: string;
}

export default function IntegrationsPage() {
  const { data: session, status } = useSession();
  const [gmailConnection, setGmailConnection] = useState<GmailConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      loadGmailStatus();
    }
  }, [status]);

  const loadGmailStatus = async () => {
    try {
      const response = await fetch('/api/integrations/gmail/status');
      const data = await response.json();

      if (data.connected && data.connection) {
        setGmailConnection(data.connection);
      } else {
        setGmailConnection(null);
      }
    } catch (error) {
      console.error('Error loading Gmail status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = async () => {
    setConnecting(true);
    try {
      window.location.href = '/api/integrations/gmail/connect';
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      setConnecting(false);
    }
  };

  const handleDisconnectGmail = async () => {
    if (!gmailConnection) return;

    const confirmed = confirm(
      "Are you sure you want to disconnect Gmail? You won't be able to send emails directly from Pitch Generator."
    );
    if (!confirmed) return;

    try {
      const response = await fetch('/api/integrations/gmail/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId: gmailConnection.id }),
      });

      if (response.ok) {
        setGmailConnection(null);
      } else {
        alert('Failed to disconnect Gmail. Please try again.');
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      alert('Failed to disconnect Gmail. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass-panel px-6 py-12 sm:px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass-panel px-6 py-12 sm:px-10">
          <h1 className="text-3xl font-bold mb-4">Integrations</h1>
          <p className="text-gray-600 mb-6">Please sign in to manage your integrations.</p>
          <a href="/auth/signin" className="cta-button">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-panel px-6 py-12 sm:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Integrations</h1>
          <p className="text-gray-600">
            Connect your favorite tools to streamline your pitch workflow. Send emails directly from
            Pitch Generator and never miss a reply.
          </p>
        </div>

        {/* Gmail Integration Card */}
        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden mb-6">
          {/* Header with Gmail brand colors */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-b-4 border-black p-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      fill="#EA4335"
                    />
                    <path
                      d="M22 6l-10 7L2 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Gmail</h3>
                  {gmailConnection?.status === 'active' && (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-bold">Connected</span>
                    </div>
                  )}
                  {gmailConnection?.status === 'error' && (
                    <div className="flex items-center gap-2 mt-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-bold">Connection Error</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connected badge */}
              {gmailConnection?.status === 'active' && (
                <div className="bg-green-500 text-white font-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3">
                  CONNECTED
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 font-medium mb-6">
              Send pitches directly from Pitch Generator and automatically track replies. No more
              copy-pasting!
            </p>

            {gmailConnection?.status === 'active' ? (
              <div className="space-y-4">
                {/* Connection info */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Last sync</span>
                      <p className="font-bold text-gray-900">
                        {gmailConnection.last_sync_at
                          ? new Date(gmailConnection.last_sync_at).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Status</span>
                      <p className="font-bold text-gray-900">Active</p>
                    </div>
                  </div>
                </div>

                {/* Error message if any */}
                {gmailConnection.status === 'error' && gmailConnection.error_message && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3">
                    <p className="text-sm text-red-800 font-medium">
                      {gmailConnection.error_message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDisconnectGmail}
                    className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-2">What you'll get:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Send pitches directly from Pitch Generator</li>
                    <li>• Automatic reply tracking</li>
                    <li>• No more copy-paste workflows</li>
                    <li>• Professional email formatting</li>
                  </ul>
                </div>

                <button
                  onClick={handleConnectGmail}
                  disabled={connecting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Connect Gmail
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Sheets */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-b-4 border-black p-6">
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#0F9D58" />
                  <path
                    d="M7 8h10M7 12h10M7 16h6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Google Sheets</h3>
                  <div className="inline-block bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-lg border-2 border-black mt-2">
                    COMING SOON
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 font-medium mb-4">
                Export pitch campaigns to Google Sheets for team collaboration and reporting.
              </p>
              <button
                disabled
                className="w-full bg-gray-400 cursor-not-allowed text-white font-black px-6 py-4 rounded-xl border-4 border-black"
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Mailchimp */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-b-4 border-black p-6">
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" fill="#FFE01B" />
                  <path
                    d="M8 10h8M10 14h4"
                    stroke="#241C15"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Mailchimp</h3>
                  <div className="inline-block bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-lg border-2 border-black mt-2">
                    COMING SOON
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 font-medium mb-4">
                Create email campaigns from your pitches and sync contact lists.
              </p>
              <button
                disabled
                className="w-full bg-gray-400 cursor-not-allowed text-white font-black px-6 py-4 rounded-xl border-4 border-black"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
