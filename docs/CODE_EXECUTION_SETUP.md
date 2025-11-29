# Code Execution MCP Setup

## Overview

Code execution capability allows Claude Code to run tests, validate builds, and execute agent scripts without manual CLI commands. This is the foundation for the Testing Orchestrator skill and intelligent agent-based testing.

## What Code Execution Enables

1. **Automated Test Running**

   ```bash
   npx playwright test apps/audio-intel/tests/mobile/
   ```

2. **TypeScript Validation**

   ```bash
   npx tsc --noEmit
   ```

3. **Build Validation**

   ```bash
   npm run build:audio-intel
   npm run build:pitch-generator
   npm run build:tracker
   ```

4. **Agent Script Execution**
   ```bash
   node tools/agents/active/testing/component-analyzer.js
   node tools/agents/active/testing/test-generator.js
   node tools/agents/active/testing/cross-app-orchestrator.js
   ```

## Current Implementation

Code execution is already available through Claude Code's Bash tool, which is whitelisted for:

- `node:*` - Running JavaScript/TypeScript files
- `npm:*` - NPM script execution
- Standard shell commands

## Usage Patterns

### Running Tests via Testing Orchestrator Skill

The Testing Orchestrator skill coordinates test execution across all apps:

```
User: "Run mobile tests on Audio Intel"

Claude: [Uses Testing Orchestrator skill]
1. Executes: npx playwright test apps/audio-intel/tests/mobile/
2. Collects results
3. Returns structured summary
```

### Cross-App Test Orchestration

```
User: "Test all apps"

Claude: [Uses Testing Orchestrator skill + task-orchestrator]
1. Spawns 4 parallel test agents
2. Each runs: npx playwright test [app]/tests/
3. Aggregates results
4. Generates unified report
```

### Component Analysis + Test Generation

```
User: "Generate tests for all interactive components"

Claude:
1. Executes: node tools/agents/active/testing/component-analyzer.js
2. Analyzes all components, generates spec JSON
3. Executes: node tools/agents/active/testing/test-generator.js
4. Creates Playwright tests from specs
5. Returns list of generated test files
```

## Testing the Setup

### Simple Test Run

```bash
# Test Audio Intel mobile suite
npx playwright test apps/audio-intel/tests/mobile/touch-targets.test.js
```

### TypeScript Validation

```bash
# Validate all TypeScript in testing package
cd packages/testing
npx tsc --noEmit
```

### Build Validation

```bash
# Build testing package
cd packages/testing
pnpm build
```

## Integration with Testing Orchestrator Skill

The Testing Orchestrator skill (`/.claude/skills/testing-orchestrator/SKILL.md`) uses code execution to:

1. **Execute Playwright tests**across all apps
2. **Run validation scripts**(TypeScript, builds)
3. **Coordinate parallel execution**via task-orchestrator patterns
4. **Generate intelligent reports**from test results

## Advanced Patterns

### Parallel Test Execution

Using task-orchestrator pattern for 3-5x speed improvement:

```javascript
// cross-app-orchestrator.js
const results = await Promise.all([
  runTests('audio-intel'),
  runTests('pitch-generator'),
  runTests('tracker'),
  runTests('totalaud.io'),
]);
```

### Conditional Test Selection

Based on git changes:

```bash
# Detect changed files
git diff --cached --name-only

# Run tests only for affected apps
if [[ $changed_files == *"apps/audio-intel"* ]]; then
  npx playwright test apps/audio-intel/tests/mobile/
fi
```

### Performance Monitoring

Track metrics over time:

```bash
# Run performance tests
npx playwright test apps/audio-intel/tests/mobile/performance-metrics.test.js

# Extract metrics
cat apps/audio-intel/reports/results.json | jq '.metrics'
```

## Future Enhancements

### Code Execution Agent (Phase 4)

Planned intelligent agent that:

- Automatically selects relevant tests based on changes
- Optimises execution order
- Predicts test failures
- Generates new tests for uncovered components

### Real-Time Streaming

Future integration with TotalAud.io:

- SSE/WebSocket streaming of test results
- Visual progress indicators in Agent Canvas
- Real-time failure analysis

### Smart Test Selection

AI-powered test selection:

- Analyse code changes
- Predict affected test files
- Run only necessary tests
- 10x faster feedback loop

## Best Practices

1. **Use Testing Orchestrator Skill**for all test execution
2. **Run tests before commits**to catch regressions early
3. **Leverage parallel execution**for speed
4. **Focus on customer-facing tests**during acquisition phase
5. **Generate reports**for stakeholder visibility

## Troubleshooting

### Tests Failing Locally

```bash
# Check test environment
npm run dev:audio-intel  # Start local server
npx playwright test --headed  # Run with browser visible
```

### TypeScript Errors

```bash
# Validate types
npx tsc --noEmit --pretty

# Check testing package types
cd packages/testing
pnpm typecheck
```

### Build Failures

```bash
# Clean and rebuild
rm -rf dist node_modules/.cache
pnpm install
pnpm build
```

## Related Documentation

- [Testing Orchestrator Skill](../.claude/skills/testing-orchestrator/SKILL.md)
- [Testing Package README](../packages/testing/README.md)
- [Audio Intel Mobile Tests](../apps/audio-intel/tests/mobile/)

## Status

**Phase 1 Complete**: Foundation implemented

- @total-audio/testing package built and ready
- Testing Orchestrator skill created
- Code execution patterns documented
- Ready for Phase 2: Expanding mobile tests across all apps
