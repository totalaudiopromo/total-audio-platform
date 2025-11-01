#!/usr/bin/env node
/*
 Automate inviting a Notion integration to a list of pages.
 - Opens a real Chrome window and reuses a persistent session so you can log in once.
 - You MUST set NOTION_INTEGRATION_NAME env to your integration’s name.
 - Pages to process: JSON file with an array of Notion page URLs (default: tools/notion/pages.json)

 Usage:
   NOTION_INTEGRATION_NAME="My Integration" node tools/notion/invite-integration.js [path/to/pages.json]

 Optional env:
   NOTION_INVITE_PERMISSION (ignored by default; integrations typically get read access)

 Notes:
 - This script is best-effort. Notion UI changes may require selector tweaks.
 - It will pause for login the first time; your session is saved under .notion-session/
*/

const fs = require('fs');
const path = require('path');

function getArg(name, fallback = null) {
  const i = process.argv.findIndex(a => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return fallback;
  const token = process.argv[i];
  if (token.includes('=')) {
    return token.split('=').slice(1).join('=').trim();
  }
  const vals = [];
  for (let j = i + 1; j < process.argv.length; j++) {
    const t = process.argv[j];
    if (t.startsWith('--')) break;
    vals.push(t);
  }
  return vals.length ? vals.join(' ').trim() : fallback;
}

function loadConfig() {
  const p = path.join('tools', 'notion', 'config.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

async function run() {
  const cfg = loadConfig();
  const integrationName =
    getArg('integration', null) || process.env.NOTION_INTEGRATION_NAME || cfg.integrationName;
  if (!integrationName) {
    console.error(
      'ERROR: Provide integration name via --integration, NOTION_INTEGRATION_NAME, or tools/notion/config.json'
    );
    process.exit(1);
  }
  const listPath = process.argv[2] || path.join('tools', 'notion', 'pages.json');
  const absListPath = path.resolve(listPath);
  if (!fs.existsSync(absListPath)) {
    console.error(`ERROR: Pages list not found at ${absListPath}`);
    process.exit(1);
  }
  const pages = Array.from(
    new Set(
      (JSON.parse(fs.readFileSync(absListPath, 'utf8')) || [])
        .map(u => String(u || '').trim())
        .filter(Boolean)
    )
  );
  if (!Array.isArray(pages) || pages.length === 0) {
    console.error('ERROR: Pages JSON must be a non-empty array of Notion share URLs.');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer is not installed. Run: npm i -D puppeteer');
    process.exit(1);
  }

  const retries = parseInt(getArg('retries', '2'), 10) || 2;
  const headless = process.argv.includes('--headless');

  const userDataDir = path.resolve('.notion-session');
  const browser = await puppeteer.launch({
    headless,
    userDataDir,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // Helper: eval XPaths and CSS with fallbacks
  async function $xFirst(xpath) {
    const els = await page.$x(xpath);
    return els && els[0] ? els[0] : null;
  }

  async function clickShare() {
    // Try aria-label first
    let el = await page.$('[aria-label="Share"]');
    if (!el) {
      // Try a button containing text "Share"
      el = await $xFirst("//button[contains(., 'Share')]");
    }
    if (!el) {
      // Fallback: a generic share menu button often used by Notion
      el = await page.$('[data-testid="share-menu-button"]');
    }
    if (!el) throw new Error('Share button not found');
    await el.click();
    await page.waitForSelector('[role="dialog"], [data-testid="popover"]', { timeout: 10000 });
  }

  async function addIntegration(name) {
    const dialogHandle = await page.$('[role="dialog"], [data-testid="popover"]');
    if (!dialogHandle) throw new Error('Share dialog not found');

    // Look for the add/invite input inside the dialog
    let input = await dialogHandle.$('input[type="text"]');
    if (!input) {
      // try common input roles/selectors
      input = await dialogHandle.$('[contenteditable="true"], [role="combobox"] input');
    }
    if (!input) throw new Error('Invite input not found');

    await input.click({ clickCount: 1 });
    await input.type(name, { delay: 40 });
    // Wait for the suggestions menu and select the first match
    await sleep(800);

    // A general approach: press Enter to accept top suggestion
    await page.keyboard.press('Enter');
    await sleep(500);

    // Validate integration appears somewhere in the dialog text
    const found = await page.evaluate(n => {
      const dlg = document.querySelector('[role="dialog"], [data-testid="popover"]');
      if (!dlg) return false;
      return dlg.innerText.toLowerCase().includes(n.toLowerCase());
    }, name);

    if (!found) {
      throw new Error(`Could not confirm integration \"${name}\" was added`);
    }
    // After adding, set permission to Can edit
    await setEditPermission(name);
  }

  async function setEditPermission(name) {
    const dialogHandle = await page.$('[role="dialog"], [data-testid="popover"]');
    if (!dialogHandle) return;
    // Open permission selector (try common labels)
    const labels = ['Can edit', 'Can read', 'Can view', 'Full access'];
    let permBtn = null;
    for (const lbl of labels) {
      const els = await page.$x(
        `//div[@role='dialog']//*[self::button or self::div][contains(normalize-space(.), '${lbl}')]`
      );
      if (els && els[0]) {
        permBtn = els[0];
        break;
      }
    }
    if (!permBtn) {
      // fallback: any button inside dialog
      permBtn = await dialogHandle.$('button');
    }
    if (!permBtn) return;
    try {
      await permBtn.click();
    } catch {}
    await sleep(300);
    // choose Can edit in the menu
    const editItems = await page.$x(
      `//div[@role='menu' or @role='listbox']//*[contains(normalize-space(.), 'Can edit') or contains(normalize-space(.), 'Full access')]`
    );
    if (editItems && editItems[0]) {
      await editItems[0].click();
      await sleep(400);
    }
    // verification
    const showsEdit = await page.evaluate(n => {
      const dlg = document.querySelector('[role="dialog"], [data-testid="popover"]');
      if (!dlg) return false;
      const txt = dlg.innerText.toLowerCase();
      return (
        txt.includes(n.toLowerCase()) && (txt.includes('can edit') || txt.includes('full access'))
      );
    }, name);
    if (!showsEdit)
      console.warn('Could not verify Can edit; please double-check this page manually.');
  }

  // Walk all pages
  const results = [];
  for (let i = 0; i < pages.length; i++) {
    const url = pages[i];
    console.log(`\n[${i + 1}/${pages.length}] Opening: ${url}`);
    let attempt = 0;
    let ok = false;
    let lastErr = null;
    while (attempt <= retries && !ok) {
      attempt++;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await sleep(1200);
        if (page.url().includes('notion.so/login')) {
          console.log(
            'Please log in to Notion in the opened window. Script will continue after login.'
          );
          await page.waitForFunction(() => !location.pathname.includes('login'), { timeout: 0 });
          await sleep(1500);
        }
        await clickShare();
        await addIntegration(integrationName);
        console.log(`✅ Invited (Can edit) integration to: ${url}`);
        ok = true;
        await page.keyboard.press('Escape');
        await sleep(300);
      } catch (err) {
        lastErr = err;
        console.warn(`Attempt ${attempt}/${retries + 1} failed: ${err.message}`);
        try {
          await page.keyboard.press('Escape');
        } catch {}
        await sleep(700);
      }
    }
    if (!ok) {
      console.error(`❌ Failed on ${url}: ${lastErr ? lastErr.message : 'Unknown error'}`);
      try {
        const shotsDir = path.join('tools', 'notion', 'screenshots');
        fs.mkdirSync(shotsDir, { recursive: true });
        const fname = path.join(shotsDir, `error_${i + 1}.png`);
        await page.screenshot({ path: fname, fullPage: true });
        console.log(`Saved screenshot: ${fname}`);
      } catch {}
      results.push({ url, status: 'failed', error: lastErr ? lastErr.message : 'unknown' });
    } else {
      results.push({ url, status: 'ok' });
    }
  }

  await browser.close();
  const summary = {
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    failed: results.filter(r => r.status === 'failed').length,
  };
  console.log('\nSummary:', summary);
  if (summary.failed > 0) {
    console.log(
      'Failed pages:',
      results.filter(r => r.status === 'failed')
    );
    process.exitCode = 2;
  }
}

run().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
