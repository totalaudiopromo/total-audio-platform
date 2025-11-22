import { AirtableContactEnrichment } from './airtableContactEnrichment';
import { PerplexityService } from '../integrations/perplexity';
import { logger } from '../utils/logger';
import { format } from 'date-fns';

export interface ResearchResult {
  contact_id: string;
  contact_intelligence: string; // All AI research in one clean, formatted field
  research_confidence: 'High' | 'Medium' | 'Low';
  last_researched: string;
  query_prompt: string;
  errors?: string[];
}

export class PerplexityContactResearch {
  private airtable: AirtableContactEnrichment;
  private perplexity: PerplexityService;
  private maxBatch: number;

  constructor(airtable: AirtableContactEnrichment, perplexity: PerplexityService, maxBatch = 5) {
    this.airtable = airtable;
    this.perplexity = perplexity;
    this.maxBatch = maxBatch;
  }

  async runPreview(): Promise<ResearchResult[]> {
    logger.info('🔍 Running Perplexity Contact Research in PREVIEW mode (no country filter)...');
    const contacts = await this.airtable.getRadioContacts();
    // Remove country filter: just take the first N contacts
    const previewContacts = contacts.slice(0, this.maxBatch);
    logger.info(
      `👤 Previewing research for ${previewContacts.length} radio contacts (no country filter)...`
    );
    const results: ResearchResult[] = [];
    let processed = 0;
    for (const contact of previewContacts) {
      processed++;
      logger.info(
        `⏳ [${processed}/${previewContacts.length}] Researching: ${
          contact.fields.Name || contact.id
        }`
      );
      try {
        const research = await this.researchContact(contact);
        results.push(research);
      } catch (err) {
        results.push({
          contact_id: contact.id,
          contact_intelligence: 'Research failed.',
          research_confidence: 'Low',
          last_researched: new Date().toISOString(),
          query_prompt: '',
          errors: [err instanceof Error ? err.message : String(err)],
        });
      }
      // Respect rate limits
      await new Promise(res => setTimeout(res, 1500));
    }
    logger.info('✅ Preview research complete.');
    return results;
  }

  async researchContact(contact: any): Promise<ResearchResult> {
    const name = contact.fields.Name || '';
    const station = contact.fields.Station || contact.fields.Company || '';
    const show = contact.fields.Show || '';
    const email = contact.fields.Email || '';
    const prompt = `Research the following radio contact for music industry intelligence.\nContact: ${name}\nStation: ${station}\nShow: ${show}\nEmail: ${email}\n\nExtract the 3-4 most actionable pieces of intelligence for pitching music. Format as a clean, scannable summary with emojis and line breaks.\n\nExample format:\n🎵 BBC Radio 1 | National Public Service\n📍 UK National Coverage | High Reach\n📧 Email: Weekday mornings preferred\n🎧 Focus: New UK artists, breaking acts\n💡 Tip: Include streaming numbers + press quote\n✅ Research Confidence: High | Updated: Jan 2025`;

    let intelligence = '';
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    const errors: string[] = [];

    try {
      const perplexityResp = await this.perplexity.researchIndustry(prompt);
      if (perplexityResp.success && perplexityResp.data) {
        if (typeof perplexityResp.data === 'string') {
          intelligence = (perplexityResp.data as string).trim();
        } else {
          intelligence = JSON.stringify(perplexityResp.data, null, 2);
        }
        confidence = 'High';
      } else {
        errors.push(perplexityResp.error || 'Unknown error from Perplexity');
        intelligence = 'No intelligence found.';
        confidence = 'Low';
      }
    } catch (err: any) {
      errors.push(err instanceof Error ? err.message : 'Unknown error');
      intelligence = 'No intelligence found.';
      confidence = 'Low';
    }

    // Fallback: If the response is not in the expected format, synthesize a summary
    if (!intelligence.includes('🎵')) {
      intelligence = [
        `🎵 ${name}${station ? ' | ' + station : ''}`,
        `📍 (Station/Show info not found)`,
        email ? `📧 ${email}` : '',
        `🎧 Focus: (Not found)`,
        `💡 Tip: (Not found)`,
        `✅ Research Confidence: ${confidence} | Updated: ${format(new Date(), 'MMM yyyy')}`,
      ]
        .filter(Boolean)
        .join('\n');
    } else {
      // Add/update the confidence and updated date line if not present
      if (!intelligence.includes('✅')) {
        intelligence += `\n✅ Research Confidence: ${confidence} | Updated: ${format(
          new Date(),
          'MMM yyyy'
        )}`;
      }
    }

    return {
      contact_id: contact.id,
      contact_intelligence: intelligence,
      research_confidence: confidence,
      last_researched: new Date().toISOString(),
      query_prompt: prompt,
      errors: errors.length ? errors : undefined,
    };
  }
}

// For CLI/preview use
export async function previewPerplexityContactResearch(
  airtable: AirtableContactEnrichment,
  perplexity: PerplexityService
) {
  const engine = new PerplexityContactResearch(airtable, perplexity, 10000); // Process all contacts
  const results = await engine.runPreview();
  console.log('\n--- Perplexity Contact Research PREVIEW Results ---\n');
  for (const r of results) {
    console.log('---');
    console.log('Prompt:');
    console.log(r.query_prompt);
    console.log('Contact Intelligence:');
    console.log(r.contact_intelligence);
    console.log('Confidence:', r.research_confidence);
    console.log('Last Researched:', r.last_researched);
    if (r.errors && r.errors.length > 0) {
      console.log('Errors:', r.errors);
    }
  }
  return results;
}
