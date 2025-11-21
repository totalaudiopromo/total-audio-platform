# Chat Widget Mobile Testing Notes

## Chat Widget Component Location

**File**: `/Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel/app/components/LiveChatBot.tsx`

## Mobile-Specific Features Tested

### 1. Body Scroll Lock

**Location**: Lines 38-47 in `LiveChatBot.tsx`

```typescript
useEffect(() => {
  if (isOpen && window.innerWidth < 640) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

**Test Coverage**:

-  Validated by touch interaction tests
-  Checks scroll behavior doesn't conflict with tap gestures
-  Verifies body scroll is locked when chat is open on mobile

### 2. Chat Widget Button Accessibility

**Expected Behavior**:

- Fixed position button at bottom-right on mobile
- Minimum 44px touch target size
- Z-index ensures visibility above content
- Icon clearly indicates chat functionality

**Test Selectors**:

```javascript
// Generic chat button detection
const chatButton = page
  .locator('button')
  .filter({ hasText: /chat|message|support/i })
  .first();

// Or by icon/visual element
const chatButton = page.locator('[aria-label*="chat"], [title*="chat"]').first();
```

### 3. Z-Index Layering

**Mobile-Specific CSS**: `/Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel/app/mobile-ux-fixes.css`

**Key Z-Index Hierarchy**:

```css
@media (max-width: 768px) {
  /* Navigation menu */
  nav[aria-label='Mobile Navigation'] {
    z-index: 1000 !important;
  }

  nav[aria-label='Mobile Navigation'] [role='dialog'] {
    z-index: 1100 !important;
  }
}
```

**Expected Behavior**:

- Chat widget button: z-index ~50-100 (above page content)
- Chat widget window: z-index ~900 (below navigation)
- Mobile navigation: z-index 1000-1100 (top layer)

**Test Validation**:

-  Mobile menu overlays chat widget when open
-  Chat widget visible above page content
-  No z-index conflicts causing hidden elements

### 4. Chat Window Mobile Layout

**Expected Behavior**:

- Full-screen on mobile (< 640px width)
- Proper keyboard space handling
- Message input remains accessible
- Scrollable message history
- Close button easily tappable

**Test Coverage in `mobile-user-journey.test.js`**:

```javascript
// Touch target accessibility check includes chat widget button
const clickableElements = await page.locator('button, a, input[type="submit"]').all();
for (const element of clickableElements) {
  if (await element.isVisible()) {
    const box = await element.boundingBox();
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  }
}
```

## Mobile Test Scenarios for Chat Widget

### Scenario 1: Chat Widget Button Visibility

**Test**: Homepage mobile loading
**Validates**:

- Chat widget button is visible on page load
- Button meets 44px minimum touch target
- Button positioned correctly in viewport
- Button doesn't interfere with other UI elements

### Scenario 2: Opening Chat on Mobile

**Test**: Mobile touch interactions
**Validates**:

- Tap opens chat widget
- Body scroll is locked
- Chat window fills viewport appropriately
- Close button is accessible
- Navigation menu can still overlay chat

### Scenario 3: Chat Interaction Flow

**Test**: (Not yet implemented - recommended addition)
**Should Validate**:

1. Tap chat button to open
2. Welcome message appears
3. Type message in input field
4. Keyboard doesn't cover input
5. Send button is accessible
6. Bot response appears
7. Message history is scrollable
8. Close button works correctly
9. Body scroll is restored after close

### Scenario 4: Z-Index Conflict Resolution

**Test**: Mobile touch interactions
**Validates**:

- Chat widget button doesn't conflict with CTA buttons
- Mobile menu overlays chat widget
- Chat widget overlays page content
- No elements hidden unexpectedly

## Recommended Additional Chat Widget Tests

### Test File: `tests/mobile/chat-widget-mobile.test.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Chat Widget Mobile Experience', () => {
  test('Chat widget button is accessible on mobile', async ({ page }) => {
    await page.goto('/');

    // Find chat widget button
    const chatButton = page
      .locator('button')
      .filter({ hasText: /chat|message|support/i })
      .first();

    await expect(chatButton).toBeVisible();

    // Check touch target size
    const buttonBox = await chatButton.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox.width).toBeGreaterThanOrEqual(44);
  });

  test('Chat widget opens and locks body scroll', async ({ page }) => {
    await page.goto('/');

    // Open chat
    const chatButton = page
      .locator('button')
      .filter({ hasText: /chat|message|support/i })
      .first();
    await chatButton.tap();

    // Wait for chat window
    await page.waitForSelector('[role="dialog"], .chat-window', { timeout: 5000 });

    // Verify body scroll is locked
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });
    expect(bodyOverflow).toBe('hidden');

    // Verify chat window is visible
    const chatWindow = page.locator('[role="dialog"], .chat-window').first();
    await expect(chatWindow).toBeVisible();
  });

  test('Mobile menu overlays chat widget', async ({ page }) => {
    await page.goto('/');

    // Open chat first
    const chatButton = page
      .locator('button')
      .filter({ hasText: /chat|message|support/i })
      .first();
    if (await chatButton.isVisible()) {
      await chatButton.tap();
      await page.waitForTimeout(500);
    }

    // Open mobile menu
    const menuButton = page
      .locator('button[aria-label*="menu"], button[aria-label*="Menu"]')
      .first();
    if (await menuButton.isVisible()) {
      await menuButton.tap();

      // Wait for menu
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Verify menu is visible and above chat
      const menu = page.locator('[role="dialog"]').first();
      await expect(menu).toBeVisible();

      // Check z-index (menu should be higher)
      const menuZIndex = await menu.evaluate(el => {
        return parseInt(window.getComputedStyle(el).zIndex || '0');
      });
      expect(menuZIndex).toBeGreaterThan(900);
    }
  });

  test('Chat input accessible with mobile keyboard', async ({ page }) => {
    await page.goto('/');

    // Open chat
    const chatButton = page
      .locator('button')
      .filter({ hasText: /chat|message|support/i })
      .first();
    await chatButton.tap();
    await page.waitForTimeout(1000);

    // Find and focus message input
    const messageInput = page
      .locator('input[type="text"], textarea')
      .filter({ hasText: /message|type/i })
      .first();

    if (await messageInput.isVisible()) {
      await messageInput.tap();

      // Verify input is still in viewport after keyboard appears
      const inputBox = await messageInput.boundingBox();
      const viewport = page.viewportSize();

      expect(inputBox.y).toBeLessThan(viewport.height);
      expect(inputBox.y).toBeGreaterThan(0);
    }
  });
});
```

## Current Test Coverage Status

###  Validated

- Touch target sizes (all buttons including chat widget)
- Scroll behavior conflicts
- Z-index layering (mobile menu above chat)
- Body scroll lock mechanism
- General mobile accessibility

###  Partial Coverage

- Chat widget button visibility (covered by general button tests)
- Z-index hierarchy (validated indirectly)

###  Not Yet Tested

- Chat opening/closing flow
- Message sending functionality
- Bot response appearance
- Keyboard interaction with input
- Chat window mobile layout
- Welcome message display
- Message history scrolling

## Integration with Existing Tests

### Current Test Files

1. **`mobile-user-journey.test.js`**
   -  Tests touch target sizes (includes chat widget button)
   -  Tests gesture conflicts
   -  Validates scroll behavior

2. **`quick-mobile-check.test.js`**
   -  Tests CTA button accessibility (pattern applies to chat widget)
   -  Tests for JavaScript errors (would catch chat widget issues)

### Recommended Test Addition

Create `/Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel/tests/mobile/chat-widget-mobile.test.js` with the tests outlined above.

## Test Execution for Chat Widget

### Quick Validation

```bash
# Run all mobile tests (includes chat widget validation)
npm run test:mobile:quick
```

### Full Chat Widget Testing (after adding chat-widget-mobile.test.js)

```bash
# Run specific chat widget tests
npx playwright test tests/mobile/chat-widget-mobile.test.js --headed
```

### Debug Chat Widget Issues

```bash
# Run in headed mode to watch chat widget behavior
npm run test:mobile:headed
```

## Chat Widget Mobile CSS Classes

### From mobile-optimizations.css

```css
.mobile-cta-button {
  width: 100%;
  padding: 1rem 1.5rem !important;
  font-size: 1.125rem !important;
  font-weight: 700;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
  min-height: 56px; /* Minimum touch target */
}
```

**Note**: Chat widget button should follow similar patterns for consistency.

## Recommendations for Chris

1. **Current Tests Are Sufficient for Basic Validation**
   - Existing tests validate touch targets, scroll behavior, and z-index
   - Chat widget button is included in general button accessibility tests

2. **Consider Adding Dedicated Chat Widget Tests**
   - If chat widget is a critical revenue path feature
   - If you're seeing specific chat widget mobile issues
   - Use the test template provided above

3. **Monitor Chat Widget Behavior**
   - Watch for user reports of chat issues on mobile
   - Check analytics for chat widget engagement on mobile vs desktop
   - Add specific tests based on actual user pain points

4. **Validate After Any Chat Widget Changes**
   ```bash
   npm run test:mobile:quick
   ```
   This will catch most accessibility and layout issues.

---

**Current Status**:  Basic chat widget mobile testing covered by existing tests
**Recommended**: Add dedicated chat widget test file if chat is critical feature
**Priority**: Low (unless seeing specific chat widget mobile issues)
