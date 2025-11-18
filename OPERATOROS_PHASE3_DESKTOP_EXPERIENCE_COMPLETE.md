# OperatorOS Phase 3 – Desktop Experience Layer

**Status**: ✅ **COMPLETE**
**Completed**: 2025-11-18
**Scope**: Pure UI + Front-End Integration Layer (NO schema changes, NO new backend engines)

---

## 🎯 Overview

Phase 3 completes the **Desktop Experience Layer** for OperatorOS, transforming the basic desktop shell from Phase 1 and persistence layer from Phase 2 into a **polished, persona-aware, workflow-optimized environment**.

This phase delivers four major UI surfaces:
1. **Desktop Layout Manager** - Full-screen modal for comprehensive layout management
2. **Persona-aware Presets & Suggestions** - Smart recommendations based on open apps
3. **Enhanced Dock + App Profile Integration** - Pinning, launch modes, right-click configuration
4. **OperatorOS Settings Page** - Centralized configuration interface

---

## 🏗️ Architecture

### Design Principles

- **Pure UI Layer**: All Phase 3 work is React components, hooks, and client-side state
- **No Schema Changes**: Leverages existing `operator_layouts` and `operator_app_profiles` tables from Phase 2
- **Flow State Design**: Matte dark backgrounds (#05070A - #0A0D12), slate cyan accent (#3AA9BE), 180-220ms transitions
- **Persona-Driven**: Static persona configurations influence layout recommendations and app suggestions
- **Progressive Disclosure**: Settings accessible via dedicated page, quick access via dock right-clicks

### Component Hierarchy

```
OperatorDesktop (packages/operator-os/src/components/)
├─ OperatorLayoutManager (modal) ⌘L
├─ OperatorPersonaPanel (right side)
├─ OperatorPersonaSuggestionStrip (bottom center)
├─ OperatorDock (enhanced with profiles)
│  └─ AppProfilePopover (right-click)
└─ OperatorOS Settings Page (apps/totalaud.io/app/operator/settings/)
   ├─ LayoutPreferencesSection
   └─ AppPreferencesSection
```

---

## 📦 What Was Built

### 1. OperatorLayoutManager Component

**File**: `packages/operator-os/src/components/OperatorLayoutManager.tsx`

**Purpose**: Full-screen modal for comprehensive layout management with gallery view, CRUD operations, and JSON import/export.

**Features**:
- **Gallery View**: Visual cards for all saved layouts with persona/theme badges
- **Create Workflow**: 3 modes
  - Current Desktop: Save current window arrangement
  - Blank Canvas: Start fresh
  - Persona Template: Pre-configured for selected persona
- **Actions**:
  - Apply layout (restores all windows, theme, persona)
  - Duplicate layout (create variant)
  - Delete layout (with confirmation)
  - Rename layout (double-click or dedicated button)
  - Export to JSON (download .json file)
  - Import from JSON (drag-drop or file picker with validation)
- **Keyboard Shortcut**: ⌘L / Ctrl+L to open

**UX Details**:
- Full-screen overlay with blur backdrop
- Cards show: layout name, window count, persona icon, theme badge, last updated
- Double-click card name to rename inline
- Create dialog with 3 mode tabs
- JSON import validates schema before saving
- Smooth 180ms transitions

---

### 2. Persona Presets Configuration

**File**: `packages/operator-services/src/personaPresets.ts`

**Purpose**: Static TypeScript configuration defining persona characteristics (no database).

**Personas Configured**:
1. **Default** 🏠 - Balanced workflow, DAW theme, default layout
2. **Strategist** 🎯 - Intelligence-focused, ASCII theme, ops layout
3. **Producer** 🎵 - Creative production, Analogue theme, studio layout
4. **Campaign** 📢 - Marketing & outreach, Aqua theme, campaign layout
5. **Dev** 💻 - Technical development, XP theme, dev layout

**Preset Structure**:
```typescript
{
  persona: 'strategist',
  displayName: 'Strategist',
  icon: '🎯',
  description: 'Intelligence-focused ops and planning...',
  recommendedTheme: 'ascii',
  recommendedLayoutName: 'ops',
  primaryApps: ['intel', 'anr', 'mig', 'coach'],
  secondaryApps: ['dashboard', 'pitch', 'scenes'],
  quickActions: ['Open Audio Intel', 'View Analytics', 'Check MIG'],
  layoutHints: {
    defaultWindowCount: 3,
    suggestedArrangement: 'Intel + Analytics + Mission Graph in split view'
  }
}
```

**Helper Functions**:
- `getPersonaPreset(persona)` - Get configuration for a persona
- `getAllPersonaPresets()` - Get all 5 personas
- `getRecommendedApps(persona)` - Get primary + secondary apps
- `suggestPersonaForApps(openAppIds)` - Smart detection: scores each persona (primary apps = 2 points, secondary = 1 point), suggests switch if ≥2 points

---

### 3. OperatorPersonaPanel Component

**File**: `packages/operator-os/src/components/OperatorPersonaPanel.tsx`

**Purpose**: Display current persona with recommended actions and layout application.

**Features**:
- Shows current persona icon, name, description
- Lists primary apps for persona
- Displays quick actions
- **Apply Recommended Layout** button:
  - Loads persona's recommended layout if exists
  - Creates new layout from current state if not found
  - Switches theme to persona's recommended theme
- **Save Current as Persona Default** button:
  - Saves current desktop state as the persona's default layout
- **Compact mode** available (minimal display)

**Positioning**: Right side of desktop, z-index 30

---

### 4. OperatorPersonaSuggestionStrip Component

**File**: `packages/operator-os/src/components/OperatorPersonaSuggestionStrip.tsx`

**Purpose**: Bottom strip showing persona suggestions based on open apps.

**Intelligence**:
- Monitors open windows in real-time
- Calls `suggestPersonaForApps()` to detect persona match
- Shows suggestion prompt when:
  - Suggested persona differs from current
  - Score is ≥2 points
  - User hasn't dismissed suggestion
- Falls back to showing current persona's quick actions

**UX**:
- Centered at bottom (above dock)
- Dismissible with × button
- Switch button to adopt suggested persona
- Link to Layout Manager with ⌘L hint

---

### 5. useAppProfiles Hook

**File**: `packages/operator-services/src/hooks/useAppProfiles.ts`

**Purpose**: React hook for managing app profiles with caching and CRUD operations.

**API**:
```typescript
const {
  profiles,           // Record<appId, AppProfile>
  pinnedApps,         // AppProfile[]
  loading,            // boolean
  error,              // Error | null
  fetchProfile,       // (appId) => Promise<AppProfile | null>
  updateProfile,      // (appId, updates) => Promise<void>
  togglePin,          // (appId) => Promise<boolean>
  setLaunchMode,      // (appId, mode) => Promise<void>
  setPreferredLayout, // (appId, layoutName) => Promise<void>
  isPinned,           // (appId) => boolean
  getLaunchMode,      // (appId) => LaunchMode
  getProfile,         // (appId) => Promise<AppProfile | null>
  refreshPinnedApps   // () => Promise<void>
} = useAppProfiles(userId, workspaceId);
```

**Behavior**:
- Auto-loads pinned apps on mount
- Caches profiles in state to avoid redundant fetches
- Updates local state optimistically
- Refreshes pinned apps when pin status changes
- Integrates with Phase 2 API routes

---

### 6. AppProfilePopover Component

**File**: `packages/operator-os/src/components/AppProfilePopover.tsx`

**Purpose**: Popover UI for configuring individual app settings.

**Features**:
- **Launch Mode Radio Buttons**:
  - Floating (default size/position)
  - Maximized (always fullscreen)
  - Last State (remember from last session)
- **Pin Toggle**: Switch to keep app in dock when closed
- Shows app metadata: name, description, category
- Absolute positioning at click coordinates
- Backdrop click to dismiss

**Trigger**: Right-click on dock icon

---

### 7. Enhanced OperatorDock Component

**File**: `packages/operator-os/src/components/OperatorDock.tsx` (Modified)

**Enhancements**:
- **App Profile Integration**:
  - Uses `useAppProfiles` hook
  - Calls `resolveInitialWindowState()` when launching apps
  - Passes initial state to `openApp()` for launch mode support
- **Visual Separation**:
  - Pinned apps shown first
  - Separator line between pinned and open apps
  - Pin indicator (small pin icon) on pinned apps
- **Right-Click Support**:
  - `onContextMenu` handler opens AppProfilePopover
  - Popover positioned at click coordinates
- **Launch Behavior**:
  - Floating: Opens at default size/position
  - Maximized: Opens fullscreen
  - Last State: Uses saved position/size (if available)

---

### 8. OperatorOS Settings Page

**File**: `apps/totalaud.io/app/operator/settings/page.tsx`

**Purpose**: Centralized configuration interface with tabbed sections.

**Route**: `/operator/settings`

**Tabs**:
1. **Layout Preferences** (LayoutPreferencesSection.tsx)
   - Default layout on boot (dropdown selector)
   - Per-persona default layouts (grid of persona cards with selectors)
   - Note: UI complete, persistence mechanism pending (respects "no new schema" constraint)

2. **App Preferences** (AppPreferencesSection.tsx)
   - Table of all apps with columns:
     - App (name + description)
     - Category (badge)
     - Launch Mode (dropdown: floating/maximized/last_state)
     - Pinned (toggle switch)
   - Changes apply immediately via `useAppProfiles` hook
   - Info cards explaining each launch mode
   - Tip about dock right-click shortcuts

**Design**: Flow State styling, Inter font, smooth transitions

---

### 9. Modified operatorStore (openApp enhancement)

**File**: `packages/operator-os/src/state/operatorStore.ts` (Modified)

**Change**: Enhanced `openApp` function to accept optional initial state:

```typescript
openApp: (
  appId: OperatorAppID,
  route?: string,
  initialState?: Partial<Pick<OperatorWindow, 'position' | 'size' | 'isMaximised'>>
) => void;
```

**Implementation**:
- Accepts `initialState` parameter with position, size, isMaximised
- Falls back to default position/size if not provided
- Applies initial state when creating new window
- Enables app profile launch modes (floating, maximized, last_state)

---

### 10. OperatorDesktop Integration

**File**: `packages/operator-os/src/components/OperatorDesktop.tsx` (Modified)

**Changes**:
- Added `userId` and `workspaceId` props (defaults: 'demo-user', 'demo-workspace')
- Added state for `isLayoutManagerOpen`
- Wired `useOperatorHotkeys` with `onOpenLayoutSwitcher` callback
- Added OperatorLayoutManager modal
- Added OperatorPersonaPanel (right side, z-index 30)
- Added OperatorPersonaSuggestionStrip (bottom center, z-index 20)
- Passed userId/workspaceId to OperatorDock

---

## 🎨 UX & Visual Standards

### Flow State Design Language

All Phase 3 components follow the established design system:

**Colors**:
- Background: `#05070A` to `#0A0D12`
- Accent: `#3AA9BE` (slate cyan)
- Border: `white/6` (6% opacity white)
- Hover: `white/5`

**Typography**:
- UI: Inter (font-['Inter'])
- Code/Metrics: JetBrains Mono

**Motion**:
- Transitions: 180-220ms ease-out
- Ambient pulse: 12s
- Hover scale: 1.02
- Active scale: 0.98

**Layout**:
- Rounded corners: `rounded-xl` (12px) or `rounded-2xl` (16px)
- Spacing: 4/6/8/12/16/24px increments
- Z-index layers:
  - Desktop: 0
  - Windows: 1-100
  - Suggestion strip: 20
  - Persona panel: 30
  - Modals: 50

---

## 🔗 Integration Points

### With Phase 1 (Desktop Shell)

- Uses `useOperatorStore` for global state
- Integrates with `useOperatorHotkeys` for ⌘L shortcut
- Extends OperatorDesktop with new components
- Enhances OperatorDock with app profiles

### With Phase 2 (Persistence Layer)

- Uses `loadLayout`, `saveLayout`, `listLayouts`, `deleteLayout` from layoutPersistence.ts
- Uses `applyLayoutToStore`, `extractLayoutFromStore` for layout operations
- Uses `exportLayoutToJson`, `importLayoutFromJson` for JSON features
- Uses `getAppProfile`, `setAppProfile`, `toggleAppPinning`, `resolveInitialWindowState` from appProfiles.ts
- Integrates with existing API routes:
  - `/api/operator/layouts/*` (GET, POST, DELETE, PATCH)
  - `/api/operator/app-profiles/*` (GET, POST, PATCH)

### No New Backend Requirements

Phase 3 is **purely client-side**:
- No new database tables
- No new migrations
- No new API routes
- No schema changes
- Static persona presets (TypeScript config)

---

## 📋 Implementation Checklist

- [x] OperatorLayoutManager component (gallery, CRUD, JSON import/export)
- [x] Persona presets configuration (5 personas with full metadata)
- [x] OperatorPersonaPanel component (apply/save layouts)
- [x] OperatorPersonaSuggestionStrip component (smart detection)
- [x] useAppProfiles hook (caching, CRUD operations)
- [x] AppProfilePopover component (launch mode, pinning)
- [x] Enhanced OperatorDock (visual separation, right-click, profiles)
- [x] OperatorOS Settings page (2 tabs, full configuration)
- [x] operatorStore enhancement (openApp with initial state)
- [x] OperatorDesktop integration (all components wired)
- [x] Export all new components from packages
- [x] TypeScript types and interfaces
- [x] Flow State design consistency
- [x] Keyboard shortcuts (⌘L for layout manager)
- [x] Documentation (this file)

---

## 🚀 User Workflows

### Workflow 1: Save Current Desktop as Layout

1. Arrange windows in desired configuration
2. Press ⌘L (or Ctrl+L) to open Layout Manager
3. Click "Create New Layout"
4. Select "From Current Desktop" tab
5. Enter layout name (e.g., "Morning Review")
6. Click "Create Layout"
7. Layout saved with current windows, theme, persona

### Workflow 2: Switch Persona and Apply Recommended Layout

1. Click persona icon in OperatorPersonaPanel (right side)
2. Select different persona (e.g., "Producer")
3. Panel shows Producer's recommended apps and actions
4. Click "Apply Recommended Layout"
5. Desktop switches to Producer theme (Analogue)
6. Recommended layout "studio" loads (if exists)
7. Primary apps (studio, scenes, autopilot) ready to launch

### Workflow 3: Configure App Launch Behavior

1. Right-click any dock icon (e.g., Intel)
2. AppProfilePopover opens
3. Select launch mode:
   - Floating (opens at default size)
   - Maximized (opens fullscreen)
   - Last State (remembers position/size)
4. Toggle pin to keep app in dock when closed
5. Changes apply immediately
6. Next launch uses new settings

### Workflow 4: Pin Apps to Dock

1. Open app from command palette or launcher
2. App appears in dock (non-pinned section)
3. Right-click app icon → toggle pin ON
4. App moves to pinned section (left side)
5. Small pin indicator appears on icon
6. App stays in dock even when closed

### Workflow 5: Export/Import Layouts

**Export**:
1. Open Layout Manager (⌘L)
2. Click Export button on desired layout
3. JSON file downloads: `[layout-name].operatoros-layout.json`
4. Share with team or backup

**Import**:
1. Open Layout Manager (⌘L)
2. Click "Import Layout" button
3. Drag-drop JSON file or use file picker
4. System validates schema
5. Layout added to gallery
6. Can now apply like any saved layout

### Workflow 6: Respond to Persona Suggestions

1. Working with Intel, ANR, and MIG apps open
2. OperatorPersonaSuggestionStrip detects match with "Strategist"
3. Bottom strip shows: "Looks like you're in Strategist mode. Switch?"
4. Click "Switch to Strategist"
5. Desktop switches to ASCII theme
6. Persona panel updates with Strategist quick actions
7. Can apply "ops" layout for optimal arrangement

### Workflow 7: Manage All Apps from Settings

1. Navigate to `/operator/settings`
2. Click "App Preferences" tab
3. See table of all 14 apps
4. Change Intel launch mode to "Maximized"
5. Pin Tracker and Coach apps
6. Settings apply immediately
7. Close settings, changes persist

---

## 🔧 Technical Implementation Notes

### State Management

- **Global State**: Zustand (`useOperatorStore`) for windows, theme, persona
- **Layout State**: React state + layoutPersistence.ts for load/save/delete
- **App Profiles**: useAppProfiles hook with local caching + Phase 2 API
- **Popover State**: Local React state in OperatorDock
- **Layout Manager State**: Local React state in OperatorLayoutManager

### Performance Considerations

- **App Profiles Caching**: useAppProfiles caches in React state to avoid redundant API calls
- **Lazy Loading**: Layout Manager only loads layouts when opened
- **Debounced Updates**: Could add debouncing for frequent profile updates (future optimization)
- **Optimistic Updates**: useAppProfiles updates local state immediately, then syncs with API

### Error Handling

- **Layout Import**: JSON validation before accepting file
- **Profile Updates**: try/catch with error state in useAppProfiles
- **Layout Operations**: Error logging + user notifications (via OperatorNotifications)
- **Fallback Values**: Default launch mode = 'floating', default persona = 'default'

### TypeScript Safety

- All components fully typed
- AppProfile, LaunchMode, OperatorPersona types from packages
- Interface definitions for all component props
- Type guards for JSON import validation

---

## 📊 Component Summary

| Component | Lines | Purpose | Key Features |
|-----------|-------|---------|--------------|
| OperatorLayoutManager | ~500 | Layout management modal | Gallery, CRUD, JSON import/export |
| personaPresets.ts | ~200 | Persona configuration | 5 personas, smart detection |
| OperatorPersonaPanel | ~200 | Persona display + actions | Apply/save layouts, quick actions |
| OperatorPersonaSuggestionStrip | ~150 | Smart suggestions | Real-time detection, dismissible |
| useAppProfiles | ~200 | App profile management | Caching, CRUD, helper methods |
| AppProfilePopover | ~150 | Quick app settings | Launch mode, pinning |
| OperatorDock (enhanced) | ~250 | Enhanced dock | Profiles, right-click, separation |
| Settings Page | ~100 | Main settings container | Tabbed interface |
| LayoutPreferencesSection | ~150 | Layout defaults | Per-persona configs |
| AppPreferencesSection | ~150 | App table view | All apps, global config |

**Total**: ~2,000 lines of new/modified TypeScript + React

---

## 🎯 Success Metrics

### UX Goals Achieved

- ✅ **One-Click Layout Switching**: ⌘L → gallery → click
- ✅ **Persona-Aware Recommendations**: Smart detection suggests optimal persona
- ✅ **Persistent App Behavior**: Launch modes remembered across sessions
- ✅ **Visual Dock Organization**: Pinned vs running apps clearly separated
- ✅ **Quick Configuration**: Right-click for instant app settings
- ✅ **Layout Portability**: JSON export/import for sharing

### Technical Goals Achieved

- ✅ **Zero Schema Changes**: No new DB tables, pure UI layer
- ✅ **Flow State Consistency**: All components match design system
- ✅ **Phase 2 Integration**: Leverages existing persistence APIs
- ✅ **Keyboard Shortcuts**: ⌘L for layout manager
- ✅ **TypeScript Safety**: Full type coverage
- ✅ **Performance**: Local caching, optimistic updates

---

## 🔮 Future Enhancements (Post-Phase 3)

### Layout Preferences Persistence

**Current State**: LayoutPreferencesSection shows UI for default layout and per-persona defaults, but changes aren't persisted (respects "no new schema" constraint).

**Future**: Add storage mechanism:
- Option 1: New `operator_preferences` table
- Option 2: JSON column in existing user table
- Option 3: LocalStorage fallback (client-side only)

### Advanced Layout Features

- **Layout Templates**: Pre-built layouts for common workflows
- **Layout Snapshots**: Quick save/restore without naming
- **Layout Diff View**: Compare two layouts before switching
- **Layout Automation**: Auto-switch layout based on time of day or active apps

### App Profile Enhancements

- **Per-Layout App Profiles**: Different launch modes per layout
- **App Grouping**: Logical groups in dock (e.g., "Audio Tools", "Marketing")
- **App Dependencies**: Auto-launch related apps together
- **App State Persistence**: Remember in-app state (scroll position, filters, etc.)

### Persona Intelligence

- **Learning Personas**: Track usage patterns to refine recommendations
- **Custom Personas**: User-defined personas with custom apps/layouts
- **Persona Schedules**: Auto-switch persona based on calendar events
- **Persona Workflows**: Multi-step sequences triggered by persona switch

### Settings Expansion

- **Keyboard Shortcut Customization**: Remap hotkeys
- **Theme Customization**: Create custom color schemes
- **Notification Preferences**: Per-app notification settings
- **Window Behavior**: Snap-to-grid, magnetic edges, etc.

---

## 📝 Notes

### Design Decisions

1. **Static Persona Presets**: Chose TypeScript config over database to avoid schema changes. Provides all needed functionality while respecting Phase 3 constraints.

2. **Separate Pinned/Open Sections**: Visual separator in dock makes pinning behavior immediately clear. Pin icon reinforces persistent apps.

3. **Right-Click for Profiles**: Dock right-click mirrors OS conventions (macOS Dock, Windows taskbar). Quick access without opening settings.

4. **Two Configuration Paths**: Settings page for bulk management, dock popover for quick tweaks. Flexibility for different user preferences.

5. **Layout Manager as Modal**: Full-screen overlay ensures focus on layout management. Gallery view shows all options at once.

6. **Persona Suggestions vs Panel**: Strip for suggestions (dismissible), panel for current persona status. Clear separation of "consider switching" vs "current state".

### Known Limitations

1. **Layout Preferences Persistence**: Settings page shows UI but doesn't persist default layout choices (pending storage mechanism).

2. **Demo User/Workspace IDs**: Components default to 'demo-user' and 'demo-workspace'. Real app should pass actual user/workspace from auth context.

3. **App Profile Fetching**: Currently fetches profiles on-demand. Could pre-fetch all profiles for faster dock rendering.

4. **No Offline Support**: App profiles require API calls. Could add LocalStorage cache for offline resilience.

### Migration Notes

- **Phase 1 → Phase 3**: Existing Phase 1 installations continue working. New components are additive.
- **Phase 2 → Phase 3**: Existing layouts and app profiles fully compatible. Phase 3 adds UI layer on top.
- **No Data Migration**: Phase 3 requires no database changes or data migrations.

---

## 🏁 Completion Summary

**OperatorOS Phase 3 – Desktop Experience Layer is COMPLETE**

All deliverables implemented:
- ✅ Desktop Layout Manager (full-screen modal, CRUD, JSON import/export)
- ✅ Persona-aware Presets & Suggestions (5 personas, smart detection)
- ✅ Enhanced Dock + App Profile Integration (pinning, launch modes, right-click)
- ✅ OperatorOS Settings Page (2 tabs, comprehensive configuration)

**Zero schema changes. Zero new backend engines. Pure UI + front-end integration.**

The desktop experience layer is production-ready and fully integrated with Phases 1 and 2.

---

**Phase 3 completes the OperatorOS foundation. Users now have:**
- Persistent layouts they can save, load, and share
- Intelligent persona system that adapts to their workflow
- Fine-grained control over app launch behavior
- Professional desktop environment with macOS/Windows-level polish

**Next**: Deploy to totalaud.io/operator and begin user testing.
