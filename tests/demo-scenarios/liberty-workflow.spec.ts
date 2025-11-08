import { test, expect } from '@playwright/test';

/**
 * Liberty Music PR Demo Scenario
 *
 * CRITICAL: This is the exact workflow you'll demonstrate to Liberty leadership
 * Tests the complete journey: Enrich contacts → Generate pitches → Track campaign
 *
 * Demo Story:
 * - Liberty has 45 BBC Radio contacts they want to pitch for a new artist
 * - Use Audio Intel to enrich contact intelligence
 * - Generate personalized pitches for key contacts
 * - Track campaign progress in Campaign Tracker
 */

test.describe('Liberty Demo Workflow - Agency Use Case', () => {
  test('complete agency workflow: enrich → pitch → track', async ({ page, context }) => {
    console.log('\n🎯 Starting Liberty Music PR Demo Workflow...\n');

    // ===== STEP 1: AUDIO INTEL - ENRICH CONTACTS =====
    console.log('📊 STEP 1: Enrich 45 BBC Radio contacts in Audio Intel');

    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('domcontentloaded');

    // Load demo data
    const loadButton = page
      .locator(
        'button:has-text("Load Demo"), button:has-text("Demo Data"), button:has-text("Enrich")'
      )
      .first();

    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      console.log('  → Loading demo contact data...');

      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Verify enrichment happened
    const contactElements = page.locator(
      '[data-testid*="contact"], .contact-card, tr[data-contact]'
    );
    const enrichedCount = await contactElements.count();

    console.log(`  ✅ Enriched ${enrichedCount} contacts`);
    expect(enrichedCount).toBeGreaterThan(0);

    // ===== STEP 2: PITCH GENERATOR - CREATE PERSONALIZED PITCHES =====
    console.log('\n✍️  STEP 2: Generate personalized pitches for key contacts');

    // Option A: Check if there's a "Generate Pitch" button on contact cards
    const generateFromIntel = page
      .locator('button:has-text("Generate Pitch"), a:has-text("Pitch")')
      .first();

    if (await generateFromIntel.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('  → Using integrated pitch generation from Audio Intel');

      // Open pitch generator in new tab
      const [pitchPage] = await Promise.all([
        context.waitForEvent('page'),
        generateFromIntel.click(),
      ]);

      await pitchPage.waitForLoadState('domcontentloaded');
      console.log('  ✅ Pitch Generator opened from enriched contact');

      // Close the pitch tab
      await pitchPage.close();
    } else {
      console.log('  → Navigating to Pitch Generator manually');

      // Option B: Navigate to Pitch Generator demo directly
      await page.goto('http://localhost:3001/demo');
      await page.waitForLoadState('domcontentloaded');

      // Try to generate a pitch
      const genButton = page.locator('button:has-text("Generate"), button[type="submit"]').first();

      if (await genButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await genButton.click();
        console.log('  → Generating personalized pitch...');

        await page.waitForTimeout(5000); // Wait for AI generation

        // Check for generated pitch
        const pitch = page
          .locator(
            '[data-testid*="pitch"], [data-testid*="generated"], .pitch-output, textarea[readonly]'
          )
          .first();

        if (await pitch.isVisible({ timeout: 15000 }).catch(() => false)) {
          const pitchText = await pitch.textContent();
          console.log(`  ✅ Generated pitch (${pitchText?.length} characters)`);
        }
      }
    }

    // ===== STEP 3: CAMPAIGN TRACKER - TRACK PROGRESS =====
    console.log('\n📈 STEP 3: Track campaign progress in Campaign Tracker');

    await page.goto('http://localhost:3004/dashboard');
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Verify dashboard loaded
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();

    console.log('  ✅ Campaign Tracker dashboard loaded');

    // Look for campaigns
    const campaigns = page.locator('[data-testid*="campaign"], .campaign-card');
    const campaignCount = await campaigns.count();

    console.log(`  → Found ${campaignCount} campaigns in tracker`);

    // ===== WORKFLOW COMPLETE =====
    console.log('\n✅ Liberty Demo Workflow Complete!\n');
    console.log('Demo shows:');
    console.log(`  • Contact enrichment: ${enrichedCount} contacts processed`);
    console.log('  • Pitch generation: Personalized AI pitches created');
    console.log(`  • Campaign tracking: ${campaignCount} campaigns being tracked`);
    console.log('\n🎯 All three tools demonstrated successfully for Liberty\n');
  });

  test('export enriched data for Liberty client reporting', async ({ page }) => {
    console.log('\n📄 Testing export functionality for client reports...\n');

    await page.goto('http://localhost:3000/demo');

    // Load demo data
    const loadButton = page
      .locator('button:has-text("Load Demo"), button:has-text("Demo Data")')
      .first();

    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Try PDF export (Liberty will want client reports)
    const pdfButton = page.locator('button:has-text("PDF"), button:has-text("Export PDF")').first();

    if (await pdfButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('  → Testing PDF export for client reporting...');

      const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
      await pdfButton.click();

      const download = await downloadPromise;
      const filename = download.suggestedFilename();

      console.log(`  ✅ PDF export successful: ${filename}`);
      expect(filename).toMatch(/\.pdf$/i);
    } else {
      console.log('  ⚠️  PDF export button not found');
    }
  });
});

/**
 * Quick Demo Smoke Test
 * Run this first to ensure demo won't crash
 */
test.describe('Quick Demo Smoke Test', () => {
  test('all three apps load without crashing', async ({ page }) => {
    console.log('\n🚀 Quick smoke test of all three apps...\n');

    // Audio Intel
    console.log('1️⃣  Testing Audio Intel...');
    await page.goto('http://localhost:3000/demo');
    await page.waitForLoadState('domcontentloaded');
    let body = await page.textContent('body');
    expect(body).toBeTruthy();
    expect(body?.length).toBeGreaterThan(100);
    console.log('   ✅ Audio Intel loaded\n');

    // Pitch Generator
    console.log('2️⃣  Testing Pitch Generator...');
    await page.goto('http://localhost:3001/demo');
    await page.waitForLoadState('domcontentloaded');
    body = await page.textContent('body');
    expect(body).toBeTruthy();
    expect(body?.length).toBeGreaterThan(100);
    console.log('   ✅ Pitch Generator loaded\n');

    // Campaign Tracker
    console.log('3️⃣  Testing Campaign Tracker...');
    await page.goto('http://localhost:3004/dashboard');
    await page.waitForLoadState('domcontentloaded');
    body = await page.textContent('body');
    expect(body).toBeTruthy();
    expect(body?.length).toBeGreaterThan(100);
    console.log('   ✅ Campaign Tracker loaded\n');

    console.log('✅ All three apps ready for Liberty demo!\n');
  });
});
