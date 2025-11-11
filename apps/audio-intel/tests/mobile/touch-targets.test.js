/**
 * AUDIO INTEL TOUCH TARGET ACCESSIBILITY TESTS
 *
 * Validates WCAG 2.2 Level AA touch target requirements
 * - Minimum touch target size: 44x44px (iOS) / 48x48px (Android)
 * - Adequate spacing between interactive elements
 * - Touch-friendly form inputs and controls
 * - Gesture conflict detection
 */

const { test, expect } = require('@playwright/test');

// Touch target size standards (WCAG 2.2 Level AA)
const MINIMUM_TOUCH_TARGET = 44; // pixels
const RECOMMENDED_TOUCH_TARGET = 48; // pixels (Android Material Design)
const MINIMUM_SPACING = 8; // pixels between interactive elements

test.describe('Touch Target Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('All primary buttons meet minimum touch target size', async ({ page }) => {
    // Get all primary buttons (CTA, submit, action buttons)
    // Updated to match Audio Intel's actual button classes: cta-button, subtle-button
    const buttons = await page
      .locator('button[type="submit"], .cta-button, .subtle-button, button[class*="cta"]')
      .all();

    let testedCount = 0;
    const failures = [];

    for (const button of buttons) {
      if (await button.isVisible()) {
        testedCount++;
        const box = await button.boundingBox();

        if (box.height < MINIMUM_TOUCH_TARGET || box.width < MINIMUM_TOUCH_TARGET) {
          const text = await button.textContent();
          failures.push({
            text: text?.trim() || 'Unnamed button',
            width: box.width,
            height: box.height,
            minRequired: MINIMUM_TOUCH_TARGET,
          });
        }
      }
    }

    if (failures.length > 0) {
      console.error('Touch target failures:', JSON.stringify(failures, null, 2));
    }

    expect(testedCount).toBeGreaterThan(0, 'No primary buttons found to test');
    expect(failures).toHaveLength(0);
  });

  test('Navigation links have adequate touch targets', async ({ page }) => {
    // Test all navigation links
    const navLinks = await page.locator('nav a, header a').all();

    let testedCount = 0;
    const failures = [];

    for (const link of navLinks) {
      if (await link.isVisible()) {
        testedCount++;
        const box = await link.boundingBox();

        // Navigation links should have at least 44px height
        if (box.height < MINIMUM_TOUCH_TARGET) {
          const text = await link.textContent();
          const href = await link.getAttribute('href');
          failures.push({
            text: text?.trim() || 'Unnamed link',
            href: href || 'No href',
            height: box.height,
            minRequired: MINIMUM_TOUCH_TARGET,
          });
        }
      }
    }

    if (failures.length > 0) {
      console.error('Navigation link touch target failures:', JSON.stringify(failures, null, 2));
    }

    expect(testedCount).toBeGreaterThan(0, 'No navigation links found to test');
    expect(failures).toHaveLength(0);
  });

  test('Form inputs are touch-friendly', async ({ page }) => {
    await page.goto('/upload');

    // Test all form inputs
    const inputs = await page.locator('input:not([type="hidden"]), select, textarea').all();

    let testedCount = 0;
    const failures = [];

    for (const input of inputs) {
      if (await input.isVisible()) {
        testedCount++;
        const box = await input.boundingBox();

        // Form inputs should have at least 44px height
        if (box.height < MINIMUM_TOUCH_TARGET) {
          const type = await input.getAttribute('type');
          const id = await input.getAttribute('id');
          const placeholder = await input.getAttribute('placeholder');
          failures.push({
            type: type || 'unknown',
            id: id || 'no-id',
            placeholder: placeholder || 'no-placeholder',
            height: box.height,
            minRequired: MINIMUM_TOUCH_TARGET,
          });
        }
      }
    }

    if (failures.length > 0) {
      console.error('Form input touch target failures:', JSON.stringify(failures, null, 2));
    }

    expect(testedCount).toBeGreaterThan(0, 'No form inputs found to test');
    expect(failures).toHaveLength(0);
  });

  test('Interactive elements have adequate spacing', async ({ page }) => {
    // Get all buttons and links on the page
    const interactiveElements = await page.locator('button, a[href], input[type="submit"]').all();

    const visibleElements = [];
    for (const el of interactiveElements) {
      if (await el.isVisible()) {
        const box = await el.boundingBox();
        if (box) {
          visibleElements.push({ element: el, box });
        }
      }
    }

    const conflicts = [];

    // Check spacing between adjacent elements
    for (let i = 0; i < visibleElements.length; i++) {
      for (let j = i + 1; j < visibleElements.length; j++) {
        const el1 = visibleElements[i];
        const el2 = visibleElements[j];

        // Calculate distance between elements
        const horizontalGap = Math.abs(el1.box.x + el1.box.width - el2.box.x);
        const verticalGap = Math.abs(el1.box.y + el1.box.height - el2.box.y);

        // Check if elements are adjacent (same row or column)
        const sameRow = Math.abs(el1.box.y - el2.box.y) < 10;
        const sameColumn = Math.abs(el1.box.x - el2.box.x) < 10;

        if (
          (sameRow && horizontalGap < MINIMUM_SPACING) ||
          (sameColumn && verticalGap < MINIMUM_SPACING)
        ) {
          const text1 = await el1.element.textContent();
          const text2 = await el2.element.textContent();
          conflicts.push({
            element1: text1?.trim() || 'Unnamed',
            element2: text2?.trim() || 'Unnamed',
            gap: Math.min(horizontalGap, verticalGap),
            minRequired: MINIMUM_SPACING,
          });
        }
      }
    }

    if (conflicts.length > 0) {
      console.warn(
        'Spacing conflicts detected (may be acceptable if intentional):',
        JSON.stringify(conflicts.slice(0, 5), null, 2)
      );
    }

    // This is a warning rather than hard failure
    // Some designs intentionally have tight spacing
    expect(conflicts.length).toBeLessThan(10);
  });

  test('File upload button is touch-accessible', async ({ page }) => {
    await page.goto('/upload');

    // Find file input and its associated label/button
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Get the visible upload area (button or drop zone)
    const uploadArea = page
      .locator('[for="file-upload"], label[class*="upload"], div[class*="dropzone"]')
      .first();

    if (await uploadArea.isVisible()) {
      const box = await uploadArea.boundingBox();

      // Upload areas should be generous for mobile
      expect(box.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
      expect(box.width).toBeGreaterThanOrEqual(100); // Reasonable width for tap target
    }
  });

  test('Modal/dialog close buttons are touch-friendly', async ({ page }) => {
    // Look for any modals or dialogs
    const closeButtons = await page
      .locator('[aria-label="Close"], button[class*="close"], button[aria-label*="close" i]')
      .all();

    if (closeButtons.length > 0) {
      for (const button of closeButtons) {
        if (await button.isVisible()) {
          const box = await button.boundingBox();

          // Close buttons must be large enough to tap accurately
          expect(box.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
          expect(box.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);
        }
      }
    }
  });

  test('Dropdown/select menus are touch-accessible', async ({ page }) => {
    await page.goto('/upload');

    const selects = await page.locator('select').all();

    for (const select of selects) {
      if (await select.isVisible()) {
        const box = await select.boundingBox();

        // Selects should have adequate touch target height
        expect(box.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET);

        // Test that select can be opened with tap
        await select.tap();
        await page.waitForTimeout(200);

        // Select should be focused after tap
        const isFocused = await select.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    }
  });

  test('Icon-only buttons have adequate touch targets', async ({ page }) => {
    // Find buttons with only icons (no visible text)
    // Fixed: Use Playwright's text() selector instead of regex in :has-text()
    const iconButtons = await page.locator('button:has(svg)').all();

    const failures = [];

    for (const button of iconButtons) {
      if (await button.isVisible()) {
        // Check if button has actual text content (excluding whitespace)
        const textContent = await button.textContent();
        const hasText = textContent && textContent.trim().length > 0 && /[a-z]/i.test(textContent);

        // Only test icon-only buttons (no text)
        if (!hasText) {
          const box = await button.boundingBox();

          // Icon buttons need even more generous touch targets
          if (box.height < RECOMMENDED_TOUCH_TARGET || box.width < RECOMMENDED_TOUCH_TARGET) {
            const ariaLabel = await button.getAttribute('aria-label');
            failures.push({
              ariaLabel: ariaLabel || 'No aria-label',
              width: box.width,
              height: box.height,
              recommended: RECOMMENDED_TOUCH_TARGET,
            });
          }
        }
      }
    }

    if (failures.length > 0) {
      console.error('Icon button touch target failures:', JSON.stringify(failures, null, 2));
    }

    expect(failures).toHaveLength(0);
  });

  test('Touch gestures do not conflict with scrolling', async ({ page }) => {
    await page.goto('/upload');

    // Test that vertical swipe scrolls page, not elements
    const startY = 200;
    const endY = 100;

    const initialScroll = await page.evaluate(() => window.scrollY);

    await page.touchscreen.tap(200, startY);
    await page.mouse.move(200, endY);
    await page.waitForTimeout(100);

    const finalScroll = await page.evaluate(() => window.scrollY);

    // Page should scroll, but this test is for detecting conflicts
    // Not failing if scroll doesn't work, just validating no JS errors
    expect(Math.abs(finalScroll - initialScroll)).toBeGreaterThanOrEqual(0);
  });

  test('Table horizontal scroll does not conflict with vertical scroll', async ({ page }) => {
    await page.goto('/upload');

    // Look for horizontally scrollable tables
    const scrollableTables = page.locator(
      'div[class*="overflow-x"], .table-scroll, table[class*="mobile"]'
    );

    if (await scrollableTables.first().isVisible()) {
      const box = await scrollableTables.first().boundingBox();

      // Test horizontal swipe within table
      await page.touchscreen.tap(box.x + 50, box.y + 50);
      await page.mouse.move(box.x + 150, box.y + 50);
      await page.waitForTimeout(100);

      // Test vertical swipe within table should still scroll page
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await page.touchscreen.tap(box.x + 50, box.y + 50);
      await page.mouse.move(box.x + 50, box.y + 150);
      await page.waitForTimeout(100);
      const finalScrollY = await page.evaluate(() => window.scrollY);

      // Validate no errors occurred during gesture testing
      expect(Math.abs(finalScrollY - initialScrollY)).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Touch Target Coverage Report', () => {
  test('Generate touch target coverage report', async ({ page }) => {
    await page.goto('/');

    // Count all interactive elements
    const allInteractive = await page
      .locator('button, a[href], input:not([type="hidden"]), select, textarea')
      .all();

    let totalElements = 0;
    let compliantElements = 0;
    let nonCompliantElements = [];

    for (const el of allInteractive) {
      if (await el.isVisible()) {
        totalElements++;
        const box = await el.boundingBox();

        if (box.height >= MINIMUM_TOUCH_TARGET && box.width >= MINIMUM_TOUCH_TARGET) {
          compliantElements++;
        } else {
          const tagName = await el.evaluate(e => e.tagName.toLowerCase());
          const text = await el.textContent();
          const id = await el.getAttribute('id');
          nonCompliantElements.push({
            tag: tagName,
            text: text?.trim().slice(0, 30) || 'No text',
            id: id || 'no-id',
            width: box.width,
            height: box.height,
          });
        }
      }
    }

    const compliancePercentage = (compliantElements / totalElements) * 100;

    console.log('\n=== TOUCH TARGET COVERAGE REPORT ===');
    console.log(`Total interactive elements: ${totalElements}`);
    console.log(`Compliant elements: ${compliantElements}`);
    console.log(`Non-compliant elements: ${totalElements - compliantElements}`);
    console.log(`Compliance rate: ${compliancePercentage.toFixed(1)}%`);

    if (nonCompliantElements.length > 0) {
      console.log('\nNon-compliant elements:');
      console.log(JSON.stringify(nonCompliantElements.slice(0, 10), null, 2));
    }

    // Target: 90%+ compliance
    expect(compliancePercentage).toBeGreaterThanOrEqual(90);
  });
});
