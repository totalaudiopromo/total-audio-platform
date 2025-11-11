#!/usr/bin/env node

/**
 * COMPONENT ANALYZER AGENT
 *
 * Analyzes React components for mobile UX issues:
 * - Touch target sizes
 * - Responsive behavior
 * - Accessibility violations
 * - Performance anti-patterns
 *
 * Part of Total Audio Platform intelligent testing system.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class ComponentAnalyzer {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.appDirs = options.appDirs || ['apps/audio-intel', 'apps/pitch-generator', 'apps/tracker'];
    this.issues = {
      touchTargets: [],
      accessibility: [],
      responsive: [],
      performance: [],
    };
  }

  /**
   * Analyze all components in specified apps
   */
  async analyzeAllComponents() {
    console.log(`${colors.cyan}${colors.bright}🔍 COMPONENT ANALYZER AGENT${colors.reset}\n`);
    console.log(`Analyzing components in: ${this.appDirs.join(', ')}\n`);

    for (const appDir of this.appDirs) {
      const appPath = path.join(this.rootDir, appDir);

      if (!fs.existsSync(appPath)) {
        console.log(`${colors.yellow}⚠️  Skipping ${appDir} - directory not found${colors.reset}`);
        continue;
      }

      console.log(`${colors.blue}📂 Analyzing ${appDir}...${colors.reset}`);
      await this.analyzeApp(appPath, appDir);
    }

    this.generateReport();
  }

  /**
   * Analyze components in a specific app
   */
  async analyzeApp(appPath, appName) {
    const componentDirs = [
      path.join(appPath, 'app/components'),
      path.join(appPath, 'components'),
      path.join(appPath, 'app'),
    ];

    for (const componentDir of componentDirs) {
      if (fs.existsSync(componentDir)) {
        await this.analyzeDirectory(componentDir, appName);
      }
    }
  }

  /**
   * Recursively analyze directory for components
   */
  async analyzeDirectory(dir, appName, depth = 0) {
    if (depth > 5) return; // Prevent infinite recursion

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await this.analyzeDirectory(fullPath, appName, depth + 1);
      } else if (entry.isFile() && this.isComponentFile(entry.name)) {
        await this.analyzeComponent(fullPath, appName);
      }
    }
  }

  /**
   * Check if file is a React component
   */
  isComponentFile(filename) {
    return (
      (filename.endsWith('.tsx') || filename.endsWith('.jsx')) &&
      !filename.endsWith('.test.tsx') &&
      !filename.endsWith('.test.jsx') &&
      !filename.endsWith('.stories.tsx')
    );
  }

  /**
   * Analyze a single component file
   */
  async analyzeComponent(filePath, appName) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(this.rootDir, filePath);

    // Check for touch target issues
    this.checkTouchTargets(content, relativePath, appName);

    // Check for accessibility issues
    this.checkAccessibility(content, relativePath, appName);

    // Check for responsive issues
    this.checkResponsive(content, relativePath, appName);

    // Check for performance issues
    this.checkPerformance(content, relativePath, appName);
  }

  /**
   * Check for potential touch target issues
   */
  checkTouchTargets(content, filePath, appName) {
    const issues = [];

    // Check for inline styles with small sizes
    const inlineStyleRegex = /style=\{\{[^}]*(?:width|height):\s*['"]?(\d+)px/gi;
    let match;

    while ((match = inlineStyleRegex.exec(content)) !== null) {
      const size = parseInt(match[1]);
      if (size < 44) {
        issues.push({
          type: 'SMALL_INLINE_SIZE',
          size,
          line: this.getLineNumber(content, match.index),
        });
      }
    }

    // Check for hardcoded small padding/spacing
    const paddingRegex = /(?:p-|padding-|gap-)(\d+)/gi;
    while ((match = paddingRegex.exec(content)) !== null) {
      const spacing = parseInt(match[1]) * 4; // Tailwind spacing scale
      if (spacing < 8) {
        issues.push({
          type: 'SMALL_SPACING',
          spacing,
          line: this.getLineNumber(content, match.index),
        });
      }
    }

    if (issues.length > 0) {
      this.issues.touchTargets.push({ app: appName, file: filePath, issues });
    }
  }

  /**
   * Check for accessibility issues
   */
  checkAccessibility(content, filePath, appName) {
    const issues = [];

    // Check for buttons without accessible names
    if (content.match(/<button[^>]*>(?:\s*<(?:svg|icon|image)[^>]*>(?:<[^>]+>)*<\/(?:svg|icon|image)>\s*)<\/button>/gi)) {
      issues.push({
        type: 'ICON_BUTTON_NO_LABEL',
        line: 'multiple',
        suggestion: 'Add aria-label to icon-only buttons',
      });
    }

    // Check for images without alt text
    const imgRegex = /<img(?![^>]*alt=)/gi;
    if (imgRegex.test(content)) {
      issues.push({
        type: 'IMAGE_NO_ALT',
        line: 'multiple',
        suggestion: 'Add alt text to all images',
      });
    }

    // Check for custom interactive elements without role
    const divClickRegex = /<div[^>]*onClick/gi;
    if (divClickRegex.test(content)) {
      issues.push({
        type: 'DIV_CLICKABLE',
        line: 'multiple',
        suggestion: 'Use button element or add role="button" and keyboard handlers',
      });
    }

    if (issues.length > 0) {
      this.issues.accessibility.push({ app: appName, file: filePath, issues });
    }
  }

  /**
   * Check for responsive issues
   */
  checkResponsive(content, filePath, appName) {
    const issues = [];

    // Check for fixed widths without responsive alternatives
    const fixedWidthRegex = /className=["'][^"']*w-\d+(?![\w-])/g;
    if (fixedWidthRegex.test(content)) {
      issues.push({
        type: 'FIXED_WIDTH',
        line: 'multiple',
        suggestion: 'Consider responsive width classes (w-full, max-w-*, lg:w-*)',
      });
    }

    // Check for overflow issues
    if (!content.includes('overflow-') && content.includes('flex') && !content.includes('flex-wrap')) {
      issues.push({
        type: 'POTENTIAL_OVERFLOW',
        line: 'multiple',
        suggestion: 'Consider adding flex-wrap or overflow handling',
      });
    }

    if (issues.length > 0) {
      this.issues.responsive.push({ app: appName, file: filePath, issues });
    }
  }

  /**
   * Check for performance issues
   */
  checkPerformance(content, filePath, appName) {
    const issues = [];

    // Check for inline functions in props
    if (content.match(/(?:onClick|onChange|onSubmit)=\{(?:\([^)]*\)|[^}]*)\s*=>/g)) {
      issues.push({
        type: 'INLINE_FUNCTION',
        line: 'multiple',
        suggestion: 'Extract event handlers to avoid re-renders',
      });
    }

    // Check for missing useMemo/useCallback
    if (content.includes('map(') && !content.includes('useMemo')) {
      issues.push({
        type: 'UNMEMOIZED_COMPUTATION',
        line: 'multiple',
        suggestion: 'Consider wrapping expensive computations with useMemo',
      });
    }

    if (issues.length > 0) {
      this.issues.performance.push({ app: appName, file: filePath, issues });
    }
  }

  /**
   * Get line number from content and index
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Generate analysis report
   */
  generateReport() {
    console.log(`\n${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}📊 COMPONENT ANALYSIS REPORT${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    const categories = [
      { key: 'touchTargets', label: '👆 Touch Target Issues', color: colors.red },
      { key: 'accessibility', label: '♿ Accessibility Issues', color: colors.yellow },
      { key: 'responsive', label: '📱 Responsive Issues', color: colors.blue },
      { key: 'performance', label: '⚡ Performance Issues', color: colors.cyan },
    ];

    let totalIssues = 0;

    for (const category of categories) {
      const issueList = this.issues[category.key];
      const count = issueList.length;
      totalIssues += count;

      console.log(`${category.color}${category.label}${colors.reset}: ${count} files\n`);

      if (count > 0) {
        issueList.slice(0, 5).forEach(({ app, file, issues }) => {
          console.log(`  ${colors.bright}${file}${colors.reset}`);
          console.log(`  App: ${app}`);
          issues.forEach(issue => {
            console.log(`    • ${issue.type}${issue.suggestion ? ` - ${issue.suggestion}` : ''}`);
          });
          console.log();
        });

        if (count > 5) {
          console.log(`  ... and ${count - 5} more files\n`);
        }
      }
    }

    console.log(`${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}Total issues: ${totalIssues} files with potential problems${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    if (totalIssues === 0) {
      console.log(`${colors.green}✅ No issues found! Components look good.${colors.reset}\n`);
    }

    // Save report to file
    this.saveReportToFile();
  }

  /**
   * Save report to JSON file for Test Generator Agent
   */
  saveReportToFile() {
    const reportPath = path.join(this.rootDir, 'reports', 'component-analysis.json');
    const reportDir = path.dirname(reportPath);

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      issues: this.issues,
      summary: {
        touchTargets: this.issues.touchTargets.length,
        accessibility: this.issues.accessibility.length,
        responsive: this.issues.responsive.length,
        performance: this.issues.performance.length,
        total: Object.values(this.issues).reduce((sum, arr) => sum + arr.length, 0),
      },
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`${colors.green}✅ Report saved to: ${reportPath}${colors.reset}\n`);
  }
}

// Run analyzer if called directly
if (require.main === module) {
  const analyzer = new ComponentAnalyzer({
    rootDir: path.resolve(__dirname, '../../../..'),
  });

  analyzer.analyzeAllComponents().catch(err => {
    console.error(`${colors.red}❌ Error:${colors.reset}`, err);
    process.exit(1);
  });
}

module.exports = ComponentAnalyzer;
