#!/usr/bin/env node

/**
 * X (Twitter) poster using Puppeteer with session persistence.
 *
 * Usage:
 *   node apps/command-centre/scripts/post-to-x.js "Your message" [--headless]
 *   TEXT="Your message" node apps/command-centre/scripts/post-to-x.js
 */

const path = require('path');
const fs = require('fs');

async function launchBrowser(puppeteer, headless, userDataDir) {
  return puppeteer.launch({
    headless,
    userDataDir,
    defaultViewport: null,
    args: ['--start-maximized'],
  });
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

function getArg(flag) {
  return process.argv.includes(flag);
}

async function run() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer is not installed. Run: npm i -D puppeteer');
    process.exit(1);
  }

  const headless = getArg('--headless');
  const message = (process.argv[2] && !process.argv[2].startsWith('--'))
    ? process.argv[2]
    : (process.env.TEXT || 'Audio Intel test post – generated via Puppeteer.');

  const sessionDir = path.resolve(__dirname, '..', '..', '..', '..', '.x-session');
  await ensureDir(sessionDir);

  const browser = await launchBrowser(puppeteer, headless, sessionDir);
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    // Step 1: Open home, check login
    console.log('Opening X (Twitter)...');
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });

    const loggedInSelectors = [
      'a[aria-label="Profile"]',
      'a[href^="/compose/post"]',
      'div[data-testid="SideNav_NewTweet_Button"]',
    ];
    let loggedIn = false;
    for (const sel of loggedInSelectors) {
      if (await page.$(sel)) { loggedIn = true; break; }
    }

    if (!loggedIn) {
      console.log('\nLogin required. Taking you to the login page...');
      await page.goto('https://x.com/login', { waitUntil: 'domcontentloaded' });
      console.log('Please complete login in the opened browser window. I will wait up to 2 minutes...');
      loggedIn = await Promise.race([
        page.waitForSelector('a[aria-label="Profile"], div[data-testid="SideNav_NewTweet_Button"]', { timeout: 120000 }).then(() => true).catch(() => false),
      ]);
      if (!loggedIn) {
        throw new Error('Login not detected within 2 minutes. Try again.');
      }
      console.log('Login detected. Proceeding...');
    }

    // Step 2: Prefer intent flow to stabilise selectors
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    console.log('Using intent flow...');
    await page.goto(intentUrl, { waitUntil: 'domcontentloaded' });

    // On intent page, click Tweet/Post button
    const intentButtonSelectors = [
      'div[data-testid="tweetButton"]',
      'div[data-testid="confirmationSheetConfirm"]',
      'button[data-testid="tweetButton"]',
      "xpath=//span[contains(., 'Post')]/ancestor::div[@role='button']",
      "xpath=//span[contains(., 'Tweet')]/ancestor::div[@role='button']",
    ];

    let clicked = false;
    for (const sel of intentButtonSelectors) {
      try {
        if (sel.startsWith('xpath=')) {
          const [, xp] = sel.split('=');
          const els = await page.$x(xp);
          if (els && els[0]) { await els[0].click(); clicked = true; break; }
        } else {
          const el = await page.$(sel);
          if (el) { await el.click(); clicked = true; break; }
        }
      } catch {}
    }

    if (!clicked) {
      // Fallback: open composer and post manually via editor
      console.log('Intent flow failed, falling back to composer...');
      await page.goto('https://x.com/compose/post', { waitUntil: 'domcontentloaded' });

      // Try keyboard shortcut to ensure editor focus
      await page.keyboard.press('KeyN').catch(() => {});
      await sleep(800);

      const editorSelectors = [
        'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
        'div[contenteditable="true"][role="textbox"]',
        'div[data-testid="tweetTextarea_0"] div[contenteditable="true"]',
      ];

      let editor = null;
      for (const sel of editorSelectors) {
        editor = await page.$(sel);
        if (editor) break;
      }
      if (!editor) {
        await sleep(1500);
        for (const sel of editorSelectors) {
          editor = await page.$(sel);
          if (editor) break;
        }
      }
      if (!editor) throw new Error('Could not find the X composer editor.');

      await editor.evaluate((el, text) => {
        el.focus();
        document.execCommand('insertText', false, text);
      }, message);

      const postButtonSelectors = [
        'div[data-testid="tweetButtonInline"]',
        'button[data-testid="tweetButtonInline"]',
        'div[role="button"][data-testid="tweetButtonInline"]',
        "xpath=//span[contains(., 'Post')]/ancestor::div[@role='button']",
      ];
      let postButton = null;
      for (const sel of postButtonSelectors) {
        if (sel.startsWith('xpath=')) {
          const els = await page.$x(sel.replace('xpath=', ''));
          if (els && els[0]) { postButton = els[0]; break; }
        } else {
          postButton = await page.$(sel);
          if (postButton) break;
        }
      }
      if (!postButton) throw new Error('Post button not found.');
      await postButton.click();
    }

    console.log('Posted. Verifying...');
    await sleep(2000);
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
    console.log('✅ X post flow completed (best-effort). Check your profile to verify.');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    try { await browser.close(); } catch {}
    process.exit(1);
  }
}

run();


