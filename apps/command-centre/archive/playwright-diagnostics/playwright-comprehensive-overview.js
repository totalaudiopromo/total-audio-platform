const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotsDir = './playwright-overview-screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// List of all pages to capture
const pages = [
  { name: 'homepage', path: '/' },
  { name: 'analytics', path: '/analytics' },
  { name: 'business-dashboard', path: '/business-dashboard' },
  { name: 'marketing', path: '/marketing' },
  { name: 'reports', path: '/reports' },
  { name: 'social-media-hub', path: '/social-media-hub' },
  { name: 'social-posting', path: '/social-posting' },
  { name: 'newsjacking', path: '/newsjacking' },
  { name: 'predictive-revenue', path: '/predictive-revenue' },
  { name: 'revenue-intelligence', path: '/revenue-intelligence' },
  { name: 'beta-management', path: '/beta-management' },
  { name: 'users', path: '/users' },
  { name: 'system-status', path: '/system-status' },
  { name: 'radio-promo', path: '/radio-promo' },
];

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: 'http://localhost:3005',
    pages: [],
  };

  for (const page of pages) {
    console.log(`📸 Capturing ${page.name}...`);

    const pageResults = {
      name: page.name,
      path: page.path,
      screenshots: [],
      errors: [],
    };

    for (const viewport of viewports) {
      try {
        const pageInstance = await context.newPage();
        await pageInstance.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        // Navigate to the page
        const url = `http://localhost:3005${page.path}`;
        console.log(`  📱 ${viewport.name} (${viewport.width}x${viewport.height})`);

        await pageInstance.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Wait a bit for any dynamic content to load
        await pageInstance.waitForTimeout(2000);

        // Capture screenshot
        const screenshotPath = path.join(screenshotsDir, `${page.name}-${viewport.name}.png`);

        await pageInstance.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        pageResults.screenshots.push({
          viewport: viewport.name,
          dimensions: `${viewport.width}x${viewport.height}`,
          path: screenshotPath,
          status: 'success',
        });

        await pageInstance.close();
      } catch (error) {
        console.error(`  ❌ Error capturing ${page.name} ${viewport.name}:`, error.message);
        pageResults.errors.push({
          viewport: viewport.name,
          error: error.message,
        });
      }
    }

    results.pages.push(pageResults);
  }

  await browser.close();

  // Save results summary
  const summaryPath = path.join(screenshotsDir, 'overview-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));

  // Generate HTML report
  generateHTMLReport(results);

  console.log(`\n✅ Screenshots captured in: ${screenshotsDir}`);
  console.log(`📊 Summary saved to: ${summaryPath}`);

  return results;
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Command Centre - Comprehensive Overview</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .page-section {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .page-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        .screenshot-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .screenshot-item img {
            width: 100%;
            height: auto;
            display: block;
        }
        .screenshot-caption {
            padding: 10px;
            background: #f8f9fa;
            font-size: 14px;
            color: #666;
        }
        .error {
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Command Centre - Comprehensive Overview</h1>
        <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
        <p>Base URL: ${results.baseUrl}</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${results.pages.length}</div>
            <div class="stat-label">Pages Captured</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${results.pages.reduce((acc, page) => acc + page.screenshots.length, 0)}</div>
            <div class="stat-label">Screenshots Taken</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${results.pages.reduce((acc, page) => acc + page.errors.length, 0)}</div>
            <div class="stat-label">Errors</div>
        </div>
    </div>

    ${results.pages
      .map(
        page => `
        <div class="page-section">
            <div class="page-title">📄 ${page.name.replace('-', ' ').toUpperCase()}</div>
            <p><strong>Path:</strong> ${page.path}</p>
            
            ${
              page.errors.length > 0
                ? `
                <div class="error">
                    <strong>Errors:</strong>
                    ${page.errors.map(error => `<div>${error.viewport}: ${error.error}</div>`).join('')}
                </div>
            `
                : ''
            }
            
            <div class="screenshots-grid">
                ${page.screenshots
                  .map(
                    screenshot => `
                    <div class="screenshot-item">
                        <img src="${screenshot.path}" alt="${page.name} ${screenshot.viewport}" />
                        <div class="screenshot-caption">
                            <strong>${screenshot.viewport.toUpperCase()}</strong><br>
                            ${screenshot.dimensions}
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
        </div>
    `
      )
      .join('')}
</body>
</html>`;

  const htmlPath = path.join(screenshotsDir, 'overview-report.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML report generated: ${htmlPath}`);
}

// Run the capture
captureScreenshots()
  .then(results => {
    console.log('\n🎉 Comprehensive overview complete!');
    console.log(`📊 Total pages: ${results.pages.length}`);
    console.log(
      `📸 Total screenshots: ${results.pages.reduce((acc, page) => acc + page.screenshots.length, 0)}`
    );
    console.log(
      `❌ Total errors: ${results.pages.reduce((acc, page) => acc + page.errors.length, 0)}`
    );
  })
  .catch(error => {
    console.error('❌ Error running comprehensive overview:', error);
    process.exit(1);
  });
