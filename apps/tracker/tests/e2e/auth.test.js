const puppeteer = require('puppeteer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    // Go to home
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });

    // Go to signup
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('text/Start Free Trial'),
    ]);

    // Fill signup form
    const email = `test+${Date.now()}@example.com`;
    const password = 'Password123!';

    await page.type('#name', 'Test User');
    await page.type('#email', email);
    await page.type('#password', password);
    await page.type('#confirmPassword', password);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button:has-text("Create account")'),
    ]);

    // Should redirect to /dashboard or /login depending on email confirmation setting
    const url = page.url();
    if (!url.includes('/dashboard') && !url.includes('/login')) {
      throw new Error(`Unexpected redirect: ${url}`);
    }

    // If on login, attempt login
    if (url.includes('/login')) {
      await page.type('#email', email);
      await page.type('#password', password);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('button:has-text("Sign in")'),
      ]);
    }

    if (!page.url().includes('/dashboard')) {
      throw new Error(`Did not reach dashboard: ${page.url()}`);
    }

    console.log('E2E auth flow passed');
  } catch (err) {
    console.error('E2E auth flow failed:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
