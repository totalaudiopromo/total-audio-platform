/**
 * Apps Registry
 * Centralized registry of all apps available in OperatorOS
 */

import type { LucideIcon } from 'lucide-react';

export type OperatorAppID =
  | 'dashboard'
  | 'intel'
  | 'pitch'
  | 'tracker'
  | 'studio'
  | 'community'
  | 'autopilot'
  | 'automations'
  | 'coach'
  | 'scenes'
  | 'mig'
  | 'anr'
  | 'settings'
  | 'terminal';

export type OpenBehaviour = 'newWindow' | 'focusExisting';

export interface AppMetadata {
  appId: OperatorAppID;
  name: string;
  description: string;
  defaultRoute: string;
  openBehaviour: OpenBehaviour;
  category: 'core' | 'intelligence' | 'campaign' | 'creative' | 'system';
  iconName: string; // Lucide icon name
}

/**
 * Complete apps registry
 */
export const APPS_REGISTRY: Record<OperatorAppID, AppMetadata> = {
  dashboard: {
    appId: 'dashboard',
    name: 'Dashboard',
    description: 'Unified command center for all Total Audio operations',
    defaultRoute: '/dashboard',
    openBehaviour: 'focusExisting',
    category: 'core',
    iconName: 'LayoutDashboard',
  },

  intel: {
    appId: 'intel',
    name: 'Audio Intel',
    description: 'Contact enrichment and validation platform',
    defaultRoute: '/intel',
    openBehaviour: 'focusExisting',
    category: 'intelligence',
    iconName: 'Radio',
  },

  pitch: {
    appId: 'pitch',
    name: 'Pitch Generator',
    description: 'Personalised pitch generation at scale',
    defaultRoute: '/pitch',
    openBehaviour: 'focusExisting',
    category: 'campaign',
    iconName: 'Send',
  },

  tracker: {
    appId: 'tracker',
    name: 'Campaign Tracker',
    description: 'CRM-style radio submission tracking',
    defaultRoute: '/tracker',
    openBehaviour: 'focusExisting',
    category: 'campaign',
    iconName: 'Target',
  },

  studio: {
    appId: 'studio',
    name: 'Creative Studio',
    description: 'AI-powered creative intelligence workspace',
    defaultRoute: '/studio',
    openBehaviour: 'focusExisting',
    category: 'creative',
    iconName: 'Sparkles',
  },

  community: {
    appId: 'community',
    name: 'Community',
    description: 'Connect with other music industry professionals',
    defaultRoute: '/community',
    openBehaviour: 'focusExisting',
    category: 'core',
    iconName: 'Users',
  },

  autopilot: {
    appId: 'autopilot',
    name: 'Autopilot',
    description: 'Autonomous campaign orchestration and execution',
    defaultRoute: '/autopilot',
    openBehaviour: 'focusExisting',
    category: 'campaign',
    iconName: 'Zap',
  },

  automations: {
    appId: 'automations',
    name: 'Automations',
    description: 'Workflow automation and integration management',
    defaultRoute: '/automations',
    openBehaviour: 'focusExisting',
    category: 'system',
    iconName: 'Workflow',
  },

  coach: {
    appId: 'coach',
    name: 'CoachOS',
    description: 'Strategic coaching and planning interface',
    defaultRoute: '/coach',
    openBehaviour: 'focusExisting',
    category: 'intelligence',
    iconName: 'GraduationCap',
  },

  scenes: {
    appId: 'scenes',
    name: 'Scenes Engine',
    description: 'Campaign scenario modeling and simulation',
    defaultRoute: '/scenes',
    openBehaviour: 'focusExisting',
    category: 'intelligence',
    iconName: 'Film',
  },

  mig: {
    appId: 'mig',
    name: 'Mission Intelligence Graph',
    description: 'Campaign mission planning and knowledge graph',
    defaultRoute: '/mig',
    openBehaviour: 'focusExisting',
    category: 'intelligence',
    iconName: 'Briefcase',
  },

  anr: {
    appId: 'anr',
    name: 'Analytics & Reports',
    description: 'Campaign analytics and performance reporting',
    defaultRoute: '/anr',
    openBehaviour: 'focusExisting',
    category: 'intelligence',
    iconName: 'BarChart3',
  },

  settings: {
    appId: 'settings',
    name: 'Settings',
    description: 'System settings and preferences',
    defaultRoute: '/settings',
    openBehaviour: 'focusExisting',
    category: 'system',
    iconName: 'Settings',
  },

  terminal: {
    appId: 'terminal',
    name: 'Terminal',
    description: 'Developer console and system tools',
    defaultRoute: '/terminal',
    openBehaviour: 'newWindow',
    category: 'system',
    iconName: 'Terminal',
  },
};

/**
 * Get app metadata by ID
 */
export function getAppMetadata(appId: OperatorAppID): AppMetadata {
  return APPS_REGISTRY[appId];
}

/**
 * Get all apps
 */
export function getAllApps(): AppMetadata[] {
  return Object.values(APPS_REGISTRY);
}

/**
 * Get apps by category
 */
export function getAppsByCategory(category: AppMetadata['category']): AppMetadata[] {
  return getAllApps().filter(app => app.category === category);
}

/**
 * Search apps by query
 */
export function searchApps(query: string): AppMetadata[] {
  const lowerQuery = query.toLowerCase();

  return getAllApps().filter(app =>
    app.name.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery) ||
    app.appId.toLowerCase().includes(lowerQuery)
  );
}
