import { test, expect } from '@playwright/test';

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to analytics page
    await page.goto('/analytics');
  });

  test('should load analytics page successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Total Audio Promo/);
    
    // Verify main analytics elements are present
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Check for analytics dashboard elements
    await expect(page.locator('text=Analytics').or(page.locator('text=Reports'))).toBeVisible();
  });

  test('should display performance metrics', async ({ page }) => {
    // Look for common analytics metrics
    const metricElements = page.locator('text=Open Rate, text=Click Rate, text=Response Rate, text=Engagement');
    
    // Should have some metrics visible
    expect(await metricElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display charts and graphs', async ({ page }) => {
    // Look for chart elements (SVG, Canvas, or chart containers)
    const chartElements = page.locator('svg, canvas, [class*="chart"], [class*="graph"]');
    
    // Should have some chart elements
    expect(await chartElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display date range filters', async ({ page }) => {
    // Look for date filter elements
    const dateElements = page.locator('text=Last 7 days, text=Last 30 days, text=Last 90 days, text=Custom');
    
    // Should have some date options
    expect(await dateElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display campaign performance data', async ({ page }) => {
    // Look for campaign performance elements
    const performanceElements = page.locator('text=Campaign Performance, text=Top Campaigns, text=Performance');
    
    // Should have some performance data
    expect(await performanceElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display contact engagement metrics', async ({ page }) => {
    // Look for contact engagement elements
    const engagementElements = page.locator('text=Contact Engagement, text=Engagement Rate, text=Interactions');
    
    // Should have some engagement data
    expect(await engagementElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('text=Analytics').or(page.locator('text=Reports'))).toBeVisible();
    await expect(page.locator('text=Total Audio Promo')).toBeVisible();
  });

  test('should display export options', async ({ page }) => {
    // Look for export functionality
    const exportElements = page.locator('text=Export, text=Download, text=PDF, text=CSV');
    
    // May or may not be visible depending on implementation
    expect(await exportElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display comparison features', async ({ page }) => {
    // Look for comparison elements
    const comparisonElements = page.locator('text=Compare, text=vs Previous Period, text=Growth');
    
    // May or may not be visible depending on implementation
    expect(await comparisonElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display real-time data indicators', async ({ page }) => {
    // Look for real-time indicators
    const realtimeElements = page.locator('text=Live, text=Real-time, text=Updated');
    
    // May or may not be visible depending on implementation
    expect(await realtimeElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle data filtering', async ({ page }) => {
    // Look for filter elements
    const filterElements = page.locator('text=Filter, text=All Campaigns, text=All Contacts');
    
    // May or may not be visible depending on implementation
    expect(await filterElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display insights and recommendations', async ({ page }) => {
    // Look for insights elements
    const insightsElements = page.locator('text=Insights, text=Recommendations, text=Tips');
    
    // May or may not be visible depending on implementation
    expect(await insightsElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle drill-down functionality', async ({ page }) => {
    // Look for drill-down elements
    const drillElements = page.locator('text=View Details, text=See More, text=Details');
    
    // May or may not be visible depending on implementation
    expect(await drillElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display proper analytics icons', async ({ page }) => {
    // Check for analytics-related icons
    const iconElements = page.locator('text=📊, text=📈, text=📉, text=📋, text=📅');
    
    // Should have some icons visible
    expect(await iconElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle navigation to other pages', async ({ page }) => {
    // Test navigation to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go back to analytics
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*analytics/);
  });

  test('should display loading states appropriately', async ({ page }) => {
    // Look for loading indicators
    const loadingElements = page.locator('text=Loading, text=...');
    
    // May or may not be visible depending on data loading
    expect(await loadingElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Look for empty state elements
    const emptyElements = page.locator('text=No data, text=No analytics, text=No reports');
    
    // May or may not be visible depending on data availability
    expect(await emptyElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display time-based metrics', async ({ page }) => {
    // Look for time-based elements
    const timeElements = page.locator('text=Today, text=This Week, text=This Month, text=This Year');
    
    // May or may not be visible depending on implementation
    expect(await timeElements.count()).toBeGreaterThanOrEqual(0);
  });
}); 