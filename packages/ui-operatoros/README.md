# @total-audio/ui-operatoros

OperatorOS Design System - Cinematic OS UI for totalaud.io.

## Purpose

This package is for **OperatorOS / totalaud.io ONLY**.

**DO NOT** use this package in TAP apps (audio-intel, command-centre, web, etc.) - use `@total-audio/ui-tap` instead.

## Design Principles

### Visual Language

- **Cinematic, OS-like experience** - Window chrome, panels, themes
- **Flow State aesthetics** - Matte, cyan accent (#3AA9BE), 240ms transitions
- **Keyboard-first** - Hotkey hints, keyboard navigation
- **Not overdone** - No "theme park UI", no excessive neon

### Theme System

OperatorOS supports multiple themes, each with distinct visual personality:

#### **xp** - Windows XP Inspired
- Playful but tasteful
- Blue gradient title bars
- Beige/grey neutral backgrounds
- Nostalgia without kitsch

#### **aqua** - macOS Aqua Inspired
- Translucent, glossy surfaces
- Subtle blur effects
- Light, airy aesthetic
- Professional but warm

#### **daw** - DAW/Audio Workstation Inspired
- Dark, pro-audio aesthetic
- Slate cyan accents matching TAP
- Minimal distractions
- Focus on workflow

#### **ascii** - Terminal/ASCII Art Inspired
- Monospace font throughout
- Green-on-black (classic terminal)
- Grain effects optional
- Retro computing feel

#### **analogue** - Vintage Hardware Inspired
- Warm browns and oranges
- Textured backgrounds (grain, noise)
- Tactile, physical feel
- Cassette deck / reel-to-reel vibes

### Motion

- **Default Transition**: 240ms (matches TAP / Flow State)
- **Timing Function**: `ease-out`
- Subtle animations on hover, focus, state changes

### Typography

- **Sans**: Inter (system font)
- **Mono**: JetBrains Mono (for ASCII theme and code)

## Installation

```bash
pnpm add @total-audio/ui-operatoros
```

## Usage

### 1. Import Theme System

```tsx
import { themes, getTheme } from '@total-audio/ui-operatoros/themes';
import type { ThemeId } from '@total-audio/ui-operatoros/themes';

// Get a theme
const theme = getTheme('daw');

// Apply theme CSS variables
const themeVars = {
  '--operator-background': theme.colors.background,
  '--operator-foreground': theme.colors.foreground,
  '--operator-accent': theme.colors.accent,
  '--operator-border': theme.colors.border,
  '--operator-muted': theme.colors.muted,
};
```

### 2. Use Components

```tsx
import {
  OperatorWindowChrome,
  OperatorPanel,
  OperatorToolbar,
  OperatorBadge,
  OperatorListItem,
  OperatorGrid,
  OperatorHotkeyHint,
} from '@total-audio/ui-operatoros';

export default function MyOperatorWindow() {
  return (
    <OperatorWindowChrome
      title="Audio Console"
      themeId="daw"
      onClose={() => console.log('close')}
    >
      <OperatorToolbar>
        <OperatorBadge variant="accent">Active</OperatorBadge>
        <OperatorHotkeyHint keys={['Cmd', 'K']} />
      </OperatorToolbar>

      <OperatorPanel title="Recent Projects">
        <OperatorGrid columns={2} gap={4}>
          <OperatorListItem selected>Project Alpha</OperatorListItem>
          <OperatorListItem>Project Beta</OperatorListItem>
        </OperatorGrid>
      </OperatorPanel>
    </OperatorWindowChrome>
  );
}
```

## Components

### Window System

- **OperatorWindowChrome** - Window with title bar and controls
- **OperatorPanel** - Panel/section container (variants: default, card, flat)
- **OperatorToolbar** - Toolbar for actions (top or bottom)

### UI Elements

- **OperatorBadge** - Status badge (variants: default, accent, success, error)
- **OperatorListItem** - List item with hover and selected states
- **OperatorGrid** - Responsive grid layout
- **OperatorHotkeyHint** - Keyboard shortcut display

## Theme CSS Variables

Each theme defines these CSS variables:

```css
--operator-background
--operator-foreground
--operator-accent
--operator-border
--operator-muted
```

Components use these variables for theme-aware styling.

## Examples

### Window with Toolbar and List

```tsx
<OperatorWindowChrome title="File Browser" themeId="xp" onClose={handleClose}>
  <OperatorToolbar position="top">
    <OperatorBadge variant="accent">12 files</OperatorBadge>
    <OperatorHotkeyHint keys={['Ctrl', 'N']} />
  </OperatorToolbar>

  <OperatorPanel variant="flat">
    {files.map((file) => (
      <OperatorListItem
        key={file.id}
        selected={file.id === selectedId}
        onClick={() => handleSelectFile(file.id)}
      >
        {file.name}
      </OperatorListItem>
    ))}
  </OperatorPanel>
</OperatorWindowChrome>
```

### Grid Layout with Panels

```tsx
<OperatorGrid columns={3} gap={6}>
  <OperatorPanel title="Agents" variant="card">
    <OperatorBadge variant="success">3 active</OperatorBadge>
  </OperatorPanel>

  <OperatorPanel title="Workflows" variant="card">
    <OperatorBadge variant="default">2 running</OperatorBadge>
  </OperatorPanel>

  <OperatorPanel title="Insights" variant="card">
    <OperatorBadge variant="accent">New</OperatorBadge>
  </OperatorPanel>
</OperatorGrid>
```

## Do / Don't

### ✅ DO

- Use themes for different "feels" and user preferences
- Keep 240ms transitions for consistency with Flow State
- Use cyan accent (#3AA9BE) for primary actions
- Design for keyboard-first interaction
- Keep the cinematic, OS-like aesthetic

### ❌ DON'T

- Don't use this package in TAP apps
- Don't add excessive neon or "theme park UI"
- Don't break the 240ms transition standard
- Don't add themes without considering overall coherence
- Don't forget keyboard navigation and hotkey hints

## Enforcement

This design system is enforced via:

1. **ESLint Plugin**: `eslint-plugin-total-audio-ui` prevents cross-product imports
2. **CI**: All PRs must pass UI linting
3. **CodeRabbit**: Flags violations in reviews

## License

UNLICENSED - Internal use only for Total Audio Promo
