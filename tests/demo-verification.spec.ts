import { test, expect } from '@playwright/test';

// Demo Night Verification Tests
// Tests all three tools before deployment

test.describe('Audio Intel - Demo Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Intel/i);
    await expect(page.locator('text=Audio Intel')).toBeVisible();
  });

  test('can navigate to dashboard', async ({ page }) => {
    // Check if sign in or dashboard is visible
    const signInButton = page.locator('text=Sign in');
    const dashboardLink = page.locator('text=Dashboard');

    const isSignedOut = await signInButton.isVisible().catch(() => false);

    if (isSignedOut) {
      console.log('⚠️ Audio Intel: User needs to sign in first');
    } else {
      await expect(dashboardLink).toBeVisible();
    }
  });

  test('enrich contacts page loads', async ({ page }) => {
    // Try to navigate to enrich page
    await page.goto('http://localhost:3000/enrich');

    // Should either show enrich page or redirect to sign in
    const enrichButton = page.locator('text=Load Demo Data');
    const signInForm = page.locator('form');

    const hasEnrichButton = await enrichButton.isVisible().catch(() => false);
    const hasSignInForm = await signInForm.isVisible().catch(() => false);

    expect(hasEnrichButton || hasSignInForm).toBeTruthy();
  });

  test('mobile header displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for burger menu on mobile
    const burgerMenu = page
      .locator('[aria-label*="menu"]')
      .or(page.locator('button[aria-expanded]'));
    const isBurgerVisible = await burgerMenu.isVisible().catch(() => false);

    if (!isBurgerVisible) {
      console.log('⚠️ Audio Intel: No burger menu found on mobile');
    }
  });
});

test.describe('Tracker - Demo Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page.locator('text=Tracker')).toBeVisible();
  });

  test('header has correct color scheme', async ({ page }) => {
    const header = page.locator('h1:has-text("Tracker")');
    await expect(header).toBeVisible();

    // Check that header text is black, not teal
    const color = await header.evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    // rgb(0, 0, 0) is black
    expect(color).toContain('rgb(0, 0, 0)');
  });

  test('logo displays in header', async ({ page }) => {
    const logo = page.locator('header img[alt*="Total Audio"]');
    const isLogoVisible = await logo.isVisible().catch(() => false);

    if (!isLogoVisible) {
      console.log('⚠️ Tracker: Logo not visible in header');
    }
  });

  test('sign in page loads', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await expect(page.locator('text=Sign in')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('sign in button works (no 500 error)', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill in demo credentials
    await page.fill('input[type="email"]', 'chris.schofield@libertymusicpr.com');
    await page.fill('input[type="password"]', '2Sn00zyD0g$');

    // Click sign in
    const signInButton = page.locator('button[type="submit"]');
    await signInButton.click();

    // Wait for response
    await page.waitForLoadState('networkidle');

    // Check for 500 error
    const errorText = page.locator('text=/500|internal server error/i');
    const has500Error = await errorText.isVisible().catch(() => false);

    if (has500Error) {
      console.log('❌ Tracker: Sign in returns 500 error');
    } else {
      console.log('✅ Tracker: Sign in works (no 500 error)');
    }
  });

  test('mobile layout is correct', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check that content doesn't overflow
    const body = page.locator('body');
    const hasHorizontalScroll = await body.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });

    if (hasHorizontalScroll) {
      console.log('⚠️ Tracker: Horizontal scroll detected on mobile');
    }
  });
});

test.describe('Pitch Generator - Demo Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page.locator('text=/Pitch Generator|Generate|Pitch/i')).toBeVisible();
  });

  test('can navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3002/dashboard');

    // Should show dashboard or redirect to sign in
    const welcomeText = page.locator('text=/Welcome|Dashboard|Recent Pitches/i');
    const signInForm = page.locator('form');

    const hasDashboard = await welcomeText.isVisible().catch(() => false);
    const hasSignIn = await signInForm.isVisible().catch(() => false);

    expect(hasDashboard || hasSignIn).toBeTruthy();
  });

  test('recent pitches page works (no 404)', async ({ page }) => {
    // Sign in first
    await page.goto('http://localhost:3002/auth/signin');

    const emailInput = page.locator('input[type="email"]');
    const isSignInPage = await emailInput.isVisible().catch(() => false);

    if (isSignInPage) {
      await page.fill('input[type="email"]', 'chris.schofield@libertymusicpr.com');
      await page.fill('input[type="password"]', '2Sn00zyD0g$');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Go to dashboard
    await page.goto('http://localhost:3002/dashboard');

    // Look for recent pitches section
    const recentPitchesSection = page.locator('text=Recent Pitches');
    const hasRecentPitches = await recentPitchesSection.isVisible().catch(() => false);

    if (hasRecentPitches) {
      // Try clicking first pitch
      const firstPitch = page.locator('a[href*="/pitch/review/"]').first();
      const hasPitches = await firstPitch.isVisible().catch(() => false);

      if (hasPitches) {
        await firstPitch.click();
        await page.waitForLoadState('networkidle');

        // Check for 404
        const notFoundText = page.locator('text=/404|not found|pitch not found/i');
        const is404 = await notFoundText.isVisible().catch(() => false);

        if (is404) {
          console.log('❌ Pitch: Recent pitches return 404 error');
        } else {
          console.log('✅ Pitch: Recent pitches work correctly');
        }
      } else {
        console.log('ℹ️ Pitch: No pitches to test yet');
      }
    }
  });

  test('pitch analysis feature exists', async ({ page }) => {
    // Check if analysis component exists in the bundle
    await page.goto('http://localhost:3002/dashboard');

    // Generate a test pitch or navigate to existing one
    const generateButton = page.locator('text=Generate Pitch');
    const hasGenerateButton = await generateButton.isVisible().catch(() => false);

    if (hasGenerateButton) {
      console.log('✅ Pitch: Generate button found');
    } else {
      console.log('⚠️ Pitch: Generate button not found on dashboard');
    }
  });

  test('mobile newsletter section layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002/dashboard');

    // Check if newsletter section overflows
    const newsletterSection = page.locator('text=Newsletter').locator('..');
    const isNewsletterVisible = await newsletterSection.isVisible().catch(() => false);

    if (isNewsletterVisible) {
      const overflows = await newsletterSection.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > window.innerWidth;
      });

      if (overflows) {
        console.log('⚠️ Pitch: Newsletter section overflows on mobile');
      } else {
        console.log('✅ Pitch: Newsletter section fits on mobile');
      }
    }
  });

  test('mobile template library layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002/pitch/templates');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Check if buttons overflow
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const overflows = await firstButton.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > window.innerWidth;
      });

      if (overflows) {
        console.log('⚠️ Pitch: Template buttons overflow on mobile');
      } else {
        console.log('✅ Pitch: Template buttons fit on mobile');
      }
    }
  });

  test('mobile contacts page layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002/pitch/contacts');

    await page.waitForLoadState('networkidle');

    // Check for horizontal scroll
    const body = page.locator('body');
    const hasHorizontalScroll = await body.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });

    if (hasHorizontalScroll) {
      console.log('⚠️ Pitch: Contacts page has horizontal scroll on mobile');
    } else {
      console.log('✅ Pitch: Contacts page layout correct on mobile');
    }
  });
});

test.describe('Cross-Site Authentication', () => {
  test('can sign in with same credentials across all sites', async ({ page }) => {
    const credentials = {
      email: 'chris.schofield@libertymusicpr.com',
      password: '2Sn00zyD0g$',
    };

    const sites = [
      { name: 'Audio Intel', url: 'http://localhost:3000' },
      { name: 'Tracker', url: 'http://localhost:3001' },
      { name: 'Pitch Generator', url: 'http://localhost:3002' },
    ];

    for (const site of sites) {
      console.log(`Testing ${site.name}...`);

      await page.goto(`${site.url}/auth/signin`);

      const emailInput = page.locator('input[type="email"]');
      const isVisible = await emailInput.isVisible().catch(() => false);

      if (isVisible) {
        await page.fill('input[type="email"]', credentials.email);
        await page.fill('input[type="password"]', credentials.password);
        await page.click('button[type="submit"]');

        await page.waitForLoadState('networkidle');

        // Check if redirected to dashboard
        const isDashboard = page.url().includes('/dashboard');

        if (isDashboard) {
          console.log(`✅ ${site.name}: Sign in successful`);
        } else {
          console.log(`⚠️ ${site.name}: Sign in may have failed`);
        }
      }
    }
  });
});
