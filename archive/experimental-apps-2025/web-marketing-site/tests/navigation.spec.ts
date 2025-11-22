import { test, expect } from '@playwright/test';

test.describe('Navigation and Cross-Page Functionality', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to contacts
    await page.click('text=Contacts');
    await expect(page).toHaveURL(/.*contacts/);

    // Navigate to campaigns
    await page.click('text=Campaigns');
    await expect(page).toHaveURL(/.*campaigns/);

    // Navigate to analytics
    await page.click('text=Reports');
    await expect(page).toHaveURL(/.*analytics/);

    // Navigate to integrations
    await page.click('text=Integrations');
    await expect(page).toHaveURL(/.*integrations/);

    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');

    // Verify navigation menu is present on all pages
    const pages = ['/contacts', '/campaigns', '/analytics', '/integrations'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check that navigation menu is always visible
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Contacts')).toBeVisible();
      await expect(page.locator('text=Campaigns')).toBeVisible();
      await expect(page.locator('text=Reports')).toBeVisible();
      await expect(page.locator('text=Integrations')).toBeVisible();
    }
  });

  test('should handle logo navigation', async ({ page }) => {
    // Start at any page
    await page.goto('/contacts');

    // Click on logo
    await page.click('img[alt="Total Audio Promo Logo"]');

    // Should navigate to home/dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should maintain responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test navigation on mobile
    await page.goto('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    await page.click('text=Contacts');
    await expect(page).toHaveURL(/.*contacts/);
    await expect(page.locator('text=Contacts')).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/dashboard');
    await page.goto('/contacts');
    await page.goto('/campaigns');

    // Test browser back
    await page.goBack();
    await expect(page).toHaveURL(/.*contacts/);

    // Test browser forward
    await page.goForward();
    await expect(page).toHaveURL(/.*campaigns/);
  });

  test('should maintain page state during navigation', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');

    // Navigate away and back
    await page.click('text=Contacts');
    await page.click('text=Dashboard');

    // Dashboard should still be functional
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Contacts')).toBeVisible();
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to each page
    const pages = [
      { path: '/dashboard', title: 'Dashboard' },
      { path: '/contacts', title: 'Contacts' },
      { path: '/campaigns', title: 'Campaigns' },
      { path: '/analytics', title: 'Analytics' },
      { path: '/integrations', title: 'Integrations' },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      await expect(page.locator(`text=${pageInfo.title}`)).toBeVisible();
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page');

    // Should show 404 or redirect to dashboard
    const is404 = await page.locator('text=404, text=Not Found, text=Page not found').isVisible();
    const isDashboard = await page.locator('text=Dashboard').isVisible();

    // Should handle gracefully (either 404 or redirect)
    expect(is404 || isDashboard).toBeTruthy();
  });

  test('should maintain consistent header across pages', async ({ page }) => {
    // Test header consistency across pages
    const pages = ['/dashboard', '/contacts', '/campaigns', '/analytics', '/integrations'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check for consistent header elements
      await expect(page.locator('text=Total Audio Promo')).toBeVisible();
      await expect(page.locator('img[alt="Total Audio Promo Logo"]')).toBeVisible();
    }
  });

  test('should handle quick action navigation', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');

    // Test quick action buttons
    await page.click('text=View Campaigns');
    await expect(page).toHaveURL(/.*campaigns/);

    await page.goto('/dashboard');
    await page.click('text=View Contacts');
    await expect(page).toHaveURL(/.*contacts/);

    await page.goto('/dashboard');
    await page.click('text=Go to Reports');
    await expect(page).toHaveURL(/.*analytics/);
  });

  test('should handle integration detail navigation', async ({ page }) => {
    // Navigate to integrations
    await page.goto('/integrations');

    // Click on an integration card
    const firstIntegrationCard = page.locator('[class*="bg-white"]').first();

    if (await firstIntegrationCard.isVisible()) {
      await firstIntegrationCard.click();

      // Should show integration details
      await expect(page.locator('text=Integration')).toBeVisible();

      // Test back navigation
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
      if (await backButton.isVisible()) {
        await backButton.click();
        await expect(page).toHaveURL(/.*integrations/);
      }
    }
  });

  test('should maintain scroll position appropriately', async ({ page }) => {
    // Navigate to a page with content
    await page.goto('/contacts');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    // Navigate to another page
    await page.click('text=Dashboard');

    // Should be at top of new page
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should handle page refresh gracefully', async ({ page }) => {
    // Navigate to a page
    await page.goto('/campaigns');

    // Refresh the page
    await page.reload();

    // Should still be on the same page
    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator('text=Campaigns')).toBeVisible();
  });
});
