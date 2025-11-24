# OperatorOS Design System

**Cinematic OS UI for totalaud.io**

Theme-aware, keyboard-first design system for the future OperatorOS interface.

---

## Purpose

The OperatorOS design system provides a cinematic, OS-like experience for:

- `apps/totalaud.io` - Experimental creative interface (future)
- `packages/operator-os` - OS-level services and orchestration
- `packages/ui-operatoros` - UI primitives and theme system

**Package**: `@total-audio/ui-operatoros`

**Status**: Infrastructure ready, app implementation pending (after TAP revenue validation)

---

## Design Principles

### Visual Philosophy

**Cinematic, OS-like experience with Flow State aesthetics**

- Window chrome, panels, theme system
- Multiple visual "personalities" via themes
- Keyboard-first interaction design
- Not overdone - no "theme park UI"

### Core Constraints

1. **Theme-aware** - All components use CSS variables
2. **240ms transitions** - Matches TAP / Flow State timing
3. **Cyan accent** (#3AA9BE) - Consistent with TAP brand
4. **Keyboard-first** - Hotkey hints, keyboard navigation
5. **No excessive neon** - Tasteful, not garish

---

## Theme System

OperatorOS supports **5 themes**, each with distinct visual personality:

### **xp** - Windows XP Inspired

**Feel**: Playful nostalgia, but tasteful

**Visual Style**:
- Blue gradient title bars
- Beige/grey neutral backgrounds
- Subtle drop shadows
- Classic window chrome

**Use When**: Users want warm, familiar, retro computing feel

**CSS Variables**:
```css
--operator-background: #ECE9D8
--operator-foreground: #000000
--operator-accent: #0054E3
--operator-border: #ACA899
--operator-muted: #FFFFFF
```

---

### **aqua** - macOS Aqua Inspired

**Feel**: Translucent, glossy, professional

**Visual Style**:
- Semi-transparent surfaces (rgba)
- Subtle blur effects
- Light, airy aesthetic
- Minimal borders

**Use When**: Users want modern, clean, Apple-like experience

**CSS Variables**:
```css
--operator-background: rgba(255, 255, 255, 0.8)
--operator-foreground: #1D1D1F
--operator-accent: #007AFF
--operator-border: rgba(0, 0, 0, 0.1)
--operator-muted: rgba(0, 0, 0, 0.5)
```

**Effects**: `blur: true`

---

### **daw** - DAW/Audio Workstation Inspired

**Feel**: Pro audio, focus mode, minimal distractions

**Visual Style**:
- Dark grey backgrounds
- Slate cyan accent (matches TAP)
- Matte finish, no gloss
- Subtle borders

**Use When**: Users want professional, distraction-free workflow (default for power users)

**CSS Variables**:
```css
--operator-background: #1E1E1E
--operator-foreground: #CCCCCC
--operator-accent: #3AA9BE  (slate cyan)
--operator-border: #3A3A3A
--operator-muted: #666666
```

**Recommended as default** - aligns with TAP brand.

---

### **ascii** - Terminal/ASCII Art Inspired

**Feel**: Retro computing, hacker aesthetic

**Visual Style**:
- Pure black background
- Green-on-black text
- Monospace fonts throughout
- No rounded corners
- Optional grain effect

**Use When**: Users want command-line, retro terminal feel

**CSS Variables**:
```css
--operator-background: #000000
--operator-foreground: #00FF00
--operator-accent: #00FF00
--operator-border: #00FF00
--operator-muted: #008000
```

**Effects**: `grain: true`

**Fonts**: JetBrains Mono everywhere

---

### **analogue** - Vintage Hardware Inspired

**Feel**: Warm, tactile, physical hardware

**Visual Style**:
- Warm browns and oranges
- Textured backgrounds (grain, noise)
- Reel-to-reel / cassette deck vibes
- Subtle gradients (warm, not garish)

**Use When**: Users want warm, creative, vintage feel

**CSS Variables**:
```css
--operator-background: #1C1410
--operator-foreground: #EFEBE9
--operator-accent: #FF6F00
--operator-border: #5D4037
--operator-muted: #8D6E63
```

**Effects**: `grain: true`, `noise: true`

---

## Motion

### Transitions

**Default duration**: `240ms` (matches TAP / Flow State)

```tsx
className="transition-all duration-[240ms]"
```

**Timing function**: `ease-out`

```
cubic-bezier(0.4, 0, 0.2, 1)
```

### Animation Principles

- **Hover**: Slight colour change, 240ms
- **Focus**: Ring or highlight, 240ms
- **State changes**: Fade in/out, 240ms
- **No excessive motion** - OS should feel responsive, not bouncy

---

## Typography

### Fonts

**Sans Serif (Primary)**:
```
Inter, system-ui, -apple-system, sans-serif
```

**Monospace (Secondary)**:
```
JetBrains Mono, Menlo, monospace
```

**Note**: ASCII theme uses monospace everywhere.

---

## Components

See `packages/ui-operatoros/README.md` for full component library.

### Core Primitives

#### Window System
- **OperatorWindowChrome** - Window with title bar and controls
- **OperatorPanel** - Panel/section container
- **OperatorToolbar** - Toolbar for actions

#### UI Elements
- **OperatorBadge** - Status badge
- **OperatorListItem** - List item with hover/selected states
- **OperatorGrid** - Responsive grid layout
- **OperatorHotkeyHint** - Keyboard shortcut display

---

## Usage

### 1. Install Package

```bash
pnpm add @total-audio/ui-operatoros
```

### 2. Set Up Theme

```tsx
import { themes, getTheme } from '@total-audio/ui-operatoros/themes';
import type { ThemeId } from '@total-audio/ui-operatoros/themes';

const [currentTheme, setCurrentTheme] = useState<ThemeId>('daw');
const theme = getTheme(currentTheme);

// Apply CSS variables
const themeVars = {
  '--operator-background': theme.colors.background,
  '--operator-foreground': theme.colors.foreground,
  '--operator-accent': theme.colors.accent,
  '--operator-border': theme.colors.border,
  '--operator-muted': theme.colors.muted,
};

<div style={themeVars}>
  {/* Your app */}
</div>
```

### 3. Use Components

```tsx
import {
  OperatorWindowChrome,
  OperatorPanel,
  OperatorToolbar,
  OperatorBadge,
} from '@total-audio/ui-operatoros';

<OperatorWindowChrome
  title="Audio Console"
  themeId={currentTheme}
  onClose={handleClose}
>
  <OperatorToolbar>
    <OperatorBadge variant="accent">Active</OperatorBadge>
  </OperatorToolbar>

  <OperatorPanel title="Projects">
    {/* Content */}
  </OperatorPanel>
</OperatorWindowChrome>
```

---

## Do / Don't Examples

### ✅ DO

**Use theme tokens**:
```tsx
<div className="bg-[var(--operator-background)] text-[var(--operator-foreground)]">
  <span className="text-[var(--operator-accent)]">Actionable item</span>
</div>
```

**Use OperatorOS components**:
```tsx
<OperatorWindowChrome title="My Window" themeId="daw">
  <OperatorPanel variant="card">
    <OperatorBadge variant="accent">Status</OperatorBadge>
  </OperatorPanel>
</OperatorWindowChrome>
```

**Include hotkey hints**:
```tsx
<OperatorHotkeyHint keys={['Cmd', 'K']} />
```

### ❌ DON'T

**No hard-coded colors**:
```tsx
// ❌ Wrong
<div style={{ color: '#FF0000' }}>...</div>

// ✅ Correct
<div style={{ color: 'var(--operator-accent)' }}>...</div>
```

**No TAP UI imports**:
```tsx
// ❌ Wrong (in OperatorOS code)
import { Button } from '@total-audio/ui-tap';

// ✅ Correct
// Use OperatorOS-specific components or styled divs with theme tokens
```

**No excessive neon**:
```tsx
// ❌ Wrong
<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse">
  NEON THEME PARK
</div>

// ✅ Correct
<OperatorPanel variant="card">
  Tasteful, theme-aware design
</OperatorPanel>
```

---

## Keyboard Navigation

OperatorOS is **keyboard-first**. All components should support:

- **Tab** - Navigate between elements
- **Enter / Space** - Activate buttons, select items
- **Escape** - Close windows, cancel actions
- **Arrow keys** - Navigate lists, grids

### Hotkey System

Use **OperatorHotkeyHint** to display shortcuts:

```tsx
<OperatorToolbar>
  <span>Open Command Palette</span>
  <OperatorHotkeyHint keys={['Cmd', 'K']} />
</OperatorToolbar>
```

---

## Theme Selection UX

### Recommended UI

Provide a theme switcher in settings or toolbar:

```tsx
<select value={currentTheme} onChange={e => setCurrentTheme(e.target.value)}>
  <option value="xp">XP (Nostalgia)</option>
  <option value="aqua">Aqua (Modern)</option>
  <option value="daw">DAW (Pro Audio)</option>
  <option value="ascii">ASCII (Terminal)</option>
  <option value="analogue">Analogue (Vintage)</option>
</select>
```

### Persistence

Store theme preference:
- **localStorage**: For quick prototyping
- **Supabase user settings**: For production

---

## Integration with TAP

### Shared Values

Both systems share:
- **Cyan accent**: #3AA9BE (slate cyan)
- **240ms transitions**: Flow State timing
- **Matte aesthetic**: No harsh gradients
- **Professional tone**: Not overdone

### Separation

- **TAP** = Analytical SaaS tools
- **OperatorOS** = Creative orchestration interface

**Never mix** - use `eslint-plugin-total-audio-ui` to enforce.

---

## Future Enhancements

### Planned Features (Post-Revenue Phase)

1. **Custom theme creator** - Users define their own themes
2. **Window layouts** - Save/restore window positions
3. **Agent progress indicators** - Visual feedback for agent tasks
4. **Realtime collaboration** - Multi-user cursor/presence
5. **Audio reactive themes** - Subtle visuals reacting to audio levels

---

## Enforcement

### ESLint Plugin

The `eslint-plugin-total-audio-ui` enforces:

- No hard-coded colors in OperatorOS code
- No TAP UI imports in OperatorOS
- Theme token usage

### CI Checks

`.github/workflows/ui-standards.yml` validates:

- No cross-product imports
- Theme system integrity

### CodeRabbit

`.coderabbit/config.yml` flags:

- Hard-coded colors
- Cross-product violations
- Theme token misuse

---

## Philosophy

The OperatorOS design system exists to:

1. **Enable creativity** - Themes = personality and choice
2. **Support workflows** - OS-like chrome for complex tasks
3. **Maintain brand** - Cyan accent + 240ms = Total Audio identity
4. **Keyboard-first** - Power users should never need a mouse
5. **Not overdone** - Cinematic, but tasteful

**Remember**: OperatorOS is for creative orchestration, not a theme park. Keep it tasteful, keep it keyboard-first, keep it Flow State.

---

## Resources

- **Package**: `packages/ui-operatoros/`
- **ESLint Plugin**: `packages/eslint-plugin-total-audio-ui/`
- **Component Generator**: `pnpm ui:generate operator ComponentName`
- **CI Workflow**: `.github/workflows/ui-standards.yml`

---

## License

UNLICENSED - Internal use only for Total Audio Promo
