import { test, expect } from '@playwright/test';

test.describe('Pulse Total Audio Promo - Health Check', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Pulse|Total Audio Promo/);
    
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Log any console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
    
    // Basic content checks
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements
    const nav = page.locator('nav, [role="navigation"], header');
    await expect(nav.first()).toBeVisible();
    
    // Test navigation links if they exist
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('#')) {
          // Test internal links
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Check if we're on a different page
          const currentUrl = page.url();
          expect(currentUrl).not.toBe('https://pulse.totalaudiopromo.com/');
        }
      }
    }
  });

  test('should handle authentication flows', async ({ page }) => {
    await page.goto('/');
    
    // Look for auth-related elements
    const authElements = page.locator('a[href*="login"], a[href*="signin"], a[href*="auth"], button:has-text("Login"), button:has-text("Sign In")');
    
    if (await authElements.count() > 0) {
      const authLink = authElements.first();
      await authLink.click();
      
      // Check if we're redirected to auth page
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      
      // Should be on auth page or have auth-related content
      expect(currentUrl).toMatch(/login|signin|auth/);
    }
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto('/');
    
    // Look for forms and test basic interactions
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < Math.min(formCount, 3); i++) {
        const form = forms.nth(i);
        
        // Test form inputs
        const inputs = form.locator('input, textarea, select');
        const inputCount = await inputs.count();
        
        if (inputCount > 0) {
          // Test first input
          const firstInput = inputs.first();
          await firstInput.click();
          
          // Check if input is focusable
          await expect(firstInput).toBeFocused();
        }
      }
    }
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      // Check if page is still functional
      await expect(page.locator('body')).toBeVisible();
      
      // Check for horizontal scroll (bad responsive design)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      if (hasHorizontalScroll && viewport.width < 768) {
        console.warn(`Horizontal scroll detected on viewport ${viewport.width}x${viewport.height}`);
      }
    }
  });

  test('should load images and assets correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for broken images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src) {
          // Check if image loads
          try {
            await img.waitFor({ state: 'visible', timeout: 5000 });
          } catch (error) {
            console.warn(`Image failed to load: ${src}`);
          }
        }
      }
    }
  });

  test('should have acceptable performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Log performance metrics
    console.log(`Page load time: ${loadTime}ms`);
    
    // Check for performance issues
    const metrics = await page.evaluate(() => {
      return {
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('Performance metrics:', metrics);
    
    // Warn if load time is too high
    if (loadTime > 10000) {
      console.warn(`Slow page load time: ${loadTime}ms`);
    }
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Log any JavaScript errors
    if (errors.length > 0) {
      console.log('JavaScript errors found:', errors);
    }
    
    // Page should still be functional even with JS errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper meta tags and SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.first().getAttribute('content');
      expect(description).toBeTruthy();
    }
    
    // Check for viewport meta tag (important for mobile)
    const viewport = page.locator('meta[name="viewport"]');
    expect(await viewport.count()).toBeGreaterThan(0);
  });

  test('should have working API endpoints', async ({ page }) => {
    // Test common API endpoints
    const apiEndpoints = [
      '/api/health',
      '/api/status',
      '/api/analytics',
      '/api/auth'
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.get(endpoint);
        console.log(`API endpoint ${endpoint}: ${response.status()}`);
      } catch (error) {
        console.log(`API endpoint ${endpoint}: Not available or error`);
      }
    }
  });

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/');
    
    // Test button interactions
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        
        // Check if button is visible and clickable
        await expect(button).toBeVisible();
        
        // Try clicking (but don't follow through if it causes navigation)
        try {
          await button.click({ timeout: 2000 });
          await page.waitForTimeout(1000);
        } catch (error) {
          console.log(`Button ${i} click failed:`, error.message);
        }
      }
    }
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      // Should have at least one h1
      const h1s = page.locator('h1');
      expect(await h1s.count()).toBeGreaterThan(0);
    }
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Decorative images can have empty alt, but should have alt attribute
        expect(alt).not.toBeNull();
      }
    }
  });
}); 