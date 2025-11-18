/**
 * Persona Presets Configuration
 * Defines recommended layouts and apps for each OperatorOS persona
 * Phase 3 - Desktop Experience Layer
 */

import type { OperatorPersona } from './appsRegistry';
import type { OperatorAppID } from './appsRegistry';
import type { OperatorOSTheme } from '@total-audio/operator-os';

export interface PersonaPreset {
  persona: OperatorPersona;
  displayName: string;
  icon: string;
  description: string;
  recommendedTheme: OperatorOSTheme;
  recommendedLayoutName: string;
  primaryApps: OperatorAppID[];
  secondaryApps: OperatorAppID[];
  quickActions: string[];
  layoutHints: {
    defaultWindowCount: number;
    suggestedArrangement: string;
  };
}

export const PERSONA_PRESETS: Record<OperatorPersona, PersonaPreset> = {
  default: {
    persona: 'default',
    displayName: 'Default',
    icon: '⚡',
    description: 'Balanced workflow for general tasks across all Total Audio tools',
    recommendedTheme: 'daw',
    recommendedLayoutName: 'default',
    primaryApps: ['dashboard', 'intel', 'pitch', 'tracker'],
    secondaryApps: ['community', 'settings'],
    quickActions: ['Open Dashboard', 'Check Intel', 'View Tracker'],
    layoutHints: {
      defaultWindowCount: 2,
      suggestedArrangement: 'Dashboard + one active tool',
    },
  },

  strategist: {
    persona: 'strategist',
    displayName: 'Strategist',
    icon: '🎯',
    description: 'Intelligence-focused ops and planning. Ideal for data analysis and strategic decisions.',
    recommendedTheme: 'ascii',
    recommendedLayoutName: 'ops',
    primaryApps: ['intel', 'anr', 'mig', 'coach'],
    secondaryApps: ['dashboard', 'pitch', 'scenes'],
    quickActions: ['Open Audio Intel', 'View Analytics', 'Check MIG'],
    layoutHints: {
      defaultWindowCount: 3,
      suggestedArrangement: 'Intel + Analytics + Mission Graph in split view',
    },
  },

  producer: {
    persona: 'producer',
    displayName: 'Producer',
    icon: '🎨',
    description: 'Creative studio and production tools. Perfect for creative content and campaign design.',
    recommendedTheme: 'aqua',
    recommendedLayoutName: 'creative',
    primaryApps: ['studio', 'scenes', 'pitch'],
    secondaryApps: ['community', 'tracker', 'intel'],
    quickActions: ['Open Creative Studio', 'Launch Scenes', 'Generate Pitch'],
    layoutHints: {
      defaultWindowCount: 2,
      suggestedArrangement: 'Studio (maximized) + Scenes (side panel)',
    },
  },

  campaign: {
    persona: 'campaign',
    displayName: 'Campaign Manager',
    icon: '📊',
    description: 'Campaign execution and tracking. Optimized for managing active promotional campaigns.',
    recommendedTheme: 'daw',
    recommendedLayoutName: 'ops',
    primaryApps: ['autopilot', 'tracker', 'pitch', 'intel'],
    secondaryApps: ['anr', 'scenes', 'dashboard'],
    quickActions: ['Launch Autopilot', 'Track Campaign', 'Send Pitches'],
    layoutHints: {
      defaultWindowCount: 3,
      suggestedArrangement: 'Autopilot + Tracker + Pitch Generator tiled',
    },
  },

  dev: {
    persona: 'dev',
    displayName: 'Developer',
    icon: '⌨️',
    description: 'System tools and terminal access. For developers and power users.',
    recommendedTheme: 'ascii',
    recommendedLayoutName: 'dev',
    primaryApps: ['terminal', 'settings', 'automations'],
    secondaryApps: ['dashboard', 'intel', 'anr'],
    quickActions: ['Open Terminal', 'System Settings', 'View Automations'],
    layoutHints: {
      defaultWindowCount: 2,
      suggestedArrangement: 'Terminal (main) + Settings (reference)',
    },
  },
};

/**
 * Get persona preset by persona name
 */
export function getPersonaPreset(persona: OperatorPersona): PersonaPreset {
  return PERSONA_PRESETS[persona];
}

/**
 * Get all persona presets
 */
export function getAllPersonaPresets(): PersonaPreset[] {
  return Object.values(PERSONA_PRESETS);
}

/**
 * Get recommended apps for a persona (primary + secondary)
 */
export function getRecommendedApps(persona: OperatorPersona): OperatorAppID[] {
  const preset = PERSONA_PRESETS[persona];
  return [...preset.primaryApps, ...preset.secondaryApps];
}

/**
 * Get primary apps only for a persona
 */
export function getPrimaryApps(persona: OperatorPersona): OperatorAppID[] {
  return PERSONA_PRESETS[persona].primaryApps;
}

/**
 * Check if an app is recommended for a persona
 */
export function isAppRecommendedForPersona(
  appId: OperatorAppID,
  persona: OperatorPersona
): boolean {
  const preset = PERSONA_PRESETS[persona];
  return preset.primaryApps.includes(appId) || preset.secondaryApps.includes(appId);
}

/**
 * Get persona suggestions based on currently open apps
 */
export function suggestPersonaForApps(openAppIds: OperatorAppID[]): OperatorPersona | null {
  if (openAppIds.length === 0) return null;

  // Count matches for each persona
  const scores: Record<OperatorPersona, number> = {
    default: 0,
    strategist: 0,
    producer: 0,
    campaign: 0,
    dev: 0,
  };

  for (const appId of openAppIds) {
    for (const [personaKey, preset] of Object.entries(PERSONA_PRESETS)) {
      const persona = personaKey as OperatorPersona;
      if (preset.primaryApps.includes(appId)) {
        scores[persona] += 2; // Primary apps count more
      } else if (preset.secondaryApps.includes(appId)) {
        scores[persona] += 1;
      }
    }
  }

  // Find persona with highest score
  let maxScore = 0;
  let suggestedPersona: OperatorPersona = 'default';

  for (const [persona, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      suggestedPersona = persona as OperatorPersona;
    }
  }

  // Only suggest if there's a clear match (at least 2 points)
  return maxScore >= 2 ? suggestedPersona : null;
}
