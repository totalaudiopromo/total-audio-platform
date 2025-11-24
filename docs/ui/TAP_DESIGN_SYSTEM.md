# TAP Design System

**Total Audio Promo Design Language**

Production-ready, enforceable UI standards for all TAP apps.

---

## Purpose

The TAP design system provides a unified visual language for:

- `apps/audio-intel` - Contact enrichment SaaS
- `apps/command-centre` - TAP console/dashboard
- `apps/web` - Marketing site
- `apps/pitch-generator` - Pitch generation tool
- `apps/tracker` - Campaign tracking CRM

**Package**: `@total-audio/ui-tap`

---

## Design Principles

### Visual Philosophy

**Matte, analytical, understated SaaS aesthetic**

- Professional and focused on data/workflow
- No distractions - users are here to work
- Confidence through simplicity
- British sensibility - no nonsense, no hype

### Core Constraints

1. **No pure black** (#000000) - Use near-black (#05070A) or slate tokens
2. **No harsh gradients** - Matte finish only
3. **No neon** - Subtle, purposeful colour usage
4. **No arbitrary values** - Use design tokens exclusively
5. **No random animations** - 240ms transitions for hover/focus only

---

## Colour System

### Primary Palette

#### Near-Black Background
```
tap-near-black: #05070A
```
Never use pure #000000. Use this or slate-900.

#### Slate System (Primary)
```
tap-slate-50:  #F8FAFC  (rarely used)
tap-slate-100: #F1F5F9
tap-slate-200: #E2E8F0
tap-slate-300: #CBD5E1
tap-slate-400: #94A3B8  (muted text)
tap-slate-500: #64748B
tap-slate-600: #475569
tap-slate-700: #334155  (card backgrounds, borders)
tap-slate-800: #1E293B  (main card background)
tap-slate-900: #0F172A  (page background)
tap-slate-950: #020617
```

**Usage**:
- **900**: Page backgrounds
- **800**: Card backgrounds, panels
- **700**: Borders, subtle dividers
- **400**: Muted/secondary text
- **200/300**: Disabled states, placeholders

#### Slate Cyan (THE TAP Accent)
```
tap-cyan: #3AA9BE  (default)

tap-cyan-50:  #E6F7FA
tap-cyan-100: #CCEFF5
tap-cyan-200: #99DFEB
tap-cyan-300: #66CFE1
tap-cyan-400: #3AA9BE  (primary accent)
tap-cyan-500: #2E8799
tap-cyan-600: #236573
tap-cyan-700: #17444D
tap-cyan-800: #0C2226
tap-cyan-900: #010101
```

**Usage**: Actionable elements ONLY
- Primary buttons
- Links
- Active states
- Focus rings
- Key metrics that need emphasis

**Do NOT use for**:
- Large background areas
- Body text
- Decorative elements

### Semantic Colours

#### Success (Green)
```
tap-success-50:  #ECFDF5
tap-success-100: #D1FAE5
tap-success-500: #10B981  (default)
tap-success-700: #047857
```

**Usage**: Positive metrics, success states, completed actions

#### Error (Red)
```
tap-error-50:  #FEF2F2
tap-error-100: #FEE2E2
tap-error-500: #EF4444  (default)
tap-error-700: #B91C1C
```

**Usage**: Errors, destructive actions, negative metrics

#### Warning (Amber)
```
tap-warning-50:  #FFFBEB
tap-warning-100: #FEF3C7
tap-warning-500: #F59E0B  (default)
tap-warning-700: #B45309
```

**Usage**: Warnings, caution states, pending actions

### Border Colours
```
tap-border:        #334155  (slate-700)
tap-border-subtle: #1E293B  (slate-800)
```

---

## Typography

### Fonts

**Sans Serif (Primary)**:
```
font-sans: Inter, system-ui, -apple-system, sans-serif
```
Use for all UI text, headings, body content.

**Monospace (Secondary)**:
```
font-mono: JetBrains Mono, Menlo, monospace
```
Use for code, data tables, IDs, technical content.

### Type Scale

```
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
```

### Font Weights

```
font-normal:   400
font-medium:   500
font-semibold: 600
font-bold:     700
```

**Recommendations**:
- Body: `text-base font-normal`
- UI labels: `text-sm font-medium`
- Section headings: `text-lg font-semibold`
- Page headings: `text-2xl font-bold`

---

## Spacing Scale

**Enforced spacing values** (in rem/px):

```
1:  0.25rem  (4px)
2:  0.5rem   (8px)
3:  0.75rem  (12px)
4:  1rem     (16px)
6:  1.5rem   (24px)
8:  2rem     (32px)
12: 3rem     (48px)
16: 4rem     (64px)
24: 6rem     (96px)
```

**Do NOT use arbitrary spacing** - use this scale exclusively.

### Common Patterns

- **Card padding**: `p-6` (24px)
- **Button padding**: `px-4 py-2` (16px/8px)
- **Input padding**: `px-3 py-2` (12px/8px)
- **Section gaps**: `gap-6` or `gap-8`
- **Grid gaps**: `gap-4`

---

## Border Radius

**Approved radius values**:

```
tap-sm:  0.375rem  (6px)   - Small elements (pills, badges)
tap-md:  0.5rem    (8px)   - Inputs, buttons, small cards
tap-lg:  0.75rem   (12px)  - Cards, panels
tap-xl:  1rem      (16px)  - Large cards
tap-2xl: 1.5rem    (24px)  - Hero sections (rare)
```

**Do NOT** use arbitrary radius values.

---

## Shadows

**Minimal shadows** (matte aesthetic):

```
tap-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.25)
tap-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3)
tap-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4)
```

**Use sparingly** - prefer borders over shadows.

---

## Motion

### Transitions

**Default duration**: `240ms`

```
duration-tap: 240ms
```

**Timing function**: `ease-out`
```
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)
```

### Recommended Pattern

```tsx
className="transition-all duration-tap hover:bg-tap-slate-700"
```

**Use for**:
- Hover states
- Focus states
- State changes (open/closed, active/inactive)

**Do NOT use for**:
- Page loads
- Large movements
- Decorative animations
- Anything that distracts from work

---

## Components

See `packages/ui-tap/README.md` for full component library.

### Core Primitives

- **PageShell** - Page-level container
- **SectionCard** - Card with optional header
- **Toolbar** - Header with actions
- **MetricStat** - Metric display with delta
- **DataTable** - Structured data table
- **TagPill** - Small status pill
- **Badge** - Status indicator
- **Button** - Primary/secondary/ghost
- **Input** - Text input with label/error
- **Select** - Dropdown with label/error
- **Checkbox** - Checkbox with label
- **Skeleton** - Loading placeholder

---

## Do / Don't Examples

### ✅ DO

**Use TAP components**:
```tsx
<Button variant="primary">Save Changes</Button>
```

**Use TAP tokens**:
```tsx
<div className="bg-tap-slate-800 border border-tap-border rounded-tap-lg">
  <h2 className="text-tap-cyan">Analytics</h2>
</div>
```

**Use approved spacing**:
```tsx
<div className="p-6 gap-4">
  {/* Content */}
</div>
```

### ❌ DON'T

**No inline styles**:
```tsx
// ❌ Wrong
<div style={{ color: '#FF0000', backgroundColor: '#000000' }}>...</div>
```

**No arbitrary Tailwind**:
```tsx
// ❌ Wrong
<div className="bg-[#FF0000] text-[#00FF00]">...</div>
```

**No random fonts**:
```tsx
// ❌ Wrong
<div style={{ fontFamily: 'Comic Sans MS' }}>...</div>
```

**No pure black**:
```tsx
// ❌ Wrong
<div className="bg-black">...</div>

// ✅ Correct
<div className="bg-tap-slate-900">...</div>
```

**No harsh gradients**:
```tsx
// ❌ Wrong
<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">...</div>
```

---

## Integration

### 1. Install Package

```bash
pnpm add @total-audio/ui-tap
```

### 2. Add Tailwind Preset

In `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';
import tapPreset from '@total-audio/ui-tap/tailwind-preset';

const config: Config = {
  presets: [tapPreset],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui-tap/src/**/*.{ts,tsx}',
  ],
};

export default config;
```

### 3. Import Components

```tsx
import {
  PageShell,
  SectionCard,
  Button,
  MetricStat,
} from '@total-audio/ui-tap';
```

---

## Enforcement

### ESLint Plugin

The `eslint-plugin-total-audio-ui` enforces these standards:

- No inline color styles
- No arbitrary Tailwind colors
- No cross-product imports
- TAP tokens only

### CI Checks

`.github/workflows/ui-standards.yml` runs on all PRs:

- Lints for violations
- Checks for arbitrary colors
- Validates cross-product imports

### CodeRabbit

`.coderabbit/config.yml` flags:

- New colors
- New shadows
- New fonts
- Custom spacing

---

## Philosophy

The TAP design system exists to:

1. **Maintain professionalism** - Look like a serious SaaS tool
2. **Reduce cognitive load** - Consistent patterns = faster work
3. **Enforce brand** - Slate cyan is THE TAP colour
4. **Enable speed** - Pre-built components = faster shipping
5. **Prevent drift** - Automated enforcement = no random UI

**Remember**: TAP is for work, not play. Keep it matte, keep it simple, keep it professional.

---

## Resources

- **Package**: `packages/ui-tap/`
- **ESLint Plugin**: `packages/eslint-plugin-total-audio-ui/`
- **Component Generator**: `pnpm ui:generate tap ComponentName`
- **CI Workflow**: `.github/workflows/ui-standards.yml`

---

## License

UNLICENSED - Internal use only for Total Audio Promo
