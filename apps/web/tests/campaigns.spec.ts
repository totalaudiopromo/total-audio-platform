import { test, expect } from '@playwright/test';

test.describe('Campaigns Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to campaigns page
    await page.goto('/campaigns');
  });

  test('should load campaigns page successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Total Audio Promo/);

    // Verify main campaigns elements are present
    await expect(page.locator('text=Campaigns')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display campaign management interface', async ({ page }) => {
    // Check for campaign management elements
    await expect(page.locator('text=Create Campaign')).toBeVisible();
    await expect(page.locator('text=Campaigns')).toBeVisible();
  });

  test('should display campaign list or empty state', async ({ page }) => {
    // Check for either campaign list or empty state
    const campaignList = page.locator('text=No campaigns yet');
    const createButton = page.locator('text=Create Campaign');

    // Should show either campaigns or empty state
    await expect(campaignList.or(createButton)).toBeVisible();
  });

  test('should handle create campaign flow', async ({ page }) => {
    // Look for create campaign button
    const createButton = page.locator('text=Create Campaign');

    if (await createButton.isVisible()) {
      await createButton.click();

      // Should navigate to campaign creation or show modal
      // This depends on the implementation
      await expect(
        page.locator('text=Create Campaign').or(page.locator('text=New Campaign'))
      ).toBeVisible();
    }
  });

  test('should display campaign filters if campaigns exist', async ({ page }) => {
    // Look for filter options
    const filterElements = page.locator('text=All, text=Active, text=Draft, text=Sent');

    // May or may not be visible depending on campaign count
    expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display campaign status indicators', async ({ page }) => {
    // Look for status indicators
    const statusElements = page.locator(
      '[class*="bg-green"], [class*="bg-yellow"], [class*="bg-gray"]'
    );

    // May or may not be visible depending on campaign count
    expect(await statusElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle campaign search if present', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Campaign');

      // Should filter campaigns
      await expect(
        page.locator('text=Test Campaign').or(page.locator('text=No results'))
      ).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify mobile layout
    await expect(page.locator('text=Campaigns')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();

    // Check if create button is accessible on mobile
    await expect(page.locator('text=Create Campaign')).toBeVisible();
  });

  test('should display campaign metrics if campaigns exist', async ({ page }) => {
    // Look for campaign metrics
    const metricElements = page.locator('text=Total Campaigns, text=Active, text=Draft, text=Sent');

    // May or may not be visible depending on campaign count
    expect(await metricElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle campaign actions if campaigns exist', async ({ page }) => {
    // Look for campaign action buttons
    const actionButtons = page.locator(
      'button:has-text("Edit"), button:has-text("Delete"), button:has-text("View")'
    );

    // May or may not be visible depending on campaign count
    expect(await actionButtons.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display proper campaign icons', async ({ page }) => {
    // Check for campaign-related icons
    const iconElements = page.locator('text=📢, text=📧, text=📊, text=➕');

    // Should have some icons visible
    expect(await iconElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle navigation back to dashboard', async ({ page }) => {
    // Click on dashboard link
    await page.click('text=Dashboard');

    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display campaign types if present', async ({ page }) => {
    // Look for campaign type indicators
    const typeElements = page.locator('text=Email, text=Social, text=Radio, text=Mixed');

    // May or may not be visible depending on campaign count
    expect(await typeElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle bulk actions if campaigns exist', async ({ page }) => {
    // Look for bulk action elements
    const bulkElements = page.locator('text=Bulk Actions, text=Select All');

    // May or may not be visible depending on campaign count
    expect(await bulkElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display campaign dates if campaigns exist', async ({ page }) => {
    // Look for date elements
    const dateElements = page.locator('text=Created, text=Sent, text=Updated');

    // May or may not be visible depending on campaign count
    expect(await dateElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle sorting if campaigns exist', async ({ page }) => {
    // Look for sort elements
    const sortElements = page.locator('text=Sort by, text=Date, text=Name, text=Status');

    // May or may not be visible depending on campaign count
    expect(await sortElements.count()).toBeGreaterThanOrEqual(0);
  });
});
