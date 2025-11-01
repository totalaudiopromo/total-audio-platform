#!/usr/bin/env node

/**
 * Google Cloud Console OAuth Setup Automation
 *
 * This script will automatically configure your Google Cloud Console
 * to fix the OAuth issues with your Radio Promo Agent
 */

const { chromium } = require('playwright');
const readline = require('readline');

async function setupGoogleCloudConsole() {
  console.log('🚀 Google Cloud Console OAuth Setup Automation...\n');

  const browser = await chromium.launch({
    headless: false, // Show browser so you can see what's happening
    slowMo: 1000, // Slow down for visibility
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to Google Cloud Console
    console.log('📍 Step 1: Opening Google Cloud Console...');
    await page.goto(
      'https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3'
    );

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('✅ Google Cloud Console opened');
    console.log('🔐 You may need to sign in to Google Cloud Console');
    console.log('   Please sign in with your Google account if prompted');
    console.log('');

    // Wait for user to sign in if needed
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise(resolve => {
      rl.question('Press Enter after signing in to Google Cloud Console: ', () => {
        rl.close();
        resolve();
      });
    });

    // Step 2: Navigate to OAuth consent screen
    console.log('📍 Step 2: Configuring OAuth consent screen...');
    await page.goto(
      'https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3'
    );
    await page.waitForLoadState('networkidle');

    // Look for edit button or configure button
    try {
      // Try different possible button texts
      const editButton = await page
        .locator('text=Edit App')
        .or(
          page
            .locator('text=Configure')
            .or(page.locator('text=Edit').or(page.locator('[data-testid="edit-button"]')))
        )
        .first();

      await editButton.click();
      console.log('✅ Clicked edit button on OAuth consent screen');
    } catch (error) {
      console.log('⚠️  Could not find edit button, trying to navigate directly...');
      // Try to go directly to the edit page
      await page.goto(
        'https://console.cloud.google.com/apis/credentials/consent/edit?project=gleaming-realm-471715-p3'
      );
      await page.waitForLoadState('networkidle');
    }

    // Add authorized domains
    console.log('📍 Step 3: Adding authorized domains...');

    // Look for authorized domains section
    const domainsSection = page
      .locator('text=Authorized domains')
      .or(page.locator('text=Authorized domains').locator('..'))
      .first();

    // Add localhost domain
    try {
      const addDomainButton = page
        .locator('text=Add domain')
        .or(page.locator('text=+').or(page.locator('[data-testid="add-domain"]')))
        .first();

      await addDomainButton.click();
      await page.fill('input[placeholder*="domain"]', 'localhost');
      await page.keyboard.press('Enter');
      console.log('✅ Added localhost domain');
    } catch (error) {
      console.log('⚠️  Could not add localhost domain automatically');
    }

    // Add 127.0.0.1 domain
    try {
      const addDomainButton2 = page
        .locator('text=Add domain')
        .or(page.locator('text=+').or(page.locator('[data-testid="add-domain"]')))
        .first();

      await addDomainButton2.click();
      await page.fill('input[placeholder*="domain"]', '127.0.0.1');
      await page.keyboard.press('Enter');
      console.log('✅ Added 127.0.0.1 domain');
    } catch (error) {
      console.log('⚠️  Could not add 127.0.0.1 domain automatically');
    }

    // Save OAuth consent screen
    try {
      const saveButton = page
        .locator('text=Save and Continue')
        .or(page.locator('text=Save').or(page.locator('[data-testid="save-button"]')))
        .first();

      await saveButton.click();
      console.log('✅ Saved OAuth consent screen changes');
    } catch (error) {
      console.log('⚠️  Could not save OAuth consent screen automatically');
    }

    // Step 3: Navigate to credentials
    console.log('📍 Step 4: Configuring OAuth credentials...');
    await page.goto(
      'https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3'
    );
    await page.waitForLoadState('networkidle');

    // Find the OAuth 2.0 Client ID
    const oauthClient = page
      .locator('text=309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com')
      .or(page.locator('text=OAuth 2.0 Client ID').locator('..'))
      .first();

    await oauthClient.click();
    console.log('✅ Clicked on OAuth 2.0 Client ID');

    // Add redirect URIs
    console.log('📍 Step 5: Adding redirect URIs...');

    const redirectUris = [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'postmessage',
      'urn:ietf:wg:oauth:2.0:oob',
    ];

    for (const uri of redirectUris) {
      try {
        const addUriButton = page
          .locator('text=Add URI')
          .or(page.locator('text=+').or(page.locator('[data-testid="add-uri"]')))
          .first();

        await addUriButton.click();
        await page.fill('input[placeholder*="URI"]', uri);
        await page.keyboard.press('Enter');
        console.log(`✅ Added redirect URI: ${uri}`);
      } catch (error) {
        console.log(`⚠️  Could not add redirect URI: ${uri}`);
      }
    }

    // Save credentials
    try {
      const saveButton = page
        .locator('text=Save')
        .or(page.locator('[data-testid="save-button"]'))
        .first();

      await saveButton.click();
      console.log('✅ Saved OAuth credentials changes');
    } catch (error) {
      console.log('⚠️  Could not save credentials automatically');
    }

    // Step 4: Enable APIs
    console.log('📍 Step 6: Enabling required APIs...');

    const apisToEnable = ['Gmail API', 'Google Drive API', 'Google Calendar API'];

    for (const apiName of apisToEnable) {
      try {
        await page.goto(
          `https://console.cloud.google.com/apis/library/${apiName.toLowerCase().replace(/\s+/g, '-')}?project=gleaming-realm-471715-p3`
        );
        await page.waitForLoadState('networkidle');

        const enableButton = page
          .locator('text=Enable')
          .or(page.locator('[data-testid="enable-button"]'))
          .first();

        await enableButton.click();
        console.log(`✅ Enabled ${apiName}`);

        // Wait for API to be enabled
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`⚠️  Could not enable ${apiName}: ${error.message}`);
      }
    }

    console.log('\n🎉 Google Cloud Console setup complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test OAuth setup:');
    console.log('   node working-oauth-setup.js');
    console.log('');
    console.log('2. Test your agent:');
    console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('🔧 Manual fallback:');
    console.log(
      '1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3'
    );
    console.log('2. Add authorized domains: localhost, 127.0.0.1');
    console.log(
      '3. Go to: https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3'
    );
    console.log('4. Edit your OAuth 2.0 Client ID and add redirect URIs');
  } finally {
    // Keep browser open for a few seconds so user can see the result
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Check if Playwright is available
async function checkPlaywright() {
  try {
    require('playwright');
    return true;
  } catch (error) {
    console.log('❌ Playwright not installed. Installing...');
    return false;
  }
}

// Install Playwright if needed and run setup
async function main() {
  const hasPlaywright = await checkPlaywright();

  if (!hasPlaywright) {
    console.log('📦 Installing Playwright...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install playwright', { stdio: 'inherit' });
      console.log('✅ Playwright installed successfully');
    } catch (error) {
      console.error('❌ Failed to install Playwright:', error.message);
      console.log('Please run: npm install playwright');
      return;
    }
  }

  await setupGoogleCloudConsole();
}

// Run the setup
main();
