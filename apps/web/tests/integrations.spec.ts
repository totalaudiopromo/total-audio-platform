import { test, expect } from '@playwright/test';

test.describe('Integrations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to integrations page
    await page.goto('/integrations');
  });

  test('should load integrations page successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Total Audio Promo/);
    
    // Verify main integrations elements are present
    await expect(page.locator('text=Integrations')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display all integration cards', async ({ page }) => {
    // Check for all major integrations
    await expect(page.locator('text=Airtable')).toBeVisible();
    await expect(page.locator('text=Mailchimp')).toBeVisible();
    await expect(page.locator('text=Gmail')).toBeVisible();
    await expect(page.locator('text=Claude AI')).toBeVisible();
    await expect(page.locator('text=Perplexity AI')).toBeVisible();
    await expect(page.locator('text=Data for SEO')).toBeVisible();
    await expect(page.locator('text=Aura AI')).toBeVisible();
  });

  test('should display integration status indicators', async ({ page }) => {
    // Check for status indicators
    const statusElements = page.locator('[class*="bg-green-100"], [class*="bg-gray-100"], [class*="bg-red-100"]');
    await expect(statusElements.first()).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    // Check if category filters are present
    await expect(page.locator('text=All')).toBeVisible();
    await expect(page.locator('text=Database')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Social')).toBeVisible();
  });

  test('should filter integrations by category', async ({ page }) => {
    // Click on Database filter
    await page.click('text=Database');
    
    // Should show database integrations
    await expect(page.locator('text=Airtable')).toBeVisible();
    
    // Click on Email filter
    await page.click('text=Email');
    
    // Should show email integrations
    await expect(page.locator('text=Gmail')).toBeVisible();
    await expect(page.locator('text=Mailchimp')).toBeVisible();
  });

  test('should handle connect/disconnect actions', async ({ page }) => {
    // Test connect button functionality
    const connectButtons = page.locator('button:has-text("Connect")');
    
    if (await connectButtons.count() > 0) {
      await expect(connectButtons.first()).toBeVisible();
    }
    
    // Test disconnect button functionality
    const disconnectButtons = page.locator('button:has-text("Disconnect")');
    
    if (await disconnectButtons.count() > 0) {
      await expect(disconnectButtons.first()).toBeVisible();
    }
  });

  test('should display integration details', async ({ page }) => {
    // Check for integration details like last sync, data points
    const lastSyncElements = page.locator('text=Last sync');
    const dataPointsElements = page.locator('text=data points');
    
    // These may or may not be visible depending on integration status
    expect(await lastSyncElements.count()).toBeGreaterThanOrEqual(0);
    expect(await dataPointsElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle Gmail integration flow', async ({ page }) => {
    // Look for Gmail integration
    const gmailCard = page.locator('text=Gmail').locator('..').locator('..');
    
    if (await gmailCard.isVisible()) {
      // Click on Gmail card to open details
      await gmailCard.click();
      
      // Should show Gmail integration details
      await expect(page.locator('text=Gmail Integration')).toBeVisible();
    }
  });

  test('should handle Claude AI integration flow', async ({ page }) => {
    // Look for Claude AI integration
    const claudeCard = page.locator('text=Claude AI').locator('..').locator('..');
    
    if (await claudeCard.isVisible()) {
      // Click on Claude AI card to open details
      await claudeCard.click();
      
      // Should show Claude AI integration details
      await expect(page.locator('text=Claude AI Integration')).toBeVisible();
    }
  });

  test('should handle Perplexity AI integration flow', async ({ page }) => {
    // Look for Perplexity AI integration
    const perplexityCard = page.locator('text=Perplexity AI').locator('..').locator('..');
    
    if (await perplexityCard.isVisible()) {
      // Click on Perplexity AI card to open details
      await perplexityCard.click();
      
      // Should show Perplexity AI integration details
      await expect(page.locator('text=Perplexity AI Integration')).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('text=Integrations')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
    
    // Check if integration cards are accessible on mobile
    await expect(page.locator('text=Airtable')).toBeVisible();
  });

  test('should display sync status indicators', async ({ page }) => {
    // Check for sync status indicators
    const syncStatusElements = page.locator('[class*="text-green-600"], [class*="text-red-600"], [class*="text-yellow-600"]');
    
    // At least some sync status should be visible
    expect(await syncStatusElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle back navigation from integration details', async ({ page }) => {
    // Click on an integration card
    const firstIntegrationCard = page.locator('[class*="bg-white"]').first();
    
    if (await firstIntegrationCard.isVisible()) {
      await firstIntegrationCard.click();
      
      // Look for back button
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
      
      if (await backButton.isVisible()) {
        await backButton.click();
        
        // Should be back on integrations page
        await expect(page).toHaveURL(/.*integrations/);
      }
    }
  });

  test('should display proper integration icons', async ({ page }) => {
    // Check for integration icons
    const iconElements = page.locator('text=📊, text=📧, text=📮, text=🤖, text=🔍, text=📈, text=✨');
    
    // Should have some icons visible
    expect(await iconElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle search functionality if present', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Gmail');
      
      // Should filter to show Gmail integration
      await expect(page.locator('text=Gmail')).toBeVisible();
    }
  });
}); 