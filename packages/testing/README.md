# @total-audio/testing

Shared testing utilities for Total Audio Platform - provides validators, configurations, and helpers for consistent testing across Audio Intel, Pitch Generator, Tracker, and TotalAud.io.

## Features

- ✅ **Touch Target Validation**: WCAG 2.2 Level AA compliance (44px minimum)
- ✅ **Responsive Testing**: Breakpoint validation across mobile/tablet/desktop
- ✅ **Accessibility Validation**: ARIA, contrast, keyboard navigation
- ✅ **Performance Metrics**: Core Web Vitals (CLS, LCP, FID, TTI)
- ✅ **Shared Configurations**: UK market mobile devices (iPhone 13, Galaxy S9+, iPad Pro)

## Installation

```bash
# From monorepo root
pnpm add @total-audio/testing --filter=your-app
```

## Usage

### Touch Target Validation

```typescript
import { test, expect } from '@playwright/test';
import { validateAllTouchTargets, validateTouchTargetSize } from '@total-audio/testing';

test('All buttons meet WCAG 2.2 Level AA', async ({ page }) => {
  await page.goto('/');

  // Validate all touch targets
  const results = await validateAllTouchTargets(page);
  const failures = results.filter(r => !r.passed);

  expect(failures).toHaveLength(0);
});

test('Specific button meets requirements', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: /submit/i });
  const result = await validateTouchTargetSize(button, 44);

  expect(result.passed).toBe(true);
});
```

### Responsive Testing

```typescript
import { validateBreakpoints, commonBreakpoints } from '@total-audio/testing';

test('Page responsive across all breakpoints', async ({ page }) => {
  await page.goto('/');

  const results = await validateBreakpoints(page, commonBreakpoints);
  const failures = results.filter(r => !r.passed);

  expect(failures).toHaveLength(0);
});
```

### Accessibility Testing

```typescript
import { validateAccessibility, validateKeyboardNavigation } from '@total-audio/testing';

test('Page meets WCAG 2.2 accessibility standards', async ({ page }) => {
  await page.goto('/');

  const results = await validateAccessibility(page);

  expect(results.passed).toBe(true);
  expect(results.summary.critical).toBe(0);
});
```

### Performance Testing

```typescript
import { validatePerformance, measureAllMetrics } from '@total-audio/testing';

test('Page meets Core Web Vitals thresholds', async ({ page }) => {
  await page.goto('/');

  const results = await validatePerformance(page);

  expect(results.passed).toBe(true);
  expect(results.metrics.cls).toBeLessThan(0.1);
  expect(results.metrics.lcp).toBeLessThan(2500);
});
```

### Shared Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { basePlaywrightConfig, ukMarketDevices } from '@total-audio/testing';

export default defineConfig({
  ...basePlaywrightConfig,
  testDir: './tests',
  projects: ukMarketDevices,
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

## API Reference

### Validators

#### Touch Targets

- `validateTouchTargetSize(element, minSize)` - Validate single element
- `validateAllTouchTargets(page, selector, minSize)` - Validate all interactive elements
- `validateTouchTargetSpacing(elements, minSpacing)` - Check spacing between elements
- `validateGestureConflicts(element)` - Detect tap/swipe conflicts

#### Responsive

- `validateBreakpoints(page, breakpoints, criticalSelector)` - Test multiple breakpoints
- `validateViewportFit(element, viewport)` - Check element fits viewport
- `validateHorizontalScroll(element)` - Detect unintended scrolling
- `validateMobileLayout(page)` - Mobile-specific validations

#### Accessibility

- `validateAccessibility(page)` - Comprehensive A11y audit
- `validateAriaLabels(page)` - ARIA implementation validation
- `validateKeyboardNavigation(page)` - Keyboard accessibility
- `validateColorContrast(element)` - WCAG 2.2 contrast ratios

#### Performance

- `validatePerformance(page, thresholds)` - Core Web Vitals validation
- `measureAllMetrics(page)` - All performance metrics
- `measureCLS(page, duration)` - Cumulative Layout Shift
- `measureLCP(page)` - Largest Contentful Paint
- `measureTTI(page)` - Time to Interactive
- `measurePageLoadTime(page)` - Total page load time

### Configurations

#### Devices

- `ukMarketDevices` - iPhone 13, Galaxy S9+, iPad Pro
- `extendedDevices` - Additional mobile devices
- `desktopDevices` - Desktop Chrome, Firefox, Safari

#### Breakpoints

- `commonBreakpoints` - Standard mobile/tablet/desktop sizes

#### Environments

- `getBaseURL(app, environment)` - Get app URL for environment

## UK Market Focus

All mobile configurations target UK market devices:

- iPhone 13 (Mobile Safari)
- Samsung Galaxy S9+ (Mobile Chrome)
- iPad Pro (Mobile Safari)

Performance thresholds account for UK mobile networks.

## WCAG 2.2 Level AA Compliance

All validators enforce WCAG 2.2 Level AA standards:

- Touch targets: 44x44px minimum
- Color contrast: 4.5:1 (normal text), 3:1 (large text)
- Keyboard navigation: Full support required
- ARIA labels: Required for all interactive elements

## Core Web Vitals Thresholds

Performance validators use Google's Core Web Vitals thresholds:

- CLS (Cumulative Layout Shift): < 0.1 (good)
- LCP (Largest Contentful Paint): < 2500ms (good)
- FID (First Input Delay): < 100ms (good)
- TTI (Time to Interactive): < 3800ms (good)

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

## License

MIT © Total Audio
