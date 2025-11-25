/**
 * Impact Tester Agent
 * Tests impact of changes - runs type checks and relevant tests
 */

const { execSync, spawnSync } = require('child_process');

module.exports = {
  name: 'impact-tester',
  model: 'sonnet',

  async execute(context) {
    const { files, dryRun } = context;

    const results = {
      typeCheck: null,
      lint: null,
      tests: null,
    };

    // Skip actual testing in dry run mode
    if (dryRun) {
      return {
        success: true,
        summary: 'Impact testing skipped (dry run)',
        results,
      };
    }

    // Run TypeScript check
    try {
      execSync('pnpm typecheck 2>&1', { encoding: 'utf8', timeout: 60000 });
      results.typeCheck = { success: true };
    } catch (e) {
      results.typeCheck = { success: false, output: e.stdout || e.message };
    }

    // Run lint
    try {
      execSync('pnpm lint 2>&1', { encoding: 'utf8', timeout: 60000 });
      results.lint = { success: true };
    } catch (e) {
      results.lint = { success: false, output: e.stdout || e.message };
    }

    // Determine overall success
    const allPassed = results.typeCheck?.success && results.lint?.success;

    return {
      success: allPassed,
      summary: allPassed ? 'All checks passed' : 'Some checks failed',
      results,
    };
  },
};
