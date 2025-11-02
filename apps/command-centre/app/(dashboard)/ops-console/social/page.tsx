'use client';

import { useEffect, useState } from 'react';
import { Share2, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface SocialIntegration {
  id: string;
  name: string;
  status: 'active' | 'stub' | 'not_implemented';
  oauthVersion: string;
  connected: boolean;
  postsScheduled: number;
  postsPublished: number;
  lastPost: string | null;
  rateLimits: {
    postsPerDay: number;
    postsPerHour: number;
  };
}

export default function SocialPage() {
  const [integrations, setIntegrations] = useState<SocialIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data based on command_centre_integrations.json
    const mockIntegrations: SocialIntegration[] = [
      {
        id: 'twitter',
        name: 'X (Twitter)',
        status: 'active',
        oauthVersion: '2.0',
        connected: true,
        postsScheduled: 12,
        postsPublished: 247,
        lastPost: '2 hours ago',
        rateLimits: {
          postsPerDay: 300,
          postsPerHour: 50,
        },
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        status: 'active',
        oauthVersion: '2.0',
        connected: true,
        postsScheduled: 8,
        postsPublished: 156,
        lastPost: '4 hours ago',
        rateLimits: {
          postsPerDay: 100,
          postsPerHour: 25,
        },
      },
      {
        id: 'bluesky',
        name: 'BlueSky',
        status: 'stub',
        oauthVersion: 'custom',
        connected: false,
        postsScheduled: 0,
        postsPublished: 0,
        lastPost: null,
        rateLimits: {
          postsPerDay: 200,
          postsPerHour: 30,
        },
      },
      {
        id: 'threads',
        name: 'Threads',
        status: 'not_implemented',
        oauthVersion: '2.0',
        connected: false,
        postsScheduled: 0,
        postsPublished: 0,
        lastPost: null,
        rateLimits: {
          postsPerDay: 250,
          postsPerHour: 50,
        },
      },
    ];

    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-bold text-gray-500">
          Loading social integrations...
        </div>
      </div>
    );
  }

  const activeIntegrations = integrations.filter(i => i.status === 'active');
  const totalScheduled = integrations.reduce((sum, i) => sum + i.postsScheduled, 0);
  const totalPublished = integrations.reduce((sum, i) => sum + i.postsPublished, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Share2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Social Media Hub</h2>
        </div>
        <p className="text-sm text-gray-600">
          Multi-platform social media scheduling and monitoring
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Connected</div>
          <div className="text-3xl font-black text-gray-900">
            {activeIntegrations.length}/{integrations.length}
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Scheduled</div>
          <div className="text-3xl font-black text-blue-600">{totalScheduled}</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Published</div>
          <div className="text-3xl font-black text-green-600">{totalPublished}</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="text-sm font-bold text-gray-600 uppercase mb-1">Rate Limit</div>
          <div className="text-3xl font-black text-gray-900">
            {activeIntegrations.reduce((sum, i) => sum + i.rateLimits.postsPerHour, 0)}/hr
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg border-2 border-black ${
                    integration.connected ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <Share2
                    className={`h-5 w-5 ${integration.connected ? 'text-green-600' : 'text-gray-400'}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{integration.name}</h3>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    OAuth {integration.oauthVersion}
                  </span>
                </div>
              </div>
              {integration.status === 'active' && integration.connected && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              {integration.status === 'stub' && <AlertCircle className="h-6 w-6 text-yellow-600" />}
              {integration.status === 'not_implemented' && (
                <XCircle className="h-6 w-6 text-gray-400" />
              )}
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg border-2 border-black text-xs font-bold uppercase ${
                  integration.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : integration.status === 'stub'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {integration.status === 'active' && 'Active'}
                {integration.status === 'stub' && 'Stub (OAuth Incomplete)'}
                {integration.status === 'not_implemented' && 'Not Implemented'}
              </span>
            </div>

            {/* Stats */}
            {integration.connected ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Scheduled</div>
                    <div className="text-2xl font-black text-blue-600">
                      {integration.postsScheduled}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Published</div>
                    <div className="text-2xl font-black text-green-600">
                      {integration.postsPublished}
                    </div>
                  </div>
                </div>

                {/* Rate Limits */}
                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">Rate Limits</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Per Hour:</span>
                    <span className="font-bold text-gray-900">
                      {integration.rateLimits.postsPerHour}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Per Day:</span>
                    <span className="font-bold text-gray-900">
                      {integration.rateLimits.postsPerDay}
                    </span>
                  </div>
                </div>

                {integration.lastPost && (
                  <div className="mt-4 text-xs text-gray-500">
                    Last post: {integration.lastPost}
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  {integration.status === 'stub'
                    ? 'OAuth flow needs completion'
                    : 'Connector not yet implemented'}
                </p>
                <button
                  disabled={integration.status === 'not_implemented'}
                  className={`px-4 py-2 text-sm font-bold rounded-lg border-2 border-black ${
                    integration.status === 'stub'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {integration.status === 'stub' ? 'Complete OAuth Setup' : 'Coming Soon'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Integration Status Notice */}
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Share2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Phase 9D Social Integration Status</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>
                <strong>X (Twitter) & LinkedIn:</strong> OAuth flows operational, tokens stored in
                Vercel
              </li>
              <li>
                <strong>BlueSky:</strong> Stub exists, needs OAuth completion (password-based auth)
              </li>
              <li>
                <strong>Threads:</strong> No connector, requires full implementation
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center justify-between px-4 py-3 text-sm font-bold text-left bg-white border-2 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <span>Schedule New Post</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-between px-4 py-3 text-sm font-bold text-left bg-white border-2 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <span>View Scheduled Posts</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-between px-4 py-3 text-sm font-bold text-left bg-white border-2 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <span>Analytics Dashboard</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-between px-4 py-3 text-sm font-bold text-left bg-white border-2 border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <span>Manage Templates</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
