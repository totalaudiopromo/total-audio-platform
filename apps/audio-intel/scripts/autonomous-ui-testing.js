#!/usr/bin/env node

/**
 * Autonomous UI Testing with Playwright
 * Runs comprehensive UI tests and validates deployment
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class AutonomousUITester {
  constructor() {
    this.baseUrl = 'https://intel.totalaudiopromo.com';
    this.testResults = {
      timestamp: new Date().toISOString(),
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      screenshots_captured: 0,
      performance_scores: {},
      issues_detected: [],
      recommendations: []
    };
  }

  async runAutonomousTests() {
    console.log('🎭 Starting Autonomous UI Testing Suite...');
    
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: 'Autonomous-UI-Tester/1.0'
      });
      
      const page = await context.newPage();
      
      // Test Suite 1: Homepage Validation
      await this.testHomepage(page);
      
      // Test Suite 2: Multi-viewport Testing
      await this.testResponsiveDesign(page);
      
      // Test Suite 3: Core Functionality
      await this.testCoreFunctionality(page);
      
      // Test Suite 4: Performance Analysis
      await this.testPerformance(page);
      
      // Test Suite 5: Brand Consistency
      await this.testBrandConsistency(page);
      
      await browser.close();
      
      // Generate Test Report
      await this.generateTestReport();
      
      return this.testResults;
      
    } catch (error) {
      console.error('❌ Autonomous UI testing failed:', error);
      await browser.close();
      throw error;
    }
  }

  async testHomepage(page) {
    console.log('🏠 Testing homepage...');
    this.testResults.total_tests++;
    
    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Validate founder story is present
      const founderStory = await page.textContent('body');
      if (founderStory.includes('sadact') && founderStory.includes('Decadance UK')) {
        this.testResults.passed_tests++;
        console.log('✅ Founder story validation passed');
      } else {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push('Founder story not found on homepage');
      }
      
      // Validate UK spelling
      const ukSpelling = founderStory.includes('organised') || founderStory.includes('analyse');
      if (ukSpelling) {
        this.testResults.passed_tests++;
        console.log('✅ UK spelling validation passed');
      } else {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push('UK spelling not consistently applied');
      }
      
      // Capture homepage screenshot
      await page.screenshot({ 
        path: `screenshots/homepage-${Date.now()}.png`,
        fullPage: true 
      });
      this.testResults.screenshots_captured++;
      
    } catch (error) {
      this.testResults.failed_tests++;
      this.testResults.issues_detected.push(`Homepage test failed: ${error.message}`);
    }
  }

  async testResponsiveDesign(page) {
    console.log('📱 Testing responsive design...');
    
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'ultrawide', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      this.testResults.total_tests++;
      
      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.reload({ waitUntil: 'networkidle' });
        
        // Check for mobile navigation if mobile viewport
        if (viewport.name === 'mobile') {
          const mobileNav = await page.locator('[data-testid="mobile-nav"], .mobile-nav, .md\\:hidden').count();
          if (mobileNav > 0) {
            this.testResults.passed_tests++;
            console.log(`✅ ${viewport.name} navigation test passed`);
          } else {
            this.testResults.failed_tests++;
            this.testResults.issues_detected.push(`Mobile navigation not found on ${viewport.name}`);
          }
        }
        
        // Capture screenshot for each viewport
        await page.screenshot({ 
          path: `screenshots/${viewport.name}-${Date.now()}.png`,
          fullPage: true 
        });
        this.testResults.screenshots_captured++;
        
      } catch (error) {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push(`${viewport.name} test failed: ${error.message}`);
      }
    }
  }

  async testCoreFunctionality(page) {
    console.log('⚙️ Testing core functionality...');
    
    // Test demo page
    this.testResults.total_tests++;
    try {
      await page.goto(`${this.baseUrl}/demo`, { waitUntil: 'networkidle' });
      
      const demoContent = await page.textContent('body');
      if (demoContent.includes('Upload') || demoContent.includes('Process')) {
        this.testResults.passed_tests++;
        console.log('✅ Demo page functionality test passed');
      } else {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push('Demo page functionality not working');
      }
      
    } catch (error) {
      this.testResults.failed_tests++;
      this.testResults.issues_detected.push(`Demo page test failed: ${error.message}`);
    }
  }

  async testPerformance(page) {
    console.log('⚡ Testing performance...');
    
    this.testResults.total_tests++;
    try {
      const startTime = Date.now();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      this.testResults.performance_scores.load_time = `${loadTime}ms`;
      
      if (loadTime < 3000) {
        this.testResults.passed_tests++;
        console.log(`✅ Performance test passed (${loadTime}ms)`);
      } else {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push(`Slow load time: ${loadTime}ms`);
        this.testResults.recommendations.push('Optimize page load time');
      }
      
    } catch (error) {
      this.testResults.failed_tests++;
      this.testResults.issues_detected.push(`Performance test failed: ${error.message}`);
    }
  }

  async testBrandConsistency(page) {
    console.log('🎨 Testing brand consistency...');
    
    this.testResults.total_tests++;
    try {
      await page.goto(this.baseUrl);
      
      // Check for Professional Blue color usage
      const blueElements = await page.locator('[class*="blue-"], [style*="blue"]').count();
      
      if (blueElements >= 3) {
        this.testResults.passed_tests++;
        console.log(`✅ Brand consistency test passed (${blueElements} blue elements found)`);
      } else {
        this.testResults.failed_tests++;
        this.testResults.issues_detected.push('Insufficient brand color usage');
        this.testResults.recommendations.push('Increase Professional Blue (#3b82f6) usage');
      }
      
    } catch (error) {
      this.testResults.failed_tests++;
      this.testResults.issues_detected.push(`Brand consistency test failed: ${error.message}`);
    }
  }

  async generateTestReport() {
    const report = {
      ...this.testResults,
      success_rate: Math.round((this.testResults.passed_tests / this.testResults.total_tests) * 100),
      overall_status: this.testResults.failed_tests === 0 ? 'PASSED' : 'FAILED',
      next_test_recommendation: this.testResults.failed_tests > 0 ? 'Fix detected issues before next deployment' : 'All systems operational'
    };
    
    const reportPath = path.join(__dirname, '..', 'test-reports', `ui-test-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Test report generated:', reportPath);
    console.log(`✅ Tests passed: ${this.testResults.passed_tests}/${this.testResults.total_tests}`);
    console.log(`📸 Screenshots: ${this.testResults.screenshots_captured}`);
    
    return report;
  }
}

// Run autonomous testing if called directly
if (require.main === module) {
  const tester = new AutonomousUITester();
  tester.runAutonomousTests()
    .then(results => {
      console.log('🎉 Autonomous UI testing completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Autonomous UI testing failed:', error);
      process.exit(1);
    });
}

module.exports = { AutonomousUITester };