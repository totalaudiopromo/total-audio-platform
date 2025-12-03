import { test } from '@playwright/test';

const pages = [
  { path: '/dashboard/overview', name: 'Dashboard Overview' },
  { path: '/dashboard/leads', name: 'Artist Discovery' },
  { path: '/dashboard/contacts', name: 'Contact Research' },
  { path: '/dashboard/crm', name: 'CRM Intelligence' },
  { path: '/dashboard/ops', name: 'Operations' },
  { path: '/dashboard/intake', name: 'Artist Intake' },
];

test.describe('Detailed Page Verification', () => {
  for (const pageInfo of pages) {
    test(pageInfo.name, async ({ page }) => {
      const errors = [];
      const warnings = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        } else if (msg.type() === 'warning') {
          warnings.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        errors.push('PAGE ERROR: ' + error.message);
      });

      const url = 'http://localhost:3005' + pageInfo.path;
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      await page.waitForTimeout(2000);

      const title = await page.title();
      const h1 = await page
        .locator('h1')
        .first()
        .textContent()
        .catch(() => null);
      const h2 = await page
        .locator('h2')
        .first()
        .textContent()
        .catch(() => null);
      const heading = h1 || h2 || 'No heading found';

      const screenshotPath =
        'test-results/screenshots/' + pageInfo.path.split('/').join('-') + '.png';
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log('\n' + '='.repeat(80));
      console.log(pageInfo.name + ' (' + pageInfo.path + ')');
      console.log('='.repeat(80));
      console.log('HTTP Status: ' + response.status());
      console.log('Page Title: ' + title);
      console.log('Main Heading: ' + heading);
      console.log('Errors: ' + errors.length);
      if (errors.length > 0) {
        errors.forEach((err, idx) => {
          console.log('  ' + (idx + 1) + '. ' + err);
        });
      }
      console.log('Warnings: ' + warnings.length);
      console.log('Screenshot: ' + screenshotPath);
      console.log('Overall Status: ' + (response.status() === 200 ? 'PASS' : 'FAIL'));
      console.log('');
    });
  }
});
