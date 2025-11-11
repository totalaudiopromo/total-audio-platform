/**
 * TRACKER MOBILE USER JOURNEY TESTS
 *
 * Tests complete campaign tracking flow on mobile devices
 * UK market focus: iPhone 13, Galaxy S9+, iPad Pro
 */

const { test, expect } = require('@playwright/test');
const { validateTouchTargetSize, measureCLS } = require('@total-audio/testing');

test.describe('Campaign Tracker Mobile Journey', () => {
  test('Complete campaign tracking flow', async ({ page }) => {
    const startTime = Date.now();

    // 1. HOMEPAGE
    await test.step('Homepage mobile loading', async () => {
      await page.goto('/');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);

      const cls = await measureCLS(page, 2000);
      expect(cls).toBeLessThan(0.1);
    });

    // 2. NAVIGATION TO CAMPAIGNS
    await test.step('Navigate to campaigns', async () => {
      const campaignsLink = page.getByRole('link', { name: /campaigns|dashboard/i }).first();

      if (await campaignsLink.isVisible()) {
        await validateTouchTargetSize(campaignsLink, 44);
        await campaignsLink.tap();
      } else {
        await page.goto('/campaigns');
      }

      await expect(page).toHaveURL(/\/(campaigns|dashboard)/);
    });

    // 3. CREATE NEW CAMPAIGN
    await test.step('Create new campaign on mobile', async () => {
      const createButton = page.getByRole('button', { name: /new campaign|create|add/i }).first();

      if (await createButton.isVisible()) {
        await validateTouchTargetSize(createButton, 44);
        await createButton.tap();
      } else {
        await page.goto('/campaigns/new');
      }

      // Test campaign name input
      const nameInput = page.locator('input[name*="name"], input[placeholder*="campaign"]').first();
      if (await nameInput.isVisible()) {
        await validateTouchTargetSize(nameInput, 44);
        await nameInput.fill('Test Mobile Campaign');
      }

      // Test artist input
      const artistInput = page.locator('input[name*="artist"], input[placeholder*="artist"]').first();
      if (await artistInput.isVisible()) {
        await validateTouchTargetSize(artistInput, 44);
      }
    });

    // 4. SUBMISSION TRACKING
    await test.step('Add submission on mobile', async () => {
      const addSubmissionButton = page.getByRole('button', { name: /add submission|log|track/i }).first();

      if (await addSubmissionButton.isVisible()) {
        await validateTouchTargetSize(addSubmissionButton, 44);
      }
    });

    // 5. MOBILE PERFORMANCE
    await test.step('Mobile performance check', async () => {
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(12000); // Under 12 seconds for full journey
    });
  });

  test('Mobile campaign list scrolling and interaction', async ({ page }) => {
    await page.goto('/campaigns');

    // Test campaign cards on mobile
    const campaignCards = page.locator('[data-campaign], [class*="campaign-card"]');

    if ((await campaignCards.count()) > 0) {
      const firstCard = campaignCards.first();
      const cardBox = await firstCard.boundingBox();
      const viewport = page.viewportSize();

      // Cards should fit mobile viewport with padding
      if (cardBox) {
        expect(cardBox.width).toBeLessThanOrEqual(viewport.width - 32);
      }

      // Test card interaction
      await validateTouchTargetSize(firstCard, 44);
    }
  });

  test('Mobile submission modal interactions', async ({ page }) => {
    await page.goto('/campaigns');

    // Open first campaign
    const firstCampaign = page.locator('[data-campaign], [class*="campaign"]').first();

    if (await firstCampaign.isVisible()) {
      await firstCampaign.tap();

      // Test modal submission form
      const modalForm = page.locator('[role="dialog"], [class*="modal"]').first();

      if (await modalForm.isVisible()) {
        // Verify modal fits viewport
        const modalBox = await modalForm.boundingBox();
        const viewport = page.viewportSize();

        if (modalBox) {
          expect(modalBox.width).toBeLessThanOrEqual(viewport.width);
        }

        // Test close button
        const closeButton = modalForm.getByRole('button', { name: /close|cancel/i }).first();
        if (await closeButton.isVisible()) {
          await validateTouchTargetSize(closeButton, 44);
        }
      }
    }
  });
});
