# Total Audio Platform - Demo-Critical Functional Tests

## Purpose

Comprehensive Playwright tests to validate functionality for **Liberty Music PR presentation** in 9 days.

**Focus**: Demo-blocking bugs only. Core features that will be shown, not edge cases.

## Test Structure

```
tests/
 audio-intel/           # Audio Intel core functionality
    enrichment.spec.ts # Contact enrichment (PRIMARY VALUE)
    export.spec.ts     # PDF/CSV/Excel exports
 pitch-generator/       # Pitch Generator core functionality
    generation.spec.ts # AI pitch generation
 tracker/               # Campaign Tracker core functionality
    dashboard.spec.ts  # Dashboard and campaign management
 demo-scenarios/        # Liberty demo workflow tests
     liberty-workflow.spec.ts  # Complete agency workflow
```

## Quick Start

### 1. Smoke Test (1 minute)

Quickly verify all three apps load without crashing:

```bash
pnpm test:smoke
```

### 2. Individual App Tests

Test each app independently:

```bash
# Audio Intel (contact enrichment + export)
pnpm test:audio-intel

# Pitch Generator (AI pitch generation)
pnpm test:pitch

# Campaign Tracker (dashboard + campaigns)
pnpm test:tracker
```

### 3. Full Demo Workflow

Test the complete Liberty demo scenario:

```bash
pnpm test:demo
```

### 4. All Tests

Run everything:

```bash
pnpm test
```

### 5. Visual Testing

Run tests with browser visible (useful for debugging):

```bash
pnpm test:headed
```

## Test Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `pnpm test:smoke`       | Quick smoke test - all apps load (1 min) |
| `pnpm test:audio-intel` | Audio Intel functionality                |
| `pnpm test:pitch`       | Pitch Generator functionality            |
| `pnpm test:tracker`     | Campaign Tracker functionality           |
| `pnpm test:demo`        | Complete Liberty demo workflow           |
| `pnpm test`             | All tests (10-15 min)                    |
| `pnpm test:headed`      | Run with browser visible                 |
| `pnpm test:ui`          | Interactive test runner UI               |
| `pnpm test:report`      | View HTML test report                    |

## What We're Testing

###  Audio Intel

- [x] Contact enrichment works
- [x] Demo data loads successfully
- [x] Export PDF works
- [x] Export CSV works
- [x] Export Excel works
- [x] Intelligence data is meaningful (not placeholder)
- [x] No critical console errors

###  Pitch Generator

- [x] Pitch generation works
- [x] Personalization is evident
- [x] Copy to clipboard works
- [x] No crashes during generation

###  Campaign Tracker

- [x] Dashboard displays correctly
- [x] Campaign listing works
- [x] Navigation to campaign detail works
- [x] Stats/metrics display

###  Demo Scenarios

- [x] Complete agency workflow (enrich → pitch → track)
- [x] Export functionality for client reporting
- [x] All apps load without crashing

## What We're NOT Testing

-  Edge cases and error handling
-  Every possible feature combination
-  Performance optimization
-  Mobile responsive (demo is desktop)
-  Authentication flows in depth

## Interpreting Results

### Success Output

```
 Audio Intel loaded
 Enriched 45 contacts
 PDF export successful
 All three apps ready for Liberty demo!
```

### Warning Output

```
  PDF export button not found - check selector
  No demo button found - may have pre-loaded data
```

**Action**: Investigate but may not be demo-blocking

### Failure Output

```
 Test failed: Contact enrichment not working
```

**Action**: Fix immediately - this is demo-blocking

## Running Tests Before Demo

**Recommended workflow:**

1. **Day Before Demo**: Run full test suite

```bash
pnpm test
```

2. **Morning of Demo**: Run smoke test

```bash
pnpm test:smoke
```

3. **30 Minutes Before**: Run demo scenario

```bash
pnpm test:demo
```

## Test Report

After running tests, view the HTML report:

```bash
pnpm test:report
```

## Debugging Failed Tests

### See what's happening

```bash
pnpm test:headed
```

### Interactive debugging

```bash
pnpm test:ui
```

### Check console errors

Look for `consoleErrors` in test output

## Known Limitations

- Tests assume default Next.js ports (3000, 3001, 3004)
- Tests require all three apps to be running
- Some tests gracefully skip if UI elements aren't found (to handle different demo structures)
- Tests use generous timeouts for real-world conditions

## App Ports

| App              | Port | URL                             |
| ---------------- | ---- | ------------------------------- |
| Audio Intel      | 3000 | http://localhost:3000/demo      |
| Pitch Generator  | 3001 | http://localhost:3001/demo      |
| Campaign Tracker | 3004 | http://localhost:3004/dashboard |

## CI/CD Integration

These tests are designed to run in CI as well:

```bash
CI=1 pnpm test
```

In CI mode:

- Retries failed tests 2 times
- Uses single worker (no parallel tests)
- Automatically starts dev servers
- Generates JSON results for parsing

## Questions?

**Test failing unexpectedly?**

1. Check if apps are running on correct ports
2. Run `pnpm test:headed` to see what's happening
3. Check console for errors in test output
4. Look for `` warnings about missing selectors

**Need to modify tests?**

1. Tests use flexible selectors to handle different UI structures
2. Add `console.log()` statements to debug
3. Use `test.skip()` to temporarily disable flaky tests

## Success Criteria

After running tests, you should know:

1.  Critical bugs identified
2.  Core functionality validated
3.  Demo scenarios tested
4.  Confidence level: **HIGH/MEDIUM/LOW** for demo readiness

---

**Last Updated**: November 2025
**Demo Date**: 9 days from now
**Purpose**: Validate Liberty Music PR demo readiness
