import type { Page, Locator } from '@playwright/test';

export interface AccessibilityValidationResult {
  passed: boolean;
  issues: Array<{
    type: string;
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    element: string;
    message: string;
  }>;
}

/**
 * Validates color contrast ratios meet WCAG 2.2 Level AA standards
 * @param element - Element to check contrast for
 * @returns Contrast ratio and pass/fail status
 */
export async function validateColorContrast(element: Locator): Promise<{
  passed: boolean;
  contrastRatio: number;
  requiredRatio: number;
  foreground: string;
  background: string;
}> {
  const contrastInfo = await element.evaluate(el => {
    const style = window.getComputedStyle(el);
    const fg = style.color;
    const bg = style.backgroundColor;

    // Helper to parse RGB values
    const parseRGB = (color: string): [number, number, number] | null => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    };

    // Calculate relative luminance
    const getLuminance = (rgb: [number, number, number]): number => {
      const [r, g, b] = rgb.map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgRGB = parseRGB(fg);
    const bgRGB = parseRGB(bg);

    if (!fgRGB || !bgRGB) {
      return { ratio: 0, fg, bg };
    }

    const fgLum = getLuminance(fgRGB);
    const bgLum = getLuminance(bgRGB);

    const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);

    return { ratio, fg, bg };
  });

  const fontSize = await element.evaluate(el => {
    return parseFloat(window.getComputedStyle(el).fontSize);
  });

  // WCAG 2.2 Level AA requirements:
  // - Normal text (< 18px or < 14px bold): 4.5:1
  // - Large text (>= 18px or >= 14px bold): 3:1
  const requiredRatio = fontSize >= 18 ? 3 : 4.5;

  return {
    passed: contrastInfo.ratio >= requiredRatio,
    contrastRatio: Math.round(contrastInfo.ratio * 100) / 100,
    requiredRatio,
    foreground: contrastInfo.fg,
    background: contrastInfo.bg,
  };
}

/**
 * Validates ARIA labels and roles are properly implemented
 * @param page - Playwright Page object
 * @returns Validation results for ARIA implementation
 */
export async function validateAriaLabels(page: Page): Promise<AccessibilityValidationResult> {
  const issues: AccessibilityValidationResult['issues'] = [];

  // Check for buttons without accessible names
  const buttonsWithoutLabels = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    const violations: Array<{ element: string; message: string }> = [];

    buttons.forEach(button => {
      const hasAccessibleName =
        button.textContent?.trim() ||
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby') ||
        button.getAttribute('title');

      if (!hasAccessibleName) {
        violations.push({
          element: button.tagName.toLowerCase() + (button.id ? `#${button.id}` : ''),
          message: 'Button has no accessible name (text content, aria-label, or title)',
        });
      }
    });

    return violations;
  });

  buttonsWithoutLabels.forEach(violation => {
    issues.push({
      type: 'missing-accessible-name',
      severity: 'critical',
      element: violation.element,
      message: violation.message,
    });
  });

  // Check for images without alt text
  const imagesWithoutAlt = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    const violations: Array<{ element: string; message: string }> = [];

    images.forEach(img => {
      const hasAlt = img.hasAttribute('alt');
      const isDecorative =
        img.getAttribute('role') === 'presentation' || img.getAttribute('aria-hidden') === 'true';

      if (!hasAlt && !isDecorative) {
        violations.push({
          element: `img[src="${img.src}"]`,
          message: 'Image missing alt text',
        });
      }
    });

    return violations;
  });

  imagesWithoutAlt.forEach(violation => {
    issues.push({
      type: 'missing-alt-text',
      severity: 'critical',
      element: violation.element,
      message: violation.message,
    });
  });

  // Check for form inputs without labels
  const inputsWithoutLabels = await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll('input:not([type="hidden"]), textarea, select')
    );
    const violations: Array<{ element: string; message: string }> = [];

    inputs.forEach(input => {
      const hasLabel =
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        (input.id && document.querySelector(`label[for="${input.id}"]`));

      if (!hasLabel) {
        violations.push({
          element: `${input.tagName.toLowerCase()}[name="${input.getAttribute('name') || 'unnamed'}"]`,
          message: 'Form input has no associated label',
        });
      }
    });

    return violations;
  });

  inputsWithoutLabels.forEach(violation => {
    issues.push({
      type: 'missing-form-label',
      severity: 'critical',
      element: violation.element,
      message: violation.message,
    });
  });

  // Check for invalid ARIA roles
  const invalidAriaRoles = await page.evaluate(() => {
    const validRoles = [
      'alert',
      'alertdialog',
      'application',
      'article',
      'banner',
      'button',
      'checkbox',
      'columnheader',
      'combobox',
      'complementary',
      'contentinfo',
      'definition',
      'dialog',
      'directory',
      'document',
      'feed',
      'figure',
      'form',
      'grid',
      'gridcell',
      'group',
      'heading',
      'img',
      'link',
      'list',
      'listbox',
      'listitem',
      'log',
      'main',
      'marquee',
      'math',
      'menu',
      'menubar',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'navigation',
      'none',
      'note',
      'option',
      'presentation',
      'progressbar',
      'radio',
      'radiogroup',
      'region',
      'row',
      'rowgroup',
      'rowheader',
      'scrollbar',
      'search',
      'searchbox',
      'separator',
      'slider',
      'spinbutton',
      'status',
      'switch',
      'tab',
      'table',
      'tablist',
      'tabpanel',
      'term',
      'textbox',
      'timer',
      'toolbar',
      'tooltip',
      'tree',
      'treegrid',
      'treeitem',
    ];

    const elementsWithRoles = Array.from(document.querySelectorAll('[role]'));
    const violations: Array<{ element: string; message: string }> = [];

    elementsWithRoles.forEach(el => {
      const role = el.getAttribute('role');
      if (role && !validRoles.includes(role)) {
        violations.push({
          element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
          message: `Invalid ARIA role: "${role}"`,
        });
      }
    });

    return violations;
  });

  invalidAriaRoles.forEach(violation => {
    issues.push({
      type: 'invalid-aria-role',
      severity: 'serious',
      element: violation.element,
      message: violation.message,
    });
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}

/**
 * Validates keyboard navigation functionality
 * @param page - Playwright Page object
 * @returns Validation results for keyboard navigation
 */
export async function validateKeyboardNavigation(page: Page): Promise<{
  passed: boolean;
  issues: string[];
  focusableElements: number;
  tabOrder: string[];
}> {
  const issues: string[] = [];

  // Get all focusable elements
  const focusableInfo = await page.evaluate(() => {
    const focusable = Array.from(
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    const elements = focusable.map(el => {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const tabindex = el.getAttribute('tabindex');
      return `${tag}${id}${tabindex ? `[tabindex="${tabindex}"]` : ''}`;
    });

    return {
      count: focusable.length,
      elements,
    };
  });

  if (focusableInfo.count === 0) {
    issues.push('No focusable elements found on page');
  }

  // Check for negative tabindex on interactive elements
  const negativeTabindex = await page.evaluate(() => {
    const interactive = Array.from(
      document.querySelectorAll('button, a[href], input, select, textarea')
    );

    return interactive.filter(el => {
      const tabindex = el.getAttribute('tabindex');
      return tabindex === '-1';
    }).length;
  });

  if (negativeTabindex > 0) {
    issues.push(
      `${negativeTabindex} interactive elements have tabindex="-1" (not keyboard accessible)`
    );
  }

  // Check for skip links
  const hasSkipLink = await page.evaluate(() => {
    const skipLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(link => {
      const text = link.textContent?.toLowerCase() || '';
      return text.includes('skip') && text.includes('content');
    });
    return skipLinks.length > 0;
  });

  if (!hasSkipLink) {
    issues.push('No "skip to content" link found (recommended for keyboard navigation)');
  }

  // Check for focus indicators
  const hasFocusIndicators = await page.evaluate(() => {
    // Create a temporary button to test focus styling
    const testButton = document.createElement('button');
    testButton.textContent = 'Test';
    testButton.style.position = 'absolute';
    testButton.style.left = '-9999px';
    document.body.appendChild(testButton);

    testButton.focus();
    const focusedOutline = window.getComputedStyle(testButton).outline;

    document.body.removeChild(testButton);

    // Check if outline is not 'none' when focused
    return focusedOutline !== 'none' && focusedOutline !== '0px none rgb(0, 0, 0)';
  });

  if (!hasFocusIndicators) {
    issues.push('Focus indicators may be disabled (outline: none detected)');
  }

  return {
    passed: issues.length === 0,
    issues,
    focusableElements: focusableInfo.count,
    tabOrder: focusableInfo.elements,
  };
}

/**
 * Comprehensive accessibility audit
 * @param page - Playwright Page object
 * @returns Complete accessibility validation results
 */
export async function validateAccessibility(page: Page): Promise<{
  passed: boolean;
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  ariaValidation: AccessibilityValidationResult;
  keyboardNavigation: Awaited<ReturnType<typeof validateKeyboardNavigation>>;
}> {
  const ariaValidation = await validateAriaLabels(page);
  const keyboardNavigation = await validateKeyboardNavigation(page);

  const summary = {
    critical: ariaValidation.issues.filter(i => i.severity === 'critical').length,
    serious: ariaValidation.issues.filter(i => i.severity === 'serious').length,
    moderate: ariaValidation.issues.filter(i => i.severity === 'moderate').length,
    minor: ariaValidation.issues.filter(i => i.severity === 'minor').length,
  };

  const passed = summary.critical === 0 && summary.serious === 0 && keyboardNavigation.passed;

  return {
    passed,
    summary,
    ariaValidation,
    keyboardNavigation,
  };
}
