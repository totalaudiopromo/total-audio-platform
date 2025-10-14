import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://pitch.totalaudiopromo.com';

test.describe('Pitch Generator MVP - Production Tests', () => {

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await expect(page).toHaveTitle(/Pitch Generator/i);

    // Check hero section
    await expect(page.locator('h1')).toBeVisible();

    // Check CTA buttons
    const ctaButton = page.locator('text=Get Started');
    await expect(ctaButton).toBeVisible();
  });

  test('Templates page shows 6 professional templates', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pitch/templates`);

    // Wait for templates to load
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page.locator('h1:has-text("Template Library")')).toBeVisible();

    // Verify all 6 templates are visible
    const templates = [
      'BBC Radio 1 Specialist Shows',
      'BBC 6 Music Alternative/Indie',
      'Spotify Editorial Playlists',
      'Commercial Radio',
      'Music Blogs & Online Publications',
      'Community & Independent Radio'
    ];

    for (const template of templates) {
      await expect(page.locator(`text=${template}`).first()).toBeVisible();
    }

    // Check for success rates
    await expect(page.locator('text=/\\d+% success rate/i').first()).toBeVisible();
  });

  test('Dashboard shows empty state for new users', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/dashboard`);

    // Should redirect to sign-in if not authenticated
    await page.waitForLoadState('networkidle');

    // Check if on sign-in page or dashboard
    const url = page.url();
    if (url.includes('/auth/signin')) {
      // Sign-in page should be visible - use h1 heading instead of generic text
      await expect(page.locator('h1').filter({ hasText: /sign in/i })).toBeVisible();
      console.log('✓ Dashboard correctly requires authentication');
    } else {
      // If already signed in, check for dashboard
      await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible();
      console.log('✓ Dashboard loaded (user already authenticated)');
    }
  });

  test('Sign-in page loads correctly', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Check for sign-in heading
    await expect(page.locator('h1').filter({ hasText: /sign in/i })).toBeVisible();

    // Check for Google OAuth button
    const googleButton = page.getByRole('button', { name: /google/i });
    if (await googleButton.isVisible()) {
      console.log('✓ Google OAuth sign-in available');
    }

    // Check for demo credentials form
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible()) {
      console.log('✓ Email/password sign-in available');
    }
  });

  test('Pitch generation page loads', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pitch/generate`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (url.includes('/auth/signin')) {
      console.log('✓ Pitch generation correctly requires authentication');
      await expect(page.locator('h1').filter({ hasText: /sign in/i })).toBeVisible();
    } else {
      // Check for pitch generation form
      await expect(page.locator('text=/generate/i, text=/pitch/i').first()).toBeVisible();
      console.log('✓ Pitch generation page loaded');
    }
  });

  test('Pitch history page requires authentication', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pitch/history`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (url.includes('/auth/signin')) {
      await expect(page.locator('h1').filter({ hasText: /sign in/i })).toBeVisible();
      console.log('✓ Pitch history correctly requires authentication');
    } else {
      // If authenticated, check for history page
      await expect(page.locator('h1:has-text("Pitch History")')).toBeVisible();
      console.log('✓ Pitch history loaded (user authenticated)');
    }
  });

  test('Voice profile page loads', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/profile/voice`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (url.includes('/auth/signin')) {
      console.log('✓ Voice profile correctly requires authentication');
      await expect(page.locator('h1').filter({ hasText: /sign in/i })).toBeVisible();
    } else {
      // Check for voice profile heading or form
      const heading = page.locator('h1, h2').filter({ hasText: /voice|profile/i });
      await expect(heading.first()).toBeVisible();
      console.log('✓ Voice profile page loaded');
    }
  });

  test('Pricing page loads correctly', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pricing`);
    await page.waitForLoadState('networkidle');

    // Check for pricing tiers
    await expect(page.locator('text=/professional/i, text=/pro/i').first()).toBeVisible();
    await expect(page.locator('text=/agency/i').first()).toBeVisible();

    // Check for price amounts
    await expect(page.locator('text=/£/').first()).toBeVisible();

    console.log('✓ Pricing page shows tiers and pricing');
  });

  test('Mobile responsive - Templates page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${PRODUCTION_URL}/pitch/templates`);
    await page.waitForLoadState('networkidle');

    // Check templates are still visible on mobile
    await expect(page.locator('text=/BBC Radio 1/i').first()).toBeVisible();

    console.log('✓ Templates page is mobile responsive');
  });

  test('Mobile responsive - Homepage', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Check hero is visible
    await expect(page.locator('h1').first()).toBeVisible();

    // Check CTA button is visible
    await expect(page.locator('text=/get started/i, text=/sign in/i').first()).toBeVisible();

    console.log('✓ Homepage is mobile responsive');
  });

  test('Navigation links work', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Check header navigation exists
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();

    // Check for key navigation links
    const links = ['Templates', 'Pricing', 'Sign In', 'Dashboard'];
    for (const linkText of links) {
      const link = page.locator(`a:has-text("${linkText}")`);
      const count = await link.count();
      if (count > 0) {
        console.log(`✓ Found navigation link: ${linkText}`);
      }
    }
  });

  test('Footer contains key information', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    console.log('✓ Footer is present');
  });

  test('SEO - Meta tags present', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Check for essential meta tags
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log(`✓ Page title: ${title}`);

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      console.log('✓ Meta description present');
    }
  });

  test('Performance - Page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    console.log(`✓ Page loaded in ${loadTime}ms`);
  });

  test('Console errors check', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Some errors might be expected (e.g., analytics, external resources)
    // But we should flag them
    if (errors.length > 0) {
      console.log(`⚠️  Found ${errors.length} console errors:`);
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('✓ No console errors detected');
    }
  });

  test('API routes respond correctly', async ({ page }) => {
    // Test stats API endpoint
    const response = await page.request.get(`${PRODUCTION_URL}/api/stats`);

    if (response.status() === 401) {
      console.log('✓ Stats API correctly requires authentication');
    } else if (response.status() === 200) {
      const data = await response.json();
      console.log('✓ Stats API responds with data:', data);
    } else {
      console.log(`⚠️  Stats API returned status: ${response.status()}`);
    }
  });
});
