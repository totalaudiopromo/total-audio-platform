# Total Audio UI Component Generator

CLI tool to scaffold new UI components for TAP or OperatorOS design systems.

## Purpose

This tool ensures all new UI components start compliant with the respective design system standards. It generates:

- Component file with TypeScript + React
- Proper styling (TAP tokens or OperatorOS theme variables)
- Flow State motion (240ms transitions)
- Type-safe props
- Documentation comments
- Auto-updates package index

## Usage

### Generate TAP Component

```bash
pnpm ui:generate tap ComponentName
```

Example:
```bash
pnpm ui:generate tap AlertBanner
```

This creates:
- `packages/ui-tap/src/components/AlertBanner.tsx`
- Updates `packages/ui-tap/src/index.ts` with export

### Generate OperatorOS Component

```bash
pnpm ui:generate operator ComponentName
```

Example:
```bash
pnpm ui:generate operator StatusIndicator
```

This creates:
- `packages/ui-operatoros/src/components/OperatorStatusIndicator.tsx`
- Updates `packages/ui-operatoros/src/index.ts` with export

**Note**: OperatorOS components are prefixed with `Operator` automatically.

## Interactive Prompts

The generator asks:

1. **Component type**: `layout` / `control` / `display`
   - Helps organize and document component purpose

2. **Add variants prop?**: `y` / `n`
   - If yes, adds variant-based styling (default/primary/secondary for TAP, default/accent/muted for OperatorOS)

3. **Short description**:
   - Added to component JSDoc

## What Gets Generated

### TAP Component Example

```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface AlertBannerProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

/**
 * TAP AlertBanner Component
 *
 * Display alert messages to users
 *
 * Design constraints:
 * - Matte, analytical aesthetic
 * - Slate cyan accent for actionable elements
 * - 240ms transitions
 * - No harsh gradients or glows
 */
export function AlertBanner({
  children,
  variant = 'default',
  className,
}: AlertBannerProps) {
  return (
    <div
      className={clsx(
        'rounded-tap-md p-4',
        'border border-tap-border',
        'transition-all duration-tap',
        {
          'bg-tap-slate-800 text-tap-slate-200': variant === 'default',
          'bg-tap-cyan text-white': variant === 'primary',
          'bg-tap-slate-700 text-tap-slate-100': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

### OperatorOS Component Example

```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface OperatorStatusIndicatorProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  className?: string;
}

/**
 * OperatorStatusIndicator Component
 *
 * Display system status
 *
 * Design principles:
 * - Theme-aware (uses CSS variables)
 * - Cinematic OS aesthetic
 * - 240ms transitions (Flow State)
 * - Keyboard-first design
 */
export function OperatorStatusIndicator({
  children,
  variant = 'default',
  className,
}: OperatorStatusIndicatorProps) {
  return (
    <div
      className={clsx(
        'rounded-md p-4',
        'border border-[var(--operator-border)]',
        'transition-all duration-[240ms]',
        {
          'bg-[var(--operator-background)] text-[var(--operator-foreground)]':
            variant === 'default',
          'bg-[var(--operator-accent)]/20 text-[var(--operator-accent)] border-[var(--operator-accent)]/30':
            variant === 'accent',
          'bg-[var(--operator-muted)] text-[var(--operator-foreground)]':
            variant === 'muted',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

## After Generation

1. **Review the component** - Adjust props, styling, logic as needed
2. **Add usage examples** - Update package README
3. **Test in your app** - Import and use the component
4. **Commit with semantic message** - `feat(ui-tap): Add AlertBanner component`

## Benefits

- **Consistency**: All components start with correct patterns
- **Speed**: No boilerplate copy-paste
- **Type Safety**: TypeScript props from the start
- **Documentation**: JSDoc comments included
- **Standards Compliance**: Uses approved tokens/variables
- **Auto-Export**: Index file updated automatically

## Examples

### Create a TAP DataGrid Component

```bash
$ pnpm ui:generate tap DataGrid

ℹ️  Generating TAP component: DataGrid

Component type (layout/control/display): display
Add variants prop? (y/n): n
Short description: Advanced data grid with sorting and filtering

✅ Created component: packages/ui-tap/src/components/DataGrid.tsx
✅ Updated packages/ui-tap/src/index.ts

ℹ️  Next steps:
  1. Review the generated component
  2. Add any additional props or logic
  3. Update the README with usage examples
  4. Test the component in your app

ℹ️  Import in your app:
  import { DataGrid } from '@total-audio/ui-tap';
```

### Create an OperatorOS CommandPalette Component

```bash
$ pnpm ui:generate operator CommandPalette

ℹ️  Generating OperatorOS component: CommandPalette

Component type (layout/control/display): control
Add variants prop? (y/n): y
Short description: Keyboard-driven command palette

✅ Created component: packages/ui-operatoros/src/components/OperatorCommandPalette.tsx
✅ Updated packages/ui-operatoros/src/index.ts

ℹ️  Import in your app:
  import { OperatorCommandPalette } from '@total-audio/ui-operatoros';
```

## Troubleshooting

### "Package not found"

Make sure you're running from the monorepo root:
```bash
cd /path/to/total-audio-platform
pnpm ui:generate tap MyComponent
```

### "Component already exists"

Choose a different name or delete the existing component first.

### "Permission denied"

Make the generator executable:
```bash
chmod +x tools/ui-generator/index.mjs
```

## License

UNLICENSED - Internal use only for Total Audio Promo
