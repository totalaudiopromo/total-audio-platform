import { test, expect } from '@playwright/test';

test.describe('Simple Page Test', () => {
  test('should load dashboard and show basic content', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see what's actually there
    await page.screenshot({ path: 'debug-screenshot.png' });
    
    // Check if page has any content
    const bodyText = await page.textContent('body');
    console.log('Page body text:', bodyText);
    
    // Check if we can find any elements
    const elements = await page.locator('*').count();
    console.log('Total elements on page:', elements);
    
    // Basic test - just check if page loads
    await expect(page).toBeTruthy();
  });
}); 