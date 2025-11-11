import type { Page, Locator } from '@playwright/test';

export interface Breakpoint {
  name: string;
  width: number;
  height: number;
}

export const commonBreakpoints: Breakpoint[] = [
  { name: 'mobile-small', width: 320, height: 568 }, // iPhone SE
  { name: 'mobile', width: 390, height: 844 }, // iPhone 13
  { name: 'mobile-large', width: 428, height: 926 }, // iPhone 13 Pro Max
  { name: 'tablet', width: 768, height: 1024 }, // iPad
  { name: 'tablet-large', width: 1024, height: 1366 }, // iPad Pro
  { name: 'desktop', width: 1280, height: 720 }, // Desktop
  { name: 'desktop-large', width: 1920, height: 1080 }, // Desktop HD
];

export interface ResponsiveValidationResult {
  breakpoint: string;
  passed: boolean;
  viewport: { width: number; height: number };
  issues: string[];
}

/**
 * Validates an element fits within the viewport at a specific breakpoint
 * @param element - Element to validate
 * @param viewport - Viewport dimensions
 * @returns Whether element fits viewport
 */
export async function validateViewportFit(
  element: Locator,
  viewport: { width: number; height: number }
): Promise<{
  passed: boolean;
  elementWidth: number;
  elementHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  issues: string[];
}> {
  const box = await element.boundingBox();

  if (!box) {
    return {
      passed: false,
      elementWidth: 0,
      elementHeight: 0,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      issues: ['Element not visible or has no bounding box'],
    };
  }

  const issues: string[] = [];

  if (box.width > viewport.width) {
    issues.push(`Element width ${box.width}px exceeds viewport width ${viewport.width}px`);
  }

  if (box.x + box.width > viewport.width) {
    issues.push(`Element extends beyond right edge of viewport`);
  }

  if (box.x < 0) {
    issues.push(`Element extends beyond left edge of viewport`);
  }

  return {
    passed: issues.length === 0,
    elementWidth: Math.round(box.width),
    elementHeight: Math.round(box.height),
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    issues,
  };
}

/**
 * Validates horizontal scrolling behaviour
 * @param element - Element to check for horizontal scroll
 * @returns Whether element has unintended horizontal scroll
 */
export async function validateHorizontalScroll(element: Locator): Promise<{
  passed: boolean;
  scrollWidth: number;
  clientWidth: number;
  hasScroll: boolean;
}> {
  const scrollInfo = await element.evaluate(el => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    hasScroll: el.scrollWidth > el.clientWidth,
  }));

  return {
    passed: !scrollInfo.hasScroll,
    scrollWidth: scrollInfo.scrollWidth,
    clientWidth: scrollInfo.clientWidth,
    hasScroll: scrollInfo.hasScroll,
  };
}

/**
 * Validates page responsiveness across multiple breakpoints
 * @param page - Playwright Page object
 * @param breakpoints - Array of breakpoints to test (default: common breakpoints)
 * @param criticalSelector - Optional selector for critical element that must be visible
 * @returns Array of validation results for each breakpoint
 */
export async function validateBreakpoints(
  page: Page,
  breakpoints: Breakpoint[] = commonBreakpoints,
  criticalSelector?: string
): Promise<ResponsiveValidationResult[]> {
  const results: ResponsiveValidationResult[] = [];

  for (const breakpoint of breakpoints) {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height,
    });

    // Wait for any layout shifts to settle
    await page.waitForTimeout(500);

    const issues: string[] = [];

    // Check for horizontal scroll on body
    const bodyScrollCheck = await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth,
      hasHorizontalScroll: document.body.scrollWidth > document.body.clientWidth,
    }));

    if (bodyScrollCheck.hasHorizontalScroll) {
      issues.push(
        `Page has horizontal scroll: ${bodyScrollCheck.scrollWidth}px > ${bodyScrollCheck.clientWidth}px`
      );
    }

    // Check critical element if provided
    if (criticalSelector) {
      const criticalElement = page.locator(criticalSelector).first();
      const isVisible = await criticalElement.isVisible().catch(() => false);

      if (!isVisible) {
        issues.push(`Critical element "${criticalSelector}" not visible at this breakpoint`);
      } else {
        const fitResult = await validateViewportFit(criticalElement, breakpoint);
        issues.push(...fitResult.issues);
      }
    }

    results.push({
      breakpoint: breakpoint.name,
      passed: issues.length === 0,
      viewport: { width: breakpoint.width, height: breakpoint.height },
      issues,
    });
  }

  return results;
}

/**
 * Validates element visibility across breakpoints
 * @param page - Playwright Page object
 * @param selector - CSS selector for element to check
 * @param breakpoints - Breakpoints to test
 * @returns Map of breakpoint names to visibility status
 */
export async function validateElementVisibilityAcrossBreakpoints(
  page: Page,
  selector: string,
  breakpoints: Breakpoint[] = commonBreakpoints
): Promise<
  Array<{
    breakpoint: string;
    visible: boolean;
    viewport: { width: number; height: number };
  }>
> {
  const results: Array<{
    breakpoint: string;
    visible: boolean;
    viewport: { width: number; height: number };
  }> = [];

  for (const breakpoint of breakpoints) {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height,
    });

    await page.waitForTimeout(300);

    const element = page.locator(selector).first();
    const visible = await element.isVisible().catch(() => false);

    results.push({
      breakpoint: breakpoint.name,
      visible,
      viewport: { width: breakpoint.width, height: breakpoint.height },
    });
  }

  return results;
}

/**
 * Validates mobile-specific layout patterns
 * @param page - Playwright Page object
 * @returns Validation results for mobile layout
 */
export async function validateMobileLayout(page: Page): Promise<{
  passed: boolean;
  issues: string[];
  checks: {
    hasViewportMeta: boolean;
    hasHorizontalScroll: boolean;
    textReadable: boolean;
    touchTargetsAccessible: boolean;
  };
}> {
  const issues: string[] = [];

  // Check viewport meta tag
  const hasViewportMeta = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    return !!meta;
  });

  if (!hasViewportMeta) {
    issues.push('Missing viewport meta tag');
  }

  // Check horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > document.body.clientWidth;
  });

  if (hasHorizontalScroll) {
    issues.push('Page has unintended horizontal scroll');
  }

  // Check text readability (minimum 12px font size for body text)
  const textReadable = await page.evaluate(() => {
    const bodyFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
    return bodyFontSize >= 12;
  });

  if (!textReadable) {
    issues.push('Body text too small (< 12px)');
  }

  // Check if interactive elements are accessible (not covered by fixed headers/footers)
  const touchTargetsAccessible = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a[href]'));
    const fixedElements = Array.from(document.querySelectorAll('[style*="position: fixed"]'));

    for (const button of buttons) {
      const buttonRect = button.getBoundingClientRect();
      for (const fixed of fixedElements) {
        const fixedRect = fixed.getBoundingClientRect();
        // Check if button is covered by fixed element
        if (
          buttonRect.top < fixedRect.bottom &&
          buttonRect.bottom > fixedRect.top &&
          buttonRect.left < fixedRect.right &&
          buttonRect.right > fixedRect.left
        ) {
          return false; // Button covered by fixed element
        }
      }
    }
    return true;
  });

  if (!touchTargetsAccessible) {
    issues.push('Some interactive elements covered by fixed positioned elements');
  }

  return {
    passed: issues.length === 0,
    issues,
    checks: {
      hasViewportMeta,
      hasHorizontalScroll,
      textReadable,
      touchTargetsAccessible,
    },
  };
}
