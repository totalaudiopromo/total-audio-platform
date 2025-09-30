#!/usr/bin/env node

/**
 * Threads (threads.net) poster using Puppeteer with session persistence.
 *
 * Usage:
 *   node apps/command-centre/scripts/post-to-threads.js "Your message" [--headless]
 *   TEXT="Your message" node apps/command-centre/scripts/post-to-threads.js
 */

const path = require('path');
const fs = require('fs');

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
    : (process.env.TEXT || 'Audio Intel test post – built for UK music pros.');

  const sessionDir = path.resolve(__dirname, '..', '..', '..', '..', '.threads-session');
  await ensureDir(sessionDir);

  const browser = await puppeteer.launch({
    headless,
    userDataDir: sessionDir,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    console.log('Opening Threads...');
    await page.goto('https://www.threads.net/', { waitUntil: 'domcontentloaded' });

    // Detect login state
    let loggedIn = false;
    const loggedInSelectors = [
      'a[href^="/@"], a[role="link"][href*="/profile"]',
      'button[aria-label="Create"]',
    ];
    for (const sel of loggedInSelectors) {
      if (await page.$(sel)) { loggedIn = true; break; }
    }

    if (!loggedIn) {
      console.log('Login required. Clicking Log in...');
      // Try clicking login buttons
      const loginSelectors = [
        'a[href^="/login"], a[href*="/login"]',
        'button[role="button"]',
        'a[role="link"]',
      ];
      let clicked = false;
      for (const sel of loginSelectors) {
        try {
          const el = await page.$(sel);
          if (el) {
            const text = await page.evaluate(node => node.innerText || node.textContent || '', el);
            if (text && /log in/i.test(text)) { await el.click(); clicked = true; break; }
          }
        } catch {}
      }

      if (!clicked) {
        // Threads often uses Instagram login flow
        await page.goto('https://www.threads.net/login', { waitUntil: 'domcontentloaded' });
      }

      console.log('Please complete Instagram/Threads login in the browser. Waiting up to 2 minutes...');
      loggedIn = await Promise.race([
        page.waitForSelector('button[aria-label="Create"], div[role="dialog"] textarea, div[contenteditable="true"]', { timeout: 120000 }).then(() => true).catch(() => false),
      ]);
      if (!loggedIn) throw new Error('Login not detected within 2 minutes.');
      console.log('Login detected. Proceeding...');
    }

    // Open composer (Create button)
    console.log('Opening composer...');
    let createBtn = await page.$('button[aria-label="Create"]');
    if (!createBtn) {
      // Try alternative: look for visible buttons with matching text
      const candidates = await page.$$('button, div[role="button"], a[role="button"]');
      for (const c of candidates) {
        const text = await page.evaluate(node => (node.innerText || node.textContent || '').trim(), c);
        if (/^(create|new thread)$/i.test(text)) { createBtn = c; break; }
      }
    }
    if (createBtn) await createBtn.click();

    // Find editor (textarea/contenteditable inside dialog)
    await sleep(800);
    const editorSelectors = [
      'div[role="dialog"] textarea',
      'div[role="dialog"] div[contenteditable="true"]',
      'textarea',
      'div[contenteditable="true"]',
    ];
    let editor = null;
    for (const sel of editorSelectors) {
      editor = await page.$(sel);
      if (editor) break;
    }
    if (!editor) throw new Error('Could not find Threads composer editor.');

    await editor.evaluate((el, text) => {
      el.focus();
      if (el.tagName === 'TEXTAREA') {
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        document.execCommand('insertText', false, text);
      }
    }, message);

    // Click Post/Share button
    let posted = false;
    // Prefer aria-label buttons inside dialog
    const dialogButtons = await page.$$('div[role="dialog"] button, div[role="dialog"] div[role="button"]');
    for (const b of dialogButtons) {
      const text = await page.evaluate(node => (node.innerText || node.textContent || '').trim(), b);
      if (/^(post|share)$/i.test(text)) { await b.click(); posted = true; break; }
    }

    if (!posted) throw new Error('Could not find Post/Share button.');

    await sleep(2000);
    console.log('✅ Threads post flow completed (best-effort). Check your profile to verify.');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    console.log('Leaving the browser open for manual fallback.');
    console.log('If you see Threads, click “Create”, paste your text and post.');
    // Keep browser open for 3 minutes to allow manual posting
    await new Promise(res => setTimeout(res, 180000));
    try { await browser.close(); } catch {}
    process.exit(0);
  }
}

run();


