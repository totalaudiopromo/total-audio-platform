/**
 * TRACKER MODAL INTERACTION TESTS
 *
 * Tests submission tracking modals, dialogs, and overlays on mobile
 */

const { test, expect } = require('@playwright/test');
const {
  validateTouchTargetSize,
  validateAllTouchTargets,
} = require('@total-audio/testing');

test.describe('Modal Interactions on Mobile', () => {
  test('Submission modal opens and closes correctly', async ({ page }) => {
    await page.goto('/campaigns');

    // Find and open submission modal
    const addSubmissionButton = page
      .getByRole('button', { name: /add submission|log|track/i })
      .first();

    if (await addSubmissionButton.isVisible()) {
      await validateTouchTargetSize(addSubmissionButton, 44);
      await addSubmissionButton.tap();

      // Modal should be visible
      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 3000 });

      // Test close button
      const closeButton = modal
        .getByRole('button', { name: /close|cancel/i })
        .first();
      if (await closeButton.isVisible()) {
        await validateTouchTargetSize(closeButton, 44);
        await closeButton.tap();

        // Modal should close
        await expect(modal).not.toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('Modal fits mobile viewport', async ({ page }) => {
    await page.goto('/campaigns');

    const addButton = page
      .getByRole('button', { name: /add|new|create/i })
      .first();

    if (await addButton.isVisible()) {
      await addButton.tap();

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();

      if (await modal.isVisible()) {
        const modalBox = await modal.boundingBox();
        const viewport = page.viewportSize();

        if (modalBox) {
          // Modal should not exceed viewport width
          expect(modalBox.width).toBeLessThanOrEqual(viewport.width);

          // Modal should have reasonable height (not too tall)
          expect(modalBox.height).toBeLessThan(viewport.height - 100);

          // Modal should be centered
          const centerX = modalBox.x + modalBox.width / 2;
          const viewportCenterX = viewport.width / 2;
          expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(50);
        }
      }
    }
  });

  test('Modal form inputs are touch-friendly', async ({ page }) => {
    await page.goto('/campaigns');

    const addButton = page.getByRole('button', { name: /add/i }).first();

    if (await addButton.isVisible()) {
      await addButton.tap();

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();

      if (await modal.isVisible()) {
        // Validate all interactive elements in modal
        const results = await validateAllTouchTargets(
          page,
          '[role="dialog"] input, [role="dialog"] button, [role="dialog"] select'
        );

        const failures = results.filter(r => !r.passed);
        expect(failures).toHaveLength(0);
      }
    }
  });

  test('Modal backdrop closes modal on tap', async ({ page }) => {
    await page.goto('/campaigns');

    const addButton = page.getByRole('button', { name: /add/i }).first();

    if (await addButton.isVisible()) {
      await addButton.tap();

      const modal = page.locator('[role="dialog"]').first();

      if (await modal.isVisible()) {
        // Try tapping backdrop (outside modal content)
        const backdrop = page
          .locator('[class*="backdrop"], [class*="overlay"]')
          .first();

        if (await backdrop.isVisible()) {
          await backdrop.tap();

          // Modal should close
          await expect(modal).not.toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('Submission status dropdown works on mobile', async ({ page }) => {
    await page.goto('/campaigns');

    // Find status dropdown
    const statusDropdown = page
      .locator('select[name*="status"], [role="combobox"]')
      .first();

    if (await statusDropdown.isVisible()) {
      await validateTouchTargetSize(statusDropdown, 44);

      // Test dropdown opens
      await statusDropdown.tap();

      // Dropdown should show options
      const options = page.locator('option, [role="option"]');
      const optionCount = await options.count();

      expect(optionCount).toBeGreaterThan(0);
    }
  });

  test('Delete confirmation modal prevents accidental deletion', async ({
    page,
  }) => {
    await page.goto('/campaigns');

    const deleteButton = page
      .getByRole('button', { name: /delete|remove/i })
      .first();

    if (await deleteButton.isVisible()) {
      await validateTouchTargetSize(deleteButton, 44);
      await deleteButton.tap();

      // Confirmation modal should appear
      const confirmModal = page
        .locator('[role="alertdialog"], [role="dialog"]')
        .last();

      if (await confirmModal.isVisible()) {
        // Test both confirm and cancel buttons are touch-friendly
        const confirmButton = confirmModal
          .getByRole('button', { name: /confirm|delete|yes/i })
          .first();
        const cancelButton = confirmModal
          .getByRole('button', { name: /cancel|no/i })
          .first();

        if (await confirmButton.isVisible()) {
          await validateTouchTargetSize(confirmButton, 44);
        }

        if (await cancelButton.isVisible()) {
          await validateTouchTargetSize(cancelButton, 44);

          // Cancel to avoid actual deletion
          await cancelButton.tap();
        }
      }
    }
  });
});
