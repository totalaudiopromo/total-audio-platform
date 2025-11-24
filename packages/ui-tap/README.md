# @total-audio/ui-tap

Total Audio Promo Design System - Production-ready UI primitives for TAP apps.

## Purpose

This package is the **ONLY** source of UI components for Total Audio Promo apps:

- `apps/audio-intel`
- `apps/command-centre`
- `apps/web`
- `apps/pitch-generator`
- `apps/tracker`

**DO NOT** use this package in OperatorOS / totalaud.io - use `@total-audio/ui-operatoros` instead.

## Design Principles

### Visual Language

- **Matte, analytical, understated SaaS aesthetic**
- No pure black (#000000) - use near-black (`#05070A`) or slate tokens
- No harsh gradients, no neon, no glows
- Professional and focused on data/workflow

### Colour System

- **Primary Background**: `tap-slate-900` (near-black)
- **Card Background**: `tap-slate-800`
- **Accent**: `tap-cyan` (#3AA9BE) - Slate cyan for actionable elements ONLY
- **Success**: `tap-success` (#10B981)
- **Error**: `tap-error` (#EF4444)
- **Warning**: `tap-warning` (#F59E0B)

### Typography

- **Sans**: Inter
- **Mono**: JetBrains Mono

### Motion

- **Default Transition**: 240ms
- **Timing Function**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Subtle, purposeful motion only

### Spacing Scale

Use the enforced spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96

### Border Radius

Approved values only:
- `tap-sm`: 6px
- `tap-md`: 8px
- `tap-lg`: 12px
- `tap-xl`: 16px
- `tap-2xl`: 24px

## Installation

```bash
pnpm add @total-audio/ui-tap
```

## Usage

### 1. Add Tailwind Preset

In your app's `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';
import tapPreset from '@total-audio/ui-tap/tailwind-preset';

const config: Config = {
  presets: [tapPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // Add the TAP UI package to your content paths
    '../../packages/ui-tap/src/**/*.{ts,tsx}',
  ],
  // Your app-specific config...
};

export default config;
```

### 2. Import Components

```tsx
import { Button, SectionCard, MetricStat, Input } from '@total-audio/ui-tap';

export default function MyPage() {
  return (
    <PageShell>
      <SectionCard title="Dashboard" subtitle="Your metrics at a glance">
        <MetricStat
          label="Total Contacts"
          value="1,234"
          delta={{ value: '+12%', trend: 'up' }}
        />
        <Button variant="primary">View Details</Button>
      </SectionCard>
    </PageShell>
  );
}
```

## Components

### Layout

- **PageShell** - Page-level container with consistent padding
- **SectionCard** - Card with optional header (title + subtitle)
- **Toolbar** - Header toolbar with title and actions

### Data Display

- **MetricStat** - Display metric with label, value, and optional delta
- **DataTable** - Simple table for structured data
- **TagPill** - Small pill for tags, statuses, categories
- **Badge** - Status indicator badge

### Form Controls

- **Button** - Primary, secondary, ghost variants
- **Input** - Text input with label and error states
- **Select** - Dropdown select with label and error states
- **Checkbox** - Checkbox with optional label

### Feedback

- **Skeleton** - Loading placeholder (text, circular, rectangular)

## Examples

### Metric Dashboard

```tsx
<SectionCard title="Key Metrics">
  <div className="grid grid-cols-3 gap-6">
    <MetricStat
      label="Total Enrichments"
      value="1,234"
      delta={{ value: '+12%', trend: 'up' }}
    />
    <MetricStat
      label="Success Rate"
      value="98.5%"
      delta={{ value: '+2.3%', trend: 'up' }}
    />
    <MetricStat
      label="Avg. Time Saved"
      value="14.2h"
      delta={{ value: '-0.8h', trend: 'down' }}
    />
  </div>
</SectionCard>
```

### Data Table

```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Contact Name' },
    { key: 'role', header: 'Role' },
    { key: 'station', header: 'Station' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <TagPill intent="success">{item.status}</TagPill>,
    },
  ]}
  data={contacts}
  keyExtractor={(item) => item.id}
/>
```

### Form

```tsx
<form>
  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    helperText="We'll never share your email"
  />
  <Select
    label="Role"
    options={[
      { value: 'promoter', label: 'Radio Promoter' },
      { value: 'artist', label: 'Artist' },
      { value: 'agency', label: 'PR Agency' },
    ]}
  />
  <Checkbox label="I agree to the terms" />
  <Button variant="primary" type="submit">
    Submit
  </Button>
</form>
```

## Do / Don't

### ✅ DO

- Use `tap-cyan` for primary actions and accents
- Use slate tokens for backgrounds and surfaces
- Use 240ms transitions for hover/focus
- Use the approved spacing scale
- Keep the matte, analytical aesthetic

### ❌ DON'T

- Don't use pure black (#000000)
- Don't add harsh gradients or glows
- Don't use neon colours
- Don't use arbitrary spacing values
- Don't use this package in OperatorOS / totalaud.io apps

## Enforcement

This design system is enforced via:

1. **ESLint Plugin**: `eslint-plugin-total-audio-ui` catches violations
2. **CI**: All PRs must pass UI linting
3. **CodeRabbit**: Flags new colours, shadows, fonts, spacing in reviews

## License

UNLICENSED - Internal use only for Total Audio Promo
