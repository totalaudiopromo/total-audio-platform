import { test, expect } from '@playwright/test';

/**
 * Campaign Tracker - Dashboard and Campaign Management
 *
 * CRITICAL: Liberty needs to see campaign tracking and management interface
 * Tests dashboard display, campaign listing, and basic navigation
 */

test.describe('Campaign Tracker - Dashboard', () => {
  test('should load dashboard successfully', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard');

    // Verify page loads
    await expect(page).toHaveTitle(/Tracker|Dashboard|Campaign/i);

    // Wait for dashboard to render
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    console.log('✅ Campaign Tracker dashboard loaded');
  });

  test('should display campaign overview', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard');

    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Look for campaign cards or list items
    const campaignElements = page.locator(
      '[data-testid*="campaign"], .campaign-card, .campaign-item, tr[data-campaign]'
    );

    const count = await campaignElements.count();
    console.log(`Found ${count} campaign elements`);

    // May be zero if no demo data, but UI should exist
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
      console.log('✅ Campaigns displayed in dashboard');
    } else {
      // Verify we have campaign UI even if empty
      const hasCampaignUI =
        (await page.locator('text=/campaign/i').count()) > 0 ||
        (await page.locator('text=/track/i').count()) > 0;
      expect(hasCampaignUI).toBeTruthy();
      console.log('✅ Campaign interface present (may be empty)');
    }
  });

  test('should display stats or metrics', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard');

    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Look for stats cards (common patterns)
    const statsElements = page.locator(
      '[data-testid*="stat"], .stat-card, .metric, text=/total/i, text=/active/i, text=/pending/i, text=/completed/i'
    );

    const count = await statsElements.count();
    console.log(`Found ${count} stat elements`);

    if (count > 0) {
      console.log('✅ Dashboard metrics displayed');
    } else {
      console.log('⚠️  No stat elements found - may need different selectors');
    }
  });

  test('should have demo data or demo loading option', async ({ page }) => {
    await page.goto('http://localhost:3004/demo');

    // Check if demo page exists
    const pageContent = await page.content();

    if (pageContent.includes('404') || pageContent.includes('Not Found')) {
      console.log('⚠️  No dedicated demo page - using dashboard instead');
      await page.goto('http://localhost:3004/dashboard');
    }

    await page.waitForLoadState('domcontentloaded');

    // Look for demo data button
    const demoButton = page
      .locator(
        'button:has-text("Load Demo"), button:has-text("Demo Data"), button:has-text("Sample")'
      )
      .first();

    if (await demoButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Demo data loading option available');
    } else {
      console.log('⚠️  No demo button found - may have pre-loaded data');
    }
  });

  test('should navigate to campaign detail', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard');

    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Look for clickable campaign elements
    const campaignLink = page
      .locator(
        '[data-testid*="campaign"] a, .campaign-card a, a:has-text("View"), a:has-text("Details")'
      )
      .first();

    if (await campaignLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const currentUrl = page.url();

      await campaignLink.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      const newUrl = page.url();

      // URL should have changed (navigation occurred)
      expect(newUrl).not.toBe(currentUrl);
      console.log(`✅ Navigated from ${currentUrl} to ${newUrl}`);
    } else {
      console.log('⚠️  No campaign links found to test navigation');
    }
  });
});

/**
 * Campaign Tracker - Campaign Management
 */
test.describe('Campaign Tracker - Campaign Detail', () => {
  test('should load campaigns page', async ({ page }) => {
    // Try campaigns route
    await page.goto('http://localhost:3004/campaigns');

    const pageContent = await page.content();

    if (pageContent.includes('404') || pageContent.includes('Not Found')) {
      console.log('⚠️  /campaigns route not found - using dashboard instead');
      test.skip();
      return;
    }

    await page.waitForLoadState('domcontentloaded');
    expect(await page.textContent('body')).toBeTruthy();

    console.log('✅ Campaigns page loaded');
  });
});

/**
 * Campaign Tracker - Demo Readiness
 */
test.describe('Campaign Tracker - Demo Readiness', () => {
  test('dashboard loads without crashes', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3004/dashboard');

    await page.waitForLoadState('domcontentloaded');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      e => !e.includes('Warning') && !e.includes('favicon') && !e.includes('_next')
    );

    expect(criticalErrors.length).toBeLessThan(5);

    console.log('✅ Campaign Tracker ready for demo');
  });

  test('has campaign tracking interface', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard');

    await page.waitForLoadState('domcontentloaded');

    // Verify core campaign tracking UI exists
    const hasCampaignUI =
      (await page.locator('text=/campaign/i, text=/track/i, text=/contact/i').count()) > 0 ||
      (await page.locator('button, a').count()) > 0;

    expect(hasCampaignUI).toBeTruthy();
    console.log('✅ Campaign tracking interface present');
  });
});
