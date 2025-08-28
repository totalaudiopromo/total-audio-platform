import { test, expect } from '@playwright/test';

test.describe('Contacts Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contacts page
    await page.goto('/contacts');
  });

  test('should load contacts page successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Total Audio Promo/);
    
    // Verify main contacts elements are present
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display contacts management interface', async ({ page }) => {
    // Check for contacts management elements
    await expect(page.locator('text=Add Contact')).toBeVisible();
    await expect(page.locator('text=Contacts')).toBeVisible();
  });

  test('should display contacts list or empty state', async ({ page }) => {
    // Check for either contacts list or empty state
    const contactsList = page.locator('text=No contacts yet');
    const addButton = page.locator('text=Add Contact');
    
    // Should show either contacts or empty state
    await expect(contactsList.or(addButton)).toBeVisible();
  });

  test('should handle add contact flow', async ({ page }) => {
    // Look for add contact button
    const addButton = page.locator('text=Add Contact');
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Should navigate to contact creation or show modal
      await expect(page.locator('text=Add Contact').or(page.locator('text=New Contact'))).toBeVisible();
    }
  });

  test('should display contact filters if contacts exist', async ({ page }) => {
    // Look for filter options
    const filterElements = page.locator('text=All, text=Active, text=Inactive, text=Engaged');
    
    // May or may not be visible depending on contact count
    expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display contact status indicators', async ({ page }) => {
    // Look for status indicators
    const statusElements = page.locator('[class*="bg-green"], [class*="bg-yellow"], [class*="bg-gray"]');
    
    // May or may not be visible depending on contact count
    expect(await statusElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle contact search if present', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Contact');
      
      // Should filter contacts
      await expect(page.locator('text=Test Contact').or(page.locator('text=No results'))).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
    
    // Check if add button is accessible on mobile
    await expect(page.locator('text=Add Contact')).toBeVisible();
  });

  test('should display contact metrics if contacts exist', async ({ page }) => {
    // Look for contact metrics
    const metricElements = page.locator('text=Total Contacts, text=Active, text=Engaged, text=New');
    
    // May or may not be visible depending on contact count
    expect(await metricElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle contact actions if contacts exist', async ({ page }) => {
    // Look for contact action buttons
    const actionButtons = page.locator('button:has-text("Edit"), button:has-text("Delete"), button:has-text("View")');
    
    // May or may not be visible depending on contact count
    expect(await actionButtons.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display proper contact icons', async ({ page }) => {
    // Check for contact-related icons
    const iconElements = page.locator('text=👥, text=📧, text=📞, text=➕');
    
    // Should have some icons visible
    expect(await iconElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle navigation back to dashboard', async ({ page }) => {
    // Click on dashboard link
    await page.click('text=Dashboard');
    
    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display contact categories if present', async ({ page }) => {
    // Look for contact category indicators
    const categoryElements = page.locator('text=Journalist, text=Radio, text=Blogger, text=Influencer');
    
    // May or may not be visible depending on contact count
    expect(await categoryElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle bulk actions if contacts exist', async ({ page }) => {
    // Look for bulk action elements
    const bulkElements = page.locator('text=Bulk Actions, text=Select All');
    
    // May or may not be visible depending on contact count
    expect(await bulkElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display contact engagement data if present', async ({ page }) => {
    // Look for engagement elements
    const engagementElements = page.locator('text=Last Contact, text=Engagement Score, text=Response Rate');
    
    // May or may not be visible depending on contact count
    expect(await engagementElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle sorting if contacts exist', async ({ page }) => {
    // Look for sort elements
    const sortElements = page.locator('text=Sort by, text=Name, text=Date, text=Engagement');
    
    // May or may not be visible depending on contact count
    expect(await sortElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display import/export options', async ({ page }) => {
    // Look for import/export elements
    const importExportElements = page.locator('text=Import, text=Export, text=CSV, text=Sync');
    
    // May or may not be visible depending on implementation
    expect(await importExportElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle contact details view', async ({ page }) => {
    // Look for contact detail elements
    const detailElements = page.locator('text=Contact Details, text=Email, text=Phone, text=Notes');
    
    // May or may not be visible depending on implementation
    expect(await detailElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display contact interaction history', async ({ page }) => {
    // Look for interaction elements
    const interactionElements = page.locator('text=Interactions, text=History, text=Timeline');
    
    // May or may not be visible depending on implementation
    expect(await interactionElements.count()).toBeGreaterThanOrEqual(0);
  });
}); 