#!/usr/bin/env node
/**
 * Playwright automation to set Gmail label colours
 * Saves time by automatically applying the colour scheme
 */

const { chromium } = require('playwright');

class GmailColourSetup {
  constructor() {
    this.labelColours = {
      'Active Campaigns': 'green',
      'Needs Action': 'blue',
      'Station Feedback': 'orange',
      'Station Auto-Responses': 'gray',
      Completed: 'yellow',
      'Old Campaigns': 'red',
      Agent: 'purple',
    };
  }

  async setup() {
    console.log('🚀 Starting Gmail label colour setup...');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to Gmail settings
      console.log('📧 Opening Gmail settings...');
      await page.goto('https://mail.google.com/mail/u/0/#settings/labels');

      // Wait for page to load
      await page.waitForTimeout(3000);

      // Check if we need to login
      if (page.url().includes('accounts.google.com')) {
        console.log('🔐 Please login to Gmail in the browser window...');
        console.log('⏳ Waiting for you to complete login...');

        // Wait for redirect back to Gmail
        await page.waitForURL('**/mail.google.com/**', { timeout: 120000 });

        // Navigate to labels again after login
        await page.goto('https://mail.google.com/mail/u/0/#settings/labels');
        await page.waitForTimeout(3000);
      }

      console.log('🏷️  Setting label colours...');

      for (const [labelName, colour] of Object.entries(this.labelColours)) {
        try {
          console.log(`Setting ${labelName} to ${colour}...`);

          // Find the label row
          const labelRow = await page.locator(`text="${labelName}"`).first();

          if (await labelRow.isVisible()) {
            // Find the colour dropdown in the same row
            const colourButton = await labelRow
              .locator('..')
              .locator('[data-tooltip*="color" i], [aria-label*="color" i]')
              .first();

            if (await colourButton.isVisible()) {
              await colourButton.click();
              await page.waitForTimeout(500);

              // Select the colour
              const colourOption = await page
                .locator(`[data-color="${colour}"], [title*="${colour}" i]`)
                .first();
              if (await colourOption.isVisible()) {
                await colourOption.click();
                console.log(`✅ Set ${labelName} to ${colour}`);
              } else {
                console.log(`⚠️  Could not find ${colour} colour option for ${labelName}`);
              }

              await page.waitForTimeout(500);
            } else {
              console.log(`⚠️  Could not find colour button for ${labelName}`);
            }
          } else {
            console.log(`⚠️  Label "${labelName}" not found - may need to be created first`);
          }
        } catch (error) {
          console.log(`❌ Failed to set colour for ${labelName}: ${error.message}`);
        }
      }

      console.log('💾 Saving changes...');

      // Look for save button
      const saveButton = await page
        .locator('button:has-text("Save Changes"), input[value*="Save" i]')
        .first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);
      }

      console.log('🎉 Gmail label colours setup complete!');
      console.log('');
      console.log('📧 Your Gmail labels now have colour coding:');
      console.log('  🟢 Active Campaigns - Green');
      console.log('  🔵 Needs Action - Blue');
      console.log('  🟠 Station Feedback - Orange');
      console.log('  ⚪ Station Auto-Responses - Grey');
      console.log('  🟡 Completed - Yellow');
      console.log('  🔴 Old Campaigns - Red');
      console.log('  🟣 Agent - Purple');
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      console.log('🔄 Closing browser in 5 seconds...');
      await page.waitForTimeout(5000);
      await browser.close();
    }
  }

  async setupAdvanced() {
    console.log('🚀 Starting advanced Gmail setup...');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to Gmail settings filters
      console.log('🔧 Opening Gmail filters settings...');
      await page.goto('https://mail.google.com/mail/u/0/#settings/filters');

      await page.waitForTimeout(3000);

      // Check if we need to login
      if (page.url().includes('accounts.google.com')) {
        console.log('🔐 Please login to Gmail in the browser window...');
        console.log('⏳ Waiting for you to complete login...');

        await page.waitForURL('**/mail.google.com/**', { timeout: 120000 });
        await page.goto('https://mail.google.com/mail/u/0/#settings/filters');
        await page.waitForTimeout(3000);
      }

      console.log('📋 Current filters visible in browser');
      console.log('ℹ️  Manual setup required for archiving filters:');
      console.log('');
      console.log('🔧 Add these filters manually:');
      console.log('');
      console.log('1️⃣  Auto-Complete Filter:');
      console.log('   Has the words: older_than:14d label:active-campaigns');
      console.log('   Apply label: "Completed"');
      console.log('   Remove label: "Active Campaigns"');
      console.log('');
      console.log('2️⃣  Auto-Archive Filter:');
      console.log('   Has the words: older_than:30d label:completed');
      console.log('   Apply label: "Old Campaigns"');
      console.log('   Remove label: "Completed"');
      console.log('');
      console.log('⏳ Browser will stay open for you to add these filters...');
      console.log('💡 Press Ctrl+C when finished');

      // Keep browser open for manual setup
      await page.waitForTimeout(300000); // 5 minutes
    } catch (error) {
      console.error('❌ Setup failed:', error);
    } finally {
      await browser.close();
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const setup = new GmailColourSetup();

  try {
    switch (command) {
      case 'colours':
      case 'colors':
        await setup.setup();
        break;

      case 'filters':
        await setup.setupAdvanced();
        break;

      case 'full':
        await setup.setup();
        await setup.setupAdvanced();
        break;

      default:
        console.log('🎨 Gmail Colour Setup - Playwright Automation');
        console.log('');
        console.log('Commands:');
        console.log('  colours  - Set up label colours automatically');
        console.log('  filters  - Open filters page for manual setup');
        console.log('  full     - Complete setup (colours + filters)');
        console.log('');
        console.log('Example: node gmail-colour-setup.js colours');
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GmailColourSetup;
