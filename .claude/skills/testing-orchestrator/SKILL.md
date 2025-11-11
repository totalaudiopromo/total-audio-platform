# Testing Orchestrator Skill

## Purpose

Intelligent test orchestration across Audio Intel, Pitch Generator, Tracker, and TotalAud.io using code execution and parallel agent coordination.

## When to Use This Skill

- When the user asks to run mobile tests
- When validating UX across multiple apps
- When checking for accessibility or performance issues
- When running cross-app consistency validation
- After making changes that affect multiple apps

## Triggers

- "Run mobile tests"
- "Test all apps"
- "Validate touch targets"
- "Check accessibility"
- "Run visual regression tests"
- "Test [app name]"
- "Run performance tests"

## Capabilities

### 1. Code Execution

- Run Playwright tests via Bash/code execution MCP
- Execute TypeScript compilation validation
- Run build scripts to validate production readiness
- Execute agent scripts for intelligent test generation

### 2. Parallel Execution

- Use task-orchestrator patterns for 3-5x speed improvement
- Spawn parallel test agents (one per app)
- Coordinate results aggregation
- Generate unified cross-app reports

### 3. Visual Validation

- Browser automation for screenshot comparison
- Touch target size verification
- Gesture conflict detection
- Responsive breakpoint visual testing

### 4. Intelligent Reporting

- Structured test results with pass/fail status
- Performance metrics (CLS, LCP, FID, TTI)
- Accessibility compliance scores
- Touch target coverage reports
- Cross-app consistency analysis

### 5. Cross-App Consistency

- Validate UX patterns match across all apps
- Ensure design system compliance
- Check motion grammar adherence (Slate Cyan #3AA9BE, 240ms ease-out)
- Validate shared component behaviour

## Process

1. **Detect Scope**
   - Determine which apps need testing (based on git changes or user request)
   - Identify test types required (mobile, accessibility, performance, visual)

2. **Spawn Test Agents**
   - Create parallel test agents (one per app) using task-orchestrator
   - Each agent runs independently with dedicated test configuration

3. **Execute Tests**
   - Use code execution MCP to run Playwright tests
   - Leverage @total-audio/testing package for validators
   - Collect results in real-time

4. **Aggregate Results**
   - Combine results from all test agents
   - Calculate cross-app metrics
   - Identify consistency issues

5. **Generate Report**
   - Create unified HTML report
   - Post metrics to Notion dashboard (optional)
   - Return structured summary to user

## Usage Examples

### Run Touch Target Tests

```
User: "Run touch target tests on Audio Intel and Pitch Generator"

Response:
1. Spawn 2 test agents (Audio Intel, Pitch Generator)
2. Execute: npx playwright test tests/mobile/touch-targets.test.js
3. Validate all interactive elements meet WCAG 2.2 Level AA (44px minimum)
4. Return results showing pass/fail for each app
```

### Validate Mobile UX Across All Apps

```
User: "Validate mobile UX across all apps"

Response:
1. Spawn 4 test agents (Audio Intel, Pitch Generator, Tracker, TotalAud.io)
2. Run full mobile test suites in parallel
3. Collect results:
   - Touch targets: 100% compliant
   - Responsive breakpoints: All passing
   - Performance: CLS < 0.1, LCP < 2500ms
   - Accessibility: WCAG 2.2 Level AA compliant
4. Generate unified report
```

### Check If Latest Changes Broke Tests

```
User: "Check if latest changes broke any tests"

Response:
1. Detect changed files via git diff
2. Identify affected apps
3. Run relevant test suites
4. Report any new failures
```

### Generate Performance Report

```
User: "Generate performance report for all apps"

Response:
1. Run performance tests on all apps
2. Measure Core Web Vitals (CLS, LCP, FID, TTI)
3. Compare against thresholds
4. Generate trend analysis
5. Post results to Notion dashboard
```

## Integration

### Uses

- `@total-audio/testing` package for validators
- `task-orchestrator` skill for parallel execution
- `browser-automation` skill for visual testing
- Code execution MCP for running tests
- Notion MCP for dashboard updates (optional)

### Coordinates With

- `systematic-debugging` skill for failure analysis
- `customer-acquisition-focus` skill to ensure tests don't block revenue work
- `mobile-first-validator` skill for mobile-specific patterns

## Test Types Supported

### Mobile Testing

- Touch target validation (WCAG 2.2 Level AA)
- Responsive breakpoint testing
- Gesture conflict detection
- Mobile layout validation

### Accessibility Testing

- ARIA labels and roles
- Color contrast validation (WCAG 2.2)
- Keyboard navigation
- Screen reader compatibility

### Performance Testing

- Cumulative Layout Shift (CLS)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Time to Interactive (TTI)
- Page load times
- Resource loading analysis

### Visual Regression

- Screenshot comparison
- Layout consistency
- Motion grammar compliance
- Design system validation

## Output Format

```typescript
{
  timestamp: '2025-11-10T12:00:00Z',
  apps: ['audio-intel', 'pitch-generator', 'tracker', 'totalaud.io'],
  results: {
    'audio-intel': {
      passed: true,
      duration: 45.2,
      touchTargets: { passed: true, failures: 0 },
      accessibility: { passed: true, critical: 0 },
      performance: { cls: 0.05, lcp: 1800, passed: true }
    },
    // ... other apps
  },
  summary: {
    totalTests: 150,
    passed: 148,
    failed: 2,
    duration: 45.2 // seconds (parallel execution)
  }
}
```

## Best Practices

1. **Run Tests Before Commits**
   - Validate changes don't break mobile UX
   - Catch regressions early

2. **Cross-App Consistency**
   - Always test shared components across all apps
   - Ensure design system compliance

3. **Performance First**
   - Use parallel execution for speed
   - Run full suites only when necessary
   - Use quick tests for rapid feedback

4. **Customer Acquisition Focus**
   - Prioritise tests that affect customer-facing features
   - Don't block deployments for minor issues
   - Focus on revenue-critical paths

## Limitations

- Code execution requires MCP server setup
- Parallel execution limited by system resources
- Visual regression requires baseline screenshots
- Performance metrics vary by network/hardware

## Future Enhancements

- Automatic test generation from component analysis
- AI-powered failure analysis
- Predictive test selection based on code changes
- Integration with TotalAud.io Agent Canvas for visual orchestration
- Real-time streaming of test results via SSE/WebSocket
