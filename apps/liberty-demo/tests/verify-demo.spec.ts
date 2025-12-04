import { test, expect } from '@playwright/test';

const pages = [
  { path: '/dashboard/overview', name: 'Dashboard Overview' },
  { path: '/dashboard/leads', name: 'Artist Discovery' },
  { path: '/dashboard/contacts', name: 'Contact Research' },
  { path: '/dashboard/crm', name: 'CRM Intelligence' },
  { path: '/dashboard/ops', name: 'Operations' },
  { path: '/dashboard/intake', name: 'Artist Intake' },
];

test.describe('Liberty Demo Verification', () => {
  for (const pageInfo of pages) {
    test(pageInfo.name + ' should load correctly', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        errors.push('Page Error: ' + error.message);
      });

      const url = 'http://localhost:3005' + pageInfo.path;
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
      });

      expect(response.status()).toBe(200);

      await page.waitForTimeout(2000);

      const heading = await page.locator('h1, h2').first().textContent();
      expect(heading).toBeTruthy();

      const screenshotName = pageInfo.path.split('/').join('-') + '.png';
      await page.screenshot({
        path: 'test-results/' + screenshotName,
        fullPage: true,
      });

      expect(errors.length).toBe(0);
    });
  }
});
