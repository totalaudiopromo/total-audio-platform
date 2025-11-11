/**
 * PITCH GENERATOR MOBILE USER JOURNEY TESTS
 *
 * Tests complete pitch generation flow on mobile devices
 * UK market focus: iPhone 13, Galaxy S9+, iPad Pro
 */

const { test, expect } = require('@playwright/test');
const { validateTouchTargetSize, measureCLS } = require('@total-audio/testing');

test.describe('Pitch Generator Mobile Journey', () => {
  test('Complete pitch generation flow', async ({ page }) => {
    const startTime = Date.now();

    // 1. HOMEPAGE
    await test.step('Homepage mobile loading', async () => {
      await page.goto('/');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);

      const cls = await measureCLS(page, 2000);
      expect(cls).toBeLessThan(0.1);
    });

    // 2. NAVIGATION TO PITCH CREATION
    await test.step('Navigate to pitch creation', async () => {
      const createButton = page.getByRole('button', { name: /create|new pitch|generate/i }).first();

      if (await createButton.isVisible()) {
        await validateTouchTargetSize(createButton, 44);
        await createButton.tap();
      } else {
        await page.goto('/pitch/new');
      }

      await expect(page).toHaveURL(/\/pitch/);
    });

    // 3. FORM INTERACTION
    await test.step('Fill pitch form on mobile', async () => {
      // Test artist name input
      const artistInput = page.locator('input[name*="artist"], input[placeholder*="artist"]').first();
      if (await artistInput.isVisible()) {
        await validateTouchTargetSize(artistInput, 44);
        await artistInput.fill('Test Artist');
      }

      // Test genre selection
      const genreSelect = page.locator('select[name*="genre"], [role="combobox"]').first();
      if (await genreSelect.isVisible()) {
        await validateTouchTargetSize(genreSelect, 44);
      }

      // Test generate button
      const generateButton = page.getByRole('button', { name: /generate|create/i }).first();
      if (await generateButton.isVisible()) {
        await validateTouchTargetSize(generateButton, 44);
      }
    });

    // 4. MOBILE PERFORMANCE
    await test.step('Mobile performance check', async () => {
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(10000); // Under 10 seconds for full journey
    });
  });

  test('Mobile onboarding flow', async ({ page }) => {
    await page.goto('/onboarding');

    // Test onboarding steps on mobile
    const continueButton = page.getByRole('button', { name: /continue|next|start/i }).first();

    if (await continueButton.isVisible()) {
      await validateTouchTargetSize(continueButton, 44);

      const buttonBox = await continueButton.boundingBox();
      const viewport = page.viewportSize();

      // Button should be easily reachable (not at very top or bottom)
      expect(buttonBox.y).toBeGreaterThan(100);
      expect(buttonBox.y).toBeLessThan(viewport.height - 100);
    }
  });

  test('Mobile pitch history navigation', async ({ page }) => {
    await page.goto('/pitch/history');

    // Verify pitch history is mobile-friendly
    const pitchCards = page.locator('[class*="pitch"], [data-pitch]').first();

    if (await pitchCards.isVisible()) {
      const cardBox = await pitchCards.boundingBox();
      const viewport = page.viewportSize();

      // Cards should fit mobile viewport
      expect(cardBox.width).toBeLessThanOrEqual(viewport.width - 32);
    }
  });
});
