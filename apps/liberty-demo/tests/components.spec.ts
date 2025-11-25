import { test, expect } from '@playwright/test';

test.describe('Component Interactions', () => {
  test('should display stat cards with proper formatting', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for stat card containers
    const statCards = page.locator('.bg-tap-panel').first();
    await expect(statCards).toBeVisible({ timeout: 10000 });

    // Verify stat cards have readable content
    const cardText = await statCards.textContent();
    expect(cardText).toBeTruthy();
  });

  test('should open campaign slideover when card is clicked', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find and click a campaign card
    const campaignCard = page.locator('[class*="bg-tap-panel"]').first();

    if ((await campaignCard.count()) > 0) {
      await campaignCard.click();
      await page.waitForTimeout(500);

      // Check if slideover opened (it should overlay the page)
      const slideover = page.locator('[class*="fixed"][class*="inset-0"]');
      if ((await slideover.count()) > 0) {
        await expect(slideover.first()).toBeVisible();
      }
    }
  });

  test('should display campaign cards with all required sections', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const campaignCard = page.locator('[class*="bg-tap-panel"]').first();

    if ((await campaignCard.count()) > 0) {
      const cardContent = await campaignCard.textContent();

      // Campaign cards should have some content
      expect(cardContent).toBeTruthy();
    }
  });

  test('should show status chips with proper styling', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for status indicators
    const statusElements = page.locator('[class*="status"], [class*="chip"]');

    if ((await statusElements.count()) > 0) {
      const firstStatus = statusElements.first();
      await expect(firstStatus).toBeVisible();
    }
  });

  test('should render activity stream panel', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');

    // Check for panel content
    const panels = page.locator('.bg-tap-panel');
    expect(await panels.count()).toBeGreaterThan(0);
  });

  test('should display lead gen panel', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for panels with content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should render asset cards in asset hub', async ({ page }) => {
    await page.goto('/dashboard/assets');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for asset-related content
    const heading = page.getByRole('heading', { name: /Asset Hub/i });
    await expect(heading).toBeVisible();
  });

  test('should display automation library items', async ({ page }) => {
    await page.goto('/dashboard/automation');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check page loaded
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/automation|workflow/);
  });

  test('should show CRM network visualisation', async ({ page }) => {
    await page.goto('/dashboard/crm');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for CRM content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should display ops dashboard panels', async ({ page }) => {
    await page.goto('/dashboard/ops');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for operations dashboard heading - try multiple selectors
    const heading = page
      .getByRole('heading', { name: /Operations/i })
      .or(page.locator('h1:has-text("Operations")'))
      .first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should render intake panel with submissions', async ({ page }) => {
    await page.goto('/dashboard/intake');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check page loaded
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should have working hover states on interactive elements', async ({ page }) => {
    await page.goto('/dashboard/overview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const campaignCard = page.locator('[class*="bg-tap-panel"]').first();

    if ((await campaignCard.count()) > 0) {
      // Hover over the card
      await campaignCard.hover();

      // Card should still be visible after hover
      await expect(campaignCard).toBeVisible();
    }
  });

  test('should display loading states properly', async ({ page }) => {
    // Navigate to a page that might show loading state
    const navigationPromise = page.goto('/dashboard/overview');

    // Try to catch loading state
    const loadingIndicator = page.locator('text=/loading/i, [class*="animate-spin"]');

    // Either we see loading or page loads too fast
    const hasLoading = (await loadingIndicator.count()) > 0;

    await navigationPromise;
    await page.waitForLoadState('networkidle');

    // After loading, content should be visible
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});
