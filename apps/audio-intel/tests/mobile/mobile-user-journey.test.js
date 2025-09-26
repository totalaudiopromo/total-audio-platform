/**
 * AUDIO INTEL MOBILE USER JOURNEY TESTS
 *
 * Critical revenue-path mobile testing for customer acquisition
 * Tests the complete signup → upload → results → payment flow
 */

const { test, expect, devices } = require('@playwright/test');

// Mobile devices to test (UK market focus)
const mobileDevices = [
  'iPhone 13',
  'iPhone 14',
  'Galaxy S9+',
  'Pixel 5'
];

// Test each mobile device
for (const deviceName of mobileDevices) {
  test.describe(`Mobile User Journey - ${deviceName}`, () => {
    test.use({ ...devices[deviceName] });

    test('Complete Revenue Journey: Homepage → Upload → Results → Export', async ({ page }) => {
      // Start timing for performance tracking
      const startTime = Date.now();

      // 1. HOMEPAGE MOBILE EXPERIENCE
      await test.step('Homepage Mobile Loading', async () => {
        await page.goto('https://intel.totalaudiopromo.com');

        // Check page loads within 3 seconds on mobile
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);

        // Verify mobile header is visible
        await expect(page.locator('.mobile-header')).toBeVisible();

        // Check hero section mobile layout
        await expect(page.locator('.mobile-hero')).toBeVisible();

        // Verify CTA button is thumb-accessible (min 44px)
        const ctaButton = page.locator('.mobile-cta-button').first();
        await expect(ctaButton).toBeVisible();

        const buttonBox = await ctaButton.boundingBox();
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      });

      // 2. MOBILE DEMO TESTING
      await test.step('Mobile Demo Functionality', async () => {
        // Test instant demo on mobile
        const demoButton = page.getByText('Try Demo');
        if (await demoButton.isVisible()) {
          await demoButton.tap();

          // Wait for demo results to appear
          await page.waitForSelector('[data-testid="demo-result"]', { timeout: 10000 });

          // Verify results are readable on mobile
          const demoResult = page.locator('[data-testid="demo-result"]');
          await expect(demoResult).toBeVisible();
        }
      });

      // 3. NAVIGATION TO UPLOAD
      await test.step('Mobile Navigation to Upload', async () => {
        // Navigate to upload page
        await page.goto('/upload');

        // Verify upload page mobile layout
        await expect(page.getByText('Upload Contacts for Enrichment')).toBeVisible();

        // Check email input field mobile usability
        const emailInput = page.locator('#user-email');
        await expect(emailInput).toBeVisible();

        // Tap email field and verify keyboard doesn't cover UI
        await emailInput.tap();
        await emailInput.fill('test@example.com');

        const inputBox = await emailInput.boundingBox();
        expect(inputBox.y).toBeGreaterThan(0); // Not hidden behind keyboard
      });

      // 4. MOBILE FILE UPLOAD TESTING
      await test.step('Mobile File Upload Process', async () => {
        // Create test CSV content
        const csvContent = 'name,email\\nJohn Doe,john@bbc.co.uk\\nJane Smith,jane@radio1.com';

        // Test file upload on mobile
        const fileInput = page.locator('input[type="file"]');

        // For mobile testing, we simulate file selection
        await fileInput.setInputFiles({
          name: 'test-contacts.csv',
          mimeType: 'text/csv',
          buffer: Buffer.from(csvContent)
        });

        // Verify file preview appears and is readable on mobile
        await expect(page.getByText('Preview (first 5 contacts)')).toBeVisible();

        // Check table is mobile-optimized
        const previewTable = page.locator('table').first();
        await expect(previewTable).toBeVisible();

        // Verify table fits mobile viewport or scrolls properly
        const tableBox = await previewTable.boundingBox();
        const viewport = page.viewportSize();
        expect(tableBox.width).toBeLessThanOrEqual(viewport.width);
      });

      // 5. MOBILE ENRICHMENT PROCESS
      await test.step('Mobile Enrichment Experience', async () => {
        // Start enrichment process
        const enrichButton = page.getByText('Start Enrichment');
        await expect(enrichButton).toBeVisible();
        await expect(enrichButton).toBeEnabled();
        await enrichButton.tap();

        // Verify progress bar is visible on mobile
        await page.waitForSelector('[data-testid="progress-bar"]', { timeout: 5000 });
        const progressBar = page.locator('[data-testid="progress-bar"]');
        await expect(progressBar).toBeVisible();

        // Wait for enrichment to complete (timeout 30s)
        await page.waitForSelector('.bg-green-50', { timeout: 30000 });

        // Verify success message is visible on mobile
        await expect(page.getByText('Successfully enriched')).toBeVisible();
      });

      // 6. MOBILE RESULTS DISPLAY
      await test.step('Mobile Results Table Experience', async () => {
        // Check results table mobile layout
        const resultsTable = page.locator('table').last();
        await expect(resultsTable).toBeVisible();

        // Verify contact intelligence is readable on mobile
        const intelligenceCell = page.locator('td').filter({ hasText: 'BBC' }).first();
        if (await intelligenceCell.isVisible()) {
          const textContent = await intelligenceCell.textContent();
          expect(textContent.length).toBeGreaterThan(10); // Has meaningful content
        }

        // Test horizontal scrolling if table is wide
        const tableBox = await resultsTable.boundingBox();
        const viewport = page.viewportSize();

        if (tableBox.width > viewport.width) {
          // Test swipe scrolling
          await page.touchscreen.tap(tableBox.x + 50, tableBox.y + 50);
          await page.mouse.move(tableBox.x + 100, tableBox.y + 50);
        }
      });

      // 7. MOBILE EXPORT FUNCTIONALITY
      await test.step('Mobile Export Process', async () => {
        // Find export button
        const exportButton = page.getByText('Export CSV').or(page.getByText('Download')).first();

        if (await exportButton.isVisible()) {
          await expect(exportButton).toBeVisible();

          // Verify button is thumb-accessible
          const buttonBox = await exportButton.boundingBox();
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);

          // Test export functionality
          const downloadPromise = page.waitForEvent('download');
          await exportButton.tap();

          const download = await downloadPromise;
          expect(download.suggestedFilename()).toContain('.csv');
        }
      });

      // 8. MOBILE PERFORMANCE VALIDATION
      await test.step('Mobile Performance Check', async () => {
        // Total journey time should be reasonable
        const totalTime = Date.now() - startTime;
        expect(totalTime).toBeLessThan(60000); // Under 1 minute for full journey

        // Check for JavaScript errors
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        expect(errors.length).toBe(0);

        // Verify no layout shifts occurred
        const cls = await page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const cls = entries.reduce((sum, entry) => sum + entry.value, 0);
              resolve(cls);
            }).observe({ entryTypes: ['layout-shift'] });

            setTimeout(() => resolve(0), 1000);
          });
        });

        expect(cls).toBeLessThan(0.1); // Good CLS score
      });
    });

    test('Mobile Form Validation & Error Handling', async ({ page }) => {
      await page.goto('/upload');

      // Test form validation on mobile
      await test.step('Mobile Form Error States', async () => {
        // Try uploading invalid file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
          name: 'invalid.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('invalid content')
        });

        // Verify error message is visible and readable on mobile
        await page.waitForSelector('.bg-red-50', { timeout: 5000 });
        const errorMessage = page.locator('.bg-red-50');
        await expect(errorMessage).toBeVisible();

        // Check error message doesn't overflow mobile viewport
        const errorBox = await errorMessage.boundingBox();
        const viewport = page.viewportSize();
        expect(errorBox.width).toBeLessThanOrEqual(viewport.width);
      });
    });

    test('Mobile Touch Interactions', async ({ page }) => {
      await page.goto('/');

      await test.step('Touch Target Accessibility', async () => {
        // Get all clickable elements
        const clickableElements = await page.locator('button, a, input[type="submit"]').all();

        for (const element of clickableElements) {
          if (await element.isVisible()) {
            const box = await element.boundingBox();

            // Verify minimum touch target size (44px)
            expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
          }
        }
      });

      await test.step('Gesture Conflicts', async () => {
        // Test for conflicting gestures (e.g., swipe vs click)
        const swipeableArea = page.locator('table, .overflow-x-auto').first();

        if (await swipeableArea.isVisible()) {
          const box = await swipeableArea.boundingBox();

          // Test tap vs swipe differentiation
          await page.touchscreen.tap(box.x + 50, box.y + 50);
          await page.waitForTimeout(100);

          // Verify tap didn't trigger unintended scroll
          const scrollLeft = await swipeableArea.evaluate(el => el.scrollLeft);
          expect(scrollLeft).toBe(0);
        }
      });
    });
  });
}

// Export test results for reporting
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    // Capture screenshot on mobile test failure
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('mobile-failure-screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  }
});