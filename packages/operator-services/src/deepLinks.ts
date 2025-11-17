/**
 * Deep Links
 * Utilities for opening routes as apps and deep-linking within OperatorOS
 */

import type { OperatorAppID } from './appsRegistry';

/**
 * Deep link configuration
 */
export interface DeepLink {
  appId: OperatorAppID;
  route: string;
  params?: Record<string, string>;
}

/**
 * Parse deep link from URL or string
 * Format: operator://app/route?params
 */
export function parseDeepLink(url: string): DeepLink | null {
  try {
    // Handle operator:// protocol
    if (url.startsWith('operator://')) {
      const parsed = new URL(url);
      const appId = parsed.hostname as OperatorAppID;
      const route = parsed.pathname;
      const params = Object.fromEntries(parsed.searchParams);

      return { appId, route, params };
    }

    // Handle regular paths
    const parts = url.split('?');
    const path = parts[0];
    const searchParams = new URLSearchParams(parts[1] || '');

    // Extract app from path
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const appId = segments[0] as OperatorAppID;
    const route = '/' + segments.join('/');
    const params = Object.fromEntries(searchParams);

    return { appId, route, params };
  } catch {
    return null;
  }
}

/**
 * Build deep link URL
 */
export function buildDeepLink(link: DeepLink): string {
  const params = new URLSearchParams(link.params || {});
  const queryString = params.toString();

  return `operator://${link.appId}${link.route}${queryString ? '?' + queryString : ''}`;
}

/**
 * Build route URL for embedding
 */
export function buildRouteUrl(appId: OperatorAppID, route?: string, params?: Record<string, string>): string {
  const baseRoute = route || `/${appId}`;
  const searchParams = new URLSearchParams(params || {});
  const queryString = searchParams.toString();

  return `${baseRoute}${queryString ? '?' + queryString : ''}`;
}

/**
 * Common deep link shortcuts
 */
export const DEEP_LINKS = {
  // Dashboard
  dashboardHome: (): DeepLink => ({ appId: 'dashboard', route: '/dashboard' }),

  // Intel
  intelEnrich: (): DeepLink => ({ appId: 'intel', route: '/intel/enrich' }),
  intelHistory: (): DeepLink => ({ appId: 'intel', route: '/intel/history' }),

  // Pitch
  pitchGenerate: (): DeepLink => ({ appId: 'pitch', route: '/pitch/generate' }),
  pitchTemplates: (): DeepLink => ({ appId: 'pitch', route: '/pitch/templates' }),

  // Tracker
  trackerCampaigns: (): DeepLink => ({ appId: 'tracker', route: '/tracker/campaigns' }),
  trackerCampaign: (campaignId: string): DeepLink => ({
    appId: 'tracker',
    route: `/tracker/campaign/${campaignId}`,
  }),

  // Studio
  studioProjects: (): DeepLink => ({ appId: 'studio', route: '/studio/projects' }),
  studioProject: (projectId: string): DeepLink => ({
    appId: 'studio',
    route: `/studio/project/${projectId}`,
  }),

  // Autopilot
  autopilotMissions: (): DeepLink => ({ appId: 'autopilot', route: '/autopilot/missions' }),
  autopilotMission: (missionId: string): DeepLink => ({
    appId: 'autopilot',
    route: `/autopilot/mission/${missionId}`,
  }),

  // Coach
  coachHome: (): DeepLink => ({ appId: 'coach', route: '/coach' }),
  coachArtist: (artistId: string): DeepLink => ({
    appId: 'coach',
    route: '/coach',
    params: { focus: artistId },
  }),

  // Scenes
  scenesExplore: (): DeepLink => ({ appId: 'scenes', route: '/scenes' }),
  scenesScenario: (scenarioId: string): DeepLink => ({
    appId: 'scenes',
    route: `/scenes/${scenarioId}`,
  }),

  // MIG
  migHome: (): DeepLink => ({ appId: 'mig', route: '/mig' }),

  // ANR
  anrReports: (): DeepLink => ({ appId: 'anr', route: '/anr/reports' }),

  // Settings
  settingsGeneral: (): DeepLink => ({ appId: 'settings', route: '/settings' }),
  settingsIntegrations: (): DeepLink => ({ appId: 'settings', route: '/settings/integrations' }),
};
