#!/usr/bin/env ts-node

import 'dotenv/config';
import { AirtableContactEnrichment } from '../src/services/airtableContactEnrichment';
import { PerplexityService } from '../src/integrations/perplexity';
import { previewPerplexityContactResearch } from '../src/services/perplexityContactResearch';

async function main(): Promise<void> {
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