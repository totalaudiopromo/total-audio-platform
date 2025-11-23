# eslint-plugin-total-audio-ui

ESLint plugin to enforce Total Audio UI standards across TAP and OperatorOS.

## Purpose

This plugin enforces the unified UI system rules:

1. **TAP apps** must use `@total-audio/ui-tap` components and tokens
2. **OperatorOS apps** must use `@total-audio/ui-operatoros` theme tokens
3. **No cross-product imports** - TAP and OperatorOS UI systems are separate

## Installation

Already installed in the monorepo. To use in ESLint config:

```js
// .eslintrc.cjs or eslint.config.mjs
export default {
  plugins: ['total-audio-ui'],
  extends: ['plugin:total-audio-ui/recommended'],
};
```

## Rules

### `tap-no-raw-styling`

**Scope**: TAP apps (`apps/audio-intel`, `apps/command-centre`, `apps/web`, `apps/pitch-generator`, `apps/tracker`)

**Disallows**:
- Inline style objects with `color`, `backgroundColor`, `boxShadow`, `fontFamily`
- Tailwind classes with arbitrary colors (e.g., `bg-[#FF0000]`)
- Use of unapproved font classes

**Encourages**:
- Use of `@total-audio/ui-tap` components
- Use of TAP tokens (`tap-cyan`, `tap-slate-*`, `tap-success`, etc.)

**Examples**:

❌ **Bad**:
```tsx
// Inline styles
<div style={{ color: '#FF0000', backgroundColor: '#000000' }}>...</div>

// Arbitrary Tailwind colors
<div className="bg-[#FF0000] text-[#123456]">...</div>

// Random font families
<div style={{ fontFamily: 'Comic Sans' }}>...</div>
```

✅ **Good**:
```tsx
// Use TAP components
<Button variant="primary">Click me</Button>

// Use TAP tokens
<div className="bg-tap-slate-800 text-tap-cyan">...</div>

// Use approved fonts
<div className="font-sans">...</div> {/* Inter */}
<div className="font-mono">...</div> {/* JetBrains Mono */}
```

### `operatoros-no-raw-colour`

**Scope**: OperatorOS code (`apps/totalaud.io`, `packages/operator-os`, `packages/ui-operatoros`)

**Disallows**:
- Hard-coded hex or rgb/rgba colours in JSX/TSX files
- Tailwind classes with arbitrary colors
- Inline styles for `color`, `background`, `boxShadow`, `borderColor`

**Encourages**:
- Use of theme tokens from `@total-audio/ui-operatoros`
- Use of CSS variables (`--operator-*`)

**Examples**:

❌ **Bad**:
```tsx
// Hard-coded hex colors
const color = '#FF0000';

// Inline styles
<div style={{ color: '#123456', backgroundColor: '#000000' }}>...</div>

// Arbitrary Tailwind colors
<div className="bg-[#FF0000]">...</div>
```

✅ **Good**:
```tsx
// Use CSS variables
<div style={{ color: 'var(--operator-accent)' }}>...</div>

// Use theme-aware components
<OperatorBadge variant="accent">Status</OperatorBadge>

// Use theme tokens in Tailwind
<div className="bg-[var(--operator-background)]">...</div>
```

### `no-cross-product-ui-imports`

**Scope**: All files in the monorepo

**Disallows**:
- `@total-audio/ui-tap` imports in OperatorOS/totalaud.io code
- `@total-audio/ui-operatoros` imports in TAP apps

**Purpose**: Enforces strict separation of the two UI worlds.

**Examples**:

❌ **Bad**:
```tsx
// In apps/audio-intel (TAP app)
import { OperatorWindowChrome } from '@total-audio/ui-operatoros';

// In apps/totalaud.io (OperatorOS app)
import { Button } from '@total-audio/ui-tap';
```

✅ **Good**:
```tsx
// In apps/audio-intel (TAP app)
import { Button } from '@total-audio/ui-tap';

// In apps/totalaud.io (OperatorOS app)
import { OperatorWindowChrome } from '@total-audio/ui-operatoros';
```

## Configuration

### Root ESLint Config

Create or update `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  plugins: ['total-audio-ui'],
  extends: ['plugin:total-audio-ui/recommended'],
  overrides: [
    {
      // TAP apps - enforce TAP UI standards
      files: [
        'apps/audio-intel/**/*.{ts,tsx}',
        'apps/command-centre/**/*.{ts,tsx}',
        'apps/web/**/*.{ts,tsx}',
        'apps/pitch-generator/**/*.{ts,tsx}',
        'apps/tracker/**/*.{ts,tsx}',
      ],
      rules: {
        'total-audio-ui/tap-no-raw-styling': 'error',
      },
    },
    {
      // OperatorOS - enforce OperatorOS UI standards
      files: [
        'apps/totalaud.io/**/*.{ts,tsx}',
        'packages/operator-os/**/*.{ts,tsx}',
        'packages/ui-operatoros/**/*.{ts,tsx}',
      ],
      rules: {
        'total-audio-ui/operatoros-no-raw-colour': 'error',
      },
    },
    {
      // Global - prevent cross-product imports
      files: ['**/*.{ts,tsx}'],
      rules: {
        'total-audio-ui/no-cross-product-ui-imports': 'error',
      },
    },
  ],
};
```

## CI Integration

The plugin is integrated into CI via `.github/workflows/ui-standards.yml`.

All PRs must pass UI linting before merge.

## Development

### Testing Locally

```bash
cd packages/eslint-plugin-total-audio-ui
pnpm test
```

### Adding New Rules

1. Create rule in `src/rules/your-rule-name.js`
2. Export from `src/index.js`
3. Add to `configs.recommended` in `src/index.js`
4. Update this README with examples

## License

UNLICENSED - Internal use only for Total Audio Promo
