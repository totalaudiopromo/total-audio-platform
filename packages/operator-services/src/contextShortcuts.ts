/**
 * Context Shortcuts
 * Quick access to context-aware actions within OperatorOS
 */

import type { OperatorAppID } from './appsRegistry';

export interface ContextShortcut {
  id: string;
  label: string;
  description: string;
  appId: OperatorAppID;
  route: string;
  contextRequired?: string[]; // Required context variables
}

/**
 * Define context shortcuts
 * These are dynamic actions that depend on current context
 */
export const CONTEXT_SHORTCUTS: ContextShortcut[] = [
  // Campaign context
  {
    id: 'open-current-campaign-autopilot',
    label: 'Open current campaign in Autopilot',
    description: 'View active campaign in Autopilot dashboard',
    appId: 'autopilot',
    route: '/autopilot/mission/:missionId',
    contextRequired: ['currentMissionId'],
  },

  {
    id: 'open-current-campaign-tracker',
    label: 'Open current campaign in Tracker',
    description: 'Track campaign progress and submissions',
    appId: 'tracker',
    route: '/tracker/campaign/:campaignId',
    contextRequired: ['currentCampaignId'],
  },

  // Artist context
  {
    id: 'open-current-artist-coach',
    label: 'Open current artist in CoachOS',
    description: 'Strategic planning for current artist',
    appId: 'coach',
    route: '/coach?focus=:artistId',
    contextRequired: ['currentArtistId'],
  },

  {
    id: 'generate-pitch-current-artist',
    label: 'Generate pitch for current artist',
    description: 'Create personalised pitch for current artist',
    appId: 'pitch',
    route: '/pitch/generate?artist=:artistId',
    contextRequired: ['currentArtistId'],
  },

  // Project context
  {
    id: 'open-current-project-studio',
    label: 'Open current project in Studio',
    description: 'Continue working on creative project',
    appId: 'studio',
    route: '/studio/project/:projectId',
    contextRequired: ['currentProjectId'],
  },

  // Intelligence context
  {
    id: 'analyze-current-campaign-scenes',
    label: 'Analyze campaign in Scenes',
    description: 'Model campaign scenarios and outcomes',
    appId: 'scenes',
    route: '/scenes/campaign/:campaignId',
    contextRequired: ['currentCampaignId'],
  },

  {
    id: 'view-campaign-analytics',
    label: 'View campaign analytics',
    description: 'Detailed performance analytics for campaign',
    appId: 'anr',
    route: '/anr/campaign/:campaignId',
    contextRequired: ['currentCampaignId'],
  },
];

/**
 * Context store (in-memory for now, could be replaced with proper state management)
 */
let currentContext: Record<string, string> = {};

/**
 * Set context variable
 */
export function setContext(key: string, value: string): void {
  currentContext[key] = value;
}

/**
 * Get context variable
 */
export function getContext(key: string): string | undefined {
  return currentContext[key];
}

/**
 * Clear all context
 */
export function clearContext(): void {
  currentContext = {};
}

/**
 * Check if shortcut is available based on current context
 */
export function isShortcutAvailable(shortcut: ContextShortcut): boolean {
  if (!shortcut.contextRequired) return true;

  return shortcut.contextRequired.every(key => currentContext[key] !== undefined);
}

/**
 * Resolve shortcut route with current context
 */
export function resolveShortcutRoute(shortcut: ContextShortcut): string | null {
  if (!isShortcutAvailable(shortcut)) return null;

  let route = shortcut.route;

  // Replace :param placeholders with context values
  if (shortcut.contextRequired) {
    for (const key of shortcut.contextRequired) {
      const value = currentContext[key];
      if (value) {
        route = route.replace(`:${key}`, value);
      }
    }
  }

  return route;
}

/**
 * Get available shortcuts based on current context
 */
export function getAvailableShortcuts(): ContextShortcut[] {
  return CONTEXT_SHORTCUTS.filter(isShortcutAvailable);
}
