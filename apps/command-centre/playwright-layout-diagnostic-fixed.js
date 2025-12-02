const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Pages to test - updated with correct URL (port 3005)
const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { name: 'homepage', url: '/', title: 'Dashboard Home' },
  { name: 'analytics', url: '/analytics', title: 'Analytics' },
  { name: 'social-posting', url: '/social-posting', title: 'Social Posting' },
  { name: 'newsjacking', url: '/newsjacking', title: 'Newsjacking' },
  { name: 'business-dashboard', url: '/business-dashboard', title: 'Business Dashboard' },
  { name: 'beta-management', url: '/beta-management', title: 'Beta Management' },
  { name: 'predictive-revenue', url: '/predictive-revenue', title: 'Predictive Revenue' },
  { name: 'revenue-intelligence', url: '/revenue-intelligence', title: 'Revenue Intelligence' },
  { name: 'reports', url: '/reports', title: 'Reports' },
  { name: 'marketing', url: '/marketing', title: 'Marketing' },
  { name: 'users', url: '/users', title: 'Users' },
  { name: 'system-status', url: '/system-status', title: 'System Status' },
];

// Viewport configurations for responsive testing
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

// Create screenshots directory
const SCREENSHOTS_DIR = './layout-diagnostic-screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function measureLayoutElements(page) {
  try {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const measurements = await page.evaluate(() => {
      const results = {
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        elements: {},
      };

      // Function to safely get element measurements
      function measureElement(selector, name) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const styles = window.getComputedStyle(element);
          return {
            selector,
            found: true,
            dimensions: {
              width: rect.width,
              height: rect.height,
              x: rect.x,
              y: rect.y,
            },
            styles: {
              padding: styles.padding,
              margin: styles.margin,
              paddingLeft: styles.paddingLeft,
              paddingRight: styles.paddingRight,
              marginLeft: styles.marginLeft,
              marginRight: styles.marginRight,
              display: styles.display,
              position: styles.position,
              minWidth: styles.minWidth,
              maxWidth: styles.maxWidth,
              width: styles.width,
              flexBasis: styles.flexBasis,
              flexGrow: styles.flexGrow,
              flexShrink: styles.flexShrink,
            },
          };
        } else {
          return { selector, found: false };
        }
      }

      // Try multiple possible selectors for sidebar
      const sidebarSelectors = [
        'aside',
        '[role="navigation"]',
        '.sidebar',
        '.navigation',
        '.side-nav',
        'nav:first-of-type',
        '.w-64', // Tailwind width class
        '.w-48',
        '.w-56',
        '.min-w-64',
      ];

      let sidebarFound = null;
      for (const selector of sidebarSelectors) {
        const measurement = measureElement(selector, 'sidebar');
        if (measurement.found) {
          sidebarFound = measurement;
          break;
        }
      }
      results.elements.sidebar = sidebarFound || {
        found: false,
        testedSelectors: sidebarSelectors,
      };

      // Try multiple possible selectors for main content
      const mainContentSelectors = [
        'main',
        '[role="main"]',
        '.main-content',
        '.content',
        '.main',
        '.flex-1', // Tailwind flex-1 class
        '.flex-grow',
      ];

      let mainContentFound = null;
      for (const selector of mainContentSelectors) {
        const measurement = measureElement(selector, 'main-content');
        if (measurement.found) {
          mainContentFound = measurement;
          break;
        }
      }
      results.elements.mainContent = mainContentFound || {
        found: false,
        testedSelectors: mainContentSelectors,
      };

      // Measure navigation items
      const navItems = document.querySelectorAll(
        'nav a, [role="navigation"] a, .nav-item, .sidebar a'
      );
      if (navItems.length > 0) {
        results.elements.navigationItems = {
          found: true,
          count: navItems.length,
          items: Array.from(navItems)
            .slice(0, 5)
            .map((item, index) => {
              const rect = item.getBoundingClientRect();
              const styles = window.getComputedStyle(item);
              return {
                index,
                text: item.textContent?.trim().substring(0, 30),
                dimensions: {
                  width: rect.width,
                  height: rect.height,
                },
                styles: {
                  padding: styles.padding,
                  margin: styles.margin,
                  fontSize: styles.fontSize,
                  lineHeight: styles.lineHeight,
                },
              };
            }),
        };
      } else {
        results.elements.navigationItems = { found: false };
      }

      // Measure overall layout container
      const layoutContainer = document.querySelector('body > div, .app, .layout, #__next');
      if (layoutContainer) {
        results.elements.layoutContainer = measureElement(
          'body > div:first-child',
          'layout-container'
        );
      }

      // Check for potential layout issues
      results.layoutIssues = [];

      // Check if sidebar is too narrow
      if (results.elements.sidebar?.found && results.elements.sidebar.dimensions.width < 200) {
        results.layoutIssues.push({
          type: 'narrow-sidebar',
          description: `Sidebar width (${results.elements.sidebar.dimensions.width}px) may be too narrow for good UX`,
          severity: 'medium',
        });
      }

      // Check if content area has insufficient padding
      if (results.elements.mainContent?.found) {
        const paddingLeft = parseInt(results.elements.mainContent.styles.paddingLeft) || 0;
        const paddingRight = parseInt(results.elements.mainContent.styles.paddingRight) || 0;
        if (paddingLeft < 16 || paddingRight < 16) {
          results.layoutIssues.push({
            type: 'insufficient-padding',
            description: `Main content has insufficient padding (left: ${paddingLeft}px, right: ${paddingRight}px)`,
            severity: 'low',
          });
        }
      }

      // Check for content width issues on large screens
      if (window.innerWidth > 1200 && results.elements.mainContent?.found) {
        const contentWidth = results.elements.mainContent.dimensions.width;
        if (contentWidth > 1200) {
          results.layoutIssues.push({
            type: 'content-too-wide',
            description: `Content area (${contentWidth}px) may be too wide for comfortable reading on large screens`,
            severity: 'low',
          });
        }
      }

      return results;
    });

    return measurements;
  } catch (error) {
    console.error('Error measuring layout elements:', error.message);
    return {
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

async function diagnosticTest() {
  console.log('🚀 Starting Command Centre Layout Diagnostic...\n');

  const browser = await chromium.launch({ headless: false });

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages: {},
  };

  for (const viewport of VIEWPORTS) {
    console.log(`📱 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);

    // Create new context for each viewport
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });

    for (const pageConfig of PAGES) {
      const pageKey = `${pageConfig.name}-${viewport.name}`;
      console.log(`  📄 Testing ${pageConfig.title} (${pageConfig.url})`);

      const page = await context.newPage();

      try {
        // Navigate to page
        const response = await page.goto(`${BASE_URL}${pageConfig.url}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        if (!response.ok()) {
          console.log(`    ⚠️  Page returned ${response.status()}`);
        }

        // Wait a moment for any dynamic content to load
        await page.waitForTimeout(2000);

        // Take screenshot
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageKey}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          animations: 'disabled',
        });

        // Measure layout elements
        const measurements = await measureLayoutElements(page);

        results.pages[pageKey] = {
          page: pageConfig,
          viewport,
          screenshotPath,
          measurements,
          url: `${BASE_URL}${pageConfig.url}`,
          success: true,
        };

        console.log(`    ✅ Screenshot saved: ${screenshotPath}`);
        if (measurements.elements?.sidebar?.found) {
          console.log(`    📏 Sidebar width: ${measurements.elements.sidebar.dimensions.width}px`);
        }
        if (measurements.elements?.mainContent?.found) {
          console.log(
            `    📏 Main content width: ${measurements.elements.mainContent.dimensions.width}px`
          );
        }
        if (measurements.layoutIssues?.length > 0) {
          console.log(`    ⚠️  Issues found: ${measurements.layoutIssues.length}`);
        }
      } catch (error) {
        console.log(`    ❌ Error testing ${pageConfig.name}: ${error.message}`);
        results.pages[pageKey] = {
          page: pageConfig,
          viewport,
          error: error.message,
          success: false,
        };
      } finally {
        await page.close();
      }
    }

    // Close context after all pages in this viewport are tested
    await context.close();
    console.log('');
  }

  // Save detailed results
  const resultsPath = path.join(SCREENSHOTS_DIR, 'diagnostic-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📊 Detailed results saved to: ${resultsPath}\n`);

  // Generate summary report
  generateSummaryReport(results);

  await browser.close();
  console.log('✅ Layout diagnostic complete!');
}

function generateSummaryReport(results) {
  console.log('📋 LAYOUT DIAGNOSTIC SUMMARY');
  console.log('================================\n');

  const allIssues = [];
  const measurements = {};

  Object.entries(results.pages).forEach(([pageKey, pageData]) => {
    if (pageData.success && pageData.measurements?.layoutIssues) {
      allIssues.push(
        ...pageData.measurements.layoutIssues.map(issue => ({
          ...issue,
          page: pageData.page.name,
          viewport: pageData.viewport.name,
        }))
      );
    }

    if (pageData.success && pageData.measurements?.elements) {
      const key = `${pageData.page.name}-${pageData.viewport.name}`;
      measurements[key] = {
        page: pageData.page.name,
        viewport: pageData.viewport.name,
        sidebar: pageData.measurements.elements.sidebar,
        mainContent: pageData.measurements.elements.mainContent,
      };
    }
  });

  // Group issues by type
  const issuesByType = allIssues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  console.log('🔍 IDENTIFIED ISSUES:');
  if (allIssues.length === 0) {
    console.log('  ✅ No major layout issues detected\n');
  } else {
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(`  📌 ${type.replace('-', ' ').toUpperCase()}: ${issues.length} occurrences`);
      issues.forEach(issue => {
        console.log(`    - ${issue.page} (${issue.viewport}): ${issue.description}`);
      });
      console.log('');
    });
  }

  console.log('📐 LAYOUT MEASUREMENTS:');
  const desktopMeasurements = Object.values(measurements).filter(m => m.viewport === 'desktop');
  if (desktopMeasurements.length > 0) {
    console.log('  Desktop (1920x1080):');
    desktopMeasurements.forEach(m => {
      const sidebarWidth = m.sidebar?.found ? `${m.sidebar.dimensions.width}px` : 'Not found';
      const contentWidth = m.mainContent?.found
        ? `${m.mainContent.dimensions.width}px`
        : 'Not found';
      console.log(
        `    ${m.page.padEnd(20)} | Sidebar: ${sidebarWidth.padEnd(12)} | Content: ${contentWidth}`
      );
    });
  }

  console.log('\n📱 RESPONSIVE BEHAVIOR:');
  const responsiveIssues = [];

  // Check for consistent sidebar behavior across viewports
  const sidebarWidths = {};
  Object.values(measurements).forEach(m => {
    if (m.sidebar?.found) {
      if (!sidebarWidths[m.page]) sidebarWidths[m.page] = {};
      sidebarWidths[m.page][m.viewport] = m.sidebar.dimensions.width;
    }
  });

  Object.entries(sidebarWidths).forEach(([page, widths]) => {
    if (widths.desktop && widths.tablet && widths.mobile) {
      if (widths.desktop === widths.tablet && widths.tablet === widths.mobile) {
        responsiveIssues.push(
          `${page}: Sidebar width doesn't adapt to viewport (${widths.desktop}px on all sizes)`
        );
      }
    }
  });

  if (responsiveIssues.length > 0) {
    responsiveIssues.forEach(issue => console.log(`  ⚠️  ${issue}`));
  } else {
    console.log('  ✅ No obvious responsive issues detected');
  }

  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('  1. Check sidebar width - should be ~240-280px on desktop');
  console.log('  2. Ensure main content has adequate padding (24-32px)');
  console.log('  3. Consider max-width for content area on large screens');
  console.log('  4. Verify navigation item spacing and touch targets');
  console.log('  5. Test sidebar collapse/expand behavior on mobile');

  // Save summary report
  const summaryPath = path.join(SCREENSHOTS_DIR, 'summary-report.txt');
  const summaryContent = `COMMAND CENTRE LAYOUT DIAGNOSTIC SUMMARY
Generated: ${new Date().toLocaleString()}

TOTAL PAGES TESTED: ${Object.keys(results.pages).length}
TOTAL ISSUES FOUND: ${allIssues.length}

ISSUES BY TYPE:
${Object.entries(issuesByType)
  .map(([type, issues]) => `${type.replace('-', ' ').toUpperCase()}: ${issues.length} occurrences`)
  .join('\n')}

DETAILED MEASUREMENTS SAVED TO: diagnostic-results.json
SCREENSHOTS SAVED TO: ${SCREENSHOTS_DIR}/

Next Steps:
1. Review all screenshots for visual inconsistencies
2. Examine detailed measurements in diagnostic-results.json
3. Implement CSS fixes based on identified issues
4. Re-run diagnostic to verify improvements
`;

  fs.writeFileSync(summaryPath, summaryContent);
  console.log(`\n📄 Summary report saved to: ${summaryPath}`);
}

// Check if Playwright is installed
async function checkPlaywrightInstall() {
  try {
    require('playwright');
    return true;
  } catch (error) {
    console.log('❌ Playwright not found. Please install it:');
    console.log('   npm install playwright');
    console.log('   npx playwright install');
    return false;
  }
}

// Run the diagnostic
(async () => {
  const hasPlaywright = await checkPlaywrightInstall();
  if (hasPlaywright) {
    await diagnosticTest();
  }
})().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});
