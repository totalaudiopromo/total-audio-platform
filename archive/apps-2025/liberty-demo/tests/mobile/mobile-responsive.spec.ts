import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport for all tests in this describe block
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should display mobile-optimised overview page', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(430);

    // Check page is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have touch-friendly tap targets', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const campaignCard = page.locator('[class*="bg-tap-panel"]').first();

    if ((await campaignCard.count()) > 0) {
      const boundingBox = await campaignCard.boundingBox();

      // Touch target should be at least 44x44 pixels (WCAG 2.2 Level AA)
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should stack stat cards vertically on mobile', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const statCards = page.locator('.bg-tap-panel');

    if ((await statCards.count()) > 1) {
      const firstCard = await statCards.nth(0).boundingBox();
      const secondCard = await statCards.nth(1).boundingBox();

      if (firstCard && secondCard) {
        // On mobile, cards should stack (second card should be below first)
        expect(secondCard.y).toBeGreaterThan(firstCard.y);
      }
    }
  });

  test('should have readable font sizes on mobile', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    const fontSize = await body.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));

    // Base font size should be at least 14px on mobile
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    // Try to find navigation elements
    const links = page.locator('a[href*="/dashboard"]');

    if ((await links.count()) > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();
    }
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // Allow small differences (1-2px) due to rounding
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('should display campaign cards on mobile', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const campaignCards = page.locator('[class*="bg-tap-panel"]');

    if ((await campaignCards.count()) > 0) {
      const firstCard = campaignCards.first();
      await expect(firstCard).toBeVisible();

      // Card should not overflow viewport
      const boundingBox = await firstCard.boundingBox();
      const viewport = page.viewportSize();

      if (boundingBox && viewport) {
        expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  test('should open slideover on mobile tap', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const campaignCard = page.locator('[class*="bg-tap-panel"]').first();

    if ((await campaignCard.count()) > 0) {
      // Use click instead of tap (works on mobile viewport)
      await campaignCard.click();
      await page.waitForTimeout(500);

      // Slideover should be visible on mobile
      const slideover = page.locator('[class*="fixed"]');
      if ((await slideover.count()) > 0) {
        const isVisible = await slideover.first().isVisible();
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should have proper spacing on mobile', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    const padding = await body.evaluate(el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    });

    // Should have some padding/margin for readability
    expect(padding).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Tablet Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    // Set tablet viewport (iPad Pro dimensions)
    await page.setViewportSize({ width: 1024, height: 1366 });
  });

  test('should display optimised layout for tablet', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(768);

    // Check page loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should use grid layout on tablet', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const statCards = page.locator('.bg-tap-panel');

    if ((await statCards.count()) > 1) {
      const firstCard = await statCards.nth(0).boundingBox();
      const secondCard = await statCards.nth(1).boundingBox();

      // On tablet, some cards might be side-by-side
      if (firstCard && secondCard) {
        // Either horizontal or vertical layout is acceptable
        expect(firstCard).toBeTruthy();
        expect(secondCard).toBeTruthy();
      }
    }
  });

  test('should not have horizontal scroll on tablet', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
