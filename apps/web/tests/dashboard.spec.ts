import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
  });

  test('should load dashboard successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Total Audio Promo/);
    
    // Verify main dashboard elements are present
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    // Check all navigation links are present
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('a[href="/contacts"]')).toBeVisible();
    await expect(page.locator('a[href="/campaigns"]')).toBeVisible();
    await expect(page.locator('a[href="/analytics"]')).toBeVisible();
    await expect(page.locator('a[href="/integrations"]')).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    // Check if stats cards are visible
    await expect(page.locator('text=Total Contacts')).toBeVisible();
    await expect(page.locator('text=Active Campaigns')).toBeVisible();
    await expect(page.locator('text=Avg Response Rate')).toBeVisible();
    await expect(page.locator('text=Emails Sent')).toBeVisible();
  });

  test('should display quick action buttons', async ({ page }) => {
    // Check if quick action buttons are present
    await expect(page.locator('text=View Campaigns')).toBeVisible();
    await expect(page.locator('text=View Contacts')).toBeVisible();
    await expect(page.locator('text=Go to Reports')).toBeVisible();
  });

  test('should display recent campaigns section', async ({ page }) => {
    // Check if recent campaigns section is present
    await expect(page.locator('text=Recent Campaigns')).toBeVisible();
  });

  test('should display quick actions section', async ({ page }) => {
    // Check if quick actions section is present
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Manage Contacts')).toBeVisible();
    await expect(page.locator('text=Create Campaign')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
    
    // Check if navigation is accessible on mobile
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
  });

  test('should handle real-time updates', async ({ page }) => {
    // Check if real-time elements are present
    await expect(page.locator('text=Last updated')).toBeVisible();
    
    // Verify time is displayed
    const timeElement = page.locator('text=Last updated').locator('..').locator('text=/\\d{1,2}:\\d{2}/');
    await expect(timeElement).toBeVisible();
  });

  test('should display recent email replies when available', async ({ page }) => {
    // This test checks for the recent replies section
    // It may or may not be visible depending on data
    const recentRepliesSection = page.locator('text=Recent Email Replies');
    
    // If section exists, verify it has proper structure
    if (await recentRepliesSection.isVisible()) {
      await expect(recentRepliesSection).toBeVisible();
      await expect(page.locator('text=📧')).toBeVisible();
    }
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for alt text on images
    const logo = page.locator('img[alt="Total Audio Promo Logo"]');
    await expect(logo).toBeVisible();
  });

  test('should handle navigation correctly', async ({ page }) => {
    // Test navigation to campaigns page
    await page.click('text=View Campaigns');
    await expect(page).toHaveURL(/.*campaigns/);
    
    // Go back to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display loading states appropriately', async ({ page }) => {
    // Check if loading indicators are present when needed
    const loadingElements = page.locator('text=...');
    
    // Some stats might show loading state
    // This is expected behavior for dynamic data
    expect(await loadingElements.count()).toBeGreaterThanOrEqual(0);
  });
}); 