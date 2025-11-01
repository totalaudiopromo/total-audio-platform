/**
 * Example App Access Gate Component
 * Restricts access to apps based on subscription tier
 * Copy this to your app and customise as needed
 */

'use client';

import { usePermissions, getTierDisplayName } from '@total-audio/auth';
import type { AppName } from '@total-audio/auth';

interface AppAccessGateProps {
  appName: AppName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AppAccessGate({ appName, children, fallback }: AppAccessGateProps) {
  const { checkAccess, tier, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  const hasAccess = checkAccess(appName);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4 text-6xl">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Upgrade Required</h2>
        <p className="text-gray-600 mb-4">
          You're currently on the <strong>{getTierDisplayName(tier)}</strong> plan. This app
          requires a higher tier subscription.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Get access to {getAppDisplayName(appName)}</strong> by upgrading to the Bundle
            plan and unlock all Total Audio tools!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/pricing"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            View Pricing
          </a>
          <a
            href="/dashboard"
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function getAppDisplayName(appName: AppName): string {
  const names: Record<AppName, string> = {
    'audio-intel': 'Audio Intel',
    tracker: 'Campaign Tracker',
    'pitch-generator': 'Pitch Generator',
    'command-centre': 'Command Centre',
  };
  return names[appName];
}
