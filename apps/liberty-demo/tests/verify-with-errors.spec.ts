import { test } from '@playwright/test';

const pages = [
  { path: '/dashboard/overview', name: 'Dashboard Overview' },
  { path: '/dashboard/leads', name: 'Artist Discovery' },
  { path: '/dashboard/contacts', name: 'Contact Research' },
  { path: '/dashboard/crm', name: 'CRM Intelligence' },
  { path: '/dashboard/ops', name: 'Operations' },
  { path: '/dashboard/intake', name: 'Artist Intake' },
];

test.describe('Liberty Demo Error Capture', () => {
  for (const pageInfo of pages) {
    test(pageInfo.name + ' error capture', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        errors.push('PAGE ERROR: ' + error.message);
      });

      const url = 'http://localhost:3005' + pageInfo.path;

      try {
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 15000,
        });

        await page.waitForTimeout(3000);

        console.log('\n=== ' + pageInfo.name + ' (' + pageInfo.path + ') ===');
        console.log('Status: Page loaded successfully');
        console.log('Errors found: ' + errors.length);
        if (errors.length > 0) {
          console.log('ERROR LIST:');
          errors.forEach((err, idx) => {
            console.log('  ' + (idx + 1) + '. ' + err);
          });
        }
      } catch (error) {
        console.log('\n=== ' + pageInfo.name + ' (' + pageInfo.path + ') ===');
        console.log('Status: FAILED TO LOAD');
        console.log('Error: ' + error.message);
      }
    });
  }
});
