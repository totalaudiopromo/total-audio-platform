import type { Page, Locator } from '@playwright/test';

export interface TouchTargetValidationResult {
  passed: boolean;
  element: string;
  width: number;
  height: number;
  minSize: number;
  issues: string[];
}

/**
 * Validates a single element meets WCAG 2.2 Level AA touch target size (44x44px minimum)
 * @param element - Playwright Locator for the element to validate
 * @param minSize - Minimum size in pixels (default: 44px for WCAG 2.2 Level AA)
 * @returns Validation result with pass/fail status and dimensions
 */
export async function validateTouchTargetSize(
  element: Locator,
  minSize: number = 44
): Promise<TouchTargetValidationResult> {
  const box = await element.boundingBox();
  const selector = await element.evaluate(el => {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
    return `${tag}${id}${classes}`;
  });

  if (!box) {
    return {
      passed: false,
      element: selector,
      width: 0,
      height: 0,
      minSize,
      issues: ['Element not visible or has no bounding box'],
    };
  }

  const issues: string[] = [];
  if (box.width < minSize) {
    issues.push(`Width ${box.width.toFixed(1)}px < ${minSize}px`);
  }
  if (box.height < minSize) {
    issues.push(`Height ${box.height.toFixed(1)}px < ${minSize}px`);
  }

  return {
    passed: issues.length === 0,
    element: selector,
    width: Math.round(box.width),
    height: Math.round(box.height),
    minSize,
    issues,
  };
}

/**
 * Validates spacing between adjacent touch targets (8px minimum recommended)
 * @param elements - Array of Playwright Locators to check spacing between
 * @param minSpacing - Minimum spacing in pixels (default: 8px)
 * @returns Array of spacing violations
 */
export async function validateTouchTargetSpacing(
  elements: Locator[],
  minSpacing: number = 8
): Promise<
  Array<{
    passed: boolean;
    element1: string;
    element2: string;
    spacing: number;
    minSpacing: number;
  }>
> {
  const results: Array<{
    passed: boolean;
    element1: string;
    element2: string;
    spacing: number;
    minSpacing: number;
  }> = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const box1 = await elements[i].boundingBox();
      const box2 = await elements[j].boundingBox();

      if (!box1 || !box2) continue;

      // Calculate minimum distance between boxes
      const horizontalDistance = Math.max(
        0,
        Math.max(box1.x, box2.x) - Math.min(box1.x + box1.width, box2.x + box2.width)
      );
      const verticalDistance = Math.max(
        0,
        Math.max(box1.y, box2.y) - Math.min(box1.y + box1.height, box2.y + box2.height)
      );

      const spacing = Math.min(horizontalDistance, verticalDistance);

      if (spacing < minSpacing && spacing > 0) {
        const selector1 = await elements[i].evaluate(el => el.tagName);
        const selector2 = await elements[j].evaluate(el => el.tagName);

        results.push({
          passed: false,
          element1: selector1,
          element2: selector2,
          spacing: Math.round(spacing),
          minSpacing,
        });
      }
    }
  }

  return results;
}

/**
 * Validates all touch targets on a page meet WCAG 2.2 Level AA standards
 * @param page - Playwright Page object
 * @param selector - CSS selector for interactive elements (default: common interactive elements)
 * @param minSize - Minimum touch target size in pixels (default: 44px)
 * @returns Array of validation results for all found elements
 */
export async function validateAllTouchTargets(
  page: Page,
  selector: string = 'button, a, input[type="submit"], input[type="button"], [role="button"], [onclick]',
  minSize: number = 44
): Promise<TouchTargetValidationResult[]> {
  const elements = await page.locator(selector).all();
  const results: TouchTargetValidationResult[] = [];

  for (const element of elements) {
    const isVisible = await element.isVisible();
    if (isVisible) {
      const result = await validateTouchTargetSize(element, minSize);
      results.push(result);
    }
  }

  return results;
}

/**
 * Detects potential gesture conflicts (e.g., tap vs swipe)
 * @param element - Element to check for gesture conflicts
 * @returns Whether the element may have gesture conflicts
 */
export async function validateGestureConflicts(element: Locator): Promise<{
  passed: boolean;
  conflicts: string[];
}> {
  const conflicts: string[] = [];

  const hasClickHandler = await element.evaluate(el => {
    return !!(
      el.onclick ||
      el.getAttribute('onclick') ||
      el.getAttribute('ng-click') ||
      el.getAttribute('@click')
    );
  });

  const isScrollable = await element.evaluate(el => {
    const style = window.getComputedStyle(el);
    return (
      style.overflowX === 'scroll' ||
      style.overflowX === 'auto' ||
      style.overflowY === 'scroll' ||
      style.overflowY === 'auto'
    );
  });

  if (hasClickHandler && isScrollable) {
    conflicts.push(
      'Element has both click handler and scrollable overflow - potential tap/swipe conflict'
    );
  }

  const hasTouchHandlers = await element.evaluate(el => {
    return !!(
      el.ontouchstart ||
      el.ontouchmove ||
      el.ontouchend ||
      el.getAttribute('ontouchstart')
    );
  });

  if (hasTouchHandlers && hasClickHandler) {
    conflicts.push('Element has both touch and click handlers - may cause double-firing');
  }

  return {
    passed: conflicts.length === 0,
    conflicts,
  };
}
