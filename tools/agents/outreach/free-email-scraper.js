#!/usr/bin/env node

/**
 * FREE Email Scraper for Radio Promoters
 *
 * Uses 100% free methods:
 * 1. Google Maps scraping (Puppeteer MCP)
 * 2. Hunter.io free plan (25 searches/month)
 * 3. Snov.io free plan (50 credits/month)
 * 4. Manual LinkedIn verification
 *
 * Target: 50-100 qualified radio promoter emails/month
 * Cost: £0
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'tools/agents/outreach/data');
const PROSPECTS_FILE = join(OUTPUT_DIR, 'radio-promoters.json');

// Free tier limits
const LIMITS = {
  hunter: 25, // Hunter.io free: 25 searches/month
  snov: 50, // Snov.io free: 50 credits/month
  googlemaps: 100, // Manual scraping limit per session
};

class FreeEmailScraper {
  constructor() {
    this.prospects = this.loadProspects();
    this.stats = {
      found: 0,
      validated: 0,
      remaining: {
        hunter: LIMITS.hunter,
        snov: LIMITS.snov,
      },
    };
  }

  loadProspects() {
    if (existsSync(PROSPECTS_FILE)) {
      return JSON.parse(readFileSync(PROSPECTS_FILE, 'utf8'));
    }
    return [];
  }

  saveProspects() {
    if (!existsSync(OUTPUT_DIR)) {
      require('fs').mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    writeFileSync(PROSPECTS_FILE, JSON.stringify(this.prospects, null, 2));
    console.log(`✅ Saved ${this.prospects.length} prospects to ${PROSPECTS_FILE}`);
  }

  /**
   * Step 1: Google Maps Scraping
   * Search: "radio promotion UK", "music PR agency UK"
   */
  async scrapeGoogleMaps(searchQuery) {
    console.log(`\n🔍 Scraping Google Maps: "${searchQuery}"\n`);
    console.log('📋 MANUAL STEPS (Use Puppeteer MCP):');
    console.log('1. Open: https://www.google.com/maps');
    console.log(`2. Search: "${searchQuery}"`);
    console.log('3. Scroll through results (target: 20-30 results)');
    console.log('4. For each result, extract:');
    console.log('   - Company name');
    console.log('   - Website URL');
    console.log('   - Phone (optional)');
    console.log('   - Location\n');

    // Return example structure for manual entry
    return {
      instructions:
        'After scraping, add results to tools/agents/outreach/data/google-maps-raw.json',
      exampleFormat: [
        {
          name: 'BBC Radio Pluggers',
          website: 'https://bbcradiopluggers.co.uk',
          phone: '+44 20 1234 5678',
          location: 'London, UK',
          source: 'google_maps',
          scraped_at: new Date().toISOString(),
        },
      ],
    };
  }

  /**
   * Step 2: Hunter.io Integration (Free Plan)
   * 25 searches/month - use strategically
   */
  async findEmailWithHunter(domain) {
    if (this.stats.remaining.hunter <= 0) {
      console.log('❌ Hunter.io free limit reached (25/month)');
      return null;
    }

    console.log(`\n🔍 Hunter.io: Finding emails for ${domain}`);
    console.log('📋 MANUAL STEPS:');
    console.log(`1. Go to: https://hunter.io/search/${domain}`);
    console.log('2. Copy the most relevant email (usually founder/director)');
    console.log('3. Note the email pattern (e.g., {first}@domain.com)\n');

    this.stats.remaining.hunter--;

    return {
      instructions: 'Use Hunter.io web interface (25 free searches/month)',
      url: `https://hunter.io/search/${domain}`,
      note: `Remaining searches: ${this.stats.remaining.hunter}/25`,
    };
  }

  /**
   * Step 3: Snov.io Integration (Free Plan)
   * 50 credits/month - use after Hunter exhausted
   */
  async findEmailWithSnov(domain) {
    if (this.stats.remaining.snov <= 0) {
      console.log('❌ Snov.io free limit reached (50/month)');
      return null;
    }

    console.log(`\n🔍 Snov.io: Finding emails for ${domain}`);
    console.log('📋 MANUAL STEPS:');
    console.log(`1. Go to: https://snov.io/email-finder`);
    console.log(`2. Enter domain: ${domain}`);
    console.log('3. Copy verified emails\n');

    this.stats.remaining.snov--;

    return {
      instructions: 'Use Snov.io web interface (50 free credits/month)',
      url: 'https://snov.io/email-finder',
      note: `Remaining credits: ${this.stats.remaining.snov}/50`,
    };
  }

  /**
   * Step 4: LinkedIn Manual Verification
   * Confirm the person is real and relevant
   */
  async verifyOnLinkedIn(companyName, email) {
    console.log(`\n👤 LinkedIn Verification: ${companyName}`);
    console.log('📋 MANUAL STEPS:');
    console.log(`1. Search LinkedIn: "${companyName} radio promotion"`);
    console.log('2. Find company page or key contact');
    console.log('3. Verify they do radio promotion');
    console.log('4. Note: Job title, years in role, mutual connections\n');

    return {
      instructions: 'Manual LinkedIn verification',
      searchUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(companyName + ' radio promotion')}`,
      note: 'Look for: Founder, Director, Head of Radio, Senior Plugger',
    };
  }

  /**
   * Generate outreach workflow
   */
  generateWorkflow() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 FREE EMAIL SCRAPING WORKFLOW');
    console.log('='.repeat(60) + '\n');

    console.log('🎯 TARGET: 50 qualified radio promoter emails/month\n');

    console.log('WEEK 1: Google Maps Scraping (FREE)');
    console.log('--------------------------------');
    console.log('1. Search Google Maps: "radio promotion UK"');
    console.log('2. Extract 30 company websites');
    console.log('3. Save to: tools/agents/outreach/data/google-maps-raw.json\n');

    console.log('WEEK 2: Email Finding (FREE)');
    console.log('--------------------------------');
    console.log('1. Use Hunter.io free: 25 email searches');
    console.log('   - Focus on biggest/most relevant companies first');
    console.log('2. Use Snov.io free: 25 more email searches');
    console.log('   - Different database, might find emails Hunter missed');
    console.log('3. Total found: ~40-45 emails (80-90% success rate)\n');

    console.log('WEEK 3: LinkedIn Verification (FREE)');
    console.log('--------------------------------');
    console.log('1. Check each contact on LinkedIn');
    console.log('2. Confirm they work in radio promotion');
    console.log('3. Note job title, experience, mutual connections');
    console.log('4. Discard any that are not radio promoters\n');

    console.log('WEEK 4: Enrichment + Outreach (FREE)');
    console.log('--------------------------------');
    console.log('1. Use Audio Intel contact-enrichment on final list');
    console.log('2. Generate personalised emails using Liberty Email Agent');
    console.log('3. Send via Gmail (use your existing setup)');
    console.log('4. Track in Gmail Autopilot\n');

    console.log('📊 EXPECTED RESULTS:');
    console.log('- 50 qualified radio promoter emails');
    console.log('- 85% conversion rate = 42 demos booked');
    console.log('- 10% close rate = 4 paying customers');
    console.log('- Revenue: 4 × £19 = £76/month\n');

    console.log('💰 TOTAL COST: £0\n');
  }

  /**
   * Generate example prospect file
   */
  generateExampleFile() {
    const example = [
      {
        id: 1,
        company: 'BBC Radio Pluggers',
        website: 'https://bbcradiopluggers.co.uk',
        contact_name: 'Sarah Johnson',
        email: 'sarah@bbcradiopluggers.co.uk',
        job_title: 'Founder & Director',
        phone: '+44 20 1234 5678',
        location: 'London, UK',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        source: 'google_maps',
        verified: true,
        notes: 'Pitched to BBC Radio 1 successfully, 10+ years experience',
        scraped_at: new Date().toISOString(),
      },
      {
        id: 2,
        company: 'Independent Music Promotions',
        website: 'https://indiepromo.co.uk',
        contact_name: 'Mike Thompson',
        email: 'mike@indiepromo.co.uk',
        job_title: 'Head of Radio',
        phone: '+44 161 987 6543',
        location: 'Manchester, UK',
        linkedin: 'https://linkedin.com/in/mikethompson',
        source: 'hunter_io',
        verified: true,
        notes: 'Specialises in indie/alternative, BBC 6 Music connections',
        scraped_at: new Date().toISOString(),
      },
    ];

    const exampleFile = join(OUTPUT_DIR, 'example-prospects.json');
    writeFileSync(exampleFile, JSON.stringify(example, null, 2));
    console.log(`\n✅ Example file created: ${exampleFile}`);
    console.log('📋 Use this format for your scraped data\n');
  }

  /**
   * Show current stats
   */
  showStats() {
    console.log('\n📊 FREE TIER USAGE:');
    console.log('--------------------------------');
    console.log(`Hunter.io: ${LIMITS.hunter - this.stats.remaining.hunter}/${LIMITS.hunter} used`);
    console.log(`Snov.io: ${LIMITS.snov - this.stats.remaining.snov}/${LIMITS.snov} used`);
    console.log(`\nTotal prospects: ${this.prospects.length}`);
    console.log(`Validated: ${this.stats.validated}`);
  }
}

// CLI Interface
async function main() {
  console.log('\n🚀 FREE EMAIL SCRAPER FOR RADIO PROMOTERS\n');

  const scraper = new FreeEmailScraper();

  const command = process.argv[2];

  switch (command) {
    case 'workflow':
      scraper.generateWorkflow();
      break;

    case 'example':
      scraper.generateExampleFile();
      break;

    case 'maps':
      const query = process.argv[3] || 'radio promotion UK';
      await scraper.scrapeGoogleMaps(query);
      break;

    case 'hunter':
      const domain = process.argv[3];
      if (!domain) {
        console.log('❌ Usage: npm run scraper hunter example.com');
        process.exit(1);
      }
      await scraper.findEmailWithHunter(domain);
      break;

    case 'snov':
      const snovDomain = process.argv[3];
      if (!snovDomain) {
        console.log('❌ Usage: npm run scraper snov example.com');
        process.exit(1);
      }
      await scraper.findEmailWithSnov(snovDomain);
      break;

    case 'linkedin':
      const company = process.argv[3];
      if (!company) {
        console.log('❌ Usage: npm run scraper linkedin "Company Name"');
        process.exit(1);
      }
      await scraper.verifyOnLinkedIn(company);
      break;

    case 'stats':
      scraper.showStats();
      break;

    default:
      console.log('FREE EMAIL SCRAPER - Commands:\n');
      console.log('  workflow     - Show complete workflow');
      console.log('  example      - Generate example prospect file');
      console.log('  maps         - Google Maps scraping instructions');
      console.log('  hunter       - Hunter.io email finder');
      console.log('  snov         - Snov.io email finder');
      console.log('  linkedin     - LinkedIn verification');
      console.log('  stats        - Show free tier usage\n');
      console.log('Examples:');
      console.log('  node free-email-scraper.js workflow');
      console.log('  node free-email-scraper.js maps "radio promotion UK"');
      console.log('  node free-email-scraper.js hunter bbcradiopluggers.co.uk');
  }
}

main().catch(console.error);
