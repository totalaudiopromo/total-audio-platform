/**
 * OperatorServices Package Entry Point
 * Exports all service utilities and registries
 */

// Apps Registry
export {
  APPS_REGISTRY,
  getAppMetadata,
  getAllApps,
  getAppsByCategory,
  searchApps,
  type OperatorAppID,
  type OpenBehaviour,
  type AppMetadata,
} from './appsRegistry';

// Deep Links
export {
  parseDeepLink,
  buildDeepLink,
  buildRouteUrl,
  DEEP_LINKS,
  type DeepLink,
} from './deepLinks';

// Operator Persona
export {
  PERSONAS,
  getPersonaConfig,
  getAllPersonas,
  getSuggestedApps,
  type OperatorPersona,
  type PersonaConfig,
} from './operatorPersona';

// Context Shortcuts
export {
  CONTEXT_SHORTCUTS,
  setContext,
  getContext,
  clearContext,
  isShortcutAvailable,
  resolveShortcutRoute,
  getAvailableShortcuts,
  type ContextShortcut,
} from './contextShortcuts';

// Persona Presets
export {
  PERSONA_PRESETS,
  getPersonaPreset,
  getAllPersonaPresets,
  getRecommendedApps,
  getPrimaryApps,
  isAppRecommendedForPersona,
  suggestPersonaForApps,
  type PersonaPreset,
} from './personaPresets';

// Hooks
export { useAppProfiles } from './hooks/useAppProfiles';
