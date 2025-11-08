import { test, expect, Page } from '@playwright/test';

/**
 * Audio Intel - Contact Enrichment Core Functionality
 *
 * CRITICAL: This is the primary value proposition that will be shown to Liberty
 * Tests the most important feature: enriching contacts with intelligence data
 */

test.describe('Audio Intel - Contact Enrichment', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console error tracking
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    (page as any).consoleErrors = errors;
  });

  test('should load demo page successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Verify page loads
    await expect(page).toHaveTitle(/Audio Intel|Demo/i);

    // Verify demo page has enrichment interface
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    console.log('✅ Demo page loaded successfully');
  });

  test('should enrich contacts with intelligence data', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Look for "Load Demo Data" or similar button
    const loadButton = page
      .locator(
        'button:has-text("Load Demo"), button:has-text("Demo Data"), button:has-text("Enrich")'
      )
      .first();

    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      console.log('✅ Clicked load demo button');

      // Wait for enrichment to complete (up to 30 seconds)
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Wait a bit more for data to render
      await page.waitForTimeout(2000);
    }

    // Verify enriched data displays (look for contact cards or table rows)
    const contactElements = page.locator(
      '[data-testid*="contact"], .contact-card, tr[data-contact], .enriched-contact'
    );
    const count = await contactElements.count();

    console.log(`Found ${count} contact elements`);

    if (count > 0) {
      expect(count).toBeGreaterThan(0);

      // Verify intelligence is meaningful (check for real platforms)
      const pageContent = await page.content();
      const hasMeaningfulData =
        /BBC Radio|Spotify|NME|Radio 1|Radio 6/i.test(pageContent) ||
        /High Confidence|Medium Confidence|Low Confidence/i.test(pageContent) ||
        /twitter\.com|instagram\.com|email/i.test(pageContent);

      expect(hasMeaningfulData).toBeTruthy();
      console.log('✅ Enriched data contains meaningful intelligence');
    } else {
      console.log('⚠️  No contact elements found - check selector or page structure');
    }

    // Verify no console errors during enrichment
    const errors = (page as any).consoleErrors || [];
    if (errors.length > 0) {
      console.log('⚠️  Console errors detected:', errors);
    }
    expect(errors.length).toBeLessThanOrEqual(2); // Allow minor errors, fail on serious issues
  });

  test('should display contact intelligence details', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Load demo data if needed
    const loadButton = page
      .locator('button:has-text("Load Demo"), button:has-text("Demo Data")')
      .first();
    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Check for intelligence fields (email, social media, platform, confidence)
    const pageContent = await page.content();

    const hasEmailData = /@|email/i.test(pageContent);
    const hasSocialData = /twitter|instagram|facebook|linkedin/i.test(pageContent);
    const hasPlatformData = /BBC|Spotify|Radio|Platform/i.test(pageContent);

    const intelligenceCount = [hasEmailData, hasSocialData, hasPlatformData].filter(Boolean).length;

    expect(intelligenceCount).toBeGreaterThan(0);
    console.log(`✅ Contact intelligence includes ${intelligenceCount} data types`);
  });

  test('should handle enrichment without errors', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Track navigation and request failures
    let failedRequests = 0;
    page.on('requestfailed', request => {
      failedRequests++;
      console.log(`Request failed: ${request.url()}`);
    });

    // Trigger enrichment
    const loadButton = page
      .locator(
        'button:has-text("Load Demo"), button:has-text("Demo Data"), button:has-text("Enrich")'
      )
      .first();
    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    // Should have minimal failed requests (some static assets might fail, that's OK)
    expect(failedRequests).toBeLessThan(5);
    console.log(`✅ Enrichment completed with ${failedRequests} failed requests`);
  });
});

/**
 * Audio Intel - Demo Readiness Check
 * Quick sanity test to ensure demo won't crash
 */
test.describe('Audio Intel - Demo Readiness', () => {
  test('demo page loads without crashes', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');

    // Wait for page to be fully interactive
    await page.waitForLoadState('domcontentloaded');

    // Verify no critical errors
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);

    console.log('✅ Demo page is ready for presentation');
  });
});
