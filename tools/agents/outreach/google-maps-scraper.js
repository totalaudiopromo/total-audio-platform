#!/usr/bin/env node

/**
 * Google Maps Scraper for Radio Promoters
 *
 * Uses Puppeteer MCP to automatically scrape radio promoter data
 * Target: 100+ companies per search (100% FREE)
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'tools/agents/outreach/data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'google-maps-raw.json');

// Search queries for radio promoters
const SEARCH_QUERIES = [
  'radio promotion UK',
  'music PR agency UK',
  'radio plugger UK',
  'independent radio promoter UK',
  'BBC radio promotion UK',
  'music promotion agency London',
  'radio campaign manager UK',
  'music marketing agency UK'
];

class GoogleMapsScraper {
  constructor() {
    this.results = [];
  }

  /**
   * Puppeteer MCP Instructions
   * (Manual execution via Claude Code MCP)
   */
  async scrapeQuery(query) {
    console.log(`\n🔍 Scraping Google Maps: "${query}"`);
    console.log('='.repeat(60) + '\n');

    console.log('📋 PUPPETEER MCP COMMANDS:\n');

    console.log('1️⃣  Navigate to Google Maps:');
    console.log('    mcp__puppeteer__puppeteer_navigate');
    console.log(`    url: https://www.google.com/maps/search/${encodeURIComponent(query)}\n`);

    console.log('2️⃣  Wait for results to load (3 seconds)\n');

    console.log('3️⃣  Extract data using this script:');
    console.log('    mcp__puppeteer__puppeteer_evaluate\n');

    const extractScript = `
// Extract all business listings from Google Maps
const results = [];
const listings = document.querySelectorAll('[role="article"]');

console.log(\`Found \${listings.length} listings\`);

listings.forEach((listing, index) => {
  try {
    const nameEl = listing.querySelector('[class*="fontHeadlineSmall"]');
    const websiteEl = listing.querySelector('a[href*="http"]');
    const phoneEl = listing.querySelector('button[data-item-id*="phone"]');
    const addressEl = listing.querySelector('button[data-item-id*="address"]');

    if (nameEl) {
      const result = {
        id: index + 1,
        name: nameEl.textContent.trim(),
        website: websiteEl ? websiteEl.href : null,
        phone: phoneEl ? phoneEl.getAttribute('data-value') : null,
        address: addressEl ? addressEl.textContent.trim() : null,
        source: 'google_maps',
        query: '${query}',
        scraped_at: new Date().toISOString()
      };

      results.push(result);
    }
  } catch (e) {
    console.log(\`Error parsing listing \${index}: \${e.message}\`);
  }
});

console.log(\`Extracted \${results.length} results\`);
return results;
`;

    console.log('```javascript');
    console.log(extractScript.trim());
    console.log('```\n');

    console.log('4️⃣  Scroll down to load more results (repeat 3-4 times)\n');

    console.log('5️⃣  Save results to file\n');

    return {
      query,
      instructions: 'Use Puppeteer MCP via Claude Code',
      expectedResults: '20-50 businesses per query',
      outputFile: OUTPUT_FILE
    };
  }

  /**
   * Alternative: Manual scraping instructions
   */
  manualScraping(query) {
    console.log(`\n📝 MANUAL SCRAPING: "${query}"`);
    console.log('='.repeat(60) + '\n');

    console.log('1. Open: https://www.google.com/maps');
    console.log(`2. Search: "${query}"`);
    console.log('3. Scroll through results (aim for 20-30)');
    console.log('4. For each result, copy:');
    console.log('   • Company name');
    console.log('   • Website URL (click to verify it works)');
    console.log('   • Phone number (optional)');
    console.log('   • Location\n');

    console.log('5. Add to spreadsheet or JSON file:');
    console.log(`   ${OUTPUT_FILE}\n`);

    console.log('📋 EXAMPLE FORMAT:\n');
    console.log(JSON.stringify({
      name: "BBC Radio Pluggers",
      website: "https://bbcradiopluggers.co.uk",
      phone: "+44 20 1234 5678",
      address: "London, UK",
      source: "google_maps",
      query: query,
      scraped_at: new Date().toISOString()
    }, null, 2));
    console.log('\n');
  }

  /**
   * Process scraped data
   */
  async processResults(rawResults) {
    console.log(`\n🔄 Processing ${rawResults.length} results...\n`);

    const processed = rawResults
      .filter(r => r.website) // Only keep results with websites
      .map(r => ({
        ...r,
        domain: this.extractDomain(r.website),
        priority: this.calculatePriority(r)
      }))
      .sort((a, b) => b.priority - a.priority);

    console.log(`✅ Processed: ${processed.length} results with websites`);
    console.log(`❌ Filtered: ${rawResults.length - processed.length} results without websites\n`);

    return processed;
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  calculatePriority(result) {
    let score = 0;

    // Higher priority for UK domains
    if (result.domain?.endsWith('.co.uk')) score += 3;
    if (result.domain?.endsWith('.uk')) score += 2;

    // Higher priority for relevant keywords
    const keywords = ['radio', 'promotion', 'plugger', 'PR', 'music'];
    keywords.forEach(keyword => {
      if (result.name?.toLowerCase().includes(keyword.toLowerCase())) score += 1;
    });

    // Has phone number
    if (result.phone) score += 1;

    // Has address
    if (result.address) score += 1;

    return score;
  }

  /**
   * Generate complete workflow
   */
  generateWorkflow() {
    console.log('\n' + '='.repeat(60));
    console.log('🗺️  GOOGLE MAPS SCRAPING WORKFLOW');
    console.log('='.repeat(60) + '\n');

    console.log('🎯 GOAL: Scrape 100+ radio promoter companies (100% FREE)\n');

    console.log('OPTION 1: Automated (Puppeteer MCP)');
    console.log('-------------------------------------');
    console.log('1. Use Claude Code with Puppeteer MCP');
    console.log('2. Run scraper for each search query:');
    SEARCH_QUERIES.forEach((q, i) => {
      console.log(`   ${i + 1}. "${q}"`);
    });
    console.log('3. Expected: 20-30 results per query');
    console.log('4. Total: 160-240 companies\n');

    console.log('OPTION 2: Manual (1-2 hours)');
    console.log('-------------------------------------');
    console.log('1. Open Google Maps in browser');
    console.log('2. Search each query above');
    console.log('3. Copy data to spreadsheet/JSON');
    console.log('4. Aim for 100+ companies\n');

    console.log('📊 WHAT TO EXTRACT:');
    console.log('• Company name (required)');
    console.log('• Website URL (required)');
    console.log('• Phone number (optional but helpful)');
    console.log('• Location (optional)\n');

    console.log('💾 SAVE TO:');
    console.log(`${OUTPUT_FILE}\n`);

    console.log('⏭️  NEXT STEPS:');
    console.log('1. Run: node free-email-scraper.js hunter [domain]');
    console.log('2. Find emails for each company');
    console.log('3. Validate on LinkedIn');
    console.log('4. Enrich with Audio Intel');
    console.log('5. Send cold emails via Liberty Email Agent\n');
  }

  /**
   * Quick start guide
   */
  quickStart() {
    console.log('\n⚡ QUICK START (5 minutes)\n');
    console.log('1. Google Maps → Search: "radio promotion UK"');
    console.log('2. Find 10 companies with websites');
    console.log('3. Save to text file (just names & websites)');
    console.log('4. Run: node free-email-scraper.js hunter [domain]');
    console.log('5. Send first cold email today\n');
    console.log('🎯 Target: 10 emails sent this week = 8 demos booked\n');
  }
}

// CLI Interface
async function main() {
  const scraper = new GoogleMapsScraper();
  const command = process.argv[2];

  switch (command) {
    case 'workflow':
      scraper.generateWorkflow();
      break;

    case 'quick':
      scraper.quickStart();
      break;

    case 'scrape':
      const query = process.argv[3] || SEARCH_QUERIES[0];
      await scraper.scrapeQuery(query);
      break;

    case 'manual':
      const manualQuery = process.argv[3] || SEARCH_QUERIES[0];
      scraper.manualScraping(manualQuery);
      break;

    case 'queries':
      console.log('\n📋 RECOMMENDED SEARCH QUERIES:\n');
      SEARCH_QUERIES.forEach((q, i) => {
        console.log(`${i + 1}. "${q}"`);
      });
      console.log('\n💡 Use each query to find 20-30 companies\n');
      break;

    default:
      console.log('\n🗺️  GOOGLE MAPS SCRAPER - Commands:\n');
      console.log('  workflow   - Complete scraping workflow');
      console.log('  quick      - Quick start guide (5 min)');
      console.log('  scrape     - Puppeteer MCP instructions');
      console.log('  manual     - Manual scraping instructions');
      console.log('  queries    - Show search queries\n');
      console.log('Examples:');
      console.log('  node google-maps-scraper.js workflow');
      console.log('  node google-maps-scraper.js quick');
      console.log('  node google-maps-scraper.js scrape "radio promotion UK"');
      console.log('  node google-maps-scraper.js manual "music PR London"\n');
  }
}

main().catch(console.error);
