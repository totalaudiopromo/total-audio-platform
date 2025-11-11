#!/usr/bin/env node

/**
 * TEST GENERATOR AGENT
 *
 * Generates targeted Playwright tests based on Component Analyzer findings.
 * Creates test cases for:
 * - Touch target validation
 * - Accessibility compliance
 * - Responsive behavior
 * - Performance monitoring
 *
 * Part of Total Audio Platform intelligent testing system.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class TestGenerator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.reportPath = options.reportPath || path.join(this.rootDir, 'reports', 'component-analysis.json');
    this.generatedTests = [];
  }

  /**
   * Generate tests based on component analysis
   */
  async generateTests() {
    console.log(`${colors.cyan}${colors.bright}🧪 TEST GENERATOR AGENT${colors.reset}\n`);

    // Load component analysis report
    if (!fs.existsSync(this.reportPath)) {
      console.log(`${colors.yellow}⚠️  No analysis report found. Run component-analyzer.js first.${colors.reset}`);
      process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf-8'));
    console.log(`${colors.blue}📊 Loaded analysis report from ${new Date(report.timestamp).toLocaleString()}${colors.reset}\n`);

    // Generate tests for each category
    this.generateTouchTargetTests(report.issues.touchTargets);
    this.generateAccessibilityTests(report.issues.accessibility);
    this.generateResponsiveTests(report.issues.responsive);
    this.generatePerformanceTests(report.issues.performance);

    this.generateSummary();
  }

  /**
   * Generate touch target tests
   */
  generateTouchTargetTests(issues) {
    if (issues.length === 0) return;

    console.log(`${colors.cyan}👆 Generating touch target tests...${colors.reset}`);

    for (const { app, file, issues: fileIssues } of issues) {
      const componentName = path.basename(file, path.extname(file));
      const testPath = this.getTestPath(app, `${componentName}-touch-targets.test.js`);

      const test = this.generateTouchTargetTestContent(componentName, file, fileIssues);

      this.writeTestFile(testPath, test);
      this.generatedTests.push({ app, file: testPath, type: 'touch-targets' });
    }
  }

  /**
   * Generate touch target test content
   */
  generateTouchTargetTestContent(componentName, componentPath, issues) {
    const issueTypes = issues.map(i => i.type).join(', ');

    return `/**
 * AUTO-GENERATED TOUCH TARGET TEST
 * Component: ${componentName}
 * Source: ${componentPath}
 * Issues found: ${issueTypes}
 */

const { test, expect } = require('@playwright/test');
const { validateAllTouchTargets, validateTouchTargetSize } = require('@total-audio/testing');

test.describe('${componentName} - Touch Targets', () => {
  test('All interactive elements meet 44px minimum', async ({ page }) => {
    await page.goto('/'); // Update with actual route

    // Validate all touch targets
    const results = await validateAllTouchTargets(page);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Touch target failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Specific components have adequate spacing', async ({ page }) => {
    await page.goto('/');

    // Test specific interactive elements
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const result = await validateTouchTargetSize(button, 44);

      if (!result.passed) {
        console.error(\`Button \${i} failed: \${result.width}x\${result.height}\`);
      }

      expect(result.passed).toBe(true);
    }
  });
});
`;
  }

  /**
   * Generate accessibility tests
   */
  generateAccessibilityTests(issues) {
    if (issues.length === 0) return;

    console.log(`${colors.yellow}♿ Generating accessibility tests...${colors.reset}`);

    for (const { app, file, issues: fileIssues } of issues) {
      const componentName = path.basename(file, path.extname(file));
      const testPath = this.getTestPath(app, `${componentName}-accessibility.test.js`);

      const test = this.generateAccessibilityTestContent(componentName, file, fileIssues);

      this.writeTestFile(testPath, test);
      this.generatedTests.push({ app, file: testPath, type: 'accessibility' });
    }
  }

  /**
   * Generate accessibility test content
   */
  generateAccessibilityTestContent(componentName, componentPath, issues) {
    const issueTypes = issues.map(i => i.type).join(', ');

    return `/**
 * AUTO-GENERATED ACCESSIBILITY TEST
 * Component: ${componentName}
 * Source: ${componentPath}
 * Issues found: ${issueTypes}
 */

const { test, expect } = require('@playwright/test');
const { validateAccessibility, validateKeyboardNavigation } = require('@total-audio/testing');

test.describe('${componentName} - Accessibility', () => {
  test('WCAG 2.2 Level AA compliance', async ({ page }) => {
    await page.goto('/');

    const results = await validateAccessibility(page);

    if (!results.passed) {
      console.error('❌ Accessibility issues:', results.summary);
      results.ariaValidation.issues.forEach(issue => {
        console.error(\`  \${issue.severity}: \${issue.message}\`);
      });
    }

    expect(results.summary.critical).toBe(0);
    expect(results.summary.serious).toBe(0);
  });

  test('Keyboard navigation functional', async ({ page }) => {
    await page.goto('/');

    const results = await validateKeyboardNavigation(page);

    if (!results.passed) {
      console.error('❌ Keyboard navigation issues:', results.issues);
    }

    expect(results.focusableElements).toBeGreaterThan(0);
    expect(results.passed).toBe(true);
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      expect(alt).toBeTruthy();
    }
  });
});
`;
  }

  /**
   * Generate responsive tests
   */
  generateResponsiveTests(issues) {
    if (issues.length === 0) return;

    console.log(`${colors.blue}📱 Generating responsive tests...${colors.reset}`);

    for (const { app, file, issues: fileIssues } of issues) {
      const componentName = path.basename(file, path.extname(file));
      const testPath = this.getTestPath(app, `${componentName}-responsive.test.js`);

      const test = this.generateResponsiveTestContent(componentName, file, fileIssues);

      this.writeTestFile(testPath, test);
      this.generatedTests.push({ app, file: testPath, type: 'responsive' });
    }
  }

  /**
   * Generate responsive test content
   */
  generateResponsiveTestContent(componentName, componentPath, issues) {
    return `/**
 * AUTO-GENERATED RESPONSIVE TEST
 * Component: ${componentName}
 * Source: ${componentPath}
 */

const { test, expect } = require('@playwright/test');
const { validateBreakpoints, validateMobileLayout, commonBreakpoints } = require('@total-audio/testing');

test.describe('${componentName} - Responsive', () => {
  test('Responsive across all breakpoints', async ({ page }) => {
    await page.goto('/');

    const results = await validateBreakpoints(page, commonBreakpoints);
    const failures = results.filter(r => !r.passed);

    if (failures.length > 0) {
      console.error('❌ Breakpoint failures:', failures);
    }

    expect(failures).toHaveLength(0);
  });

  test('Mobile layout requirements', async ({ page }) => {
    await page.goto('/');

    const results = await validateMobileLayout(page);

    if (!results.passed) {
      console.error('❌ Mobile layout issues:', results.issues);
    }

    expect(results.passed).toBe(true);
    expect(results.checks.hasViewportMeta).toBe(true);
    expect(results.checks.hasHorizontalScroll).toBe(false);
  });
});
`;
  }

  /**
   * Generate performance tests
   */
  generatePerformanceTests(issues) {
    if (issues.length === 0) return;

    console.log(`${colors.cyan}⚡ Generating performance tests...${colors.reset}`);

    for (const { app, file, issues: fileIssues } of issues) {
      const componentName = path.basename(file, path.extname(file));
      const testPath = this.getTestPath(app, `${componentName}-performance.test.js`);

      const test = this.generatePerformanceTestContent(componentName, file, fileIssues);

      this.writeTestFile(testPath, test);
      this.generatedTests.push({ app, file: testPath, type: 'performance' });
    }
  }

  /**
   * Generate performance test content
   */
  generatePerformanceTestContent(componentName, componentPath, issues) {
    return `/**
 * AUTO-GENERATED PERFORMANCE TEST
 * Component: ${componentName}
 * Source: ${componentPath}
 */

const { test, expect } = require('@playwright/test');
const { validatePerformance, measureCLS, measureLCP } = require('@total-audio/testing');

test.describe('${componentName} - Performance', () => {
  test('Meets Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    const results = await validatePerformance(page);

    if (!results.passed) {
      console.error('❌ Performance issues:', results.metrics);
    }

    expect(results.passed).toBe(true);
    expect(results.metrics.cls).toBeLessThan(0.1);
    expect(results.metrics.lcp).toBeLessThan(2500);
  });

  test('No layout shift during component mount', async ({ page }) => {
    await page.goto('/');

    const cls = await measureCLS(page, 3000);
    console.log(\`📊 CLS: \${cls}\`);

    expect(cls).toBeLessThan(0.1);
  });
});
`;
  }

  /**
   * Get test file path for app
   */
  getTestPath(app, filename) {
    return path.join(this.rootDir, app, 'tests', 'generated', filename);
  }

  /**
   * Write test file to disk
   */
  writeTestFile(testPath, content) {
    const dir = path.dirname(testPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(testPath, content);
  }

  /**
   * Generate summary
   */
  generateSummary() {
    console.log(`\n${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}📝 TEST GENERATION SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    console.log(`${colors.green}✅ Generated ${this.generatedTests.length} test files${colors.reset}\n`);

    const byType = this.generatedTests.reduce((acc, test) => {
      acc[test.type] = (acc[test.type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} tests`);
    });

    console.log(`\n${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    // Save summary
    const summaryPath = path.join(this.rootDir, 'reports', 'test-generation-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      testsGenerated: this.generatedTests.length,
      byType,
      tests: this.generatedTests,
    }, null, 2));

    console.log(`${colors.green}✅ Summary saved to: ${summaryPath}${colors.reset}\n`);
  }
}

// Run generator if called directly
if (require.main === module) {
  const generator = new TestGenerator({
    rootDir: path.resolve(__dirname, '../../../..'),
  });

  generator.generateTests().catch(err => {
    console.error(`${colors.red}❌ Error:${colors.reset}`, err);
    process.exit(1);
  });
}

module.exports = TestGenerator;
