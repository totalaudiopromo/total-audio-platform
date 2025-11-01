#!/usr/bin/env ts-node

require('dotenv').config();
// Support running as JS or with ts-node
try {
  require('ts-node/register');
} catch (e) {}
const { AirtableContactEnrichment } = require('../src/services/airtableContactEnrichment.ts');
const { PerplexityService } = require('../src/integrations/perplexity/index.ts');
const {
  previewPerplexityContactResearch,
} = require('../src/services/perplexityContactResearch.ts');

async function main() {
  // Load config from env
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || '';
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey || !baseId || !contactsTableId || !perplexityApiKey) {
    console.error('❌ Missing required environment variables.');
    process.exit(1);
  }

  const airtable = new AirtableContactEnrichment(apiKey, baseId, contactsTableId, firecrawlApiKey);
  const perplexity = new PerplexityService(perplexityApiKey);

  await previewPerplexityContactResearch(airtable, perplexity);
}

main().catch(err => {
  console.error('❌ Error running Perplexity Contact Research Preview:', err);
  process.exit(1);
});
