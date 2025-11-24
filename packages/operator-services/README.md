# @total-audio/operator-services

**Service layer** for OperatorOS — app registry, deep links, personas, and context shortcuts.

## Overview

This package provides the glue between OperatorOS and the rest of Total Audio Platform. It defines which apps are available, how to navigate to them, and how personas influence the UI.

## Features

### 1. Apps Registry

Centralized registry of all apps available in OperatorOS.

```tsx
import { APPS_REGISTRY, getAppMetadata } from '@total-audio/operator-services';

// Get app metadata
const intel = getAppMetadata('intel');
// {
//   appId: 'intel',
//   name: 'Audio Intel',
//   description: 'Contact enrichment and validation platform',
//   defaultRoute: '/intel',
//   openBehaviour: 'focusExisting',
//   category: 'intelligence',
//   iconName: 'Radio',
// }

// Search apps
import { searchApps } from '@total-audio/operator-services';
const results = searchApps('campaign');
```

### 2. Deep Links

Navigate to specific routes within apps.

```tsx
import { DEEP_LINKS, buildRouteUrl } from '@total-audio/operator-services';

// Predefined shortcuts
const link = DEEP_LINKS.autopilotMission('mission-123');
// { appId: 'autopilot', route: '/autopilot/mission/mission-123' }

// Build route URL
const url = buildRouteUrl('intel', '/intel/enrich', { artist: 'foo' });
// '/intel/enrich?artist=foo'
```

### 3. Operator Personas

Personas adjust UI hints and suggested apps.

```tsx
import { getPersonaConfig, getSuggestedApps } from '@total-audio/operator-services';

const config = getPersonaConfig('strategist');
// {
//   id: 'strategist',
//   name: 'Strategist',
//   description: 'Campaign strategy and planning focus',
//   welcomeMessage: 'Strategic mode active. Mission planning tools ready.',
//   suggestedApps: ['coach', 'mig', 'scenes', 'anr', 'autopilot'],
// }
```

### 4. Context Shortcuts

Context-aware actions based on current state.

```tsx
import { setContext, getAvailableShortcuts } from '@total-audio/operator-services';

// Set context
setContext('currentMissionId', 'mission-123');
setContext('currentArtistId', 'artist-456');

// Get available shortcuts
const shortcuts = getAvailableShortcuts();
// Returns shortcuts that have required context set
```

## API Reference

### Apps Registry

```tsx
// Get app metadata
getAppMetadata(appId: OperatorAppID): AppMetadata

// Get all apps
getAllApps(): AppMetadata[]

// Get apps by category
getAppsByCategory(category: 'core' | 'intelligence' | 'campaign' | 'creative' | 'system'): AppMetadata[]

// Search apps
searchApps(query: string): AppMetadata[]
```

### Deep Links

```tsx
// Parse deep link
parseDeepLink(url: string): DeepLink | null

// Build deep link
buildDeepLink(link: DeepLink): string

// Build route URL
buildRouteUrl(appId: OperatorAppID, route?: string, params?: Record<string, string>): string
```

### Personas

```tsx
// Get persona config
getPersonaConfig(persona: OperatorPersona): PersonaConfig

// Get all personas
getAllPersonas(): PersonaConfig[]

// Get suggested apps for persona
getSuggestedApps(persona: OperatorPersona): string[]
```

### Context Shortcuts

```tsx
// Set context variable
setContext(key: string, value: string): void

// Get context variable
getContext(key: string): string | undefined

// Clear all context
clearContext(): void

// Check if shortcut is available
isShortcutAvailable(shortcut: ContextShortcut): boolean

// Resolve shortcut route with context
resolveShortcutRoute(shortcut: ContextShortcut): string | null

// Get available shortcuts
getAvailableShortcuts(): ContextShortcut[]
```

## Registered Apps

| App ID       | Name                        | Category      | Default Route           |
|--------------|-----------------------------|---------------|-------------------------|
| dashboard    | Dashboard                   | core          | /dashboard              |
| intel        | Audio Intel                 | intelligence  | /intel                  |
| pitch        | Pitch Generator             | campaign      | /pitch                  |
| tracker      | Campaign Tracker            | campaign      | /tracker                |
| studio       | Creative Studio             | creative      | /studio                 |
| community    | Community                   | core          | /community              |
| autopilot    | Autopilot                   | campaign      | /autopilot              |
| automations  | Automations                 | system        | /automations            |
| coach        | CoachOS                     | intelligence  | /coach                  |
| scenes       | Scenes Engine               | intelligence  | /scenes                 |
| mig          | Mission Intelligence Graph  | intelligence  | /mig                    |
| anr          | Analytics & Reports         | intelligence  | /anr                    |
| settings     | Settings                    | system        | /settings               |
| terminal     | Terminal                    | system        | /terminal               |

## Personas

| Persona     | Focus                      | Suggested Apps                            |
|-------------|----------------------------|-------------------------------------------|
| default     | Balanced workspace         | dashboard, intel, pitch, tracker          |
| strategist  | Campaign strategy          | coach, mig, scenes, anr, autopilot        |
| producer    | Creative production        | studio, community, pitch, intel           |
| campaign    | Radio campaign execution   | autopilot, intel, pitch, tracker, anr     |
| dev         | Development & admin        | terminal, settings, automations, dashboard|

## Deep Link Shortcuts

```tsx
DEEP_LINKS = {
  // Dashboard
  dashboardHome: () => DeepLink

  // Intel
  intelEnrich: () => DeepLink
  intelHistory: () => DeepLink

  // Pitch
  pitchGenerate: () => DeepLink
  pitchTemplates: () => DeepLink

  // Tracker
  trackerCampaigns: () => DeepLink
  trackerCampaign: (campaignId: string) => DeepLink

  // Studio
  studioProjects: () => DeepLink
  studioProject: (projectId: string) => DeepLink

  // Autopilot
  autopilotMissions: () => DeepLink
  autopilotMission: (missionId: string) => DeepLink

  // Coach
  coachHome: () => DeepLink
  coachArtist: (artistId: string) => DeepLink

  // Scenes
  scenesExplore: () => DeepLink
  scenesScenario: (scenarioId: string) => DeepLink

  // MIG
  migHome: () => DeepLink

  // ANR
  anrReports: () => DeepLink

  // Settings
  settingsGeneral: () => DeepLink
  settingsIntegrations: () => DeepLink
}
```

## Context Shortcuts

Predefined context-aware shortcuts:

- **open-current-campaign-autopilot**: Open current campaign in Autopilot
- **open-current-campaign-tracker**: Track campaign progress
- **open-current-artist-coach**: Strategic planning for artist
- **generate-pitch-current-artist**: Create pitch for artist
- **open-current-project-studio**: Continue creative project
- **analyze-current-campaign-scenes**: Model campaign scenarios
- **view-campaign-analytics**: Performance analytics

## Extending

### Add New App

```tsx
// Update APPS_REGISTRY in appsRegistry.ts
export const APPS_REGISTRY: Record<OperatorAppID, AppMetadata> = {
  // ... existing apps
  myNewApp: {
    appId: 'myNewApp',
    name: 'My New App',
    description: 'Description here',
    defaultRoute: '/my-new-app',
    openBehaviour: 'focusExisting',
    category: 'core',
    iconName: 'Star',
  },
};
```

### Add Deep Link Shortcut

```tsx
// Update DEEP_LINKS in deepLinks.ts
export const DEEP_LINKS = {
  // ... existing links
  myNewAppHome: (): DeepLink => ({
    appId: 'myNewApp',
    route: '/my-new-app',
  }),
};
```

### Add Context Shortcut

```tsx
// Update CONTEXT_SHORTCUTS in contextShortcuts.ts
export const CONTEXT_SHORTCUTS: ContextShortcut[] = [
  // ... existing shortcuts
  {
    id: 'my-context-action',
    label: 'My Context Action',
    description: 'Does something context-aware',
    appId: 'myNewApp',
    route: '/my-new-app/:contextId',
    contextRequired: ['contextId'],
  },
];
```

## Related Packages

- **@total-audio/operator-os**: Main desktop environment
- **@total-audio/operator-boot**: Boot sequence components

## License

Private - Total Audio Platform
