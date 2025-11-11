/**
 * Diagnostic script to test enrichment
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { ClaudeEnrichmentService } = require('./utils/claudeEnrichmentService');
const { googleSearch } = require('./utils/googleSearchService');

async function testEnrichment() {
  console.log('\n=== DIAGNOSTIC TEST ===\n');

  // Check Google API config
  console.log('Google API Configuration:');
  console.log(
    '  API Key:',
    process.env.GOOGLE_SEARCH_API_KEY
      ? process.env.GOOGLE_SEARCH_API_KEY.substring(0, 10) + '...'
      : 'NOT SET'
  );
  console.log('  Search Engine ID:', process.env.GOOGLE_SEARCH_ENGINE_ID || 'NOT SET');
  console.log('  isAvailable:', googleSearch.isAvailable());
  console.log('  Quota:', googleSearch.getQuotaStatus());

  // Test enrichment
  console.log('\nTesting enrichment for: chrisschofield@libertymusicpr.com');

  const service = new ClaudeEnrichmentService();
  const contact = {
    name: 'Chris Schofield',
    email: 'chrisschofield@libertymusicpr.com',
  };

  const startTime = Date.now();
  const result = await service.enrichContact(contact);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\nResult:');
  console.log('  Duration:', duration + 's');
  console.log('  Source:', result.source);
  console.log('  Confidence:', result.confidence);
  console.log('  Platform:', result.platform);
  console.log('  Role:', result.role);
  console.log('  Cost:', result.cost ? '$' + result.cost.toFixed(4) : 'N/A');
  console.log('  Reasoning:', result.reasoning);

  console.log('\n=== END TEST ===\n');
}

testEnrichment().catch(console.error);
