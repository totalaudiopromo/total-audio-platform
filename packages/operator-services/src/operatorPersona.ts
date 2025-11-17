/**
 * Operator Persona
 * Defines persona characteristics and UI hints
 */

export type OperatorPersona = 'default' | 'strategist' | 'producer' | 'campaign' | 'dev';

export interface PersonaConfig {
  id: OperatorPersona;
  name: string;
  description: string;
  welcomeMessage: string;
  suggestedApps: string[];
  uiHints: {
    accentColor?: string;
    dashboardLayout?: 'default' | 'campaign' | 'creative' | 'analytics';
  };
}

/**
 * Persona configurations
 */
export const PERSONAS: Record<OperatorPersona, PersonaConfig> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Balanced workspace for all Total Audio features',
    welcomeMessage: 'Welcome to OperatorOS. All systems ready.',
    suggestedApps: ['dashboard', 'intel', 'pitch', 'tracker'],
    uiHints: {
      dashboardLayout: 'default',
    },
  },

  strategist: {
    id: 'strategist',
    name: 'Strategist',
    description: 'Campaign strategy and planning focus',
    welcomeMessage: 'Strategic mode active. Mission planning tools ready.',
    suggestedApps: ['coach', 'mig', 'scenes', 'anr', 'autopilot'],
    uiHints: {
      dashboardLayout: 'campaign',
    },
  },

  producer: {
    id: 'producer',
    name: 'Producer',
    description: 'Creative production and studio workflow',
    welcomeMessage: 'Creative Studio mode. Production tools online.',
    suggestedApps: ['studio', 'community', 'pitch', 'intel'],
    uiHints: {
      dashboardLayout: 'creative',
    },
  },

  campaign: {
    id: 'campaign',
    name: 'Campaign',
    description: 'Radio campaign execution focus',
    welcomeMessage: 'Campaign mode active. Outreach systems ready.',
    suggestedApps: ['autopilot', 'intel', 'pitch', 'tracker', 'anr'],
    uiHints: {
      dashboardLayout: 'campaign',
    },
  },

  dev: {
    id: 'dev',
    name: 'Developer',
    description: 'Development and system administration',
    welcomeMessage: 'DevOS mode. System access granted.',
    suggestedApps: ['terminal', 'settings', 'automations', 'dashboard'],
    uiHints: {
      accentColor: '#3AA9BE',
      dashboardLayout: 'analytics',
    },
  },
};

/**
 * Get persona configuration
 */
export function getPersonaConfig(persona: OperatorPersona): PersonaConfig {
  return PERSONAS[persona];
}

/**
 * Get all personas
 */
export function getAllPersonas(): PersonaConfig[] {
  return Object.values(PERSONAS);
}

/**
 * Get suggested apps for persona
 */
export function getSuggestedApps(persona: OperatorPersona): string[] {
  return PERSONAS[persona].suggestedApps;
}
