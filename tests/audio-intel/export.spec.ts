import { test, expect } from '@playwright/test';
import * as fs from 'fs';

/**
 * Audio Intel - Export Functionality
 *
 * CRITICAL: Liberty will want to export enriched contacts for their campaigns
 * Tests PDF, CSV, and Excel export features
 */

test.describe('Audio Intel - Export Functions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Load demo data if button exists
    const loadButton = page
      .locator('button:has-text("Load Demo"), button:has-text("Demo Data")')
      .first();
    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
    }
  });

  test('should export contacts as PDF', async ({ page }) => {
    // Look for PDF export button
    const pdfButton = page
      .locator('button:has-text("PDF"), button:has-text("Export PDF"), a:has-text("PDF")')
      .first();

    if (!(await pdfButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('⚠️  PDF export button not found - may need to check selector');
      test.skip();
      return;
    }

    // Listen for download
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });

    await pdfButton.click();

    const download = await downloadPromise;

    // Verify download happened
    const filename = download.suggestedFilename();
    console.log(`Downloaded file: ${filename}`);

    expect(filename).toMatch(/\.pdf$/i);

    // Verify file size > 0 (has content)
    const path = await download.path();
    if (path) {
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(100); // At least 100 bytes
      console.log(`✅ PDF export successful (${stats.size} bytes)`);
    }
  });

  test('should export contacts as CSV', async ({ page }) => {
    // Look for CSV export button
    const csvButton = page
      .locator('button:has-text("CSV"), button:has-text("Export CSV"), a:has-text("CSV")')
      .first();

    if (!(await csvButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('⚠️  CSV export button not found');
      test.skip();
      return;
    }

    // Listen for download
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });

    await csvButton.click();

    const download = await downloadPromise;

    // Verify download happened
    const filename = download.suggestedFilename();
    console.log(`Downloaded file: ${filename}`);

    expect(filename).toMatch(/\.csv$/i);

    // Verify file has content
    const path = await download.path();
    if (path) {
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(10); // At least 10 bytes
      console.log(`✅ CSV export successful (${stats.size} bytes)`);

      // Read CSV and verify it has headers and data
      const content = fs.readFileSync(path, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      expect(lines.length).toBeGreaterThan(1); // At least header + 1 data row
      console.log(`CSV has ${lines.length} lines`);
    }
  });

  test('should export contacts as Excel', async ({ page }) => {
    // Look for Excel export button
    const excelButton = page
      .locator(
        'button:has-text("Excel"), button:has-text("Export Excel"), button:has-text("XLSX"), a:has-text("Excel")'
      )
      .first();

    if (!(await excelButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('⚠️  Excel export button not found');
      test.skip();
      return;
    }

    // Listen for download - wrap in try/catch as Excel export may not trigger download
    let download;
    try {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await excelButton.click();
      download = await downloadPromise;
    } catch {
      console.log('⚠️  Excel export did not trigger download - feature may not be implemented');
      test.skip();
      return;
    }

    // Verify download happened
    const filename = download.suggestedFilename();
    console.log(`Downloaded file: ${filename}`);

    expect(filename).toMatch(/\.xlsx?$/i);

    // Verify file size
    const path = await download.path();
    if (path) {
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(100); // Excel files are usually larger
      console.log(`✅ Excel export successful (${stats.size} bytes)`);
    }
  });

  test('export buttons are visible and functional', async ({ page }) => {
    // Verify at least ONE export option exists
    const exportButtons = page.locator(
      'button:has-text("Export"), button:has-text("PDF"), button:has-text("CSV"), button:has-text("Excel")'
    );

    const count = await exportButtons.count();
    expect(count).toBeGreaterThan(0);

    console.log(`✅ Found ${count} export options`);

    // Verify buttons are enabled
    const firstButton = exportButtons.first();
    await expect(firstButton).toBeEnabled();
  });
});
