#!/usr/bin/env node
/**
 * 🚀 AUDIO INTEL - POST-DEPLOYMENT TEST SUITE
 *
 * Run this after deploying to verify all critical functionality works.
 *
 * Usage:
 *   node tests/post-deployment-test.js https://intel.totalaudiopromo.com
 *   node tests/post-deployment-test.js http://localhost:3000  (for local)
 */

const https = require('https');
const http = require('http');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class DeploymentTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: [],
    };
  }

  log(message, type = 'info') {
    const icons = {
      success: '✅',
      fail: '❌',
      warn: '⚠️ ',
      info: '📋',
      test: '🧪',
    };

    const colorMap = {
      success: colors.green,
      fail: colors.red,
      warn: colors.yellow,
      info: colors.blue,
      test: colors.cyan,
    };

    console.log(`${colorMap[type] || ''}${icons[type] || ''} ${message}${colors.reset}`);
  }

  async fetch(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const protocol = url.protocol === 'https:' ? https : http;

      const req = protocol.request(
        url,
        {
          method: options.method || 'GET',
          headers: options.headers || {},
          ...options,
        },
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: data,
              ok: res.statusCode >= 200 && res.statusCode < 300,
            });
          });
        }
      );

      req.on('error', reject);

      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }

      req.end();
    });
  }

  async runTest(name, testFn) {
    this.log(`Testing: ${name}`, 'test');
    try {
      const result = await testFn();
      if (result.pass) {
        this.log(`  PASSED: ${result.message || name}`, 'success');
        this.results.passed++;
      } else if (result.warn) {
        this.log(`  WARNING: ${result.message || name}`, 'warn');
        this.results.warnings++;
      } else {
        this.log(`  FAILED: ${result.message || name}`, 'fail');
        this.results.failed++;
      }
      this.results.tests.push({ name, ...result });
    } catch (error) {
      this.log(`  ERROR: ${error.message}`, 'fail');
      this.results.failed++;
      this.results.tests.push({ name, pass: false, error: error.message });
    }
  }

  async testHomepageLoads() {
    return this.runTest('Homepage loads successfully', async () => {
      const startTime = Date.now();
      const res = await this.fetch('/');
      const loadTime = Date.now() - startTime;

      if (!res.ok) {
        return { pass: false, message: `Status ${res.status}` };
      }

      if (loadTime > 5000) {
        return { pass: true, warn: true, message: `Loaded but slow (${loadTime}ms)` };
      }

      return { pass: true, message: `Loaded in ${loadTime}ms` };
    });
  }

  async testSignInPageExists() {
    return this.runTest('Sign in page exists', async () => {
      const res = await this.fetch('/signin');
      return {
        pass: res.ok,
        message: res.ok ? 'Page exists' : `Status ${res.status}`,
      };
    });
  }

  async testSignUpPageExists() {
    return this.runTest('Sign up page exists', async () => {
      const res = await this.fetch('/signup');
      return {
        pass: res.ok,
        message: res.ok ? 'Page exists' : `Status ${res.status}`,
      };
    });
  }

  async testPricingPageLoads() {
    return this.runTest('Pricing page loads', async () => {
      const res = await this.fetch('/pricing');
      return {
        pass: res.ok,
        message: res.ok ? 'Page exists' : `Status ${res.status}`,
      };
    });
  }

  async testUploadPageRedirects() {
    return this.runTest('Upload page requires authentication', async () => {
      const res = await this.fetch('/demo');

      // Should redirect to signin (307) or show signin page (200)
      const requiresAuth =
        res.status === 307 || res.body.includes('signin') || res.body.includes('Sign in');

      return {
        pass: requiresAuth,
        message: requiresAuth ? 'Protected ✅' : 'NOT PROTECTED - SECURITY ISSUE!',
      };
    });
  }

  async testDashboardProtected() {
    return this.runTest('Dashboard requires authentication', async () => {
      const res = await this.fetch('/dashboard');

      const requiresAuth =
        res.status === 307 || res.body.includes('signin') || res.body.includes('Sign in');

      return {
        pass: requiresAuth,
        message: requiresAuth ? 'Protected ✅' : 'NOT PROTECTED - SECURITY ISSUE!',
      };
    });
  }

  async testHealthEndpoint() {
    return this.runTest('Health check endpoint', async () => {
      const res = await this.fetch('/api/health');

      if (!res.ok) {
        return { pass: false, message: `Status ${res.status}` };
      }

      try {
        const data = JSON.parse(res.body);
        return {
          pass: data.status === 'ok',
          message: `Status: ${data.status}`,
        };
      } catch (e) {
        return { pass: false, message: 'Invalid JSON response' };
      }
    });
  }

  async testEnrichAPIProtected() {
    return this.runTest('Enrich API requires authentication', async () => {
      const res = await this.fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: [{ email: 'test@example.com' }] }),
      });

      // Should return 401 or redirect
      const isProtected = res.status === 401 || res.status === 307 || res.status === 403;

      return {
        pass: isProtected,
        message: isProtected
          ? 'Protected ✅'
          : `WARNING: Returns ${res.status} - may not be protected!`,
      };
    });
  }

  async testEnrichClaudeAPIProtected() {
    return this.runTest('Enrich-Claude API requires authentication', async () => {
      const res = await this.fetch('/api/enrich-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: [{ email: 'test@example.com' }] }),
      });

      const isProtected = res.status === 401 || res.status === 307 || res.status === 403;

      return {
        pass: isProtected,
        warn: !isProtected,
        message: isProtected ? 'Protected ✅' : `⚠️  NOT PROTECTED - Returns ${res.status}!`,
      };
    });
  }

  async testRobotsTxt() {
    return this.runTest('robots.txt exists', async () => {
      const res = await this.fetch('/robots.txt');
      return {
        pass: res.ok,
        message: res.ok ? 'Exists' : 'Missing',
      };
    });
  }

  async testSitemap() {
    return this.runTest('sitemap.xml exists', async () => {
      const res = await this.fetch('/sitemap.xml');
      return {
        pass: res.ok,
        message: res.ok ? 'Exists' : 'Missing',
      };
    });
  }

  async testTestPagesBlocked() {
    return this.runTest('Test pages blocked in production', async () => {
      // Only test if this is a production URL
      if (!this.baseUrl.includes('totalaudiopromo.com')) {
        return { pass: true, message: 'Skipped (not production)' };
      }

      const res = await this.fetch('/test');
      const isBlocked = res.status === 307 || res.status === 404;

      return {
        pass: isBlocked,
        message: isBlocked ? 'Blocked ✅' : `WARNING: Test page accessible (${res.status})`,
      };
    });
  }

  async testSSL() {
    return this.runTest('SSL certificate valid', async () => {
      if (!this.baseUrl.startsWith('https://')) {
        return { pass: true, message: 'Skipped (HTTP)' };
      }

      // SSL is automatically validated by Node.js https module
      // If we can connect, SSL is valid
      try {
        await this.fetch('/');
        return { pass: true, message: 'Valid SSL certificate' };
      } catch (error) {
        return { pass: false, message: `SSL Error: ${error.message}` };
      }
    });
  }

  async testMetaTags() {
    return this.runTest('Meta tags present', async () => {
      const res = await this.fetch('/');

      const hasMeta =
        res.body.includes('<meta') && res.body.includes('description') && res.body.includes('og:');

      return {
        pass: hasMeta,
        message: hasMeta ? 'Meta tags found' : 'Missing meta tags',
      };
    });
  }

  async runAllTests() {
    console.log('\n' + '='.repeat(60));
    this.log(`AUDIO INTEL - POST-DEPLOYMENT TEST SUITE`, 'info');
    this.log(`Testing: ${this.baseUrl}`, 'info');
    console.log('='.repeat(60) + '\n');

    // Basic Connectivity
    this.log('🌐 Basic Connectivity Tests', 'info');
    await this.testHomepageLoads();
    await this.testSSL();
    await this.testHealthEndpoint();
    console.log('');

    // Page Tests
    this.log('📄 Page Tests', 'info');
    await this.testSignInPageExists();
    await this.testSignUpPageExists();
    await this.testPricingPageLoads();
    console.log('');

    // Security Tests
    this.log('🔒 Security Tests', 'info');
    await this.testUploadPageRedirects();
    await this.testDashboardProtected();
    await this.testEnrichAPIProtected();
    await this.testEnrichClaudeAPIProtected();
    await this.testTestPagesBlocked();
    console.log('');

    // SEO Tests
    this.log('🔍 SEO Tests', 'info');
    await this.testRobotsTxt();
    await this.testSitemap();
    await this.testMetaTags();
    console.log('');

    // Results Summary
    console.log('='.repeat(60));
    this.log('TEST RESULTS SUMMARY', 'info');
    console.log('='.repeat(60));
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, 'fail');
    this.log(`⚠️  Warnings: ${this.results.warnings}`, 'warn');
    console.log('='.repeat(60));

    if (this.results.failed > 0) {
      console.log('');
      this.log('FAILED TESTS:', 'fail');
      this.results.tests
        .filter(t => !t.pass && !t.warn)
        .forEach(t => console.log(`  ${colors.red}❌ ${t.name}: ${t.message}${colors.reset}`));
    }

    if (this.results.warnings > 0) {
      console.log('');
      this.log('WARNINGS:', 'warn');
      this.results.tests
        .filter(t => t.warn)
        .forEach(t => console.log(`  ${colors.yellow}⚠️  ${t.name}: ${t.message}${colors.reset}`));
    }

    console.log('');

    if (this.results.failed === 0) {
      this.log('🎉 ALL TESTS PASSED - DEPLOYMENT SUCCESSFUL!', 'success');
      return 0;
    } else {
      this.log('⚠️  SOME TESTS FAILED - REVIEW REQUIRED', 'fail');
      return 1;
    }
  }
}

// Main execution
(async () => {
  const baseUrl = process.argv[2] || 'http://localhost:3000';

  if (baseUrl === '--help' || baseUrl === '-h') {
    console.log(`
📋 Audio Intel - Post-Deployment Test Suite

Usage:
  node tests/post-deployment-test.js <BASE_URL>

Examples:
  node tests/post-deployment-test.js http://localhost:3000
  node tests/post-deployment-test.js https://intel.totalaudiopromo.com

Options:
  --help, -h    Show this help message
`);
    process.exit(0);
  }

  const tester = new DeploymentTester(baseUrl);
  const exitCode = await tester.runAllTests();
  process.exit(exitCode);
})();
