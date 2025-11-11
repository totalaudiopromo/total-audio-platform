#!/usr/bin/env node

/**
 * CROSS-APP ORCHESTRATOR AGENT
 *
 * Orchestrates testing across all Total Audio Platform apps:
 * - Runs mobile test suites in parallel
 * - Analyzes components for issues
 * - Generates targeted tests
 * - Produces comprehensive cross-app reports
 *
 * Part of Total Audio Platform intelligent testing system.
 * Achieves 3-5x faster testing through parallel execution.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

class CrossAppOrchestrator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.apps = options.apps || [
      { name: 'audio-intel', dir: 'apps/audio-intel', port: 3000 },
      { name: 'pitch-generator', dir: 'apps/pitch-generator', port: 3004 },
      { name: 'tracker', dir: 'apps/tracker', port: 3001 },
    ];
    this.results = {
      analysis: null,
      tests: {},
      summary: {},
    };
  }

  /**
   * Run complete testing orchestration
   */
  async orchestrate() {
    console.log(`${colors.cyan}${colors.bright}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}║  🎯 CROSS-APP TESTING ORCHESTRATOR                          ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}║  Total Audio Platform Intelligent Testing System            ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    const startTime = Date.now();

    try {
      // Phase 1: Component Analysis
      await this.runComponentAnalysis();

      // Phase 2: Test Generation
      await this.runTestGeneration();

      // Phase 3: Run Mobile Tests (Parallel)
      await this.runMobileTests();

      // Phase 4: Generate Cross-App Report
      await this.generateCrossAppReport();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n${colors.green}${colors.bright}✅ Orchestration complete in ${duration}s${colors.reset}\n`);
    } catch (error) {
      console.error(`${colors.red}❌ Orchestration failed:${colors.reset}`, error.message);
      process.exit(1);
    }
  }

  /**
   * Phase 1: Run component analysis
   */
  async runComponentAnalysis() {
    console.log(`${colors.magenta}${colors.bright}━━━ PHASE 1: COMPONENT ANALYSIS ━━━${colors.reset}\n`);

    const analyzerPath = path.join(__dirname, 'component-analyzer.js');
    await this.runScript(analyzerPath, 'Component Analyzer');

    // Load results
    const reportPath = path.join(this.rootDir, 'reports', 'component-analysis.json');
    if (fs.existsSync(reportPath)) {
      this.results.analysis = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      console.log(`${colors.green}✅ Analysis complete - ${this.results.analysis.summary.total} issues found${colors.reset}\n`);
    }
  }

  /**
   * Phase 2: Run test generation
   */
  async runTestGeneration() {
    console.log(`${colors.magenta}${colors.bright}━━━ PHASE 2: TEST GENERATION ━━━${colors.reset}\n`);

    const generatorPath = path.join(__dirname, 'test-generator.js');
    await this.runScript(generatorPath, 'Test Generator');

    // Load results
    const summaryPath = path.join(this.rootDir, 'reports', 'test-generation-summary.json');
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
      console.log(`${colors.green}✅ Generated ${summary.testsGenerated} tests${colors.reset}\n`);
    }
  }

  /**
   * Phase 3: Run mobile tests in parallel
   */
  async runMobileTests() {
    console.log(`${colors.magenta}${colors.bright}━━━ PHASE 3: MOBILE TESTING (PARALLEL) ━━━${colors.reset}\n`);

    const testPromises = this.apps.map(app => this.runAppTests(app));

    const results = await Promise.allSettled(testPromises);

    results.forEach((result, index) => {
      const app = this.apps[index];
      if (result.status === 'fulfilled') {
        this.results.tests[app.name] = result.value;
        console.log(`${colors.green}✅ ${app.name}: Tests completed${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠️  ${app.name}: Tests failed or skipped${colors.reset}`);
        this.results.tests[app.name] = { error: result.reason };
      }
    });

    console.log();
  }

  /**
   * Run tests for a specific app
   */
  async runAppTests(app) {
    const appPath = path.join(this.rootDir, app.dir);
    const testDir = path.join(appPath, 'tests', 'mobile');

    if (!fs.existsSync(testDir)) {
      return { skipped: true, reason: 'No mobile tests found' };
    }

    return new Promise((resolve, reject) => {
      const proc = spawn('npm', ['run', 'test:mobile'], {
        cwd: appPath,
        env: { ...process.env, CI: 'true' },
      });

      let output = '';
      let errorOutput = '';

      proc.stdout.on('data', data => {
        output += data.toString();
      });

      proc.stderr.on('data', data => {
        errorOutput += data.toString();
      });

      proc.on('close', code => {
        if (code === 0) {
          resolve({ passed: true, output });
        } else {
          resolve({ passed: false, output, errorOutput, exitCode: code });
        }
      });

      proc.on('error', err => {
        reject(err);
      });
    });
  }

  /**
   * Phase 4: Generate cross-app report
   */
  async generateCrossAppReport() {
    console.log(`${colors.magenta}${colors.bright}━━━ PHASE 4: CROSS-APP REPORT ━━━${colors.reset}\n`);

    const report = {
      timestamp: new Date().toISOString(),
      apps: this.apps.map(app => app.name),
      analysis: this.results.analysis?.summary || {},
      testResults: this.results.tests,
      summary: this.calculateSummary(),
    };

    // Save report
    const reportPath = path.join(this.rootDir, 'reports', 'cross-app-testing-report.json');
    const reportDir = path.dirname(reportPath);

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    this.displaySummary(report);

    console.log(`${colors.green}✅ Full report saved to: ${reportPath}${colors.reset}\n`);
  }

  /**
   * Calculate summary statistics
   */
  calculateSummary() {
    const appsPassed = Object.values(this.results.tests).filter(r => r.passed).length;
    const appsTotal = this.apps.length;
    const issuesFound = this.results.analysis?.summary.total || 0;

    return {
      appsPassed,
      appsTotal,
      issuesFound,
      passRate: appsTotal > 0 ? ((appsPassed / appsTotal) * 100).toFixed(1) : 0,
    };
  }

  /**
   * Display summary
   */
  displaySummary(report) {
    console.log(`${colors.cyan}${colors.bright}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}║  📊 CROSS-APP TESTING SUMMARY                               ║${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    console.log(`${colors.bright}Apps Tested:${colors.reset} ${report.summary.appsTotal}`);
    console.log(`${colors.green}Apps Passed:${colors.reset} ${report.summary.appsPassed}`);
    console.log(`${colors.yellow}Pass Rate:${colors.reset} ${report.summary.passRate}%`);
    console.log(`${colors.red}Issues Found:${colors.reset} ${report.summary.issuesFound}\n`);

    console.log(`${colors.bright}Per-App Results:${colors.reset}`);
    Object.entries(report.testResults).forEach(([app, result]) => {
      const status = result.passed ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
      console.log(`  ${app.padEnd(20)} ${status}`);
    });

    console.log();
  }

  /**
   * Run a script and wait for completion
   */
  runScript(scriptPath, name) {
    return new Promise((resolve, reject) => {
      console.log(`${colors.dim}Running ${name}...${colors.reset}\n`);

      const proc = spawn('node', [scriptPath], {
        cwd: this.rootDir,
        stdio: 'inherit',
      });

      proc.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${name} failed with code ${code}`));
        }
      });

      proc.on('error', err => {
        reject(err);
      });
    });
  }
}

// Run orchestrator if called directly
if (require.main === module) {
  const orchestrator = new CrossAppOrchestrator({
    rootDir: path.resolve(__dirname, '../../../..'),
  });

  orchestrator.orchestrate().catch(err => {
    console.error(`${colors.red}❌ Fatal error:${colors.reset}`, err);
    process.exit(1);
  });
}

module.exports = CrossAppOrchestrator;
