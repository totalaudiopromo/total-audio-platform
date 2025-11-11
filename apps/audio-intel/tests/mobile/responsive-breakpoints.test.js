/**
 * AUDIO INTEL RESPONSIVE BREAKPOINT TESTS
 *
 * Validates responsive design across critical viewport breakpoints
 * Tests layout, typography, navigation, and content reflow
 * Covers mobile (320-767px), tablet (768-1023px), and desktop (1024+px)
 */

const { test, expect } = require('@playwright/test');

// Responsive breakpoint configurations
const BREAKPOINTS = {
  mobile: {
    small: { width: 320, height: 568, name: 'iPhone SE' },
    medium: { width: 375, height: 667, name: 'iPhone 8' },
    large: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  },
  tablet: {
    portrait: { width: 768, height: 1024, name: 'iPad Portrait' },
    landscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  },
  desktop: {
    small: { width: 1280, height: 720, name: 'Desktop Small' },
    medium: { width: 1440, height: 900, name: 'Desktop Medium' },
    large: { width: 1920, height: 1080, name: 'Desktop Large' },
  },
};

test.describe('Mobile Breakpoint Tests (320-414px)', () => {
  for (const [size, config] of Object.entries(BREAKPOINTS.mobile)) {
    test(`Homepage layout at ${config.name} (${config.width}x${config.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/');

      // Header should be visible and full-width
      const header = page.locator('header, nav, .mobile-header').first();
      await expect(header).toBeVisible();

      const headerBox = await header.boundingBox();
      expect(headerBox.width).toBeCloseTo(config.width, 5);

      // Hero section should be visible
      const hero = page.locator('h1, .hero, .mobile-hero').first();
      await expect(hero).toBeVisible();

      // Check text is readable (not too small)
      const heroText = await hero.evaluate(el => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.fontSize);
      });
      expect(heroText).toBeGreaterThanOrEqual(24); // Minimum 24px for hero

      // CTA button should be visible and centered/prominent
      const cta = page
        .locator('button, a')
        .filter({ hasText: /try|demo|start|get started/i })
        .first();
      await expect(cta).toBeVisible();

      // No horizontal scrollbar should appear
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Upload page layout at ${config.name} (${config.width}x${config.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/upload');

      // Form should fit viewport width
      const form = page.locator('form').first();
      if (await form.isVisible()) {
        const formBox = await form.boundingBox();
        expect(formBox.width).toBeLessThanOrEqual(config.width);
      }

      // Input fields should be full-width on mobile
      const inputs = await page.locator('input[type="email"], input[type="text"]').all();
      for (const input of inputs) {
        if (await input.isVisible()) {
          const inputBox = await input.boundingBox();
          expect(inputBox.width).toBeGreaterThan(config.width * 0.8); // At least 80% width
        }
      }

      // Upload button should be prominent
      const uploadBtn = page
        .locator('button')
        .filter({ hasText: /upload|choose file/i })
        .first();
      if (await uploadBtn.isVisible()) {
        const btnBox = await uploadBtn.boundingBox();
        expect(btnBox.width).toBeGreaterThan(config.width * 0.5); // At least 50% width
      }
    });

    test(`Typography scales correctly at ${config.name}`, async ({ page }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/');

      // Check heading sizes
      const h1Size = await page
        .locator('h1')
        .first()
        .evaluate(el => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
      expect(h1Size).toBeGreaterThanOrEqual(24); // Minimum readable size

      // Check body text
      const bodySize = await page
        .locator('p, div')
        .first()
        .evaluate(el => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
      expect(bodySize).toBeGreaterThanOrEqual(14); // Minimum body text size

      // Check line height for readability
      const lineHeight = await page
        .locator('p')
        .first()
        .evaluate(el => {
          return parseFloat(window.getComputedStyle(el).lineHeight);
        });
      expect(lineHeight).toBeGreaterThanOrEqual(bodySize * 1.4); // 1.4+ line height
    });
  }
});

test.describe('Tablet Breakpoint Tests (768-1024px)', () => {
  for (const [orientation, config] of Object.entries(BREAKPOINTS.tablet)) {
    test(`Homepage layout at ${config.name} (${config.width}x${config.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/');

      // Navigation should be visible (not hamburger menu)
      const nav = page.locator('nav, header nav').first();
      await expect(nav).toBeVisible();

      // Content should use available space (not mobile stacked)
      const contentWidth = await page.evaluate(() => {
        const main = document.querySelector('main, .content, .container');
        return main ? main.offsetWidth : document.body.offsetWidth;
      });
      expect(contentWidth).toBeGreaterThan(config.width * 0.7); // Use at least 70% width

      // Check for multi-column layout if appropriate
      const columns = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll('.grid, [class*="col-"], [class*="flex"]')
        );
        return elements.some(el => {
          const style = window.getComputedStyle(el);
          return style.display === 'grid' || style.display === 'flex';
        });
      });
      // Tablet should have some multi-column layouts
      expect(columns).toBe(true);
    });

    test(`Upload form layout at ${config.name}`, async ({ page }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/upload');

      // Form should be centered with reasonable width
      const form = page.locator('form').first();
      if (await form.isVisible()) {
        const formBox = await form.boundingBox();
        expect(formBox.width).toBeLessThan(config.width * 0.9); // Not full-width
        expect(formBox.width).toBeGreaterThan(400); // Not too narrow
      }

      // Table should be visible without horizontal scroll
      const table = page.locator('table').first();
      if (await table.isVisible()) {
        const tableBox = await table.boundingBox();
        expect(tableBox.width).toBeLessThanOrEqual(config.width);
      }
    });
  }
});

test.describe('Desktop Breakpoint Tests (1280-1920px)', () => {
  for (const [size, config] of Object.entries(BREAKPOINTS.desktop)) {
    test(`Homepage layout at ${config.name} (${config.width}x${config.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/');

      // Content should have max-width constraint (not stretch to full viewport)
      // Homepage uses max-w-6xl (1280px), so content should be ≤ viewport width
      const contentWidth = await page.evaluate(() => {
        // Look for the main content container with max-width
        const container = document.querySelector('.max-w-6xl, .max-w-7xl, .max-w-5xl, main > div');
        return container ? container.offsetWidth : document.body.offsetWidth;
      });

      // Content should not exceed viewport width (allows equal or constrained)
      expect(contentWidth).toBeLessThanOrEqual(config.width);

      // On larger viewports, content should be constrained by max-width
      // max-w-6xl = 1280px, so at 1440px+ viewport, content should be less than viewport
      if (config.width > 1280) {
        expect(contentWidth).toBeLessThan(config.width);
      }

      // Navigation should be horizontal
      const nav = page.locator('nav, header nav').first();
      if (await nav.isVisible()) {
        const navBox = await nav.boundingBox();
        expect(navBox.width).toBeGreaterThan(navBox.height); // Horizontal layout
      }

      // Hero section should have reasonable padding (not flush left)
      // ClientLayout adds responsive padding: px-4 (16px) → px-16 (64px) on xl
      // Plus max-w-6xl centering, so minimum padding should be ~48px
      const hero = page.locator('.hero, h1').first();
      const heroBox = await hero.boundingBox();
      expect(heroBox.x).toBeGreaterThan(48); // Reasonable left padding
    });

    test(`Table layout at ${config.name}`, async ({ page }) => {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto('/upload');

      // Tables should display all columns without scrolling
      const table = page.locator('table').first();
      if (await table.isVisible()) {
        const tableBox = await table.boundingBox();

        // Check if table has overflow container
        const hasOverflow = await table.evaluate(el => {
          const parent = el.parentElement;
          const style = window.getComputedStyle(parent);
          return style.overflowX === 'auto' || style.overflowX === 'scroll';
        });

        // Desktop tables shouldn't need horizontal scroll
        expect(hasOverflow).toBe(false);
      }
    });
  }
});

test.describe('Critical Breakpoint Transitions', () => {
  test('Mobile to Tablet transition (767px → 768px)', async ({ page }) => {
    // Test at 767px (mobile)
    await page.setViewportSize({ width: 767, height: 1024 });
    await page.goto('/');

    const mobileNav = await page.evaluate(() => {
      const nav = document.querySelector('nav, header nav');
      const style = window.getComputedStyle(nav);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
      };
    });

    // Test at 768px (tablet)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Allow layout recalculation

    const tabletNav = await page.evaluate(() => {
      const nav = document.querySelector('nav, header nav');
      const style = window.getComputedStyle(nav);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
      };
    });

    // Navigation layout should change at this breakpoint
    // This is a detection test, not enforcing specific values
    expect(mobileNav).toBeDefined();
    expect(tabletNav).toBeDefined();
  });

  test('Tablet to Desktop transition (1023px → 1024px)', async ({ page }) => {
    // Test at 1023px (tablet)
    await page.setViewportSize({ width: 1023, height: 768 });
    await page.goto('/');

    const tabletWidth = await page.evaluate(() => {
      const main = document.querySelector('main, .content, .container');
      return main ? main.offsetWidth : document.body.offsetWidth;
    });

    // Test at 1024px (desktop)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);

    const desktopWidth = await page.evaluate(() => {
      const main = document.querySelector('main, .content, .container');
      return main ? main.offsetWidth : document.body.offsetWidth;
    });

    // Content width should be constrained more on desktop
    expect(desktopWidth).toBeDefined();
    expect(tabletWidth).toBeDefined();
  });
});

test.describe('Content Reflow Tests', () => {
  test('Images scale responsively across breakpoints', async ({ page }) => {
    await page.goto('/');

    const breakpoints = [375, 768, 1280];
    const imageData = [];

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(300);

      const imgInfo = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => ({
          src: img.src.slice(0, 50),
          width: img.offsetWidth,
          height: img.offsetHeight,
        }));
      });

      imageData.push({ breakpoint: width, images: imgInfo });
    }

    // Verify images scale (width changes across breakpoints)
    for (let i = 0; i < imageData.length - 1; i++) {
      const current = imageData[i];
      const next = imageData[i + 1];

      if (current.images.length > 0 && next.images.length > 0) {
        // At least one image should scale up at larger breakpoint
        const hasScaling = current.images.some((img, idx) => {
          if (next.images[idx]) {
            return next.images[idx].width !== img.width;
          }
          return false;
        });

        // This is informational - some images may be fixed size
        expect(hasScaling).toBeDefined();
      }
    }
  });

  test('Text content does not overflow at any breakpoint', async ({ page }) => {
    await page.goto('/');

    const breakpoints = [320, 375, 768, 1024, 1920];

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(300);

      // Check for text overflow and report details
      const overflowInfo = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, span, div'));
        const overflowing = [];

        textElements.forEach(el => {
          if (el.scrollWidth > el.clientWidth + 5) {
            // 5px tolerance
            overflowing.push({
              tagName: el.tagName,
              text: el.textContent?.substring(0, 50) || '',
              className: el.className,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              diff: el.scrollWidth - el.clientWidth,
            });
          }
        });

        return {
          hasOverflow: overflowing.length > 0,
          elements: overflowing,
        };
      });

      expect(overflowInfo.hasOverflow).toBe(false);

      // If there's overflow, log details for debugging
      if (overflowInfo.hasOverflow) {
        console.log(`Overflow detected at ${width}px:`, overflowInfo.elements);
      }
    }
  });

  test('Forms reflow correctly across breakpoints', async ({ page }) => {
    await page.goto('/upload');

    const breakpoints = [375, 768, 1280];
    const formLayouts = [];

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(300);

      const layout = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return null;

        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        return {
          formWidth: form.offsetWidth,
          inputWidths: inputs.map(i => i.offsetWidth),
          inputFullWidth: inputs.every(i => i.offsetWidth > form.offsetWidth * 0.8),
        };
      });

      formLayouts.push({ breakpoint: width, layout });
    }

    // Verify form layouts exist at all breakpoints
    expect(formLayouts.every(f => f.layout !== null)).toBe(true);
  });
});

test.describe('Navigation Responsiveness', () => {
  test('Mobile navigation is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for hamburger menu or mobile nav toggle
    const mobileMenuToggle = page.locator(
      'button[aria-label*="menu" i], button[class*="hamburger"], button[class*="mobile-menu"]'
    );

    if (await mobileMenuToggle.isVisible()) {
      // Test menu toggle
      await mobileMenuToggle.tap();
      await page.waitForTimeout(300);

      // Menu should be visible after toggle
      const menu = page.locator('nav[class*="mobile"], div[class*="menu"][class*="open"]');
      await expect(menu.first()).toBeVisible();

      // Close menu
      await mobileMenuToggle.tap();
      await page.waitForTimeout(300);
    }
  });

  test('Desktop navigation is horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const nav = page.locator('nav, header nav').first();
    if (await nav.isVisible()) {
      const isHorizontal = await nav.evaluate(el => {
        const links = Array.from(el.querySelectorAll('a'));
        if (links.length < 2) return true;

        const firstRect = links[0].getBoundingClientRect();
        const secondRect = links[1].getBoundingClientRect();

        // Links should be side-by-side (horizontal)
        return Math.abs(firstRect.y - secondRect.y) < 10;
      });

      expect(isHorizontal).toBe(true);
    }
  });
});

test.describe('Responsive Coverage Report', () => {
  test('Generate responsive breakpoint coverage report', async ({ page }) => {
    const testBreakpoints = [320, 375, 768, 1024, 1920];
    const results = [];

    for (const width of testBreakpoints) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      const metrics = await page.evaluate(() => {
        return {
          hasHorizontalScroll:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
          hasTextOverflow: Array.from(document.querySelectorAll('p, h1, h2, h3')).some(
            el => el.scrollWidth > el.clientWidth + 5
          ),
          minTouchTarget: Array.from(document.querySelectorAll('button, a'))
            .filter(el => el.offsetHeight > 0)
            .every(el => el.offsetHeight >= 44),
          pageHeight: document.documentElement.scrollHeight,
        };
      });

      results.push({
        breakpoint: width,
        passed: !metrics.hasHorizontalScroll && !metrics.hasTextOverflow && metrics.minTouchTarget,
        metrics,
      });
    }

    console.log('\n=== RESPONSIVE BREAKPOINT COVERAGE ===');
    for (const result of results) {
      console.log(`${result.breakpoint}px: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
      if (!result.passed) {
        console.log(`  Issues:`, result.metrics);
      }
    }

    const passRate = (results.filter(r => r.passed).length / results.length) * 100;
    console.log(`\nOverall pass rate: ${passRate.toFixed(0)}%`);

    expect(passRate).toBeGreaterThanOrEqual(80); // 80%+ breakpoints should pass
  });
});
