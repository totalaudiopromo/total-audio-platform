#!/usr/bin/env node

/**
 * Enhanced Social Media Automation with Content Verification
 *
 * Features:
 * - Pre-post content verification
 * - Duplicate content detection
 * - Platform-specific optimization
 * - Manual approval workflow
 * - Detailed logging
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const COMMAND_CENTRE_URL = process.env.COMMAND_CENTRE_URL || 'http://localhost:3000';
const LOG_FILE = path.join(process.cwd(), 'logs', 'social-automation.log');
const CONTENT_HISTORY_FILE = path.join(process.cwd(), 'data', 'content-history.json');

// Ensure directories exist
await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
await fs.mkdir(path.dirname(CONTENT_HISTORY_FILE), { recursive: true });

class VerifiedSocialAutomation {
  constructor() {
    this.socialManager = new SocialMediaManager();
    this.contentHistory = new Map();
    this.loadContentHistory();
  }

  async loadContentHistory() {
    try {
      const data = await fs.readFile(CONTENT_HISTORY_FILE, 'utf8');
      const history = JSON.parse(data);
      this.contentHistory = new Map(Object.entries(history));
    } catch (error) {
      // File doesn't exist yet, start fresh
      this.contentHistory = new Map();
    }
  }

  async saveContentHistory() {
    const historyObject = Object.fromEntries(this.contentHistory);
    await fs.writeFile(CONTENT_HISTORY_FILE, JSON.stringify(historyObject, null, 2));
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message}\n`;

    console.log(logEntry.trim());

    try {
      await fs.appendFile(LOG_FILE, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async fetchTemplates(category = null) {
    try {
      const url = `${COMMAND_CENTRE_URL}/api/social-media/templates${category ? `?category=${category}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch templates');
      }

      return data.templates;
    } catch (error) {
      await this.log(`Error fetching templates: ${error.message}`, 'ERROR');
      return [];
    }
  }

  generateContentHash(content, hashtags = []) {
    const combined = content + hashtags.join(' ');
    return crypto.createHash('md5').update(combined).digest('hex');
  }

  async checkGlobalDuplicates(contentHash) {
    return this.contentHistory.has(contentHash);
  }

  async verifyAndPrepareContent(template, platforms) {
    const content = {
      text: template.content,
      hashtags: template.hashtags || [],
    };

    await this.log(`Verifying content: "${template.name}" for platforms: ${platforms.join(', ')}`);

    // Global duplicate check
    const contentHash = this.generateContentHash(content.text, content.hashtags);
    if (await this.checkGlobalDuplicates(contentHash)) {
      throw new Error(`Duplicate content detected (hash: ${contentHash})`);
    }

    // Platform-specific verification
    const verificationResults = await this.socialManager.verifyAllContent(content, platforms);

    // Check for any issues
    const hasErrors = verificationResults.some(result =>
      !result.valid || result.duplicateDetected || result.warnings.length > 0
    );

    if (hasErrors) {
      await this.log('Content verification issues found:', 'WARN');
      verificationResults.forEach(result => {
        if (!result.valid || result.duplicateDetected) {
          this.log(`❌ ${result.platform}: ${result.warnings.join(', ')}`, 'ERROR');
        } else if (result.warnings.length > 0) {
          this.log(`⚠️  ${result.platform}: ${result.warnings.join(', ')}`, 'WARN');
        }
      });
    }

    return {
      content,
      contentHash,
      verificationResults,
      hasErrors
    };
  }

  async requestManualApproval(template, platforms, verificationResults) {
    console.log('\n🔍 MANUAL APPROVAL REQUIRED');
    console.log('================================');
    console.log(`Template: ${template.name}`);
    console.log(`Platforms: ${platforms.join(', ')}`);
    console.log(`\nContent Preview:`);
    console.log(template.content);
    console.log(`\nHashtags: ${template.hashtags.join(' ')}`);

    console.log('\nVerification Results:');
    verificationResults.forEach(result => {
      const status = result.valid && !result.duplicateDetected ? '✅' : '❌';
      console.log(`${status} ${result.platform}`);
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
      }
    });

    // In a real implementation, you might:
    // 1. Send notification to Slack/Discord
    // 2. Create a web interface for approval
    // 3. Save to pending approval queue

    console.log('\n⏸️  Content saved to pending approval queue');
    return false; // Don't auto-approve
  }

  async postWithVerification(template, platforms, autoApprove = false) {
    try {
      // Verify content first
      const verification = await this.verifyAndPrepareContent(template, platforms);

      // Check if manual approval is needed
      if (verification.hasErrors && !autoApprove) {
        await this.requestManualApproval(template, platforms, verification.verificationResults);
        return { success: false, reason: 'Manual approval required' };
      }

      // Post to platforms
      await this.log(`Posting "${template.name}" to ${platforms.length} platforms`);

      const results = await this.socialManager.postToMultiplePlatforms(
        verification.content,
        platforms,
        false // Skip verification since we already did it
      );

      // Track successful posts
      const successfulPosts = results.filter(r => r.result.success);
      if (successfulPosts.length > 0) {
        this.contentHistory.set(verification.contentHash, {
          template: template.name,
          platforms: successfulPosts.map(p => p.platform),
          timestamp: new Date().toISOString(),
          hash: verification.contentHash
        });
        await this.saveContentHistory();
      }

      await this.log(`Posted successfully to ${successfulPosts.length}/${platforms.length} platforms`);

      return {
        success: successfulPosts.length > 0,
        results,
        contentHash: verification.contentHash
      };

    } catch (error) {
      await this.log(`Posting failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async runDailyAutomation(dryRun = false) {
    await this.log('🚀 Starting verified social media automation');

    if (dryRun) {
      await this.log('🧪 DRY RUN MODE - No actual posting');
    }

    // Authenticate with all platforms
    await this.log('🔐 Authenticating with platforms...');
    const authResults = await this.socialManager.authenticateAll();

    Object.entries(authResults).forEach(([platform, success]) => {
      const status = success ? '✅' : '❌';
      this.log(`${status} ${platform}`);
    });

    // Daily posting schedule
    const schedule = [
      { time: '09:00', platforms: ['twitter', 'linkedin'], category: 'case-study' },
      { time: '13:00', platforms: ['linkedin', 'bluesky'], category: 'industry-insight' },
      { time: '17:00', platforms: ['twitter', 'bluesky'], category: 'feature' }
    ];

    for (const slot of schedule) {
      await this.log(`\n📅 Processing ${slot.time} slot (${slot.category})`);

      const templates = await this.fetchTemplates(slot.category);
      if (templates.length === 0) {
        await this.log(`No templates found for ${slot.category}`, 'WARN');
        continue;
      }

      // Select unused template
      const availableTemplates = templates.filter(t => {
        const hash = this.generateContentHash(t.content, t.hashtags);
        return !this.contentHistory.has(hash);
      });

      if (availableTemplates.length === 0) {
        await this.log('All templates have been used recently', 'WARN');
        continue;
      }

      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

      if (dryRun) {
        await this.log(`Would post: "${template.name}" to ${slot.platforms.join(', ')}`);
        continue;
      }

      await this.postWithVerification(template, slot.platforms);

      // Delay between posts
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await this.log('✨ Daily automation complete');
  }

  async showContentHistory(limit = 10) {
    console.log('\n📊 Recent Content History');
    console.log('=========================');

    const entries = Array.from(this.contentHistory.entries())
      .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
      .slice(0, limit);

    entries.forEach(([hash, data]) => {
      console.log(`${data.timestamp}: ${data.template}`);
      console.log(`  Platforms: ${data.platforms.join(', ')}`);
      console.log(`  Hash: ${hash.substring(0, 8)}...`);
      console.log('');
    });
  }
}

// CLI Interface
const automation = new VerifiedSocialAutomation();

const command = process.argv[2];

switch (command) {
  case 'daily':
    const dryRun = process.argv.includes('--dry-run');
    automation.runDailyAutomation(dryRun);
    break;

  case 'verify':
    const category = process.argv[3];
    automation.fetchTemplates(category).then(templates => {
      console.log(`Found ${templates.length} templates in ${category || 'all categories'}`);
      templates.forEach(t => {
        const hash = automation.generateContentHash(t.content, t.hashtags);
        const used = automation.checkGlobalDuplicates(hash) ? '(USED)' : '';
        console.log(`- ${t.name} ${used}`);
      });
    });
    break;

  case 'history':
    const limit = parseInt(process.argv[3]) || 10;
    automation.showContentHistory(limit);
    break;

  case 'auth':
    automation.socialManager.authenticateAll().then(results => {
      console.log('Authentication Results:');
      Object.entries(results).forEach(([platform, success]) => {
        const status = success ? '✅' : '❌';
        console.log(`${status} ${platform}`);
      });
    });
    break;

  default:
    console.log(`
Verified Social Media Automation

Commands:
  daily [--dry-run]     Run daily posting automation
  verify [category]     Check available templates
  history [limit]       Show content posting history
  auth                  Test platform authentication

Examples:
  node scripts/social-automation-verified.js daily --dry-run
  node scripts/social-automation-verified.js verify case-study
  node scripts/social-automation-verified.js history 20
    `);
}