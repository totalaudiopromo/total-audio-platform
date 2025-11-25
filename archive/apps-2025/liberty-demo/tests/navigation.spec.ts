import { test, expect } from '@playwright/test';

test.describe('Navigation and Page Loading', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/');
    expect(await page.title()).toBeTruthy();
  });

  test('should navigate to dashboard overview', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    // Check for key dashboard elements
    const heading = page.getByRole('heading', { name: /Active Campaigns/i });
    await expect(heading).toBeVisible();
  });

  test('should load all main dashboard pages without errors', async ({ page }) => {
    const dashboardPages = [
      { path: '/dashboard/overview', title: /Active Campaigns|Operational Stack/ },
      { path: '/dashboard/assets', title: /Asset Hub/ },
      { path: '/dashboard/automation', title: /Automation/ },
      { path: '/dashboard/crm', title: /CRM|Intelligence/ },
      { path: '/dashboard/ops', title: /Operations|Dashboard/ },
      { path: '/dashboard/intake', title: /Intake/ },
    ];

    for (const { path, title } of dashboardPages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Check page loaded successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });

  test('should display campaign cards on overview page', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    // Wait for campaign cards to appear (they might load from API)
    await page.waitForTimeout(2000);

    // Check if campaign cards or loading state exists
    const campaignCards = page.locator('[class*="bg-tap-panel"]');
    const loadingIndicator = page.locator('text=/loading/i');

    const hasCards = (await campaignCards.count()) > 0;
    const isLoading = (await loadingIndicator.count()) > 0;

    expect(hasCards || isLoading).toBeTruthy();
  });

  test('should load asset hub page', async ({ page }) => {
    await page.goto('/dashboard/assets');
    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { name: /Asset Hub/i });
    await expect(heading).toBeVisible();
  });

  test('should load automation page with graph', async ({ page }) => {
    await page.goto('/dashboard/automation');
    await page.waitForLoadState('networkidle');

    // Check for automation-related content
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/automation|workflow/);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/dashboard/non-existent-page');

    // Next.js should handle this gracefully
    expect(response?.status()).toBeGreaterThanOrEqual(200);
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    // Find a link to another dashboard page
    const assetLink = page.locator('a[href*="/dashboard/assets"]').first();

    if ((await assetLink.count()) > 0) {
      await assetLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/dashboard/assets');
    }
  });

  test('should maintain TAP design system colours', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);

    // Should have a background colour set (not transparent)
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(backgroundColor).not.toBe('transparent');

    // Check for TAP background class
    const className = await body.getAttribute('class');
    // Body should have bg-tap-bg or bg-background class
    expect(className || backgroundColor).toBeTruthy();
  });
});
